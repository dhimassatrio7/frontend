// src/CategoryTable.js
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../store/slices/categorySlice";
import { useEffect, useState } from "react";
import Layout from "../Layout";

const CategoryTable = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const openModal = (category = null) => {
    if (category) {
      setCategoryName(category.category_name);
      setCategoryDescription(
        category.category_description?.[0]?.children?.[0]?.text || ""
      );
      setEditingCategory(category);
    } else {
      setCategoryName("");
      setCategoryDescription("");
      setEditingCategory(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryName("");
    setCategoryDescription("");
    setEditingCategory(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryData = {
      data: {
        category_name: categoryName,
        category_description: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: categoryDescription,
              },
            ],
          },
        ],
      },
    };

    if (editingCategory) {
      dispatch(
        updateCategory({
          documentId: editingCategory.documentId,
          categoryData,
        })
      );
    } else {
      dispatch(createCategory(categoryData));
    }

    closeModal();
  };

  const handleDelete = (documentId) => {
    setCategoryToDelete(documentId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteCategory(categoryToDelete));
    closeDeleteModal();
  };

  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Layout />
      <div className="p-6 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Kategori</h1>

        {/* Input Pencarian */}
        <div className="mb-4 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Cari berdasarkan nama kategori"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 w-1/3"
          />
        </div>

        {/* Tombol Tambah Kategori Baru */}
        <button
          onClick={() => openModal()}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Buat Kategori Baru
        </button>

        {/* Tabel Kategori */}
        <div className="bg-white p-6 rounded shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-300 px-4 py-2">No</th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Nama Kategori
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Deskripsi
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category, idx) => (
                  <tr key={category.id} className="hover:bg-gray-100">
                    <td className="border-t border-gray-200 px-4 py-2">
                      {idx + 1}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2">
                      {category.category_name}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2">
                      {category.category_description?.[0]?.children?.[0]
                        ?.text || "Deskripsi tidak tersedia"}
                    </td>
                    <td className="border-t border-gray-200 px-4 py-2">
                      <div className="flex flex-col space-y-2 size-max ">
                        <button
                          onClick={() => openModal(category)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.documentId)}
                          className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 "
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

        {/* Modal untuk Pembuatan/Pengeditan Kategori */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {editingCategory ? "Edit Kategori" : "Buat Kategori Baru"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Nama Kategori
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Deskripsi Kategori
                  </label>
                  <textarea
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  ></textarea>
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
                    {editingCategory ? "Perbarui" : "Buat"} Kategori
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal untuk Konfirmasi Hapus */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Konfirmasi Hapus
              </h2>
              <p>Apakah Anda yakin ingin menghapus kategori ini?</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-gray-700 rounded-md hover bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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

export default CategoryTable;
