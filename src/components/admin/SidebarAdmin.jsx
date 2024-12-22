// src/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineDashboard, AiOutlineUser, AiOutlineTransaction } from 'react-icons/ai';
import { RiServiceLine } from 'react-icons/ri';
import { BsPeople, BsBoxSeam } from 'react-icons/bs';
import { MdRequestQuote } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import { FaHome } from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt'); // Menghapus token dari localStorage
        navigate('/login'); // Mengarahkan ke halaman login
    };

    

    return (
        <div>
            {/* Overlay untuk menutup sidebar saat diklik */}
            <div
                className={`fixed inset-0 bg-gray-800 bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            ></div>
            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full bg-blue-400 text-white w-64 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-4">
                    <h2 className="text-xl font-bold">Admin Panel</h2>
                    <ul className="mt-4">
                        <li>
                            <a href="/dashboard-admin" className="flex items-center py-2 hover:bg-blue-300 px-3 rounded">
                                <AiOutlineDashboard className="mr-2" /> Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="/table-user" className="flex items-center py-2 hover:bg-blue-300 px-3 rounded">
                                <AiOutlineUser className="mr-2" /> Pengguna
                            </a>
                        </li>
                        <li>
                            <a href="/table-service" className="flex items-center py-2 hover:bg-blue-300 px-3 rounded">
                                <RiServiceLine className="mr-2" /> Layanan
                            </a>
                        </li>
                        <li>
                            <a href="/table-transaction" className="flex items-center py-2 hover:bg-blue-300 px-3 rounded">
                                <AiOutlineTransaction className="mr-2" /> Transaksi
                            </a>
                        </li>
                        <li>
                            <a href="/table-customer" className="flex items-center py-2 hover:bg-blue-300 px-3 rounded">
                                <BsPeople className="mr-2" /> Pelanggan
                            </a>
                        </li>
                        <li>
                            <a href="/table-category" className="flex items-center py-2 hover:bg-blue-300 px-3 rounded">
                                <BsBoxSeam className="mr-2" /> Kategori
                            </a>
                        </li>
                        <li>
                            <a href="/table-serviceprovider" className="flex items-center py-2 hover:bg-blue-300 px-3 rounded">
                                <RiServiceLine className="mr-2" /> Penyedia Layanan
                            </a>
                        </li>
                        <li>
                            <a href="/table-requestpartner" className="flex items-center py-2 hover:bg-blue-300 px-3 rounded">
                                <MdRequestQuote className="mr-2" /> Permintaan Mitra
                            </a>
                        </li>
                        <li>
                            <a href="/" className="flex items-center py-2 hover:bg-blue-300 px-3 rounded"> <FaHome className="mr-2" /> Beranda </a>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full text-left py-2 hover:bg-blue-300 px-3 rounded"
                            >
                                <FiLogOut className="mr-2" /> Keluar
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
