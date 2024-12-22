import React, { useEffect } from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../store/slices/serviceSlice"; // Import action fetchServices
import NavbarComponent from "../components/NavbarComponent";
import FooterComponent from "../components/FooterComponent";
import home from "../assets/home/home.svg";
import {
  BiPhone,
  BiLogoInstagram,
  BiEnvelope,
  BiTimeFive,
  BiInfoCircle,
} from "react-icons/bi";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ambil data layanan dan status loading dari Redux
  const { services, loading } = useSelector((state) => state.service);
  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  useEffect(() => {
    // Panggil fetchServices saat komponen pertama kali di-render
    dispatch(fetchServices());
  }, [dispatch]);
  console.log(services);

  const scrollToProducts = () => {
    const section = document.getElementById("products");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDetailOrder = (id_jasa) => {
    navigate(`/detail/${id_jasa}`);
  };

  return (
    <div className="bg-gray-100">
      <NavbarComponent />
      <header className="h-screen flex items-center bg-[#5DA2D5]">
  <div className="container mx-auto px-5">
    <div className="flex items-center">
      <div className="w-1/2">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          <span className="text-black">Duduk Manis,</span>{" "}
          <p className="text-4xl">
            <span className="text-black">Udah Ada Yang BantuIn</span>
          </p>
        </h1>
        <Button
          className="bg-[#F3D250] hover:bg-[#4b8a9d] text-white font-bold py-2 px-4"
          radius="full"
          size="lg"
          onClick={scrollToProducts}
        >
          Mau dibantuin apa nih ?
        </Button>
      </div>
      <div className="w-full md:w-1/2 text-center">
        <img className="w-full h-auto max-w-xs md:max-w-full" src={home} alt="images" />
      </div>
    </div>
  </div>
</header>

      {/* Services */}
      <section className="container mx-auto py-10" id="products">
        <h2 className="text-2xl font-bold text-center mb-8">Layanan Kami</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services && services.length > 0 ? (
              services.map((service, index) => (
                <div
                  key={service.id || index}
                  className="flex items-center bg-white rounded-lg shadow-md w-full h-[150px] relative"
                >
                  {/* Gambar Produk */}
                  <img
                    src={`${BASE_URL}${service.image.url}`}
                    alt={service.service_name}
                    className="rounded-xl w-40 h-40 object-cover mx-4 p-4"
                  />
                  {/* Detail Produk */}
                  <div className="flex flex-col justify-center flex-1">
                    <h5 className="text-lg font-semibold">
                      {service.service_name}
                    </h5>
                    <p className="text-gray-600">
                      Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(
                        service.price || 0
                      )}
                    </p>
                    {/* Deskripsi untuk Mobile: hanya 10 karakter + ellipsis */}
                    <p className="text-sm text-gray-500 mt-2 md:block hidden">
                      {service.service_description?.[0]?.children?.[0]?.text ||
                        "Deskripsi tidak tersedia"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2 md:hidden block">
                      {service.service_description?.[0]?.children?.[0]?.text?.slice(
                        0,
                        10
                      ) || "Deskripsi"}
                      ...
                    </p>
                  </div>
                  {/* Tombol Pilih Jasa */}
                  <Button
                    className="absolute right-4 bg-[#5DA2D5] text-white py-1 px-3 hover:bg-[#7AB7E0]"
                    radius="full"
                    onClick={() => handleDetailOrder(service.id)}
                  >
                    Pilih Jasa
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No services available at the moment.
              </p>
            )}
          </div>
        )}
      </section>

 
{/* Contact */}
<section className="py-10" id="contact">
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold">Butuh Bantuan? Hubungi Bantuin</h1>
  </div>

  <div className="container mx-auto">
    <div className="flex flex-col items-center justify-center">
      {/* Informasi Kontak */}
      <div className="md:w-1/2 mb-6 md:mb-0">
        <div className="space-y-4">
          <div className="flex items-center justify-start">
            <BiPhone className="text-blue-500 mr-3 text-2xl" />
            <span className="font-semibold text-lg">
              Mobile Phone: (+62) 821-1234-5678
            </span>
          </div>
          <div className="flex items-center justify-start">
            <BiLogoInstagram className="text-pink-500 mr-3 text-2xl" />
            <span className="font-semibold text-lg">Instagram: @bantuin</span>
          </div>
          <div className="flex items-center justify-start">
            <BiEnvelope className="text-gray-500 mr-3 text-2xl" />
            <span className="font-semibold text-lg">Email: bantuin@gmail.com</span>
          </div>
          <div className="flex items-center justify-start">
            <BiTimeFive className="text-green-500 mr-3 text-2xl" />
            <span className="font-semibold text-lg">
              Senin - Minggu 06.00 - 22.00 (WIB)
            </span>
          </div>
          <div className="flex items-center justify-start">
            <BiInfoCircle className="text-red-500 mr-3 text-2xl" />
            <span className="font-semibold text-lg">
              BantuIn tidak bertanggung jawab atas transaksi langsung yang
              dilakukan pelanggan dengan mitra di luar pengelolaan admin.
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Footer (You can implement your Footer component here) */}
      <FooterComponent />
    </div>
  );
};

export default HomePage;

