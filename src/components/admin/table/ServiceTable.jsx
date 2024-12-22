import { useDispatch, useSelector } from "react-redux";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "../../../store/slices/serviceSlice";
import { fetchServiceProviders } from "../../../store/slices/serviceProviderSlice";
import { fetchCategories } from "../../../store/slices/categorySlice";
import { useState, useEffect } from "react";
import Layout from "../Layout";

const ServiceTable = () => {
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  // Ambil data dari store
  const { services } = useSelector((state) => state.service);
  const { serviceProviders } = useSelector((state) => state.serviceProvider);
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchServiceProviders());
    dispatch(fetchCategories());
  }, [dispatch]);

  // State untuk form
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [price, setPrice] = useState("");
  const [serviceProvider, setServiceProvider] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Tambahkan state untuk kata pencarian

  // Fungsi untuk upload gambar
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result && result[0]?.id) {
        setImage(result[0].id);
        console.log("Gambar berhasil diunggah:", result[0]);
      }
    } catch (error) {
      console.error("Error mengunggah gambar:", error);
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceData = {
      data: {
        service_name: serviceName,
        service_description: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: serviceDescription,
              },
            ],
          },
        ],
        price: Number(price),
        service_provider: serviceProvider,
        category: category,
        image: image, // ID gambar
      },
    };

    if (editingService) {
      // Jika sedang mengedit, update layanan
      dispatch(
        updateService({ documentId: editingService.documentId, serviceData })
      );
    } else {
      // Jika membuat baru, buat layanan
      dispatch(createService(serviceData));
    }

    closeModal();
  };

  // Handle edit service
  const handleEdit = (service) => {
    setServiceName(service.service_name);
    setServiceDescription(
      service.service_description?.[0]?.children?.[0]?.text || ""
    );
    setPrice(service.price);
    setServiceProvider(service.service_provider?.documentId || "");
    setCategory(service.category?.documentId || "");
    setImage(service.image?.id || null);
    setEditingService(service);
    setIsModalOpen(true);
  };

  // Handle delete service
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteService(deleteId));
    }
    setIsDeleteModalOpen(false);
    setDeleteId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setServiceName("");
    setServiceDescription("");
    setPrice("");
    setServiceProvider("");
    setCategory("");
    setImage(null);
    setEditingService(null);
  };

  // Filter layanan berdasarkan kata pencarian
  const filteredServices = services.filter((service) =>
    service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Layout />
      <div className="p-6 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Layanan</h1>

        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan nama layanan..."
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Buat Layanan Baru
        </button>

        <div className="overflow-x-auto">
          <div className="bg-white p-6 rounded shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-300 px-4 py-2">No</th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Nama Layanan
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Penyedia Layanan
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Kategori
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Deskripsi
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Harga
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Gambar
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service, idx) => (
                  <tr key={service.id} className="hover:bg-gray-100">
                    <td className="border-t border-gray-200 px-4 py-2">
                      {idx + 1}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2">
                      {service.service_name}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2">
                      {service.service_provider?.company_name || "N/A"}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2">
                      {service.category?.category_name || "N/A"}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2">
                      {service.service_description?.[0]?.children?.[0]?.text ||
                        "Deskripsi tidak tersedia"}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2">
                      {service.price}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2">
                      {service.image?.url ? (
                        <img
                          src={`${BASE_URL}${service.image.url}`}
                          alt={service.service_name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        "Tidak ada gambar"
                      )}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2 space-x-2">
                      <div className="flex flex-col space-y-2 size-max"></div>
                      <button
                        onClick={() => handleEdit(service)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setDeleteId(service.documentId);
                        }}
                        className="px-3 py-1  bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Hapus
                      </button>
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
                {editingService ? "Perbarui Layanan" : "Buat Layanan Baru"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Nama Layanan
                  </label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Deskripsi Layanan
                  </label>
                  <textarea
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Harga
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Penyedia Layanan
                  </label>
                  <select
                    value={serviceProvider}
                    onChange={(e) => setServiceProvider(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  >
                    <option value="">Pilih Penyedia Layanan</option>
                    {serviceProviders.map((provider) => (
                      <option key={provider.id} value={provider.documentId}>
                        {provider.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.documentId}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Unggah Gambar
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
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
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Apakah Anda yakin ingin menghapus layanan ini?
              </h2>
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

export default ServiceTable;
