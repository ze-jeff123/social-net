import Layout from '@/components/Layout'
import User from '@/types/User'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import profile from "../../public/images/profile.jpg"
import ProfileImage from '@/components/ProfileImage'
import "../../app/utils.css"
import Post from '@/types/Post'
import johnSinger from "../../public/images/john-singer.jpg"
import PostComment from '@/types/PostComment'
import PostView from '@/components/PostView'
import clsx from 'clsx'
import EditProfileModal from '@/components/EditProfileModal'
import Button from "@/components/ButtonTailwind"
import { useCurrentUser } from '@/app/fireauth'
import { addPost, downloadImage, getAllPostsOfUser, getUser, updatePostLikes } from '@/app/firestore'
import { v4 as uuidv4 } from "uuid"
import { addComment as firestoreAddComment } from "../../app/firestore"
type Props = {
  user: User
  posts: Post[]
}


function ButtonGroup({ showing, setShowing }: { showing: "posts" | "friends", setShowing: React.Dispatch<React.SetStateAction<"posts" | "friends">> }) {
  const setPosts = () => {
    setShowing('posts')
  }
  const setFriends = () => {
    setShowing('friends')
  }

  return (
    <div className="inline-flex rounded-md shadow-sm">
      <button onClick={setPosts} aria-current="page" className={clsx(showing == 'posts' && 'text-blue-700') + " px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"}>
        Posts
      </button>
      <button onClick={setFriends} className={clsx(showing == 'friends' && 'text-blue-700') + " px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"}>
        Friends
      </button>
    </div>

  )
}


function LightButton({ onClick, children }: React.PropsWithChildren<{ onClick: () => void }>) {
  return (<button type="button" onClick={onClick} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
    {
      children
    }
  </button>)
}
function FriendView({ user }: { user: User }) {
  return (
    <div className='flex items-center gap-4 sm:gap-8'>
      <div className='w-8 h-8 sm:w-12 sm:h-12'>
        <ProfileImage userUid={user.uid} profileImage={user.profileImage} />
      </div>
      <div>
        {
          user.displayName
        }
      </div>
      <Button onClick={() => { }}>
        Add friend
      </Button>
    </div>
  )
}
function FriendsList({ friends }: { friends: User[] }) {
  return (

    <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {
        friends.map((friend) => (
          <li className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
            <FriendView user={friend} />
          </li>
        ))
      }
    </ul>

  )
}

function ProfileHeader({ user, openModal }: { user: User, openModal: () => void }) {
  return (
    <div className='flex-1 rounded-md color-split-1 sm:grow-[0.8] relative -z-1'>
      <div className='p-4 pl-4 pr-4 sm:pl-8 sm:pr-8'>
        <div className='flex gap-7 items-center'>
          <div className='h-32 w-32 border-white border-8 rounded-full '>
            <ProfileImage isLink={false} userUid={user.uid} profileImage={user.profileImage} />
          </div>
          <div className="text-darkblue text-xl font-semibold">
            {
              user.displayName
            }
          </div>
        </div>
      </div>
      <div className="absolute flex justify-end pr-4" style={{ width: "200px", bottom: "8px", right: 0 }}>
        <LightButton onClick={openModal}>
          Settings
        </LightButton>
      </div>
    </div>
  )
}

export default function Profile(props: Props) {
  const [showing, setShowing] = useState<"posts" | "friends">("posts")
  const [modalOpen, setModalOpen] = useState(false)
  const currentUser = useCurrentUser();
  const user = props.user
  const [posts, setPosts] = useState(props.posts)

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
    firestoreAddComment(commentedPost, comment)
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

  const closeModal = () => {
    setModalOpen(false)
  }
  const openModal = () => {
    console.log("hi modal open")
    setModalOpen(true)
  }
  return (
    <Layout currentUser={currentUser}>
      <div className='flex justify-center'>
        <ProfileHeader user={user} openModal={openModal} />
      </div>
      <div className='flex items-center flex-col'>
        <div className='pt-4 pb-4'>
          <ButtonGroup showing={showing} setShowing={setShowing} />
        </div>
        {
          showing == 'posts' &&
          <div className='max-w-2xl flex flex-col gap-6'>
            {
              posts.map((post: Post) => {
                return (
                  <PostView addComment={addComment} likePost={likePost} isPostLiked={currentUser ? post.usersWhoLikedUid.includes(currentUser.uid) : false} post={post} key={post.uid} />
                )
              })
            }
          </div>
        }
        {
          showing == 'friends' &&
          <div>
            <FriendsList friends={user.friends} />
          </div>
        }
      </div>
      <EditProfileModal open={modalOpen} handleClose={closeModal} />
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  const { id } = context.params
  const user = await getUser(id)
  console.log(user)
  const posts = await getAllPostsOfUser(id)
  const postsWithProcessedImageUrl = await Promise.all(posts.map((post) => {
    const urlPromise = post.image ? downloadImage(post.image) : Promise.resolve(null)
    return urlPromise.then((url) => {
      const postWithProcessedImageUrl = Object.assign({}, post, { image: url })
      return postWithProcessedImageUrl
    })

  }))
  return { props: { user, posts: postsWithProcessedImageUrl } }
}

