import "../app/globals.css"
import ProfileImage from "./ProfileImage"
import profileImage from "../public/images/profile.jpg"
import PhotoIcon from '@mui/icons-material/Photo';
import React, { FormEvent, useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import Image from "next/image";
import User from "@/types/User";
export default function CreatePost({ currentUser }: { currentUser: User | null }) {
    const imageRef = React.createRef<HTMLInputElement>()
    const [hasImageSelected, setHasImageSelected] = useState(false)
    const [imageName, setImageName] = useState("")

    const [text,setText] = useState("")


    const clickImage = () => {
        imageRef.current?.click();
    }
    useEffect(() => {
        const funct = (e: Event) => {
            if (imageRef.current?.files && imageRef.current?.files[0]) {
                setHasImageSelected(true)
                setImageName(imageRef.current?.files[0]?.name)
                imageRef.current.value = ""
            }
        }
        imageRef.current?.addEventListener('input', funct)

        return () => { imageRef.current?.removeEventListener('input', funct) }
    }, [])


    const submitPost = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()

    }

    const onTextChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    }
    return (
        <>
            {
                currentUser
                    ?
                    <form onSubmit={submitPost}>
                        < div className="bg-white rounded-lg overflow-hidden flex flex-col" >
                            <div className="flex gap-2 p-4">
                                <div className='w-10 h-10'>
                                    <ProfileImage profileImage={currentUser.profileImage} />
                                </div>
                                <input value={text} onChange={onTextChange} className="min-w-max bg-gray-50  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type='text' placeholder="Write something..." />
                            </div>
                            <div className="flex items-stretch gap-2 bg-gray-500" style={{ backgroundColor: "#E0E9F8" }}>
                                <div className="flex items-stretch gap-2 p-4">
                                    <PhotoIcon />
                                    <input className="cursor-pointer text-gray-700 font-normal -skew-x-12" type="button" value="Photo" onClick={clickImage} />
                                    <div className='flex-grow' style={{ maxWidth: "100px" }}></div>
                                    <>
                                        {
                                            hasImageSelected &&
                                            <div className="text-gray-700 font-normal -skew-x-12">
                                                {
                                                    imageName
                                                }
                                            </div>
                                        }
                                    </>
                                    <input id="myInput" type="file" style={{ visibility: "hidden" }} ref={imageRef} className="hidden" />
                                </div>
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