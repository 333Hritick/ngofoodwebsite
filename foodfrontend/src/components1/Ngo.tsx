export default function NGOs() {
  const ngos = [
    {
      name: "Helping Hands",
      location: "Delhi",
      image: "helpinghand.webp",
      rating: "4.8",
    },
    {
      name: "Food For All",
      location: "Mumbai",
      image: "/food.png",
      rating: "4.6",
    },
    {
      name: "Care Foundation",
      location: "Bangalore",
      image: "/logo.webp",
      rating: "4.9",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50">

      {/* Heading */}
      <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
        Featured NGOs
      </h2>
      <p className="text-center text-gray-500 mb-12">
        Trusted organizations working to reduce food waste
      </p>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-10 px-6 md:px-16">
        {ngos.map((ngo, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition duration-300"
          >
            
            {/* Image */}
            <div className="relative">
              <img
                src={ngo.image}
                alt={ngo.name}
                className="w-full h-48 object-cover"
              />

              {/* Rating */}
              <span className="absolute top-3 right-3 bg-white px-2 py-1 text-sm rounded-lg shadow">
                ⭐ {ngo.rating}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <h3 className="font-bold text-xl mb-1">
                {ngo.name}
              </h3>

              <p className="text-gray-500 mb-4">
                📍 {ngo.location}
              </p>

              {/* Button */}
              <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
                Request Pickup
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}