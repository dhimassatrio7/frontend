// src/Main.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Impor useDispatch dan useSelector
import { fetchCategories } from "../../store/slices/categorySlice"; // Impor fetchCategories
import { fetchCustomers } from "../../store/slices/customerSlice"; // Impor fetchCustomers
import { fetchServices } from "../../store/slices/serviceSlice"; // Impor fetchServices
import { fetchTransactions } from "../../store/slices/transactionSlice"; // Impor fetchTransactions
import Layout from "./Layout";

const Main = () => {
  const dispatch = useDispatch();

  // Ambil kategori dari Redux store
  const categories = useSelector((state) => state.category.categories);
  const totalCategories = categories.length; // Hitung total kategori

  // Ambil pelanggan dari Redux store
  const customers = useSelector((state) => state.customer.customers);
  const totalCustomers = customers.length; // Hitung total pelanggan

  // Ambil layanan dari Redux store
  const services = useSelector((state) => state.service.services);
  const totalServices = services.length; // Hitung total layanan

  // Ambil transaksi dari Redux store
  const transactions = useSelector((state) => state.transaction.transactions);
  const totalTransactions = transactions.length; // Hitung total transaksi


  // Ambil data saat komponen dimuat
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchCustomers());
    dispatch(fetchServices());
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div>
      <Layout />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Card Jumlah Pengguna */}
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-lg font-semibold text-gray-700">Jumlah Kustomer</h2>
            <p className="text-4xl font-bold text-blue-600">{totalCustomers}</p>
          </div>

          {/* Card Jumlah Layanan */}
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-lg font-semibold text-gray-700">Jumlah Layanan</h2>
            <p className="text-4xl font-bold text-green-600">{totalServices}</p>
          </div>

          {/* Card Total Transaksi */}
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-lg font-semibold text-gray-700">Total Transaksi</h2>
            <p className="text-4xl font-bold text-red-600">{totalTransactions}</p>
          </div>

          {/* Card Total Kategori */}
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-lg font-semibold text-gray-700">Total Kategori</h2>
            <p className="text-4xl font-bold text-purple-600">{totalCategories}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;