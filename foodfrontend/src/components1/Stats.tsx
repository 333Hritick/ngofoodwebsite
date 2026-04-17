import { useEffect, useState } from "react";
import { Utensils, Users, HeartHandshake, MapPin } from "lucide-react";

export default function Stats() {
  const statsData = [
    {
      icon: <Utensils size={32} />,
      label: "Meals Donated",
      target: 5000,
    },
    {
      icon: <Users size={32} />,
      label: "Active NGOs",
      target: 120,
    },
    {
      icon: <HeartHandshake size={32} />,
      label: "Donors",
      target: 2000,
    },
    {
      icon: <MapPin size={32} />,
      label: "Cities Covered",
      target: 25,
    },
  ];

  const [counts, setCounts] = useState(statsData.map(() => 0));

  useEffect(() => {
    const intervals = statsData.map((stat, index) => {
      let i = 0;

      return setInterval(() => {
        i += Math.ceil(stat.target / 50);

        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = i >= stat.target ? stat.target : i;
          return newCounts;
        });

        if (i >= stat.target) clearInterval(intervals[index]);
      }, 40);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-green-500 text-white text-center">

      {/* Heading */}
      <h2 className="text-4xl font-bold mb-4">
        Our Impact
      </h2>
      <p className="mb-12 text-green-100">
        Together we are making a difference
      </p>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-8 px-6 md:px-16">
        {statsData.map((stat, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:scale-105 transition"
          >
            
            {/* Icon */}
            <div className="flex justify-center mb-4 text-white">
              {stat.icon}
            </div>

            {/* Count */}
            <h3 className="text-3xl font-bold">
              {counts[i]}+
            </h3>

            {/* Label */}
            <p className="text-green-100 mt-2">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}