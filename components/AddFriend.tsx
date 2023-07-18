import React, { useState } from 'react'
import Button from './ButtonTailwind'
import LightButton from './LightButton'
import { Modal } from '@mui/material'

type Props = {
    isFriendOfCurrentUser: boolean,
    onAddFriend: () => void,
    onRemoveFriend: () => void,
}
function RemoveFriendModal({ open, handleClose, removeFriend }: { open: boolean, handleClose: () => void, removeFriend: () => void }) {
    const handleYes = () => {
        removeFriend()
        handleClose()
    }
    return (
        <Modal className="flex justify-center items-center" open={open} onClose={handleClose}>
            <div className="bg-white rounded-md p-4">
                <div className="relative">
                    <button onClick={handleClose} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>

                    <div className="p-6 text-center">
                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Do you want to remove this friend?</h3>
                        <button onClick={handleYes} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                            Yes
                        </button>
                        <button onClick={handleClose} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
export default function AddFriend({ isFriendOfCurrentUser, onAddFriend, onRemoveFriend }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const openModal = () => {
        setIsModalOpen(true)
    }
    const handleClose = () => {
        setIsModalOpen(false)
    }
    return (
        (!isFriendOfCurrentUser)
            ?
            <Button onClick={onAddFriend}>
                Add friend
            </Button>
            :
            <>
                <LightButton onClick={openModal}>
                    Friend
                </LightButton>
                <RemoveFriendModal removeFriend={onRemoveFriend} open={isModalOpen} handleClose={handleClose} />
            </>
    )
}