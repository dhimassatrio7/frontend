import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import ServiceProviderPartnerTable from "./table/ServiceProviderPartnerTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceProviderByDocumentId } from "../../store/slices/serviceProviderSlice";
import { fetchTransactionsForServiceProvider, updateTransaction } from "../../store/slices/transactionSlice";
import { fetchCustomers } from "../../store/slices/customerSlice";
import { fetchUserById, fetchUsers } from "../../store/slices/userSlice";
import EditData from "./modal/EditData";

const Main = () => {
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_IMAGE_URL;
  const { serviceProviders } = useSelector((state) => state.serviceProvider);
  const { transactions } = useSelector((state) => state.transaction);
  const { customers } = useSelector((state) => state.customer);
  const userPhoto = useSelector((state) => state.user)

  // Get documentId from localStorage
  const documentId = localStorage.getItem("documentId"); // Assuming the documentId is stored under "documentId"
  const documentIdServiceProvider = serviceProviders[0]?.documentId;
  const userId = localStorage.getItem('id');

  useEffect(() => {
    if (documentId) {
      dispatch(fetchServiceProviderByDocumentId(documentId));
      dispatch(fetchCustomers());
      
    }

    dispatch(fetchUserById(userId));
    
    if (documentIdServiceProvider) {
      dispatch(fetchTransactionsForServiceProvider(documentIdServiceProvider));
    }
  }, [dispatch, documentId, documentIdServiceProvider, userId]);

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.transaction_status == "Pending" ||
      transaction.transaction_status == "On Progress"
  );

  const handleTakeOrder = (transaction) => {
 
    const transactionData = {
      data: {
        detail_order: transaction.detail_order,
        address: transaction.address,
        customer: [transaction.customer[0]?.id],
        service: transaction.service.id,
        transaction_status: "On Progress",
        order_date: transaction.order_date,
      },
    };
    const documentId = transaction.documentId
    
    dispatch(updateTransaction({documentId, transactionData}));

    dispatch(fetchTransactionsForServiceProvider(documentIdServiceProvider));
    
  }

  const handleComplete = (transaction) => {
 
    const transactionData = {
      data: {
        detail_order: transaction.detail_order,
        address: transaction.address,
        customer: [transaction.customer[0]?.id],
        service: transaction.service.id,
        transaction_status: "Completed",
        order_date: transaction.order_date,
      },
    };
    const documentId = transaction.documentId
    
    dispatch(updateTransaction({documentId, transactionData}));
    
    dispatch(fetchTransactionsForServiceProvider(documentIdServiceProvider));

    window.location.reload();
  }

  const handleCancel = (transaction) => {

    const transactionData = {
      data: {
        detail_order: transaction.detail_order,
        address: transaction.address,
        customer: [transaction.customer[0]?.id],
        service: transaction.service.id,
        transaction_status: "Cancelled",
        order_date: transaction.order_date,
      },
    };
    const documentId = transaction.documentId
    
    dispatch(updateTransaction({documentId, transactionData}));
    
    dispatch(fetchTransactionsForServiceProvider(documentIdServiceProvider));
  }

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [user, setUser] = useState("");
  const [editingServiceProvider, setEditingServiceProvider] = useState(null);

  const { users } = useSelector((state) => state.user);

  useEffect(() => {
    if (documentId) {
      dispatch(fetchServiceProviderByDocumentId(documentId));
      dispatch(fetchUsers());
    }
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
        <Card className="bg-gray-100/70 rounded-md p-2">
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
              <div className="flex flex-col w-full">
                <p className="mb-2">
                  <strong>Nama :</strong> {serviceProviders[0]?.user.username}
                </p>
                <p className="mb-2">
                  <strong>Email :</strong> {serviceProviders[0]?.user.email}
                </p>
                <p className="mb-2">
                  <strong>Telepon :</strong> {serviceProviders[0]?.contact}
                </p>
                <p className="mb-2">
                  <strong>Alamat :</strong> {serviceProviders[0]?.location}
                </p>
                <div className="flex w-full justify-end">
                  <Button onPress={() => {handleEdit(serviceProviders[0]); setIsModalEditOpen(true)}}>Edit</Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Order List Section */}
      <section className="mb-8">
        <Card className="bg-gray-100/70 rounded-md p-2">
          <CardHeader>
            <h2 className="text-2xl font-bold mb-4">Daftar Pesanan</h2>
          </CardHeader>
          <CardBody>
            {filteredTransactions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTransactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 shadow rounded-md flex flex-col justify-between"
                  >
                    <div className="flex flex-col gap-2">
                      <p>
                        <strong>Status :</strong>{" "}
                        {transaction.transaction_status}
                      </p>
                      <p>
                        <strong>Jasa :</strong>{" "}
                        {transaction.service.service_name}
                      </p>
                      <div>
                        <strong>Nama :</strong>
                        <p className="text-gray-600">
                          {" "}
                          {transaction.customer[0]?.name}
                        </p>
                      </div>
                      <div>
                        <strong>Nomor HP :</strong>
                        <p className="text-gray-600">
                          {" "}
                          {transaction.customer[0]?.contact}
                        </p>
                      </div>
                      <div>
                        <strong>Tanggal :</strong>
                        <p className="text-gray-600">
                          {" "}
                          {new Date(
                            transaction.order_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <strong>Harga :</strong>
                        <p className="text-gray-600">
                          {" "}
                          Rp.{" "}
                          {new Intl.NumberFormat("id-ID").format(
                            transaction.service.price
                          )}
                        </p>
                      </div>
                      <div>
                        <strong>Alamat :</strong>
                        <p className="text-gray-600">
                          {" "}
                          {transaction.address}
                        </p>
                      </div>
                      <div>
                        <strong>Deskripsi Pekerjaan :</strong>
                        <p className="text-gray-600">
                          {" "}
                          {
                            transaction.detail_order
                          }
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      {transaction.transaction_status === "Pending" ? (
                        <Button
                          color="success"
                          onClick={() => handleTakeOrder(transaction)}
                          className="mt-2 font-semibold"
                        >Ambil</Button>
                      ) : transaction.transaction_status ===
                        "On Progress" ? (
                        <div className="flex gap-3">
                          <Button
                            color="error"
                            onClick={() => handleComplete(transaction)}
                            className="mt-2 font-semibold bg-blue-400"
                          >
                            Selesai
                          </Button>

                          <Button
                            color="error"
                            onClick={() => handleCancel(transaction)}
                            className="mt-2 font-semibold bg-red-400"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Tidak ada permintaan service</p>
            )}
          </CardBody>
        </Card>
      </section>

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

export default Main;
