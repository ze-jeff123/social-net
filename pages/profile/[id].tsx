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
import { addFriend, addPost, deletePost, downloadImage, getAllPostsOfUser, getUser, removeFriend, updatePostLikes } from '@/app/firestore'
import { v4 as uuidv4 } from "uuid"
import { addComment as firestoreAddComment } from "../../app/firestore"
import { Modal } from '@mui/material'
import LightButton from '@/components/LightButton'
import AddFriend from '@/components/AddFriend'
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

function BlueButton({ onClick, children }: React.PropsWithChildren<{ onClick: () => void }>) {
  return (<button type="button" onClick={onClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
    {
      children
    }
  </button>)
}

function FriendView({ user, currentUser, createFriendship, removeFriendship }: { user: User, currentUser: User | null, createFriendship: (user1: User, user2: User) => void, removeFriendship: (user1: User, user2: User) => void }) {
  const isFriendOfCurrentUser = currentUser ? user.friends.includes(currentUser.uid) : false

  const removeFriend = () => {
    if (currentUser) {
      removeFriendship(user, currentUser)
    }
  }
  const addFriend = () => {
    if (currentUser) {
      createFriendship(user, currentUser)
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
        <div className='ml-auto'>
          {
            (currentUser?.uid != user.uid) &&
            <AddFriend isFriendOfCurrentUser={isFriendOfCurrentUser} onAddFriend={addFriend} onRemoveFriend={removeFriend} />
          }
        </div>
      }
    </div>
  )
}
function FriendsList({ friends, currentUser, createFriendship, removeFriendship }: { friends: User[], currentUser: User | null, createFriendship: (user1: User, user2: User) => void, removeFriendship: (user1: User, user2: User) => void }) {
  return (

    <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {
        friends.length === 0 
        ?
        <div className="text-lg p-6 flex flex-col items-center">
          <p>
          You haven't added any friends yet
          </p>
          Add friends by going to their profile and clicking on "Add friend"!
        </div>
        :
        friends.map((friend) => (
          <li className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
            <FriendView removeFriendship={removeFriendship} createFriendship={createFriendship} currentUser={currentUser} user={friend} />
          </li>
        ))
      }
    </ul>

  )
}

function ProfileHeader({ user, openModal, createFriendship, removeFriendship, currentUser }: { removeFriendship:(user1:User,user2:User)=>void,currentUser: User | null, user: User, openModal: () => void, createFriendship: (user1: User, user2: User) => void }) {
  const isFriendOfCurrentUser = currentUser ? user.friends.includes(currentUser.uid) : false
  const removeFriend = () => {
    if (currentUser) {
      removeFriendship(user, currentUser)
    }
  }
  const addFriend = () => {
    if (currentUser) {
      createFriendship(user, currentUser)
    }
  }
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
            <AddFriend isFriendOfCurrentUser={isFriendOfCurrentUser} onAddFriend={addFriend} onRemoveFriend={removeFriend} />
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


      if (user1.uid === user.uid) {
        const {friends, ...rest} = user
        const newFriends = friends.concat(user2.uid)
        const newUser = {friends:newFriends, ...rest}
        setUser(newUser)
      }
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
        if (user1.uid === user.uid) {
          const {friends, ...rest} = user
          const newFriends = friends.filter((friend)=>friend!=user2.uid)
          const newUser = {friends:newFriends, ...rest}
          setUser(newUser)
        }
        return friend
      })
      return (user1.uid === user.uid) ? newFriends.filter((friend) => friend.uid != user2.uid) : newFriends
    }
    const newFriends1 = removeUniFriendship(user1, user2, friends)
    const newFriends2 = removeUniFriendship(user2, user1, newFriends1)
    setFriends(newFriends2)
  }
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
        <ProfileHeader removeFriendship={removeFriendship} currentUser={currentUser} createFriendship={createFriendship} user={user} openModal={openModal} />
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
                  <PostView isOwnPost={post.author.uid === currentUser?.uid} removePost={removePost} addComment={addComment} likePost={likePost} isPostLiked={currentUser ? post.usersWhoLikedUid.includes(currentUser.uid) : false} post={post} key={post.uid} />
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
      <EditProfileModal user={currentUser} open={modalOpen} handleClose={closeModal} />
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

  const friends = await Promise.all(
    user.friends.map((friend) => {
      return getUser(friend)
    })
  )
  return { props: { user, posts: postsWithProcessedAuthors, friends } }
}

