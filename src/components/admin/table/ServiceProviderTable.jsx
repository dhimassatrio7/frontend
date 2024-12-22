import { useDispatch, useSelector } from "react-redux";
import {
  fetchServiceProviders,
  createServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
} from "../../../store/slices/serviceProviderSlice";
import { fetchUsers } from "../../../store/slices/userSlice";
import { useEffect, useState } from "react";
import Layout from "../Layout";

const ServiceProviderTable = () => {
  const dispatch = useDispatch();
  const { serviceProviders } = useSelector((state) => state.serviceProvider);
  const { users } = useSelector((state) => state.user);

  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [user, setUser] = useState("");
  const [editingServiceProvider, setEditingServiceProvider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Menambahkan state untuk query pencarian

  useEffect(() => {
    dispatch(fetchServiceProviders());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Submit form untuk membuat/memperbarui penyedia layanan
  const handleSubmit = (e) => {
    e.preventDefault();

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
      dispatch(
        updateServiceProvider({
          documentId: editingServiceProvider.documentId,
          serviceProviderData,
        })
      );
    } else {
      dispatch(createServiceProvider(serviceProviderData));
    }

    closeModal();
  };

  const handleEdit = (serviceProvider) => {
    setCompanyName(serviceProvider.company_name);
    setCompanyDescription(
      serviceProvider.company_description?.[0]?.children?.[0]?.text || ""
    );
    setLocation(serviceProvider.location);
    setContact(serviceProvider.contact);
    setUser(serviceProvider.user?.documentId || "");
    setEditingServiceProvider(serviceProvider);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteServiceProvider(deleteId));
    }
    setIsDeleteModalOpen(false);
    setDeleteId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCompanyName("");
    setCompanyDescription("");
    setLocation("");
    setContact("");
    setUser("");
    setEditingServiceProvider(null);
  };

  // Menyaring penyedia layanan berdasarkan query pencarian
  const filteredServiceProviders = serviceProviders.filter((serviceProvider) =>
    serviceProvider.company_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
      <div>
    <Layout />
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Penyedia Layanan
      </h1>

      {/* Bar Pencarian */}
      <input
        type="text"
        placeholder="Cari berdasar nama penyedia layanan"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
      />
      <div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Buat Penyedia Layanan
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="overflow-x-auto">

        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-300 px-4 py-2">No</th>
              <th className="border-b-2 border-gray-300 px-4 py-2">User</th>
              <th className="border-b-2 border-gray-300 px-4 py-2">
                Nama Perusahaan
              </th>
              <th className="border-b-2 border-gray-300 px-4 py-2">
                Deskripsi
              </th>
              <th className="border-b-2 border-gray-300 px-4 py-2">Lokasi</th>
              <th className="border-b-2 border-gray-300 px-4 py-2">Kontak</th>
              <th className="border-b-2 border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredServiceProviders.map((serviceProvider, idx) => (
              <tr key={serviceProvider.id} className="hover:bg-gray-100">
                <td className="border-t border-gray-200 px-4 py-2">
                  {idx + 1}
                </td>
                <td className="border-t border-gray-200 px-4 py-2">
                  {serviceProvider.user?.username || "N/A"}
                </td>
                <td className="border-t border-gray-200 px-4 py-2">
                  {serviceProvider.company_name}
                </td>
                <td className="border-t border-gray-200 px-4 py-2">
                  {serviceProvider.company_description?.[0]?.children?.[0]
                    ?.text || "Tidak ada deskripsi tersedia"}
                </td>
                <td className="border-t border-gray-200 px-4 py-2">
                  {serviceProvider.location}
                </td>
                <td className="border-t border-gray-200 px-4 py-2">
                  {serviceProvider.contact}
                </td>
                <td className="border-t border-gray-200 px-4 py-2 space-x-2">
                  <div className="flex flex-col space-y-2 size-max">

                  <button
                    onClick={() => handleEdit(serviceProvider)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setDeleteId(serviceProvider.documentId);
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Hapus
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {editingServiceProvider
                ? "Perbarui Penyedia Layanan"
                : "Buat Penyedia Layanan Baru"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Nama Perusahaan
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Deskripsi Perusahaan
                </label>
                <textarea
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                  Pengguna
                </label>
                <select
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                >
                  <option value="">Pilih Pengguna</option>
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
                  {editingServiceProvider ? "Perbarui" : "Buat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Konfirmasi Hapus
            </h2>
            <p className="mb-4 text-gray-600">
              Apakah Anda yakin ingin menghapus penyedia layanan ini?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      </div>
  );
};

export default ServiceProviderTable;
