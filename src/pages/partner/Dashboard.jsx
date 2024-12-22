import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import axios from "axios";
import Main from '../../components/partner/Main';
import Sidebar from "../../components/partner/sidebar/Sidebar";
import Navbar from '../../components/partner/navbar/navbar';

const Dashboard = () => {
  

  return (
    <div className="relative">
      <Navbar />
      <Sidebar />
      <Main />
    </div>
  );
};

export default Dashboard;
