import { useEffect, useState } from "react";
import { Button, Image } from "@nextui-org/react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerByDocumentIdUser } from "../store/slices/customerSlice";
import { fetchServiceByDocumentId } from "../store/slices/serviceSlice";
import { fetchServiceProviders } from "../store/slices/serviceProviderSlice";
import { fetchCategories } from "../store/slices/categorySlice";
import { createTransaction } from "../store/slices/transactionSlice";

const DetailOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_IMAGE_URL;
  const [isRequesting, setIsRequesting] = useState(false);
  const [orderAccepted, setOrderAccepted] = useState(false);

  // Ambil data dari Redux store
  const { services } = useSelector((state) => state.service);
  const { customer } = useSelector((state) => state.customer);

  // Ambil data dari localStorage
  const selectedServiceId = localStorage.getItem("selectedServiceId");
  const documentId = localStorage.getItem("documentId");

  // Fetch data saat komponen pertama kali dirender
  useEffect(() => {
    dispatch(fetchServiceByDocumentId(selectedServiceId));
    dispatch(fetchCustomerByDocumentIdUser(documentId));
    dispatch(fetchServiceProviders());
    dispatch(fetchCategories());
  }, [dispatch, selectedServiceId, documentId]);

  // State untuk menyimpan detail order
  const [detailOrder, setDetailOrder] = useState({
    detail_order: "",
    address: "",
    customer: undefined,
    service: undefined,
    transaction_status: "Pending",
    order_date: new Date().toISOString(),
  });

  // Update state `detailOrder` setelah data customer dan service tersedia
  useEffect(() => {
    if (customer.length > 0 && services.length > 0) {
      setDetailOrder((prev) => ({
        ...prev,
        customer: customer[0]?.id,
        service: services[0]?.id,
      }));
    }
  }, [customer, services]);

  // Handle perubahan input form
  const handleChange = (e) => {
    setDetailOrder((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle pengiriman form
  const handleSubmit = (detailOrder, customer, services) => {
    if (!customer[0] || !services[0]) {
      alert("Data pelanggan atau jasa belum lengkap!");
      return;
    }

    setIsRequesting(true);
    try {
      const transactionData = {
        data: {
          detail_order: detailOrder.detail_order,
          address: detailOrder.address,
          customer: [customer[0]?.id],
          service: services[0]?.id,
          transaction_status: "Pending",
          order_date: detailOrder.order_date,
        },
      };
      console.log("Transaction data:", transactionData);
      dispatch(createTransaction(transactionData));
      alert("Pesanan berhasil dibuat!");
      navigate("/customer-profile");
    } catch (error) {
      console.error("Error saat membuat pesanan:", error);
      alert("Terjadi kesalahan saat membuat pesanan.");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="h-screen from-blue-400 to-blue-600 p-6 flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center justify-start w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 outline outline-blue-500">
        {/* Gambar Jasa */}
        <div className="md:w-1/3 flex justify-center items-center">
          <Image
            alt={services[0]?.service_name || "Gambar jasa"}
            src={`${BASE_URL}${services[0]?.image?.url}`}
            width={200}
            height={200}
            objectFit="cover"
            className="rounded-lg shadow-md"
          />
        </div>

        {/* Detail Jasa */}
        <div className="md:w-2/3 ml-8 flex flex-col">
          <h2 className="text-3xl font-bold text-blue-800">
            {services[0]?.service_name || "Nama jasa belum tersedia"}
          </h2>
          <p className="text-xl font-semibold text-green-600 mt-2">
            Rp.{" "}
            {services[0]?.price
              ? new Intl.NumberFormat("id-ID").format(services[0]?.price)
              : "Harga belum tersedia"}
          </p>
          <p className="text-sm text-gray-600 mt-4">
            {services[0]?.service_description?.[0]?.children?.[0]?.text ||
              "Deskripsi jasa belum tersedia"}
          </p>

          <p className="text-m text-gray-600 mt-4">
            Nama: {customer[0]?.name || "Nama pelanggan belum tersedia"}
          </p>
          <p className="text-m text-gray-600">
            No Telp: {customer[0]?.contact || "Kontak pelanggan belum tersedia"}
          </p>

          <label htmlFor="address" className="text-sm text-gray-600 mt-6">
            Alamat Anda:
          </label>
          <textarea
            id="address"
            value={detailOrder.address}
            name="address"
            onChange={handleChange}
            className="border rounded-md p-2 mt-2 w-full h-16"
            placeholder="Masukkan alamat lengkap Anda"
          />

          <label htmlFor="jobDetail" className="text-sm text-gray-600 mt-4">
            Detail Keluhan:
          </label>
          <textarea
            id="jobDetail"
            name="detail_order"
            value={detailOrder.detail_order || ""}
            onChange={handleChange}
            className="border rounded-md p-2 mt-2 w-full h-16"
            placeholder="Masukkan detail keluhan Anda"
          />

          <Button
            color="success"
            className="mt-6"
            onClick={() => handleSubmit(detailOrder, customer, services)}
            disabled={isRequesting || orderAccepted}
          >
            {orderAccepted ? "Order Diterima" : "Proses Pesanan"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailOrder;
