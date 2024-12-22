import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input
} from "@nextui-org/react";
import React from 'react'
import { createServiceProvider, fetchServiceProviderByDocumentId, updateServiceProvider } from "../../../store/slices/serviceProviderSlice";
import { useDispatch } from "react-redux";

const EditData = ({
    isModalEditOpen, 
    setIsModalEditOpen, 
    serviceProviders,
    companyName,
    setCompanyName,
    companyDescription,
    setCompanyDescription,
    location,
    setLocation,
    contact,
    setContact,
    user,
    setUser,
    users,
    editingServiceProvider,
    setEditingServiceProvider,
    documentId
  }) => {

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
  
      const serviceProviderData = {
        data: {
          company_name: companyName,
          company_description: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  text: companyDescription,
                },
              ],
            },
          ],
          location,
          contact,
          user: user,
        },
      };
  
      if (editingServiceProvider) {
        // If editing, update the service provider
        dispatch(
          updateServiceProvider({
            documentId: editingServiceProvider.documentId,
            serviceProviderData,
          })
        );
      } else {
        // If creating, create the service provider
        dispatch(createServiceProvider(serviceProviderData));
      }
  
      // Reset form after submit
      setCompanyName("");
      setCompanyDescription("");
      setLocation("");
      setContact("");
      setUser("");
      setEditingServiceProvider(null); // Reset editing state

      dispatch(fetchServiceProviderByDocumentId(documentId));
    };
    
  return (
    <Modal className="bg-white border border-[#003366] rounded-md" isOpen={isModalEditOpen} onOpenChange={setIsModalEditOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold text-2xl">Edit Data</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3" >

                  <select
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="p-2 py-4 rounded-lg bg-[#f4f4f4]"
                    required
                    disabled
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.documentId}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                  <Input 
                    isRequired 
                    label="Telepon" 
                    type="number" 
                    defaultValue={contact} 
                    onChange={(e) => setContact(e.target.value)}
                  />
                  <Input isRequired label="Alamat" type="text" defaultValue={location} 
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-[#003366] rounded-md font-semibold text-white" 
                  onPress={() => {handleSubmit(); setIsModalEditOpen(false)}}
                >
                  Edit
                </Button>
                <Button className="rounded-md" onPress={onClose}>
                  Batal
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  )
}

export default EditData