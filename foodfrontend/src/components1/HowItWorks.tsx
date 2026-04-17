import { Package, Truck, Heart } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Package size={32} />,
      title: "Donate Food",
      desc: "Share your surplus food easily through our platform.",
    },
    {
      icon: <Truck size={32} />,
      title: "NGO Pickup",
      desc: "Nearby NGOs collect the food quickly and safely.",
    },
    {
      icon: <Heart size={32} />,
      title: "Delivered to Needy",
      desc: "Food reaches those who need it the most.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white text-center">

      {/* Heading */}
      <h2 className="text-4xl font-bold mb-4 text-gray-800">
        How It Works
      </h2>
      <p className="text-gray-500 mb-12 max-w-xl mx-auto">
        Simple steps to make a big difference in someone's life
      </p>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-10 px-6 md:px-16">
        {steps.map((step, i) => (
          <div
            key={i}
            className="relative p-8 rounded-2xl bg-white/70 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
          >
            
            {/* Step Number */}
            <span className="absolute top-4 right-4 text-gray-200 text-5xl font-bold">
              0{i + 1}
            </span>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 shadow">
              {step.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-2">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-sm">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}