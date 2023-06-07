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
export default function PostView({ post }: { post: Post }) {
    return (
        <div className='bg-white rounded-lg overflow-hidden'>
            <div className="flex p-4 items-center gap-2">
                <div className='w-10, h-10'>
                    <ProfileImage profileImage={post.author.profileImage} />
                </div>
                <div className="text-zinc-950 font-normal font-roboto leading-loose">
                    {
                        post.author.name
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
                    <div className='max-h-96 rounded-md overflow-hidden'>
                        <Image alt="the image of the post" src={post.image}>

                        </Image>
                    </div>
                }
            </div>
            <div>
                <div className="flex pl-8 pr-8 gap-4">
                    <button className="cursor-pointer relative">
                        <ThumbUpOffAltIcon className="w-8 h-8" />
                        <div className="bg-sky-400 rounded-full flex justify-center align-center scale-50" style={{width:"25px", height:"25px", position: "absolute", left: "16px", bottom: "14px" }}>
                            3
                        </div>
                    </button>
                    <button className="cursor-pointer relative">
                        <ChatBubbleOutlineIcon className="w-8 h-8" />
                        <div className="bg-sky-400 rounded-full flex justify-center align-center scale-50" style={{ width:"25px", height:"25px", position: "absolute", left: "16px", bottom: "14px" }}>
                            3
                        </div>
                    </button>
                </div>
            </div>
            <div className='p-4 pt-2'>
                <input className="min-w-max bg-gray-50  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type='text' placeholder="Add comment.." />
            </div>
        </div>
    )
}