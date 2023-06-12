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

function Button({ onClick, children }: React.PropsWithChildren<{ onClick: () => void }>) {
  return (<button type="button" onClick={onClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
    {
      children
    }
  </button>)
}

function LightButton({ onClick, children }: React.PropsWithChildren<{ onClick: () => void }>) {
  return (<button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
    {
      children
    }
  </button>)
}
function FriendView({ user }: { user: User }) {
  return (
    <div className='flex items-center gap-4 sm:gap-8'>
      <div className='w-8 h-8 sm:w-12 sm:h-12'>
        <ProfileImage profileImage={user.profileImage} />
      </div>
      <div>
        {
          user.name
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
      <li className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
        <FriendView user={friends[0]} />
      </li>
      <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
        <FriendView user={friends[0]} />
      </li>
    </ul>

  )
}

function ProfileHeader({ user }: { user: User }) {
  return (
    <div className='flex-1 rounded-md color-split-1 sm:grow-[0.8] relative -z-1'>
      <div className='p-4 pl-4 pr-4 sm:pl-8 sm:pr-8'>
        <div className='h-32 w-32 border-white border-8 rounded-full flex gap-7 items-center'>
          <ProfileImage profileImage={user.profileImage} />
          <div className="text-darkblue text-xl font-semibold">
            {
              user.name
            }
          </div>
        </div>
      </div>
      <div className="absolute flex justify-end pr-4" style={{width:"200px",bottom:"8px", right:0}}>
        <LightButton onClick={() => { }}>
          Edit Profile
        </LightButton>
      </div>
    </div>
  )
}

export default function Profile({ user, posts }: Props) {
  const [showing, setShowing] = useState<"posts" | "friends">("posts")

  return (
    <Layout>
      <div className='flex justify-center'>
        <ProfileHeader user={user} />
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
                  <PostView post={post} key={post.uid} />
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
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  const { id } = context.params


  // here we get the user using the id, or the fake user in this case
  const fakeUser: User = {
    uid: "12312",
    name: "Smecherul 1",
    friends: [],
    profileImage: profile,
  }
  const user = {
    uid: "123",
    name: "Jeff",
    profileImage: profile,
    friends: [fakeUser],
  }

  const fakeComment: PostComment = {
    uid: "1241",
    author: user,
    text: "That is a really nice photo, thanks for sharing Jeff!",
  }

  const fakePost: Post = {
    uid: "1312",
    author: user,
    comments: [fakeComment, fakeComment],
    image: johnSinger,
    likes: 3,
    text: "Hi everyone! Just wanted to share this cool painint, enjoy!",
  }
  const posts = [
    fakePost,
    fakePost,
    fakePost
  ]
  return { props: { user, posts } }
}

