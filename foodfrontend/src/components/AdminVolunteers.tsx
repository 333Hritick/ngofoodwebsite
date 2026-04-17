import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminVolunteerPanel() {
  const navigate = useNavigate();

  const [volunteers, setVolunteers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchVolunteers = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin-api/volunteers/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      console.log("Status:", response.status);

      const data = await response.json();
      console.log("Volunteer API Response:", data);

      setVolunteers(data);
    } catch (error) {
      console.error("Failed to fetch volunteers", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchVolunteers();
  }, []);

  const updateStatus = async (
    id: number,
    status: "approved" | "rejected" | "pending"
  ) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin-api/volunteers/${id}/status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ volunteer_status: status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update volunteer status");
      }

      setVolunteers((prev) =>
        prev.map((volunteer) =>
          volunteer.id === id
            ? { ...volunteer, volunteer_status: status }
            : volunteer
        )
      );
    } catch (error) {
      console.error("Failed to update volunteer status", error);
      alert("Failed to update volunteer status ❌");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-lg font-semibold text-gray-700">
        Loading volunteers...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="mb-4 rounded-xl bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-900"
            >
              ← Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold text-gray-900">
              Volunteer Requests
            </h1>

            <p className="mt-1 text-gray-600">
              Approve, reject, or keep volunteer applications pending.
            </p>
          </div>
        </div>

        {volunteers.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700">
              No volunteer requests found
            </h2>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {volunteers.map((volunteer) => (
              <div
                key={volunteer.id}
                className="rounded-3xl bg-white p-6 shadow-md transition hover:shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {volunteer.name}
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      volunteer.volunteer_status === "approved"
                        ? "bg-green-100 text-green-700"
                        : volunteer.volunteer_status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {volunteer.volunteer_status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {volunteer.email}
                  </p>

                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {volunteer.phone}
                  </p>

                  <p>
                    <span className="font-semibold">City:</span>{" "}
                    {volunteer.city}
                  </p>

                  <p>
                    <span className="font-semibold">Availability:</span>{" "}
                    {volunteer.availability}
                  </p>
                </div>

                {volunteer.id_proof && (
                  <div className="mt-4">
                    <a
                      href={`http://127.0.0.1:8000${volunteer.id_proof}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-xl bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
                    >
                      View ID Proof
                    </a>
                  </div>
                )}

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button
                    onClick={() => updateStatus(volunteer.id, "approved")}
                    className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(volunteer.id, "rejected")}
                    className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => updateStatus(volunteer.id, "pending")}
                    className="rounded-2xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-600"
                  >
                    Pending
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}