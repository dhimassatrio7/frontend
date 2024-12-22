import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import HistoryDetailModal from './modal/HistoryDetailModal';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServiceProviderByDocumentId } from '../../store/slices/serviceProviderSlice';
import { fetchCustomers } from '../../store/slices/customerSlice';
import { fetchTransactionsForServiceProvider } from '../../store/slices/transactionSlice';
import { fetchUserById, fetchUsers } from '../../store/slices/userSlice';
import EditData from './modal/EditData';

const HistoryOrder = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailModalIndex, setDetailModalIndex] = useState(null);
  const [orders, setOrders] = useState([]);
  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  const dispatch = useDispatch();

  const { serviceProviders } = useSelector((state) => state.serviceProvider);
  const { transactions } = useSelector((state) => state.transaction)
  const { customers } = useSelector((state) => state.customer);
  const userPhoto = useSelector((state) => state.user)

  // Get documentId from localStorage
  const documentId = localStorage.getItem("documentId"); // Assuming the documentId is stored under "documentId"
  const documentIdServiceProvider = serviceProviders[0]?.documentId;
  useEffect(() => {
    if (documentId) {
      dispatch(fetchServiceProviderByDocumentId(documentId));
      dispatch(fetchCustomers());
    }

    if (documentIdServiceProvider) {
      dispatch(fetchTransactionsForServiceProvider(documentIdServiceProvider));
    }
  }, [dispatch, documentId, documentIdServiceProvider]);

  const filteredTransactions = transactions.filter((transaction) => transaction.transaction_status == "Completed" || transaction.transaction_status == "Cancelled")

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    
    const [companyName, setCompanyName] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");
    const [location, setLocation] = useState("");
    const [contact, setContact] = useState("");
    const [user, setUser] = useState("");
    const [editingServiceProvider, setEditingServiceProvider] = useState(null);
  
    const { users } = useSelector((state) => state.user);
    const userId = localStorage.getItem("id")

    useEffect(() => {
      if (documentId) {
        dispatch(fetchServiceProviderByDocumentId(documentId));
        dispatch(fetchUsers());
      }
      dispatch(fetchUserById(userId));
    }, [dispatch, documentId]);
  
    const handleEdit = (serviceProvider) => {
      setCompanyName(serviceProvider?.company_name);
      setCompanyDescription(
        serviceProvider?.company_description?.[0]?.children?.[0]?.text || ""
      );
      setLocation(serviceProvider?.location);
      setContact(serviceProvider?.contact);
      setUser(serviceProvider?.user?.documentId || "");
      setEditingServiceProvider(serviceProvider);
    };

  return (
    <div className="p-6 px-12 sm:pl-64 bg-gray-50 min-h-screen bg-gradient-to-br from-[#6fa6c3] from-5% via-[#FFFFFF] via-20% to-[#6fa6c3] to-95%">
      
      {/* About Section */}
      <section className="mb-8">
        <Card className='bg-gray-100/70 rounded-md p-2'>
          <CardHeader>
            <h2 className="text-2xl font-bold mb-4">Profil Mitra</h2>
          </CardHeader>
          <CardBody>
            <div className="flex items-center bg-white p-4 shadow rounded-md ">
              <img
                src={`${BASE_URL}${userPhoto?.user?.profile_image?.url}`}
                alt="Profile"
                className="hidden w-36 h-36 md:block rounded-full mr-6"
              />
              <div className='flex flex-col w-full'>
                <p className="mb-2"><strong>Nama :</strong> {serviceProviders[0]?.user.username}</p>
                <p className="mb-2"><strong>Email :</strong> {serviceProviders[0]?.user.email}</p>
                <p className="mb-2"><strong>Telepon :</strong> {serviceProviders[0]?.contact}</p>
                <p className="mb-2"><strong>Alamat :</strong> {serviceProviders[0]?.location}</p>
                <div className='flex justify-end'>
                  <Button onPress={() => {setIsModalEditOpen(true); handleEdit(serviceProviders[0])}}>
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Service History Section */}
      <section>
        <Card className='bg-gray-100/70 rounded-md p-2'>
          <CardHeader>
            <h2 className="text-2xl font-bold mb-4">Riwayat Pesanan</h2>
          </CardHeader>
          <CardBody>
            {filteredTransactions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredTransactions.map((history, index) => (
                  <div
                    key={history.id}
                    className="bg-white p-4 shadow rounded-md flex flex-col gap-4">
                    <div>
                      <p className="mb-1"><strong>Jasa :</strong> {history.service.service_name}</p>
                      <p className="text-gray-600"><strong>Selesai pada :</strong> {new Date(history.updatedAt).toLocaleDateString()}</p>
                      <p className="mb-1"><strong>Status :</strong> {history.transaction_status}</p>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        onPress={() => {setIsDetailModalOpen(true); setDetailModalIndex(index)}}
                        className="rounded-md bg-[#003366] font-semibold text-white" 
                      >
                        Lihat Rincian
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Tidak ada riwayat transaksi</p>
            )}
          </CardBody>
        </Card>
      </section>

      <HistoryDetailModal 
        isDetailModalOpen={isDetailModalOpen}
        setIsDetailModalOpen={setIsDetailModalOpen}
        detailModalIndex={detailModalIndex}
        filteredTransactions={filteredTransactions}
        orders={orders}
      />

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
  )
}

export default HistoryOrder