import "../app/globals.css"
import ProfileImage from "./ProfileImage"
import profileImage from "../public/images/profile.jpg"
import PhotoIcon from '@mui/icons-material/Photo';
import React, { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import Image, { StaticImageData } from "next/image";
import Post from "@/types/Post";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PostComment from "@/types/PostComment";
import { v4 as uuidv4 } from "uuid"
import User from "@/types/User";

function CommentView({ comment }: { comment: PostComment }) {
    return (
        <div className='flex gap-2'>
            <div className='w-12 h-12'>
                <ProfileImage userUid={comment.author.uid} profileImage={comment.author.profileImage} />
            </div>
            <div className='flex flex-col h-12 relative'>
                <div className="text-zinc-950 font-normal text-sm relative font-roboto leading-loose bottom-2">
                    {
                        comment.author.displayName
                    }
                </div>
                <div className="bg-gray-50 pt-2 pb-2 pl-6 pr-6 rounded-3xl relative bottom-3 text-sm">
                    {
                        comment.text
                    }
                </div>
            </div>
        </div>
    )
}
export default function PostView({ post, likePost, isPostLiked, addComment }: { post: Post, likePost: (post: Post) => void, isPostLiked: boolean, addComment: (post: Post, commentText: string) => void }) {
    const [commentInputText, setCommentInputText] = useState("")
    const onLikeClick = () => {
        likePost(post)
    }

    const changeCommentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommentInputText(e.target.value)
    }
    const submitComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setCommentInputText("")
        addComment(post, commentInputText)
    }

    return (
        <div className='bg-white rounded-lg overflow-hidden' style={{maxWidth:"100vw"}}>
            <div className="flex p-4 items-center gap-2">
                <div className='w-10 h-10'>
                    <ProfileImage userUid={post.author.uid} profileImage={post.author.profileImage} />
                </div>
                <div className="text-zinc-950 font-normal font-roboto leading-loose">
                    {
                        post.author.displayName
                    }
                </div>
            </div>
            <div className="flex pl-6 pr-6">
                <div className="font-roboto italic font-normal">
                    {
                        post.text
                    }
                </div>
            </div>
            <div className="p-4 pb-2">
                {
                    post.image &&
                    <div className='rounded-md flex justify-center relative overflow-hidden'>
                        <Image width={600} height={600} alt="the image of the post" src={post.image}>

                        </Image>
                    </div>
                }
            </div>
            <div>
                <div className="flex pl-8 pr-8 gap-4">
                    <button className="cursor-pointer relative hover:bg-gray-200 rounded-full p-1" onClick={onLikeClick}>

                        {
                            isPostLiked
                                ?
                                <>
                                    <ThumbUpOffAltIcon className="w-8 h-8 text-sky-300" />
                                    <div className="bg-sky-400 rounded-full flex justify-center align-center scale-50" style={{ width: "25px", height: "25px", position: "absolute", left: "16px", bottom: "14px" }}>
                                        {
                                            post.usersWhoLikedUid.length
                                        }
                                    </div>
                                </>
                                :
                                <>
                                    <ThumbUpOffAltIcon className="w-8 h-8" />
                                    <div className="bg-sky-400 rounded-full flex justify-center align-center scale-50" style={{ width: "25px", height: "25px", position: "absolute", left: "16px", bottom: "14px" }}>
                                        {
                                            post.usersWhoLikedUid.length
                                        }
                                    </div>
                                </>

                        }
                    </button>
                    <button className="cursor-pointer relative hover:bg-gray-200 rounded-full p-1">
                        <ChatBubbleOutlineIcon className="w-8 h-8" />
                        <div className="bg-sky-400 rounded-full flex justify-center align-center scale-50" style={{ width: "25px", height: "25px", position: "absolute", left: "16px", bottom: "14px" }}>
                            {
                                post.comments.length
                            }
                        </div>
                    </button>
                </div>
            </div>
            <div className='p-4 pt-2'>
                <form onSubmit={submitComment}>
                    <input value={commentInputText} onChange={changeCommentInput} className="min-w-max bg-gray-50  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type='text' placeholder="Add comment.." />
                </form>
            </div>
            <div className='h-0.5 ml-4 mr-4 bg-slate-300'>

            </div>
            <div className='p-8 pt-4 gap-5 flex flex-col'>
                {
                    post.comments.map((comment) => {
                        return (
                            <CommentView comment={comment} key={comment.uid} />
                        )
                    })
                }
            </div>
        </div>
    )
}
