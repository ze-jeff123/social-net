import CreatePost from "@/components/CreatePost"
import "../app/globals.css"
import Layout from "@/components/Layout"
import PostView from "@/components/PostView"
import Post from "@/types/Post"
import User from "@/types/User"
import profile from "../public/images/guest-profile.png"
import johnSinger from "../public/images/john-singer.jpg"
import PostComment from "@/types/PostComment"
import { useEffect, useState } from "react"
import { doc, setDoc } from "firebase/firestore"
import { Button } from "@mui/material"
import {removeComment as firestoreRemoveComment, addPost, downloadImage, getAllPosts, updatePostLikes, addComment as firestoreAddComment, getUser, deletePost } from "@/app/firestore"
import { useCurrentUser } from "@/app/fireauth"
import { v4 as uuidv4 } from "uuid"
/*const fakeUser: User = {
    uid: "123",
    displayName: "Jeff",
    friends: [],
    profileImage: null,
}
const fakeComment: PostComment = {
    uid: "1241",
    author: fakeUser,
    text: "That is a really nice photo, thanks for sharing Jeff!",
}
const fakeComment2: PostComment = {
    uid: "1241",
    author: fakeUser,
    text: "I know, right? He really did a nice job",
}
const fakePost: Post = {
    uid: "1312",
    author: fakeUser,
    comments: [fakeComment, fakeComment2],
    image: johnSinger,
    likes: 3,
    text: "Hi everyone! Just wanted to share this cool painint, enjoy!",
}*/
interface Props {
    posts: Post[]
}

export default function Home(props: Props) {
    const currentUser = useCurrentUser();
    const [posts, setPosts] = useState(props.posts)

    const removePost = (deletedPost:Post) => {
        setPosts(posts.filter((post)=>post.uid!=deletedPost.uid))
        deletePost(deletedPost.uid)
    }
    const addComment = (commentedPost: Post, commentText: string) => {
        if (currentUser === null) {
            alert("You need to be logged in to comment!")
            return
        }
        const comment: PostComment = {
            uid: uuidv4(),
            text: commentText,
            author: currentUser,
        }
        const newPosts = posts.map((post) => {
            if (post.uid != commentedPost.uid) return post
            const { comments, ...restPost } = post
            const newComments = comments.concat(comment)
            return { comments: newComments, ...restPost }
        })
        setPosts(newPosts)
        firestoreAddComment(commentedPost.uid, comment)
    }
    const removeComment = (commentedPost : Post, removedComment : PostComment) => {
        if (currentUser === null) {
            alert("You need to be logged in to remove a comment!")
            return
        }

        setPosts(posts.map((post) => {
            if (post.uid === commentedPost.uid) {
                const {comments, ...rest} = post
                const newComments = comments.filter((comment) => (comment.uid != removedComment.uid))
                return {comments : newComments, ...rest}
            }
            return post
        }))
        firestoreRemoveComment(commentedPost.uid, removedComment)
    }
    const createPost = (newDatabasePost: Post, newLocalPost: Post) => {
        setPosts([newLocalPost].concat(posts))
        return addPost(newDatabasePost)
    }
    const likePost = (likedPost: Post) => {
        if (currentUser === null) {
            alert("You need to be logged in to like a post!")
            return
        }
        if (likedPost.usersWhoLikedUid.includes(currentUser.uid)) {
            const newPosts = posts.map((post) => {
                if (post.uid != likedPost.uid) {
                    return post
                }

                const { usersWhoLikedUid, ...restPost } = post
                const newUsersWhoLikedUid = usersWhoLikedUid.filter((userUid) => userUid != currentUser.uid)
                return { usersWhoLikedUid: newUsersWhoLikedUid, ...restPost }
            })

            setPosts(newPosts)


            const { usersWhoLikedUid, ...restPost } = likedPost
            const newUsersWhoLikedUid = usersWhoLikedUid.filter((userUid) => userUid != currentUser.uid)
            updatePostLikes(likedPost, newUsersWhoLikedUid)
        } else {
            const newPosts = posts.map((post) => ((likedPost.uid === post.uid) ? Object.assign({}, post, { usersWhoLikedUid: post.usersWhoLikedUid.concat(currentUser.uid) }) : post))
            setPosts(newPosts)
            updatePostLikes(likedPost, likedPost.usersWhoLikedUid.concat(currentUser.uid))
        }
    }

    return (
        <Layout currentUser={currentUser}>
            <div className='flex justify-center'>
                <div className='flex-1 flex flex-col max-w-2xl gap-5'>
                    <CreatePost createPost={createPost} currentUser={currentUser} />
                    {
                        posts.map((post) => (
                            <PostView removeComment={removeComment} isOwnPost={post.author.uid === currentUser?.uid} removePost={removePost} addComment={addComment} isPostLiked={currentUser ? post.usersWhoLikedUid.includes(currentUser.uid) : false} post={post} key={post.uid} likePost={likePost} />
                        ))
                    }
                </div>
            </div>
        </Layout>
    )
}


export async function getServerSideProps() {
    const posts = await getAllPosts()

    const postsWithProcessedImageUrl = await Promise.all(posts.map((post) => {
        const urlPromise = post.image ? downloadImage(post.image) : Promise.resolve(null)
        return urlPromise.then((url) => {
            const postWithProcessedImageUrl = Object.assign({}, post, { image: url })
            return postWithProcessedImageUrl
        })

    }))

    const postsWithProcessedAuthors = await Promise.all(postsWithProcessedImageUrl.map((post) => {
        const user = getUser(post.author as unknown as string)
        const comments = Promise.all(post.comments.map((comment) => {
            const { author, ...rest } = comment
            return getUser(author as unknown as string).then((user) => {
                return { author: user, ...rest }
            })
        }))
        return comments.then((comments) => {
            return user.then((user) => {
                return Object.assign({}, post, { author: user, comments : comments })
            })
        })
    }))
    return { props: { posts: postsWithProcessedAuthors } }
}
