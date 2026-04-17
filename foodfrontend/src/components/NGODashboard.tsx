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
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Food Share</h1>
            <p className="text-sm text-gray-600">
              {user?.profile?.organization_name || user?.profile?.full_name}
            </p>
          </div>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* TABS */}
        <div className="mb-6 border-b">
          <nav className="flex gap-8">
            <button onClick={() => setActiveTab('available')}>
              Available Donations
            </button>
            <button onClick={() => setActiveTab('my-pickups')}>
              My Pickups
            </button>
          </nav>
        </div>

        {/* AVAILABLE TAB */}
        {activeTab === 'available' ? (
          <div className="grid grid-cols-3 gap-6">
            {availableDonations.map((donation) => (
              <div key={donation.id} className="bg-white p-6 rounded-lg shadow">

                {/* ⭐ FIXED — donation.title */}
                <h3 className="text-lg font-semibold">{donation.title}</h3>

<span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${getStatusColor(donation.status)}`}>
  {donation.status}
</span>
                <p>{donation.description}</p>

                <button
  disabled={donation.status !== "available"}
  onClick={() => handleClaimDonation(donation.id)}
  className={`mt-3 px-4 py-2 rounded text-white ${
    donation.status === "available"
      ? "bg-green-600"
      : "bg-gray-400 cursor-not-allowed"
  }`}
>
  {donation.status === "available" ? "Claim Donation" : "Already Claimed"}
</button>
              </div>
            ))}
          </div>
        ) : (

          /* MY PICKUPS TAB */
          <div className="grid grid-cols-3 gap-6">
  {myPickups.map((pickup) => (
    <div key={pickup.id} className="bg-white p-6 rounded-lg shadow">

      <h3>{pickup.donation?.title}</h3>

      <span className={getStatusColor(pickup.donation?.status)}>
        {pickup.donation?.status}
      </span>

      <p>{pickup.donation?.description}</p>

      {/* ✅ Donor Info */}
      <p className="mt-2 text-sm">
        Donor: {pickup.donation?.donor_name || "Hidden"}
      </p>

      <p className="text-sm">
        Phone: {pickup.donation?.donor_phone || "Hidden"}
      </p>

      <p className="text-sm">
        Address: {pickup.donation?.donor_address || "Hidden"}
      </p>

      <div className="flex gap-2 mt-4">

        <button
          onClick={() => setSelectedDonation(pickup.donation.id)}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          <Eye size={16}/> Track
        </button>

        {/* ✅ OTP BUTTON */}
        {pickup.donation?.status === "claimed" && (
          <button
            onClick={() => setOtpDonationId(pickup.donation.id)}
            className="bg-purple-600 text-white px-3 py-2 rounded"
          >
            Verify OTP
          </button>
        )}

        {pickup.donation?.status !== 'delivered' && (
          <button
            onClick={() => setSelectedPickup(pickup.id)}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            <TrendingUp size={16}/> Update
          </button>
        )}

      </div>
    </div>
  ))}
</div>
        )}
      </div>

      {selectedDonation && (
        <TrackingModal donationId={selectedDonation} onClose={() => setSelectedDonation(null)} />
      )}

      {selectedPickup && (
        <UpdateStatusModal pickupId={selectedPickup} onClose={() => {
          setSelectedPickup(null);
          loadData();
        }} />
      )}

{otpDonationId !== null && (
  <OtpModal
    donationId={otpDonationId}
    onClose={() => setOtpDonationId(null)}
    onSuccess={() => loadData()}
  />
)}
    </div>
    
  );
}
