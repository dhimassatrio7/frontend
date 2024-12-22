import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bantuinLogo from "../assets/images/bantuin-logo.png";

const NavbarComponent = () => {
  const [nav, setNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(""); // Role can be '', 'customer', 'admin', 'penyedia'
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt"); // Get token from localStorage
    const userRole = localStorage.getItem("userRole"); // Get user role from localStorage

    if (token) {
      setIsLoggedIn(true); // User is logged in
      setRole(userRole || ""); // Set role from localStorage
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  const handleProfileRedirect = () => {
    // Redirect based on the user's role
    if (role === "Admin") {
      navigate("/dashboard-admin");
    } else if (role === "Service Provider") {
      navigate("/dashboard-partner");
    } else if (role === "Authenticated") {
      navigate("/customer-profile");
    }
  };

  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 shadow">
        <div className="flex flex-wrap justify-between items-center mx-auto">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img className="h-12" src={bantuinLogo} alt="Bantuin Logo" />
          </a>

          {/* Hamburger Menu */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="mobile-menu"
              aria-expanded={nav}
              onClick={() => setNav(!nav)}
            >
              <span className="sr-only">Open main menu</span>
              {nav ? (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Menu */}
          <div className={`flex-col md:flex md:flex-row items-center w-full md:w-auto md:order-2 transition-all duration-300 ${nav ? "block" : "hidden"}`}>
            <ul className="flex flex-col md:flex-row md:gap-8 gap-0">
              <li>
                <Link to="/layanan" className="block py-2 pr-4 pl-3 rounded hover:bg-gray-50">
                  Layanan
                </Link>
              </li>
              <li>
                <Link to="/registration-partner" className="block py-2 pr-4 pl-3 rounded hover:bg-gray-50">
                  Daftar Mitra
                </Link>
              </li>
            </ul>

            {/* Profile Buttons */}
            {isLoggedIn ? (
              <div className="flex gap-4">
                {role === "Admin" && (
                  <>
                    <button onClick={() => navigate("/dashboard-admin")} className="rounded-full bg-slate-800 py-2 px-4 text-white text-sm hover:bg-slate-700">
                      Admin Dashboard
                    </button>
                    <button 
                      onClick={() => {localStorage.clear();window.location.reload()}} className="rounded-full bg-red-800 py-2 px-4 text-white text-sm hover:bg-red-700">
                      Log Out
                    </button>
                  </>
                )}
                {role === "Service Provider" && (
                  <>
                    <button onClick={() => navigate("/dashboard-partner")} className="rounded-full bg-slate-800 py-2 px-4 text-white text-sm hover:bg-slate-700">
                      Partner Dashboard
                    </button>
                    <button 
                    onClick={() => {localStorage.clear();window.location.reload()}} className="rounded-full bg-red-800 py-2 px-4 text-white text-sm hover:bg-red-700">
                      Log Out
                    </button>
                  </>
                )}
                {role === "Authenticated" && (
                  <>
                    <button onClick={() => navigate("/customer-profile")} className="rounded-full bg-slate-800 py-2 px-4 text-white text-sm hover:bg-slate-700">
                      Customer Profile
                    </button>
                    <button 
                    onClick={() => {localStorage.clear();window.location.reload()}} className="rounded-full bg-red-800 py-2 px-4 text-white text-sm hover:bg-red-700">
                      Log Out
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="rounded-full bg-slate-800 py-2 px-4 text-white text-sm hover:bg-slate-700">
                  Sign In
                </Link>
                <Link to="/register" className="rounded-full bg-slate-800 py-2 px-4 text-white text-sm hover:bg-slate-700">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavbarComponent;