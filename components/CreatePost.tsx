import "../app/globals.css"
import ProfileImage from "./ProfileImage"
import profileImage from "../public/images/profile.jpg"
import PhotoIcon from '@mui/icons-material/Photo';
import React, { FormEvent, useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import Image from "next/image";
import User from "@/types/User";
import { v4 as uuidv4 } from "uuid";
import Post from "@/types/Post";
import { uploadImage } from "@/app/firestore";


const LoadingIndicator = () => {
    return (
        <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
            loading...
        </div>

    )
}
export default function CreatePost({ currentUser,createPost }: { currentUser: User | null, createPost: (newDatabasePost:Post, newLocalPost:Post) => Promise<void> }) {
    const imageInputRef = React.createRef<HTMLInputElement>()
    const formRef = React.createRef<HTMLFormElement>()
    const [isLoading, setIsLoading] = useState(false)

    const [text, setText] = useState("")
    const [files, setFiles] = useState<FileList | null>(null)




    const submitPost = (e: FormEvent<HTMLFormElement>) => {
        setIsLoading(true)

        e.preventDefault()

        const imageFile = (imageInputRef.current?.files && imageInputRef.current.files[0]) ? imageInputRef.current.files[0] : null
        const imageUid = uuidv4()
        const maybeUploadImage = (imageInputRef.current?.files && imageInputRef.current.files[0])
            ? uploadImage(imageInputRef.current.files[0], imageUid).then(() => { return imageUid })
            : Promise.resolve(null)

        const form = formRef.current
        const resetForm = () => {
            console.log(form)
            if (form) {
                form.reset()
            }
            setText("")
        }
        maybeUploadImage.then((imageURL) => {

            const newDatabasePost: Post = {
                uid: uuidv4(),
                author: currentUser!,
                text: text,
                image: imageURL,
                likes: 0,
                comments: [],
                timestamp : (new Date()).toISOString(),
            }

            const newLocalPost = imageFile ? Object.assign({}, newDatabasePost, {image : URL.createObjectURL(imageFile)}) : newDatabasePost

            createPost(newDatabasePost, newLocalPost)

            resetForm()

            setIsLoading(false)

        })
    }


    const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    }
    return (
        <>
            {
                currentUser
                    ?
                    <form ref={formRef} onSubmit={submitPost}>
                        < div className="bg-white rounded-lg overflow-hidden flex flex-col" >
                            <div className="flex gap-2 p-4">
                                <div className='w-10 h-10'>
                                    <ProfileImage profileImage={currentUser.profileImage} />
                                </div>
                                <input value={text} onChange={onTextChange} className="min-w-max bg-gray-50  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type='text' placeholder="Write something..." />
                            </div>
                            <label className="pl-4 block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload image</label>

                            {
                                isLoading &&
                                <LoadingIndicator />
                            }

                            <div className="flex items-stretch" style={{ backgroundColor: "#E0E9F8" }}>
                                <input onChange={(e) => { setFiles(e.target.files) }} ref={imageInputRef} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-l-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" />
                                <button style={{ backgroundColor: "#C1E5FB" }} className="ml-auto pl-4 pr-4 bg-red-400">
                                    <SendIcon />
                                </button>
                            </div>

                        </div >
                    </form>
                    : <div></div>
            }
        </>
    )
}