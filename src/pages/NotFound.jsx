import React from 'react'
import NavbarComponent from '../components/NavbarComponent'
import FooterComponent from '../components/FooterComponent'


const NotFound = () => {
  return (
    <div>
      <NavbarComponent />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-sans">
          <h1 className="text-7xl font-extrabold text-gray-800 tracking-tight">404</h1>
          <p className="mt-4 text-lg text-gray-600 tracking-wide text-center">
            Maaf, halaman yang anda cari tidak ditemukan.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105"
          >
            Kembali ke Beranda
          </button>
        </div>
      <FooterComponent />
    </div>
  )
}

export default NotFound