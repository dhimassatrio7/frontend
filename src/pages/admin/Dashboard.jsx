import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Main from '../../components/admin/Main';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt"); // Check for token in localStorage

    // If token is not found, redirect to login page
    if (!token) {
      navigate("/login"); // Redirect to login page
    }
  }, [navigate]);

  return (
    <>
      <Main />
    </>
  );
};

export default Dashboard;
