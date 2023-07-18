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
import { addFriend, addPost, downloadImage, getAllPostsOfUser, getUser, removeFriend, updatePostLikes } from '@/app/firestore'
import { v4 as uuidv4 } from "uuid"
import { addComment as firestoreAddComment } from "../../app/firestore"
import { Modal } from '@mui/material'
type Props = {
  user: User,
  posts: Post[],
  friends: User[]
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
  return (<button data-modal-target="popup-modal" data-modal-toggle="popup-modal" type="button" onClick={onClick} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
    {
      children
    }
  </button>)
}
function BlueButton({ onClick, children }: React.PropsWithChildren<{ onClick: () => void }>) {
  return (<button type="button" onClick={onClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
    {
      children
    }
  </button>)
}

function RemoveFriendModal({ open, handleClose, removeFriend }: { open: boolean, handleClose: () => void, removeFriend: () => void }) {
  const handleYes = () => {
    removeFriend()
    handleClose()
  }
  return (
    <Modal className="flex justify-center items-center" open={open} onClose={handleClose}>
      <div className="bg-white rounded-md p-4">
        <div className="relative">
          <button onClick={handleClose} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>

          <div className="p-6 text-center">
            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Do you want to remove this friend?</h3>
            <button onClick={handleYes} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
              Yes
            </button>
            <button onClick={handleClose} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
function FriendView({ user, currentUser, createFriendship, removeFriendship }: { user: User, currentUser: User | null, createFriendship: (user1: User, user2: User) => void, removeFriendship: (user1: User, user2: User) => void }) {
  const isFriendOfCurrentUser = currentUser ? user.friends.includes(currentUser.uid) : false
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleClose = () => {
    setIsModalOpen(false)
  }
  const openModal = () => {
    setIsModalOpen(true)
  }

  const removeFriend = () => {
    if (currentUser) {
      removeFriendship(user, currentUser)
    }
  }
  return (
    <div className='flex items-center gap-4 sm:gap-8 w-80'>
      <div className='w-8 h-8 sm:w-12 sm:h-12'>
        <ProfileImage userUid={user.uid} profileImage={user.profileImage} />
      </div>
      <div>
        {
          user.displayName
        }
      </div>
      {
        <div className='ml-auto'>{
          (currentUser?.uid != user.uid) && (
            (!isFriendOfCurrentUser)
              ?
              <Button onClick={() => { if (currentUser) { createFriendship(user, currentUser) } }}>
                Add friend
              </Button>
              :
              <>
                <LightButton onClick={() => { openModal() }}>
                  Friend
                </LightButton>
                <RemoveFriendModal removeFriend={removeFriend} open={isModalOpen} handleClose={handleClose} />
              </>
          )}
        </div>
      }
    </div>
  )
}
function FriendsList({ friends, currentUser, createFriendship, removeFriendship }: { friends: User[], currentUser: User | null, createFriendship: (user1: User, user2: User) => void, removeFriendship: (user1: User, user2: User) => void }) {
  return (

    <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {
        friends.map((friend) => (
          <li className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
            <FriendView removeFriendship={removeFriendship} createFriendship={createFriendship} currentUser={currentUser} user={friend} />
          </li>
        ))
      }
    </ul>

  )
}

function ProfileHeader({ user, openModal, createFriendship, currentUser }: { currentUser: User | null, user: User, openModal: () => void, createFriendship: (user1: User, user2: User) => void }) {
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
      {
        user.uid === currentUser?.uid
          ?
          <div className="absolute flex justify-end pr-4" style={{ width: "200px", bottom: "8px", right: 0 }}>
            <LightButton onClick={openModal}>
              Settings
            </LightButton>
          </div>
          :
          <div className="absolute flex justify-end pr-4" style={{ width: "200px", bottom: "8px", right: 0 }}>
            <BlueButton onClick={() => { if (currentUser) { createFriendship(user, currentUser) } }}>
              Add Friend
            </BlueButton>
          </div>
      }
    </div>
  )
}

export default function Profile(props: Props) {
  const [showing, setShowing] = useState<"posts" | "friends">("posts")
  const [modalOpen, setModalOpen] = useState(false)
  const currentUser = useCurrentUser();
  const [user, setUser] = useState(props.user)
  const [friends, setFriends] = useState(props.friends)
  const [posts, setPosts] = useState(props.posts)

  /**
   * establish mutual friendship relationship btween user1 and user2
   */
  const createFriendship = (user1: User, user2: User) => {
    const createUniFriendship = (user1: User, user2: User, oldFriends: User[]) => { /// adds user2 to list of friends of user1
      addFriend(user1, user2)
      const newFriends = oldFriends.map((friend) => {
        if (friend.uid === user1.uid) {
          const { friends, ...rest } = friend
          const hereNewFriends = friends.concat(user2.uid)
          return { friends: hereNewFriends, ...rest }
        }
        return friend
      })
      return (user1.uid === user.uid) ? newFriends.concat(user2) : newFriends
    }
    const newFriends1 = createUniFriendship(user1, user2, friends)
    const newFriends2 = createUniFriendship(user2, user1, newFriends1)
    setFriends(newFriends2)
  }

  const removeFriendship = (user1: User, user2: User) => {
    const removeUniFriendship = (user1: User, user2: User, oldFriends: User[]) => { /// adds user2 to list of friends of user1
      removeFriend(user1, user2)
      const newFriends = oldFriends.map((friend) => {
        if (friend.uid === user1.uid) {
          const { friends, ...rest } = friend
          const hereNewFriends = friends.filter((friend) => friend != user2.uid)
          return { friends: hereNewFriends, ...rest }
        }
        return friend
      })
      return (user1.uid === user.uid) ? newFriends.filter((friend)=>friend.uid != user2.uid) : newFriends
    }
    const newFriends1 = removeUniFriendship(user1, user2, friends)
    const newFriends2 = removeUniFriendship(user2, user1, newFriends1)
    setFriends(newFriends2)
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
        <ProfileHeader currentUser={currentUser} createFriendship={createFriendship} user={user} openModal={openModal} />
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
            <FriendsList removeFriendship={removeFriendship} createFriendship={createFriendship} currentUser={currentUser} friends={friends} />
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

  const friends = await Promise.all(
    user.friends.map((friend) => {
      return getUser(friend)
    })
  )
  return { props: { user, posts: postsWithProcessedImageUrl, friends } }
}

