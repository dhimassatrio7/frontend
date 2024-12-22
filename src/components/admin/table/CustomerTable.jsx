import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../../store/slices/customerSlice";
import { fetchUsers } from "../../../store/slices/userSlice";
import Layout from "../Layout";

  const CustomerTable = () => {
  const dispatch = useDispatch();

  // Ambil data dari store
  const { customers } = useSelector((state) => state.customer);
  const { users } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchUsers());
  }, [dispatch]);

  // State untuk form
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false); // Confirm delete modal state
  const [customerToDelete, setCustomerToDelete] = useState(null); // Customer to delete

  // Filtered customers based on search query
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const customerData = {
      data: {
        name: name,
        contact: contact,
        address: address,
        user: username, // Store the user ID selected from the users list
      },
    };

    if (editingCustomer) {
      // If editing, update the customer
      dispatch(
        updateCustomer({ documentId: editingCustomer.documentId, customerData })
      );
    } else {
      // If creating, create the customer
      dispatch(createCustomer(customerData));
    }

    // Reset form after submit
    setName("");
    setContact("");
    setAddress("");
    setUsername("");
    setEditingCustomer(null); // Reset editing state
    setIsModalOpen(false);
  };

  // Handle edit customer
  const handleEdit = (customer) => {
    setName(customer.name);
    setContact(customer.contact);
    setAddress(customer.address);
    setUsername(customer.user?.documentId || ""); // Store the user ID in state
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  // Handle delete customer
  const handleDelete = (documentId) => {
    setCustomerToDelete(documentId);
    setConfirmDeleteModal(true); // Open confirm delete modal
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (customerToDelete) {
      dispatch(deleteCustomer(customerToDelete));
    }
    setConfirmDeleteModal(false); // Close modal
  };

  // Close modals
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    setName("");
    setContact("");
    setAddress("");
    setUsername("");
  };

  return (
    <div>
      <Layout />
      <div className="p-6 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Kustomer</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Cari berdasarkan nama"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
        />

        {/* Create New Customer Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className=" px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Buat Customer Baru
          </button>
        </div>

        {/* Customers Table */}
        <div className="bg-white p-6 rounded shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-300 px-4 py-2">No</th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Nama Pengguna
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Full Name
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Kontak
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Alamat
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, idx) => (
                  <tr key={customer.id} className="hover:bg-gray-100">
                    <td className="border-t border-gray-200 px-4 py-2">
                      {idx + 1}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2">
                      {customer.user?.username || "N/A"}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2">
                      {customer.name}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2">
                      {customer.contact}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2">
                      {customer.address}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2 space-x-2">
                      <div className="flex flex-col space-y-2 size-max">

                      <button
                        onClick={() => handleEdit(customer)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer.documentId)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Edit/Create Customer */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {editingCustomer ? "Edit Customer" : "Buat Customer Baru"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Kontak
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Alamat
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Nama Pengguna
                  </label>
                  <select
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  >
                    <option value="">Select Username</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.documentId}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingCustomer ? "Edit" : "Buat"} Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm Delete Modal */}
        {confirmDeleteModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Apakah anda yakin ingin menghapus customer ini?
              </h2>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setConfirmDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Konfirmasi Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerTable;
