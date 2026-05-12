import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Package, Eye, TrendingUp } from 'lucide-react';
import TrackingModal from './TrackingModal';
import UpdateStatusModal from './UpdateStatusModal';
import OtpModal from "./OtpModal";

type DonationStatus = "available" | "claimed" | "picked_up" | "delivered";

interface FoodDonation {
  id: number;
  title: string;
  description: string;
  status: DonationStatus;
  donor_name?: string;
  donor_phone?: string;
  donor_address?: string;
}

interface Pickup {
  id: number;
  donation: FoodDonation;   // ⭐ FIXED
  ngo: number;
  ngo_name: string;
  ngo_email: string;
  claimed_at: string;
}

export default function NGODashboard() {
  const { user, signOut } = useAuth();

  const [availableDonations, setAvailableDonations] = useState<FoodDonation[]>([]);
  const [myPickups, setMyPickups] = useState<Pickup[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'my-pickups'>('available');
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null);
  const [selectedPickup, setSelectedPickup] = useState<number | null>(null);
  const [otpDonationId, setOtpDonationId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadAvailableDonations(), loadMyPickups()]);
    setLoading(false);
  };
const loadAvailableDonations = async () => {
  try {
    const res = await api.get('/donations/');
    setAvailableDonations(res.data.results || res.data);
  } catch (error) {
    console.error(error);
  }
};
  const loadMyPickups = async () => {
    try {
      const res = await api.get('/pickups');
      setMyPickups(res.data.results || res.data);
    } catch (error) {
      console.error(error);
    }
  };

 const handleClaimDonation = async (donationId: number) => {
  try {
    await api.post("/pickups/claim/", { donation_id: donationId });

    alert("Donation claimed successfully!");
    console.log(myPickups.donation)

    // 🔥 reload data so donor info visible
    loadData();

  } catch (error: any) {
    alert(error.response?.data?.error || "Failed to claim donation");
  }
};
  const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800 border border-green-300';

    case 'claimed':
      return 'bg-red-100 text-red-800 border border-red-300';

    case 'picked_up':
      return 'bg-yellow-100 text-yellow-800';

    case 'delivered':
      return 'bg-gray-100 text-gray-800';

    default:
      return 'bg-gray-100 text-gray-800';
  }
};

  return (
  <div className="min-h-screen bg-gray-50">

    {/* NAVBAR */}
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Food Share</h1>

          <p className="text-sm text-gray-600 break-words">
            {user?.profile?.organization_name || user?.profile?.full_name}
          </p>
        </div>

        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Sign Out
        </button>
      </div>
    </nav>

    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">

      {/* TABS */}
      <div className="mb-6 border-b overflow-x-auto">
        <nav className="flex gap-4 sm:gap-8 min-w-max">

          <button
            onClick={() => setActiveTab('available')}
            className={`pb-2 text-sm sm:text-base font-medium ${
              activeTab === 'available'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600'
            }`}
          >
            Available Donations
          </button>

          <button
            onClick={() => setActiveTab('my-pickups')}
            className={`pb-2 text-sm sm:text-base font-medium ${
              activeTab === 'my-pickups'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600'
            }`}
          >
            My Pickups
          </button>
        </nav>
      </div>

      {/* AVAILABLE TAB */}
      {activeTab === 'available' ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {availableDonations.map((donation) => (

            <div
              key={donation.id}
              className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition"
            >

              <h3 className="text-lg font-semibold break-words">
                {donation.title}
              </h3>

              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded ${getStatusColor(
                  donation.status
                )}`}
              >
                {donation.status}
              </span>

              <p className="mt-3 text-sm sm:text-base text-gray-700 break-words">
                {donation.description}
              </p>

              <button
                disabled={donation.status !== "available"}
                onClick={() => handleClaimDonation(donation.id)}
                className={`mt-4 w-full px-4 py-2 rounded text-white transition ${
                  donation.status === "available"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {donation.status === "available"
                  ? "Claim Donation"
                  : "Already Claimed"}
              </button>
            </div>
          ))}
        </div>

      ) : (

        /* MY PICKUPS TAB */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {myPickups.map((pickup) => (

            <div
              key={pickup.id}
              className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition"
            >

              <h3 className="text-lg font-semibold break-words">
                {pickup.donation?.title}
              </h3>

              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded ${getStatusColor(
                  pickup.donation?.status
                )}`}
              >
                {pickup.donation?.status}
              </span>

              <p className="mt-3 text-sm sm:text-base text-gray-700 break-words">
                {pickup.donation?.description}
              </p>

              {/* DONOR INFO */}
              <div className="mt-4 space-y-1 text-sm text-gray-700">

                <p className="break-words">
                  <span className="font-semibold">Donor:</span>{" "}
                  {pickup.donation?.donor_name || "Hidden"}
                </p>

                <p className="break-words">
                  <span className="font-semibold">Phone:</span>{" "}
                  {pickup.donation?.donor_phone || "Hidden"}
                </p>

                <p className="break-words">
                  <span className="font-semibold">Address:</span>{" "}
                  {pickup.donation?.donor_address || "Hidden"}
                </p>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-5">

                <button
                  onClick={() => setSelectedDonation(pickup.donation.id)}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded w-full sm:w-auto"
                >
                  <Eye size={16} />
                  Track
                </button>

                {pickup.donation?.status === "claimed" && (
                  <button
                    onClick={() => setOtpDonationId(pickup.donation.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded w-full sm:w-auto"
                  >
                    Verify OTP
                  </button>
                )}

                {pickup.donation?.status !== "delivered" && (
                  <button
                    onClick={() => setSelectedPickup(pickup.id)}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded w-full sm:w-auto"
                  >
                    <TrendingUp size={16} />
                    Update
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* MODALS */}
    {selectedDonation && (
      <TrackingModal
        donationId={selectedDonation}
        onClose={() => setSelectedDonation(null)}
      />
    )}

    {selectedPickup && (
      <UpdateStatusModal
        pickupId={selectedPickup}
        onClose={() => {
          setSelectedPickup(null);
          loadData();
        }}
      />
    )}

    {otpDonationId !== null && (
      <OtpModal
        donationId={otpDonationId}
        onClose={() => setOtpDonationId(null)}
        onSuccess={() => loadData()}
      />
    )}
  </div>
);}