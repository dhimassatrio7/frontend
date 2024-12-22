import { Route, Routes } from "react-router";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import HomePage from "./pages/Home.jsx";
import DashboardPartner from "./pages/partner/Dashboard";
import HistoryOrderPage from "./pages/partner/HistoryOrderPage.jsx";
import ProfilePage from "./pages/customer/ProfilePage";
import HistoryOrderCustomer from "./pages/customer/HistoryOrderPage.jsx";
import DashboardAdmin from "./pages/admin/Dashboard";
import Layanan from "./pages/Layanan.jsx";
import DetailOrder from "./pages/DetailOrder.jsx";
import RegistrationPartner from "./pages/registrationPartner/RegistrationPartner.jsx";
import UserTable from "./components/admin/table/UserTable.jsx";
import ServiceTable from "./components/admin/table/ServiceTable.jsx";
import TransactionTable from "./components/admin/table/TransactionTable.jsx";
import CustomerTable from "./components/admin/table/CustomerTable.jsx";
import CategoryTable from "./components/admin/table/CategoryTable.jsx";
import ServiceProviderTable from "./components/admin/table/ServiceProviderTable.jsx";
import PartnerRequestTable from "./components/admin/table/PartnerRequestTable.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => {

  const role = localStorage.getItem("userRole");

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/registration-partner" element={<RegistrationPartner />} />
        <Route path="/layanan" element={<Layanan />} />
        
        {/* Rute detail yang dilindungi */}
        <Route path="/detail/:id" element={<PrivateRoute><DetailOrder /></PrivateRoute>} />

        {/* Rute yang dilindungi dengan PrivateRoute */}
        <Route path="/dashboard-admin" element={role == "Admin" ? <PrivateRoute><DashboardAdmin /></PrivateRoute> : <HomePage/>} />
        <Route path="/table-user" element={role == "Admin" ? <PrivateRoute><UserTable /></PrivateRoute> : <HomePage/>} />
        <Route path="/table-service" element={role == "Admin" ? <PrivateRoute><ServiceTable /></PrivateRoute> : <HomePage/>} />
        <Route path="/table-transaction" element={role == "Admin" ? <PrivateRoute><TransactionTable /></PrivateRoute> : <HomePage/>} />
        <Route path="/table-customer" element={role == "Admin" ? <PrivateRoute><CustomerTable /></PrivateRoute> : <HomePage/>} />
        <Route path="/table-category" element={role == "Admin" ? <PrivateRoute><CategoryTable /></PrivateRoute> : <HomePage/>} />
        <Route path="/table-serviceprovider" element={role == "Admin" ? <PrivateRoute><ServiceProviderTable /></PrivateRoute> : <HomePage/>} />
        <Route path="/table-requestpartner" element={role == "Admin" ? <PrivateRoute><PartnerRequestTable /></PrivateRoute> : <HomePage/>} />

        {/* Rute Partner dan Customer yang juga dilindungi */}
        <Route path="/dashboard-partner" element={role == "Service Provider" ? <PrivateRoute><DashboardPartner /></PrivateRoute> : <HomePage/>} />
        <Route path="/partner/history" element={ role == "Service Provider" ? <PrivateRoute><HistoryOrderPage /></PrivateRoute> : <HomePage/>} />
        <Route path="/customer-profile" element={role == "Authenticated" ? <PrivateRoute><ProfilePage /></PrivateRoute> : <HomePage/>} />
        <Route path="/customer/history" element={role == "Authenticated" ? <PrivateRoute><HistoryOrderCustomer /></PrivateRoute> : <HomePage/>} />

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;