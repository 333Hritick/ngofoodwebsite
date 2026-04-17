import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Rohit Sharma",
      role: "Donor",
      text: "Amazing platform for helping others! Super आसान and impactful.",
      image: "/person1.webp",
      rating: 5,
    },
    {
      name: "Anjali Verma",
      role: "NGO Volunteer",
      text: "Very easy to donate food. This initiative truly makes a difference.",
      image: "/person2.webp",
      rating: 5,
    },
    {
      name: "Amit Kumar",
      role: "Donor",
      text: "Great initiative to reduce food waste and support needy people.",
      image: "/person3.webp",
      rating: 4,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-orange-50 text-center">

      {/* Heading */}
      <h2 className="text-4xl font-bold mb-4 text-gray-800">
        What People Say
      </h2>
      <p className="text-gray-500 mb-12">
        Real feedback from our community
      </p>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-10 px-6 md:px-16">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
          >
            
            {/* User Image */}
            <img
              src={review.image}
              alt={review.name}
              className="w-16 h-16 mx-auto rounded-full object-cover mb-4 border-2 border-orange-400"
            />

            {/* Name */}
            <h3 className="font-semibold text-lg">
              {review.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {review.role}
            </p>

            {/* Rating */}
            <div className="flex justify-center mb-3 text-yellow-400">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>

            {/* Review */}
            <p className="text-gray-600 italic">
              "{review.text}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}