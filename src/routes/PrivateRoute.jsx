// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("jwt");

    // Jika token tidak ada, arahkan ke halaman login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Jika token ada, tampilkan komponen anak
    return children;
};

export default PrivateRoute;