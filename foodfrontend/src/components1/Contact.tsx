import axios from "axios";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await axios.post("https://ngofoodwebsite.onrender.com/api/auth/contact-us/", formData);

      console.log(response.data);

      setSuccess("Message sent successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800">Contact Us</h2>
        <p className="text-gray-500 mt-2">We'd love to hear from you</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 px-6 md:px-16 items-center">
        {/* Left Side */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600">
              <Phone />
            </div>
            <p className="text-gray-700">+91 98765 43210</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600">
              <Mail />
            </div>
            <p className="text-gray-700">support@foodshare.org</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600">
              <MapPin />
            </div>
            <p className="text-gray-700">Dehradun, India</p>
          </div>

          <p className="text-gray-500 mt-6">
            Our team is available to assist you with donations, NGO
            partnerships, or any queries.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <textarea
            name="message"
            rows={4}
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          {success && (
            <p className="text-green-600 text-sm font-medium">{success}</p>
          )}

          {error && (
            <p className="text-red-600 text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition shadow-md text-white ${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}