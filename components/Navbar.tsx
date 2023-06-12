import Link from "next/link"
import "../app/globals.css"
import Image from "next/image"
import profileImage from "../public/images/profile.jpg"
import ProfileImage from "./ProfileImage"
import { useState } from "react"
import clsx from "clsx"
import { Modal } from "@mui/material"
import EditProfileModal from "./EditProfileModal"
import { useCurrentUser } from "../app/fireauth"
import Button from "./ButtonTailwind"
import SignInModal from "./SignInModal"
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

function ProfileButton({ openModal }: { openModal: () => void }) {
    const [isShowing, setIsShowing] = useState(false)
    const toggle = () => {
        setIsShowing(!isShowing)
    }
    return (
        <div className='ml-auto items-end flex flex-col'>
            <button onClick={toggle} onBlur={() => { setIsShowing(false) }} className='cursor-pointer gap-2 flex items-center'>
                <div className="font-semibold from-neutral-500">
                    Tudor
                </div>
                <div className='w-10 h-10'>
                    <ProfileImage profileImage={profileImage} />
                </div>
            </button>
            <div className={clsx(!isShowing && "hidden") + " bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 z-40 relative"}>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    <li>
                        <Link onMouseDown={(e) => { e.preventDefault() }} href="/profile/123" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Profile</Link>
                    </li>
                    <li>
                        <button onClick={openModal} onMouseDown={(e) => { e.preventDefault() }} className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</button>
                    </li>
                    <li>
                        <button onMouseDown={(e) => { e.preventDefault() }} className="w-full text-left block px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

function SignIn() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const openModal = () => {
        setIsModalOpen(true)
    }
    const closeModal = () => {
        setIsModalOpen(false)
    }

    const signIn = () => {
        openModal()
    }
    return (<>
        <div className="ml-auto flex gap-4">
            <Button onClick={signIn}>
                Log in
            </Button>
            <Button onClick={() => { }}>
                Sign up
            </Button>
        </div>
        <SignInModal open={isModalOpen} onClose={closeModal} />
    </>
    )
}
export default function Navbar() {
    const [showing, setShowing] = useState<"posts" | "friends">("posts")
    const [modalOpen, setModalOpen] = useState(false)
    const user = useCurrentUser();
    console.log(user)
    const closeModal = () => {
        setModalOpen(false)
    }
    const openModal = () => {
        console.log("hi modal open")
        setModalOpen(true)
    }
    return (
        <>
            <div className="bg-white h-12 shadow-md shadow-gray-200 p-1 flex flex-1 sticky pl-3 pr-3">
                <Logo />
                {
                    user
                        ? <ProfileButton openModal={openModal} />
                        : <SignIn />
                }
            </div>
            <EditProfileModal handleClose={closeModal} open={modalOpen} />
        </>
    )
}