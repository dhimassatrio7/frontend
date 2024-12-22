import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const AcceptModal = ({isAcceptModalCustOpen, setIsAcceptModalCustOpen}) => {
  return (
    <Modal 
      isOpen={isAcceptModalCustOpen} 
      onOpenChange={setIsAcceptModalCustOpen}
      backdrop="opaque"
      classNames={{
        body: "py-6 ",
        backdrop: "bg-[#6d80c7]/50 backdrop-opacity-40",
        base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-white text-lg rounded-md",
        header: "border-b-[1px] border-[#292f46]",
        footer: "border-t-[1px] border-[#292f46]",
        closeButton: "hover:bg-white/5 active:bg-white/10 p-4",
      }}
      
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-blue-400 text-xl">Accept Request</ModalHeader>
            <ModalBody>
              <p>
                Are you sure want to <span className='text-blue-400'>accept</span> this user as a customer?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button className='bg-gray-600 rounded-md text-white' variant="light" onPress={onClose}>
                Close
              </Button>
              <Button className='bg-blue-500 rounded-md text-white' onPress={onClose}>
                Yes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default AcceptModal