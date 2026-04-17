import { useState } from "react";
import api from "../lib/api";

export default function OtpModal({
  donationId,
  onClose,
  onSuccess,
}: {
  donationId: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    try {
      setLoading(true);

      await api.post("/pickups/verify-otp/", {
        donation_id: donationId,
        otp: otp,
      });

      alert("Donation claimed successfully ✅");
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-80">
        <h2 className="text-lg font-semibold mb-3">Enter OTP</h2>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6 digit OTP"
          className="border w-full px-3 py-2 rounded mb-4"
        />

        <div className="flex gap-2">
          <button
            onClick={verifyOtp}
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}