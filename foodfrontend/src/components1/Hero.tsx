import { useNavigate } from "react-router-dom";
export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full">

      {/* Background Image */}
      <img
        src="/child.JPG" // 👈 yaha apni image daal
        alt="hero"
        className="absolute w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute w-full h-full bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-20 text-white max-w-3xl">
        
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Always Support for <br />
          <span className="text-green-400">Needy People</span>
        </h1>

        <p className="text-lg text-gray-200 mb-6">
          Share your extra food and help bring smiles to those who need it most.
        </p>

        <div className="flex gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
            Get Support
          </button>

          <button 
          onClick={() => navigate("/Auth")}
          className="bg-green-500 px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition">
            Donate Now
          </button>
        </div>

      </div>
    </section>
  );
}