import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  fetchPartnerRequests,
  createPartnerRequest,
  updatePartnerRequest,
  deletePartnerRequest,
} from "../../../store/slices/partnerRequestSlice";
import { fetchCategories } from "../../../store/slices/categorySlice";
import Layout from "../Layout";

const PartnerRequestTable = () => {
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  // Fetch data from the Redux store
  const { partnerRequests } = useSelector((state) => state.partnerRequest);
  const { categories } = useSelector((state) => state.category);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [category, setCategory] = useState("");
  const [identityCard, setIdentityCard] = useState(null);
  const [drivingLicense, setDrivingLicense] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);

  useEffect(() => {
    dispatch(fetchPartnerRequests());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Image upload function
  const handleImageUpload = async (e, type) => {
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
        if (type === "identityCard") {
          setIdentityCard(result[0].id);
        } else if (type === "drivingLicense") {
          setDrivingLicense(result[0].id);
        }
        console.log("Image uploaded successfully:", result[0]);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const partnerRequestData = {
      data: {
        name,
        email,
        address: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: address,
              },
            ],
          },
        ],
        date_of_birth: dateOfBirth,
        categories: category || "",
        identity_card: identityCard,
        driving_license: drivingLicense,
      },
    };

    if (editingRequest) {
      dispatch(
        updatePartnerRequest({
          documentId: editingRequest.documentId,
          partnerData: partnerRequestData,
        })
      );
    } else {
      dispatch(createPartnerRequest(partnerRequestData));
    }

    resetForm();
    setIsModalOpen(false); // Close modal after submit
  };

  // Handle editing a request
  const handleEdit = (request) => {
    setName(request.name);
    setEmail(request.email);
    setAddress(request.address?.[0]?.children?.[0]?.text || "");
    setDateOfBirth(request.date_of_birth);
    setCategory(request.categories?.[0]?.documentId || "");
    setIdentityCard(request.identity_card?.id || null);
    setDrivingLicense(request.driving_license?.id || null);
    setEditingRequest(request);
    setIsModalOpen(true); // Open modal for editing
  };

  // Open delete confirmation modal
  const handleDeleteConfirmation = (documentId) => {
    setDeleteRequestId(documentId);
    setIsDeleteModalOpen(true); // Open modal for delete confirmation
  };

  // Handle delete request
  const handleDelete = () => {
    if (deleteRequestId) {
      dispatch(deletePartnerRequest(deleteRequestId));
      setIsDeleteModalOpen(false); // Close modal after delete
    }
  };

  // Reset form state
  const resetForm = () => {
    setName("");
    setEmail("");
    setAddress("");
    setDateOfBirth("");
    setCategory("");
    setIdentityCard(null);
    setDrivingLicense(null);
    setEditingRequest(null);
  };

  return (
      <div>
        <Layout />
        <div className="p-6 min-h-screen">
          <h1 className="text-xl font-semibold mb-4">Permintaan Mitra</h1>
          {/* Button to open create modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Buat Permintaan Mitra Baru
          </button>
    
          {/* Modal for Create/Update Partner Request */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  {editingRequest
                    ? "Perbarui Permintaan Mitra"
                    : "Buat Permintaan Mitra Baru"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Nama
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
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Alamat
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                    />
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
    
                  {/* Upload Identity Card and Driving License */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Unggah Kartu Identitas
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "identityCard")}
                      className="mt-1 block w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Unggah SIM
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "drivingLicense")}
                      className="mt-1 block w-full"
                    />
                  </div>
    
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {editingRequest ? "Perbarui" : "Buat"} Permintaan Mitra
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
    
          {/* Modal for Delete Confirmation */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Konfirmasi Hapus
                </h2>
                <p>Apakah Anda yakin ingin menghapus permintaan ini?</p>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          )}
    
          {/* Table for Partner Requests */}
          <div className="bg-white p-6 rounded shadow">
            <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-300 px-4 py-2">No</th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">Nama</th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">Email</th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">Alamat</th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">Tanggal Lahir</th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">Kategori</th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">Kartu Identitas</th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">SIM</th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {partnerRequests.map((partnerRequest, idx) => (
                  <tr key={partnerRequest.id} className="border-t">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{partnerRequest.name}</td>
                    <td className="px-4 py-2">{partnerRequest.email}</td>
                    <td className="px-4 py-2">
                      {partnerRequest.address?.[0]?.children?.[0]?.text}
                    </td>
                    <td className="px-4 py-2">{partnerRequest.date_of_birth}</td>
                    <td className="px-4 py-2">
                      {partnerRequest.categories
                        ? partnerRequest.categories
                            .map((category) => category.category_name)
                            .join(", ")
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {partnerRequest.identity_card?.url ? (
                        <img
                          src={`${BASE_URL}${partnerRequest.identity_card.url}`}
                          alt="Identity Card"
                          width={80}
                        />
                      ) : (
                        "Tidak ada gambar"
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {partnerRequest.driving_license?.url ? (
                        <img
                          src={`${BASE_URL}${partnerRequest.driving_license.url}`}
                          alt="Driving License"
                          width={80}
                        />
                      ) : (
                        "Tidak ada gambar"
                      )}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2 space-x-2">
                      <div className="flex flex-col space-y-2 size-max">

                      <button
                        onClick={() => handleEdit(partnerRequest)}
                        type="submit"
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteConfirmation(partnerRequest.documentId)}
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
        </div>
      </div>
      );
    };

export default PartnerRequestTable;
