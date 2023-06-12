import Link from "next/link"
import "../app/globals.css"
import Image from "next/image"
import profileImage from "../public/images/profile.jpg"
import ProfileImage from "./ProfileImage"

function Logo() {
    return (
        <Link href="/" className="flex">
            <div className="items-center flex gap-2">
                <div className='font-bold text-indigo-600 text-lg'>
                    Social
                </div>
                <div className="bg-indigo-600 text-white rounded-md text-sm font-bold p-1">
                    Net
                </div>
            </div>
        </Link>
    )
}

function ProfileButton() {
    return (
        <div className='gap-2 ml-auto items-center flex'>
            <div className="font-semibold from-neutral-500">
                Tudor
            </div>
            <ProfileImage profileImage={profileImage}/>
        </div>
    )
}


export default function Navbar() {
    return (
        <div className="bg-white h-12 shadow-md shadow-gray-200 p-1 flex flex-1 sticky">
            <Logo />
            <ProfileButton />
        </div>
    )
}