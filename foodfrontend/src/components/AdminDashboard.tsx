import React, { useEffect, useState } from "react";
import {
  Users,
  Package,
  Heart,
  LogOut,
  Home,
  ClipboardList,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface NGO {
  id: number;
  organization_name: string;
  email: string;
  registration_number: string;
  status: string;
  is_verified: boolean;
  ai_trust_score: number;
  ai_verified: boolean;
  ai_analysis: string;
  registration_certificate: string | null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    donations: 0,
    pickups: 0,
    volunteers: 0,
  });

  const [ngos, setNgos] = useState<NGO[]>([]);
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }

    const loadData = async () => {
      try {
        await fetchStats();
        await fetchNGOs();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "https://ngofoodwebsite.onrender.com/api/admin-api/stats/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats({
        users: res.data.total_donors || 0,
        donations: res.data.total_donations || 0,
        pickups: res.data.pending_pickups || 0,
        volunteers: res.data.pending_volunteers || 0,
      });
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  const fetchNGOs = async () => {
    try {
      const res = await axios.get(
        "https://ngofoodwebsite.onrender.com/api/admin-api/ngos/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNgos(res.data || []);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  const approveNGO = async (id: number) => {
    try {
      await axios.post(
        `https://ngofoodwebsite.onrender.com/api/admin-api/ngos/${id}/approve/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("NGO Approved Successfully ");
      fetchNGOs();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Approval failed ");
    }
  };

  const rejectNGO = async (id: number) => {
    try {
      await axios.post(
        `https://ngofoodwebsite.onrender.com/api/admin-api/ngos/${id}/reject/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("NGO Rejected ");
      fetchNGOs();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Reject failed ");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const filteredNGOs = ngos.filter((ngo) => ngo.status === filter);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 p-5 text-white">
        <h2 className="mb-8 text-2xl font-bold">Admin Panel</h2>

        <nav className="space-y-4">
          <Link
            to="/admin-dashboard"
            className="flex items-center gap-2 rounded p-2 hover:bg-green-800"
          >
            <Home /> Dashboard
          </Link>

          <Link
            to="/admin-users"
            className="flex items-center gap-2 rounded p-2 hover:bg-green-800"
          >
            <Users /> Users
          </Link>

          <Link
            to="/admin-donations"
            className="flex items-center gap-2 rounded p-2 hover:bg-green-800"
          >
            <Heart /> Donations
          </Link>

          <Link
            to="/admin-pickups"
            className="flex items-center gap-2 rounded p-2 hover:bg-green-800"
          >
            <ClipboardList /> Pickups
          </Link>

          <Link
            to="/admin-volunteers"
            className="flex items-center gap-2 rounded p-2 hover:bg-green-800"
          >
            <UserPlus /> Volunteers
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 flex items-center gap-2 rounded bg-red-500 px-4 py-2 hover:bg-red-600"
        >
          <LogOut /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow">
            <Users className="text-green-600" size={30} />
            <div>
              <h2 className="text-2xl font-bold">{stats.users}</h2>
              <p className="text-gray-500">Total Users</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow">
            <Heart className="text-red-500" size={30} />
            <div>
              <h2 className="text-2xl font-bold">{stats.donations}</h2>
              <p className="text-gray-500">Total Donations</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow">
            <Package className="text-blue-500" size={30} />
            <div>
              <h2 className="text-2xl font-bold">{stats.pickups}</h2>
              <p className="text-gray-500">Pending Pickups</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow">
            <UserPlus className="text-purple-600" size={30} />
            <div>
              <h2 className="text-2xl font-bold">{stats.volunteers}</h2>
              <p className="text-gray-500">Pending Volunteers</p>
            </div>
          </div>
        </div>

        {/* NGO Requests */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">NGO Requests</h2>

          <div className="mb-5 flex gap-3">
            <button
              onClick={() => setFilter("pending")}
              className={`rounded px-4 py-2 font-medium ${
                filter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Pending
            </button>

            <button
              onClick={() => setFilter("approved")}
              className={`rounded px-4 py-2 font-medium ${
                filter === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Approved
            </button>

            <button
              onClick={() => setFilter("rejected")}
              className={`rounded px-4 py-2 font-medium ${
                filter === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Rejected
            </button>
          </div>

          {filteredNGOs.length === 0 ? (
            <p className="text-gray-500">No NGOs found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-3">Organization</th>
                    <th className="border p-3">Email</th>
                    <th className="border p-3">Status</th>
                    <th className="border p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredNGOs.map((ngo) => (
                    <tr key={ngo.id} className="text-center">
                      <td
                        className="cursor-pointer border p-3 text-blue-600 underline"
                        onClick={() => setSelectedNGO(ngo)}
                      >
                        {ngo.organization_name}
                      </td>

                      <td className="border p-3">{ngo.email}</td>

                      <td className="border p-3 capitalize">{ngo.status}</td>

                      <td className="border p-3">
                        {ngo.status === "pending" ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => approveNGO(ngo.id)}
                              className="rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() => rejectNGO(ngo.id)}
                              className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        ) : ngo.status === "approved" ? (
                          <span className="font-bold text-green-600">
                            Approved
                          </span>
                        ) : (
                          <span className="font-bold text-red-600">
                            Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* NGO Detail Modal */}
      {selectedNGO && (() => {
        const certificateUrl = selectedNGO.registration_certificate
          ? selectedNGO.registration_certificate.startsWith("http")
            ? selectedNGO.registration_certificate
            : selectedNGO.registration_certificate.startsWith("/media/")
            ? `http://localhost:8000${selectedNGO.registration_certificate}`
            : selectedNGO.registration_certificate.startsWith("/ngo_docs/")
            ? `http://localhost:8000/media${selectedNGO.registration_certificate}`
            : `http://localhost:8000/media/${selectedNGO.registration_certificate}`
          : null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative max-h-[90vh] w-[700px] overflow-y-auto rounded-xl bg-white p-6">
              <button
                onClick={() => setSelectedNGO(null)}
                className="absolute right-3 top-3 text-xl"
              >
                ✕
              </button>

              <h2 className="mb-4 text-2xl font-bold">
                {selectedNGO.organization_name}
              </h2>

              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> {selectedNGO.email}
                </p>

                <p>
                  <strong>Registration No:</strong>{" "}
                  {selectedNGO.registration_number}
                </p>

                <p>
                  <strong>Status:</strong> {selectedNGO.status}
                </p>

                <p>
                  <strong>AI Trust Score:</strong>{" "}
                  {selectedNGO.ai_trust_score}
                </p>

                <p>
                  <strong>AI Verified:</strong>{" "}
                  {selectedNGO.ai_verified ? "Yes" : "No"}
                </p>

                <p>
                  <strong>AI Analysis:</strong>{" "}
                  {selectedNGO.ai_analysis || "No analysis available"}
                </p>
              </div>

              <div className="mt-5">
                <strong>Registration Certificate:</strong>

                {selectedNGO.registration_certificate ? (
                  selectedNGO.registration_certificate.endsWith(".pdf") ? (
                    <a
                      href={certificateUrl || ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 block text-blue-600 underline"
                    >
                      Open PDF Certificate
                    </a>
                  ) : (
                    <img
                      src={certificateUrl || ""}
                      alt="Registration Certificate"
                      className="mt-4 max-h-96 w-full rounded border object-contain"
                    />
                  )
                ) : (
                  <p className="mt-2 text-red-500">No certificate uploaded</p>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
