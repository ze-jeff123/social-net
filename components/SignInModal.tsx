import { Button, Modal, ModalHeader, ModalOverlay, useDisclosure, ModalContent, ModalCloseButton, ModalBody, Flex, Input, Text, Image } from '@chakra-ui/react';
import React, { useState } from 'react'

type Props = {
    open: boolean,
    onClose: () => void,
}

export default function SignInModal({ open, onClose }: Props) {
    const [displayName, setDisplayName] = useState("");
    return (
        <Modal isOpen={open} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Sign in</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <Flex direction="column" gap="6px">
                        <form onSubmit={(e) => { }}>
                            <Flex gap="10px" alignItems="center">
                                <Input required placeholder="name" value={displayName} onChange={(e) => { setDisplayName(e.target.value) }}></Input>
                                <Button height="60px"
                                    type="submit" style={{
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                    }}> Sign in as guest </Button>
                            </Flex>
                        </form>
                        <Button colorScheme="blue" onClick={() => { }}> Sign in with Google </Button>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>)
}