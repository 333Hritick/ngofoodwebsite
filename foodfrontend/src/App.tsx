import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Auth from "./components/Auth";
import DonorDashboard from "./components/DonorDashboard";
import NGODashboard from "./components/NGODashboard";
import AdminDashboard from "./components/AdminDashboard";
import AdminAuth from "./components/AdminAuth";
import AdminUsers from "./components/AdminUsers";
import AdminDonations from "./components/AdminDonations";
import AdminPickups from "./components/AdminPickups";

import Navbar from "./components1/Navbar";
import Hero from "./components1/Hero";
import HowItWorks from "./components1/HowItWorks";
import Ngo from "./components1/Ngo";
import Stats from "./components1/Stats";
import Testimonials from "./components1/Testonomial";
import CTA from "./components1/CTA";
import Contact from "./components1/Contact";
import Footer from "./components1/Footer";
import VolunteerRegister from "./components1/VolunteerRegister";
import AdminVolunteers from "./components/AdminVolunteers";

function App() {
  const { user, loading } = useAuth();

  const adminLoggedIn = !!localStorage.getItem("adminToken");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <HowItWorks />
              <Ngo />
              <Stats />
              <Testimonials />
              <CTA />
              <Contact />
              <Footer />
            </>
          }
        />

        {/* User Login / Signup */}
        <Route path="/auth" element={<Auth />} />

        {/* Admin Login */}
        <Route
          path="/admin-login"
          element={<AdminAuth onClose={() => {}} />}
        />


        {/* Donor / NGO Dashboard */}
        <Route
          path="/dashboard"
          element={
            !user ? (
              <Navigate to="/auth" replace />
            ) : user.role === "donor" ? (
              <DonorDashboard />
            ) : user.role === "ngo" ? (
              <NGODashboard />
            ) : (
              <Navigate to="/admin-dashboard" replace />
            )
          }
        />
        

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            adminLoggedIn ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin-login" replace />
            )
          }
        />

        {/* Admin Users */}
        <Route
          path="/admin-users"
          element={
            adminLoggedIn ? (
              <AdminUsers />
            ) : (
              <Navigate to="/admin-login" replace />
            )
          }
        />

        {/* Admin Donations */}
        <Route
          path="/admin-donations"
          element={
            adminLoggedIn ? (
              <AdminDonations />
            ) : (
              <Navigate to="/admin-login" replace />
            )
          }
        />

        {/* Admin Pickups */}
        <Route
          path="/admin-pickups"
          element={
            adminLoggedIn ? (
              <AdminPickups />
            ) : (
              <Navigate to="/admin-login" replace />
            )
          }
        />
         <Route
          path="/admin-volunteers"
          element={
            adminLoggedIn ? (
              <AdminVolunteers />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
         <Route
  path="/volunteer-Register"
  element={<VolunteerRegister />}
/>
        {/* Invalid Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;