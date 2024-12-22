import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Image,
  Input,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import NavbarComponent from "../components/NavbarComponent";
import { fetchServices } from "../store/slices/serviceSlice";
import { useDispatch, useSelector } from "react-redux";

const Layanan = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_IMAGE_URL;
  const dispatch = useDispatch();

  // State untuk menyimpan data layanan dan pencarian
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);


  // Fetch data dari endpoint
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/services?populate=*"); // Ganti dengan URL API Anda
        const data = await response.json();
        setServices(data.data); // Ambil data dari response
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fungsi untuk memformat harga
  const formatPrice = (price) => price.toLocaleString("id-ID");

  // Fungsi untuk mengarahkan ke halaman detail layanan
  const handleDetailOrder = (id_jasa, documentId) => {
    // Simpan documentId ke localStorage
    localStorage.setItem("selectedServiceId", documentId);
    
    // Arahkan ke halaman detail
    navigate(`/detail/${id_jasa}`);
  };

  // Filter layanan berdasarkan pencarian
  const filteredServices = services.filter((service) =>
    service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <NavbarComponent />
      <section className="container mx-auto py-8" id="products">
        <h2 className="text-2xl font-bold text-center mb-8">Layanan Kami</h2>

        {/* Input pencarian */}
        <div className="mb-6 flex justify-center">
          <Input
            clearable
            underlined
            label="Cari Layanan"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            placeholder="Masukkan nama layanan"
            aria-label="Cari layanan"
            width="300px"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                isPressable
                shadow="sm"
                className="w-[300px] rounded-lg bg-white"
              >
                <CardHeader className="p-4 flex justify-center">
                  <Image
                    src={`${BASE_URL}${service.image.url}`} // Mengambil URL gambar dari data
                    alt={service.service_name}
                    width={250}
                    height={150}
                    className="object-cover rounded-lg"
                  />
                </CardHeader>
                <CardBody className="p-4">
                  <h5 className="text-lg font-semibold text-center">
                    {service.service_name}
                  </h5>
                  <p className="text-center text-gray-600">
                    Rp. {formatPrice(service.price)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {service.service_description[0].children[0].text} {/* Mengambil deskripsi */}
                  </p>
                </CardBody>
                <div className="flex justify-end mb-4 p-2">
                  <Button
                    onClick={() => handleDetailOrder(service.id, service.documentId)} // Tambahkan documentId di sini
                    className="bg-[#5DA2D5] text-white hover:bg-[#7AB7E0]"
                    size="lg"
                  >
                    Pilih Jasa
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
      <FooterComponent />
    </>
  );
};

export default Layanan;
