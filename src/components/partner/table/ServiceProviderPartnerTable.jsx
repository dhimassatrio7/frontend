import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditData from '../modal/EditData'
import { createServiceProvider, fetchServiceProviderByDocumentId, updateServiceProvider } from "../../../store/slices/serviceProviderSlice";
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { fetchUsers } from "../../../store/slices/userSlice";

const ServiceProviderPartnerTable = () => {
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [user, setUser] = useState("");
  const [editingServiceProvider, setEditingServiceProvider] = useState(null);

  const dispatch = useDispatch();

  const { serviceProviders } = useSelector((state) => state.serviceProvider);
  const { users } = useSelector((state) => state.user);

  // Get documentId from localStorage
  const documentId = localStorage.getItem("documentId"); // Assuming the documentId is stored under "documentId"

  useEffect(() => {
    if (documentId) {
      dispatch(fetchServiceProviderByDocumentId(documentId));
      dispatch(fetchUsers());
    }
  }, [dispatch, documentId]);

  const handleEdit = (serviceProvider) => {
    setCompanyName(serviceProvider.company_name);
    setCompanyDescription(
      serviceProvider.company_description?.[0]?.children?.[0]?.text || ""
    );
    setLocation(serviceProvider.location);
    setContact(serviceProvider.contact);
    setUser(serviceProvider.user?.documentId || "");
    setEditingServiceProvider(serviceProvider);
  };

  return (
    <div>
      <h1 className="font-bold text-2xl mb-5">Service Provider Partner</h1>
      <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>No</TableColumn>
        <TableColumn>Nama</TableColumn>
        <TableColumn>Nama Perusahaan</TableColumn>
        <TableColumn>Deskripsi</TableColumn>
        <TableColumn>Alamat</TableColumn>
        <TableColumn>Telepon</TableColumn>
        <TableColumn>Aksi</TableColumn>
      </TableHeader>
      <TableBody>
          {serviceProviders.map((serviceProvider, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{serviceProvider.user.username}</TableCell>
              <TableCell>{serviceProvider.company_name}</TableCell>
              <TableCell>{serviceProvider.company_description?.[0]?.children?.[0]?.text}</TableCell>
              <TableCell>{serviceProvider.location}</TableCell>
              <TableCell>{serviceProvider.contact}</TableCell>
              <TableCell>
                <div>
                  <Button 
                    size="sm"
                    onPress={() => {setIsModalEditOpen(true); handleEdit(serviceProvider)}}
                  >
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
      
    <EditData 
      isModalEditOpen={isModalEditOpen}
      setIsModalEditOpen={setIsModalEditOpen}
      serviceProviders={serviceProviders}
      companyName={companyName}
      setCompanyName={setCompanyName}
      companyDescription={companyDescription}
      setCompanyDescription={setCompanyDescription}
      location={location}
      setLocation={setLocation}
      contact={contact}
      setContact={setContact}
      user={user}
      setUser={setUser}
      users={users}
      editingServiceProvider={editingServiceProvider}
      setEditingServiceProvider={setEditingServiceProvider}
      documentId={documentId}
    />
    </div>
  );
};

export default ServiceProviderPartnerTable;