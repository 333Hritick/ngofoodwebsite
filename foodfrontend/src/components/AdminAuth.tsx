import { useState } from "react";
import axios from "axios";
import { X, User, Lock, Shield } from "lucide-react";
import Navbar from "../components1/Navbar";

interface AdminAuthProps {
  onClose?: () => void;
}

export default function AdminAuth({ onClose }: AdminAuthProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://ngofoodwebsite.onrender.com/api/admin-api/login/",
        {
          username,
          password,
        }
      );

      // Save admin token
      localStorage.setItem("adminToken", res.data.access);

      alert("Admin Login Successful");

      onClose?.();

      // Redirect to dashboard
      window.location.href = "/admin-dashboard";
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 401) {
        alert("Invalid admin credentials");
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Modal Background - starts below navbar */}
      <div className="fixed top-16 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-40 p-4">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
          {/* Close Button */}
          <button
            onClick={() => onClose?.()}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-900 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Admin Login
          </h2>

          <p className="text-center text-gray-600 mb-8">
            Access the admin dashboard
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Admin username"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}