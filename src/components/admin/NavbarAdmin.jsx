// src/Navbar.js
import React from 'react';

const Navbar = ({ toggleSidebar }) => {
    return (
        <nav className="bg-blue-400 text-white p-4 flex justify-between items-center">
            <div className="text-xl font-bold">Admin Panel</div> {/* Nama di navbar */}
            <div className="">
                <button onClick={toggleSidebar} className="focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;