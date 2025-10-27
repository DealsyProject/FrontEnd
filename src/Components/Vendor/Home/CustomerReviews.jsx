import React from 'react';
import { User } from 'lucide-react';

const reviews = [
  {
    id: 1,
    customer: 'Customer 2',
    location: 'Kalkonnai',
    review:
      "The Segall Chair is a perfect blend of comfort, durability, and timeless craftsmanship. Made from high-quality teak wood with a smooth matte finish, it's designed for both home and office use. Its ergonomic backrest ensures comfort even during long sitting hours, making it ideal for dining, study, or lounge spaces. Each piece is carefully handcrafted by local artisans, ensuring strength and elegant design that enhances any room décor.",
  },
  {
    id: 2,
    customer: 'Customer 24',
    location: 'Kalkonnai',
    review:
      "The Segall Chair is a perfect blend of comfort, durability, and timeless craftsmanship. Made from high-quality teak wood with a smooth matte finish, it's designed for both home and office use. Its ergonomic backrest ensures comfort even during long sitting hours, making it ideal for dining, study, or lounge spaces. Each piece is carefully handcrafted by local artisans, ensuring strength and elegant design that enhances any room décor.",
  },
  {
    id: 3,
    customer: 'Customer 46',
    location: 'Kalkonnai',
    review:
      "The Segall Chair is a perfect blend of comfort, durability, and timeless craftsmanship. Made from high-quality teak wood with a smooth matte finish, it's designed for both home and office use. Its ergonomic backrest ensures comfort even during long sitting hours, making it ideal for dining, study, or lounge spaces. Each piece is carefully handcrafted by local artisans, ensuring strength and elegant design that enhances any room décor.",
  },
];

const CustomerReviews = () => {
  return (
    <div className="max-w-6xl mx-auto px-8 py-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-indigo-500 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{review.customer}</div>
                <div className="text-sm text-gray-900">{review.location}</div>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-white/90 italic">
              "{review.review}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
