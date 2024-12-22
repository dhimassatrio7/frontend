import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../../store/slices/transactionSlice";
import { fetchCustomers } from "../../../store/slices/customerSlice";
import { createTransaction } from "../../../store/slices/transactionSlice";
import Layout from "../Layout";

const TransactionTable = () => {
  const dispatch = useDispatch();

  const { transactions } = useSelector((state) => state.transaction);
  const { customers } = useSelector((state) => state.customer);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Debug log
  console.log("Transactions:", transactions);

  const handleSubmit = (e) => {
    e.preventDefault();

    const transactionData = {
      customer: customerId,
      service: serviceId,
      order_date: orderDate,
      transaction_status: transactionStatus,
    };

    dispatch(createTransaction(transactionData));
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setCustomerId("");
    setServiceId("");
    setOrderDate("");
    setTransactionStatus("");
  };

  // Memfilter transaksi berdasarkan nama pelanggan
  const filteredTransactions = transactions.filter((transaction) => {
    const customerName = transaction.customer?.[0]?.name || "";
    return customerName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      <Layout />
      <div className="p-6 min-h-screen">
        <h1 className="text-xl font-semibold mb-4">Transaksi</h1>

        {/* Kolom Pencarian */}
        <div className="mb-4 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Cari berdasarkan nama pelanggan"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Buat Transaksi Baru
          </button>
        </div>

        {/* Modal untuk Membuat Transaksi */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Buat Transaksi Baru
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pelanggan
                  </label>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Pilih Pelanggan</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Jasa
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Pilih Jasa</option>
                    {/* Tambahkan pilihan jasa di sini */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal Pesanan
                  </label>
                  <input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status Transaksi
                  </label>
                  <select
                    value={transactionStatus}
                    onChange={(e) => setTransactionStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="pending">Menunggu</option>
                    <option value="completed">Selesai</option>
                    <option value="failed">Gagal</option>
                  </select>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-md"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabel untuk Transaksi */}
        <div className="bg-white p-6 rounded shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-300 px-4 py-2">No</th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Nama Kustomer
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">Jasa</th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Harga
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Tanggal
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2">
                    Status Pembayaran
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Tidak ada data transaksi.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction, idx) => (
                    <tr key={transaction.id}>
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">
                        {transaction.customer.name || "Tidak ada nama"}
                      </td>
                      <td className="px-4 py-2">
                        {transaction.service?.service_name || "Tidak ada jasa"}
                      </td>
                      <td className="px-4 py-2">
                        {transaction.service?.price || "Tidak ada harga"}
                      </td>
                      <td className="px-4 py-2">
                        {transaction.order_date || "Tidak ada tanggal"}
                      </td>
                      <td className="px-4 py-2">
                        {transaction.transaction_status || "Tidak ada status"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
