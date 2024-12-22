

import HistoryDetailModal from './modal/HistoryDetailModal';
import { Button, Card, CardBody, CardHeader, Table } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../../store/slices/userSlice";
import { createCustomer, fetchCustomers, updateCustomer } from "../../store/slices/customerSlice";
import defaultPhoto from "../../assets/images/defaultphoto.jpg";
import CancelOrderModal from './modal/CancelOrderModal';
import { fetchTransactionByDocumentId } from "../../store/slices/transactionSlice";

const HistoryOrder = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [historyModalIndex, setHistoryModalIndex] = useState(null);

  const dispatch = useDispatch();

  // Redux states
  const { user, loading: userLoading, error: userError } = 
  useSelector(
    (state) => state.user
  );
  const { customers, loading: customerLoading, error: customerError } =
    useSelector((state) => state.customer);

  const { transactions } = useSelector((state) => state.transaction);

  const userId = localStorage.getItem("id");
  const documentId = localStorage.getItem("documentId");
  console.log(`docId skrng ${documentId}`)

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
      dispatch(fetchCustomers());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (documentId) {
      dispatch(fetchTransactionByDocumentId(documentId))
      console.log(`ini fetch TRANSDOC ${transactions}`)
    }
  }, [dispatch, documentId]);
  
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
    if (customers.length > 0) {
      const customer = customers.find((customer) => customer.user?.id === user.id);
      if (customer) {
        setContact(customer.contact || "");
        setAddress(customer.address || "");
      } else {
        // Jika customer tidak ditemukan, set contact dan address ke string kosong
        setContact("");
        setAddress("");
      }
      // console.log("Customers:", customers);
      // console.log("Current Customer:", customer);
    }

  }, [user, customers]);

  const handleEdit = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    const customerData = {
      data: {
        name: user?.username, 
        contact: contact,
        address: address,
        user: user?.documentId 
      }
    };
  
    const customer = customers.find((cust) => cust.user?.id === user.id);
    console.log("Current Customer:", customer); // Debugging
    console.log("Customer Data to Send:", customerData); // Debugging
  
    try {
      if (customer) {
        console.log("Updating customer with documentId:", customer.documentId); // Debugging
        await dispatch(updateCustomer({ documentId: customer.documentId, customerData }));
      } else {
        await dispatch(createCustomer({ ...customerData, userId: user.id }));
      }
    } catch (error) {
      console.error("Error updating customer:", error.response?.data); // Menangkap dan mencetak error
    }
  
    setIsEditing(false);
  };

  // Filter cancelled transactions
  const cancelledTransactions = transactions.filter(transaction => 
    transaction.transaction_status === "Completed" || 
    transaction.transaction_status === "Cancelled"
  );

console.log(`ini history`, cancelledTransactions)
console.log(`ini fetch nya`, transactions)


  return (
    <div className="p-6 px-12 sm:pl-64 bg-gray-50 min-h-screen bg-gradient-to-br from-[#6fa6c3] from-5% via-[#FFFFFF] via-20% to-[#6fa6c3] to-95%">

      <section className="mb-8">
      <Card className='bg-gray-100/70 rounded-md p-2'>
        <CardHeader>
          <h2 className="text-2xl font-bold mb-4">Detail Profil</h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col md:flex-row items-center bg-white p-4 shadow rounded-md">
            <img
              src={defaultPhoto}
              alt="Profile"
              className="w-36 h-36 rounded-full mb-4 md:mb-0 md:mr-6"
            />
            <div className="flex-1">
              {isEditing ? (
                <>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border rounded-md p-1 mb-2 w-full"
                    placeholder="Username"
                  />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-md p-1 mb-2 w-full"
                    placeholder="Email"
                  />
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="border rounded-md p-1 mb-2 w-full"
                    placeholder="No Telp"
                  />
                  <input value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border rounded-md p-1 mb-2 w-full"
                    placeholder="Alamat"
                  />
                  <Button color="success" onClick={handleSave}>
                    Simpan
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold">{username}</p>
                  <p className="text-sm text-gray-600">{email}</p>
                  <p className="text-sm text-gray-600">{contact}</p>
                  <p className="text-sm text-gray-600">{address}</p>
                  <Button color="primary" onClick={handleEdit}>
                    Edit
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </section>
    

    <section>
        <Card className='bg-gray-100/70 rounded-md p-2'>
          <CardHeader>
            <h2 className="text-2xl font-bold mb-4">Riwayat Pesanan</h2>
          </CardHeader>
          <CardBody>
            {cancelledTransactions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cancelledTransactions.map((transaction) => (
                  <div key={transaction.id} className="bg-white p-4 shadow rounded-md flex flex-col gap-4">
                    <div>
                      <p className="mb-1"><strong>Jasa:</strong> {transaction.service.service_name}</p>
                      <p className="text-gray-600"><strong>Selesai pada:</strong> {new Date(transaction.order_date).toLocaleDateString()}</p>
                      <p className="text-gray-600"><strong>Status:</strong> {transaction.transaction_status}</p>
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        onPress={() => {setIsDetailModalOpen(true); setHistoryModalIndex(transaction.id)}}
                        className="rounded -md bg-[#003366] font-semibold text-white" 
                      >
                        Lihat Rincian
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Tidak ada riwayat pesanan yang dibatalkan.</p>
            )}
          </CardBody>
        </Card>
      </section>

      <HistoryDetailModal 
        isDetailModalOpen={isDetailModalOpen}
        setIsDetailModalOpen={setIsDetailModalOpen}
        historyModalIndex={historyModalIndex}
        serviceHistory={cancelledTransactions}
        cancelledTransactions={cancelledTransactions}
      />
    </div>
  )
}

export default HistoryOrder;