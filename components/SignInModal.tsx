import React from 'react'
import { Input, Modal, TextField } from '@mui/material'
import Button from './ButtonTailwind'
import { signInAsGuest, signInWithGoogle } from '@/app/fireauth'

type Props = {
    open: boolean,
    handleClose: () => void,

}

export default function EditProfileModal({ open, handleClose }: Props) {

    const guestSignIn = () => {
        signInAsGuest("Guest")
    }
    const googleSignIn = () => {
        signInWithGoogle()
    }

    return (
        <Modal className="flex justify-center items-center" open={open} onClose={handleClose} aria-labelledby="modal-modal-edit-profile" aria-describedby="modal-modal-description">
            <div className='bg-white rounded-md p-6'>
                <h1 className='pb-4'>
                    Sign in
                </h1>
                <form>
                    <div className='flex flex-col gap-3'>
                        <div className="flex gap-4">
                            <TextField label="username" variant="outlined" />
                            <Button onClick={guestSignIn}>Sign in as guest</Button>
                        </div>
                        <Button onClick={googleSignIn}>
                            Sign in with Google
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}