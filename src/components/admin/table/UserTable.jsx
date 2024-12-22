import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../store/slices/userSlice";
import Layout from "../Layout";

const UserTable = () => {
  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  // State form
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: 1,
    user_role: "Authenticated",
    profile_image: 46,
  });

  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State untuk pencarian
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk konfirmasi hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Fungsi perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fungsi upload gambar
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formDataImage = new FormData();
    formDataImage.append("files", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: formDataImage,
      });

      const result = await response.json();

      if (result && result[0]?.id) {
        setFormData({ ...formData, profile_image: result[0].id });
        console.log("Gambar berhasil diupload:", result[0]);
      }
    } catch (error) {
      console.error("Error saat mengupload gambar:", error);
    }
  };

  // Fungsi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      dispatch(updateUser({ documentId: editingUser.id, userData: formData }));
    } else {
      dispatch(createUser(formData));
    }

    setFormData({
      username: "",
      email: "",
      password: "",
      role: 1,
      user_role: "Authenticated",
      profile_image: "",
    });
    setEditingUser(null);
    setIsModalOpen(false);
  };

  // Fungsi edit
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role?.id || 1,
      user_role: user.user_role,
      profile_image: user.profile_image?.id || "",
    });
    setIsModalOpen(true);
  };

  // Fungsi hapus (tampilkan modal konfirmasi)
  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Konfirmasi hapus
  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete.id));
    }
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Batalkan hapus
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Tutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      role: 1,
      user_role: "Authenticated",
      profile_image: "",
    });
  };

  // Filter users berdasarkan searchQuery
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="">
      <Layout/>
      <div className="p-6 min-h-screen">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengguna</h1>

      {/* Input Pencarian */}
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Cari berdasarkan Nama Pengguna"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 w-1/3"
        />
      </div>

      {/* Tombol Tambah Pengguna Baru */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Buat Pengguna Baru
      </button>

      {/* Tabel Pengguna */}
      <div className="bg-white p-6 rounded shadow">
        {loading ? (
          <p>Memuat...</p>
        ) : error ? (
          <p>Kesalahan: {error}</p>
        ) : (
          <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">
            <div className="over">

            </div>
            <thead>
              <tr>
                <th className="border-b-2 border-gray-300 px-4 py-2">No</th>
                <th className="border-b-2 border-gray-300 px-4 py-2">
                  Nama Pengguna
                </th>
                <th className="border-b-2 border-gray-300 px-4 py-2">Email</th>
                <th className="border-b-2 border-gray-300 px-4 py-2">Role</th>
                <th className="border-b-2 border-gray-300 px-4 py-2">
                  User Role
                </th>
                <th className="border-b-2 border-gray-300 px-4 py-2">
                  Foto Profil
                </th>
                <th className="border-b-2 border-gray-300 px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border-t border-gray-200 px-4 py-2">
                    {idx + 1}
                  </td>
                  <td className="border-t border-gray-200 px-4 py-2">
                    {user.username}
                  </td>
                  <td className="border-t border-gray-200 px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border-t border-gray-200 px-4 py-2">
                    {user.role?.id === 1
                      ? "Authenticated"
                      : user.role?.id === 2
                      ? "Public"
                      : user.role?.id === 3
                      ? "Service Provider"
                      : "Editor"}
                  </td>
                  <td className="border-t border-gray-200 px-4 py-2">
                    {user.user_role}
                  </td>
                  <td className="border-t border-gray-200 px-4 py-2">
                    {user.profile_image?.url ? (
                      <img
                        src={`${BASE_URL}${user.profile_image.url}`}
                        alt={user.username}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      "Tidak ada gambar"
                    )}
                  </td>
                  <td className="border-t border-gray-200 px-4 py-2 space-x-2">
                    <div className="flex flex-col space-y-2 size-max">

                    <button
                      onClick={() => handleEdit(user)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
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
        )}
      </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Konfirmasi Penghapusan
            </h2>
            <p className="mb-4">
              Apakah Anda yakin ingin menghapus pengguna ini?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
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

      {/* Modal untuk Membuat/Memperbarui Pengguna */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {editingUser ? "Edit Pengguna" : "Buat Pengguna Baru"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Nama Pengguna
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Kata Sandi</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  required={!editingUser}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value={1}>Authenticated</option>
                  <option value={2}>Public</option>
                  <option value={3}>Service Provider</option>
                  <option value={4}>Editor</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">User Role</label>
                <input
                  type="text"
                  name="user_role"
                  value={formData.user_role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Foto Profil</label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingUser ? "Simpan Perubahan" : "Buat Pengguna"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
