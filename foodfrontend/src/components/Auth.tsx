import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "../components1/Navbar";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'donor' | 'ngo'>('donor');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  const [ngoRegistrationNumber, setNgoRegistrationNumber] = useState('');
  const [ngoType, setNgoType] = useState('');
  const [servingCapacity, setServingCapacity] = useState('');
  const [pickupAvailable, setPickupAvailable] = useState(false);

  const [registrationFile, setRegistrationFile] = useState<File | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    if (isLogin) {
      await signIn(email, password);

      // login hone ke baad dashboard kholo
      navigate("/dashboard");
    } else {
      const formData = new FormData();

      formData.append("email", email);
      formData.append("username", email.split("@")[0]);
      formData.append("password", password);
      formData.append("full_name", fullName);
      formData.append("role", role);

      if (phone.trim()) formData.append("phone", phone);
      if (address.trim()) formData.append("address", address);

      if (role === "ngo") {
        formData.append("organization_name", organizationName);
        formData.append("ngo_registration_number", ngoRegistrationNumber);
        formData.append("ngo_type", ngoType);
        formData.append("serving_capacity", servingCapacity);
        formData.append("pickup_available", String(pickupAvailable));

        if (registrationFile) {
          formData.append("registration_certificate", registrationFile);
        }
      }

      await signUp(formData);

      // signup ke baad bhi dashboard kholo
      navigate("/dashboard");
    }
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.error ||
      err.response?.data?.detail ||
      Object.values(err.response?.data || {})
        .flat()
        .join(", ") ||
      err.message ||
      "An error occurred";

    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
  return (
    <div>
      {/* 🔥 NAVBAR ADDED */}
      <Navbar />

      {/* 🔥 MAIN CONTENT */}
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Food Share
            </h1>
            <p className="text-gray-600">
              {isLogin ? 'Welcome back' : 'Join us in fighting food waste'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                />

                {/* ROLE */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('donor')}
                    className={`py-2 px-4 rounded-xl border ${
                      role === 'donor'
                        ? 'bg-green-600 text-white'
                        : 'bg-white'
                    }`}
                  >
                    Donor
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('ngo')}
                    className={`py-2 px-4 rounded-xl border ${
                      role === 'ngo'
                        ? 'bg-green-600 text-white'
                        : 'bg-white'
                    }`}
                  >
                    NGO
                  </button>
                </div>

                {/* NGO SECTION */}
                <AnimatePresence>
                  {role === 'ngo' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3 border p-4 rounded-xl bg-green-50"
                    >
                      <input
                        type="text"
                        placeholder="Organization Name"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-xl"
                      />

                      <input
                        type="text"
                        placeholder="Registration Number"
                        value={ngoRegistrationNumber}
                        onChange={(e) => setNgoRegistrationNumber(e.target.value)}
                        className="w-full px-4 py-2 border rounded-xl"
                      />

                      <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setRegistrationFile(e.target.files[0]);
                          }
                        }}
                        className="w-full px-3 py-2 border rounded-xl"
                      />

                      <input
                        type="text"
                        placeholder="NGO Type"
                        value={ngoType}
                        onChange={(e) => setNgoType(e.target.value)}
                        className="w-full px-4 py-2 border rounded-xl"
                      />

                      <input
                        type="number"
                        placeholder="Serving Capacity"
                        value={servingCapacity}
                        onChange={(e) => setServingCapacity(e.target.value)}
                        className="w-full px-4 py-2 border rounded-xl"
                      />

                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={pickupAvailable}
                          onChange={(e) => setPickupAvailable(e.target.checked)}
                        />
                        Pickup Available
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>

                <input
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl"
                />

                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </>
            )}

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl"
            />

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-medium"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-600 font-medium"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}