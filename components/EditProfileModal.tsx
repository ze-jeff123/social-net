import React, { useState } from 'react'
import { Modal } from '@mui/material'
import User from '@/types/User'
import { downloadImage, updateUser, uploadImage } from '@/app/firestore'
import { v4 as uuidv4 } from "uuid";
import { updateCurrentProfile } from '@/app/fireauth';

type Props = {
    open: boolean,
    handleClose: () => void,
    user: User | null,
}

export default function EditProfileModal({ user , open, handleClose }: Props) {
    const [displayName, setDisplayName] = useState(user?.displayName ?? "")
    const imageInputRef = React.createRef<HTMLInputElement>()

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (user === null) {
            alert("You must be logged in to edit your profile!")
            return
        }

        const getImageUid = () => {
            const imageFile = (imageInputRef.current?.files && imageInputRef.current.files[0]) ? imageInputRef.current.files[0] : null

            if (imageFile !== null) {
                const imageUid = uuidv4()
                return uploadImage(imageFile, imageUid).then((res) => {
                    return downloadImage(imageUid).then((imageUrl) => {
                        return imageUrl
                    })
                })
            }
            return Promise.resolve(user.profileImage)
        }
        getImageUid().then((imageUid) => {
            const newUser = Object.assign({}, user, { displayName: displayName, profileImage: imageUid })
            updateUser(user.uid, newUser)
            console.log(imageUid)
            updateCurrentProfile(newUser.displayName, imageUid )
            handleClose()
        })
    }
    return (
        <Modal className="flex justify-center items-center" open={open} onClose={handleClose} aria-labelledby="modal-modal-edit-profile" aria-describedby="modal-modal-description">
            <div className='bg-white rounded-md p-6'>
                <h1 className='pb-4'>
                    Settings
                </h1>
                <form onSubmit={submitForm}>
                    <div className="relative z-0 w-full mb-6 group">
                        <input value={displayName} onChange={(e) => { setDisplayName(e.target.value) }} type="text" name="floating_username" id="floating_username" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_username" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">New Username</label>
                    </div>

                    <div className="relative z-0 w-full mb-6 group">
                        <label className="block mb-2 text-sm  text-gray-500 dark:text-white" htmlFor="user_avatar">Change your profile picture</label>
                        <input ref={imageInputRef} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" accept="image/*" />
                    </div>


                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save Changes</button>
                </form>
            </div>
        </Modal>
    )
}