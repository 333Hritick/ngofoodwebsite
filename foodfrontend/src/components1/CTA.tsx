import { useNavigate } from "react-router-dom";
import Auth from "./Auth";

export default function CTA() {
const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center relative overflow-hidden">

      {/* Glow Effect */}
      <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl top-[-50px] left-[-50px]"></div>
      <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl bottom-[-50px] right-[-50px]"></div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-0">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Join Us in Fighting Hunger 🍱
        </h2>

        <p className="text-orange-100 mb-8 max-w-xl mx-auto">
          Your small contribution can bring a big change. Help us deliver food to those who need it most.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4">
          
          <button
          onClick={() => navigate("/Auth")}
          className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition shadow-lg">
            Donate Now
          </button>

         <button
         onClick={() => navigate("/Auth")}
          className="border border-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition">
            Join as NGO
          </button>

        </div>
      </div>
    </section>
  );
}