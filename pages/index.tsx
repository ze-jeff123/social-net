import CreatePost from "@/components/CreatePost"
import "../app/globals.css"
import Layout from "@/components/Layout"
import PostView from "@/components/PostView"
import Post from "@/types/Post"
import User from "@/types/User"
import profile from "../public/images/profile.jpg"
import johnSinger from "../public/images/john-singer.jpg"
import PostComment from "@/types/PostComment"
import { useEffect } from "react"
import { doc, setDoc } from "firebase/firestore"
import { Button } from "@mui/material"
import { addPost, downloadImage, getAllPosts } from "@/app/firestore"
import { useCurrentUser } from "@/app/fireauth"
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
    posts : Post[]
}
export default function Home({posts} : Props) {
    const currentUser = useCurrentUser();
    
    return (
        <Layout currentUser={currentUser}>
            <div className='flex justify-center'>
                <div className='flex-1 flex flex-col max-w-2xl gap-5'>
                    <CreatePost currentUser={currentUser}/>
                    {
                        posts.map((post) => (
                            <PostView post={post} key={post.uid}/>
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
            const postWithProcessedImageUrl = Object.assign({}, post, {image : url})
            return postWithProcessedImageUrl
        })

    }))
    return {props:{posts : postsWithProcessedImageUrl}}
}
