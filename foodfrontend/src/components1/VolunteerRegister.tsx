import { useState } from "react";
import axios from "axios";

export default function VolunteerJoin() {
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [availability, setAvailability] = useState("");
  const [idProof, setIdProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("city", city);
      formData.append("availability", availability);

if (idProof) {
  formData.append("id_proof", idProof);
}


      await axios.post(
        "https://ngofoodwebsite.onrender.com/api/volunteer/register/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Volunteer request sent to admin ✅");

      setName("");
      setEmail("");
      setPhone(""); 
      setCity("");
      setAvailability("");
      setIdProof(null);
    } catch (err) {
      console.error("Volunteer registration failed", err);
      alert("Failed to send volunteer request ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Join as Volunteer
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
 <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border p-3 focus:border-green-500 focus:outline-none"
          required
        />

         <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border p-3 focus:border-green-500 focus:outline-none"
          required
        />

        <input
          type="text"
          placeholder="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded border p-3 focus:border-green-500 focus:outline-none"
          required
        />





        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full rounded border p-3 focus:border-green-500 focus:outline-none"
          required
        />

        <input
          type="text"
          placeholder="Availability (e.g. Weekends, Evening)"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="w-full rounded border p-3 focus:border-green-500 focus:outline-none"
          required
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Upload ID Proof
          </label>

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => setIdProof(e.target.files?.[0] || null)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-green-600 px-4 py-3 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}