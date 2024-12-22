import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  fetchPartnerRequests,
  createPartnerRequest,
} from "../../store/slices/partnerRequestSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RegistrationPartner = () => {
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
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    dispatch(fetchPartnerRequests());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Image upload function with validation
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
  
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setError("Hanya file dengan format JPG atau PNG yang diperbolehkan.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10 MB limit
        setError("Ukuran file tidak boleh lebih dari 10 MB.");
        return;
      }
  
      const formData = new FormData();
      formData.append("files", file);
  
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
          method: "POST",
          body: formData, // Tidak ada header Authorization
        });
  
        const result = await response.json();
  
        if (result && result[0]?.id) {
          if (type === "identityCard") {
            setIdentityCard(result[0].id);
          } else if (type === "drivingLicense") {
            setDrivingLicense(result[0].id);
          }
          setError(""); // Clear error on successful upload
          console.log("Image uploaded successfully:", result[0]);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  
  // Handle form submission with age validation
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Calculate age based on the date of birth
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    // Adjust age calculation if the birthdate hasn't passed this year yet
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    // If the age is less than 18, show an error and prevent submission
    if (age < 18) {
      setDateError("Umur harus minimal 18 tahun.");
 return; // Stop form submission
    }
  
    // Prepare data to be sent in the partner request
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
        categories: category || "", // If no category, send empty string
        identity_card: identityCard,
        driving_license: drivingLicense,
      },
    };
  
    // Dispatch the action to create the partner request
    try {
      await dispatch(createPartnerRequest(partnerRequestData));
      // Show confirmation alert
      toast.success("Pendaftaran berhasil. Silakan tunggu konfirmasi dari admin.");
      // Reset the form values after successful submission
      resetForm();
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim permintaan. Silakan coba lagi.");
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
    setError("");
    setDateError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-xl font-semibold mb-4">Pendaftaran Mitra</h1>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Alamat</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Tanggal Lahir</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
            {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            >
              <option value="">Pilih Keterampilan</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.documentId}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Identity Card and Driving License */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Unggah Kartu Identitas</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "identityCard")}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray -600">Unggah SIM</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "drivingLicense")}
              className="mt-1 block w-full"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Buat Permintaan Mitra
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default RegistrationPartner;