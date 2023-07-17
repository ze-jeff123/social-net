import React, { useState } from 'react'
import { Input, Modal, TextField } from '@mui/material'
import Button from './ButtonTailwind'
import { signInAsGuest, signInWithGoogle } from '@/app/fireauth'

type Props = {
    open: boolean,
    handleClose: () => void,

}

export default function EditProfileModal({ open, handleClose }: Props) {

    const [guestName, setGuestName] = useState("Guest")
    const onChangeGuestName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setGuestName(e.target.value)
    }

    const guestSignIn = () => {
        signInAsGuest("Guest")
    }
    const googleSignIn = () => {
        signInWithGoogle()
    }

    const submitGuestForm: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        signInAsGuest(guestName)

    }
    return (
        <Modal className="flex justify-center items-center" open={open} onClose={handleClose} aria-labelledby="modal-modal-edit-profile" aria-describedby="modal-modal-description">
            <div className='bg-white rounded-md p-6'>
                <h1 className='pb-4'>
                    Sign in
                </h1>

                <div className='flex flex-col gap-3'>
                    <form onSubmit={submitGuestForm} className="flex gap-4">
                        <TextField onChange={onChangeGuestName} value={guestName} label="username" variant="outlined" />
                        <Button onClick={() => { }}>Sign in as guest</Button>
                    </form>
                    <Button onClick={googleSignIn}>
                        Sign in with Google
                    </Button>
                </div>

            </div>
        </Modal>
    )
}