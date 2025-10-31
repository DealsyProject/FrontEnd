import React from 'react';
import { User, Star } from 'lucide-react';

const vendors = ['Tech Gadgets Inc.', 'Audio Solutions', 'Office Supplies Co.', 'Home Essentials', 'Fitness Gear Pro'];

const reviews = [
  {
    id: 1,
    customer: 'John',
    location: 'Kochi',
    vendor: 'Tech Gadgets Inc.',
    review: "Dealsy is a perfect place to purchase. I ordered almost 10 products, all of which are high quality. I received every product without any delay. Really happy with Dealsy!",
    rating: 5
  },
  {
    id: 2,
    customer: 'Sarah',
    location: 'Calicut',
    vendor: 'Audio Solutions',
    review: "I received the Segall Chair yesterday - a perfect blend of comfort, durability, and timeless craftsmanship. Thank you Dealsy for this amazing product. From now on, I'll be your regular customer!",
    rating: 5
  },
  {
    id: 3,
    customer: 'Lakshmi',
    location: 'Malappuram',
    vendor: 'Office Supplies Co.',
    review: "The Segall Chair exceeded my expectations! The perfect combination of comfort and elegant design makes it ideal for long sitting hours. The quality craftsmanship is evident in every detail. Highly recommended!",
    rating: 4
  },
  {
    id: 4,
    customer: 'Anuraj',
    location: 'Thiruvananthapuram',
    vendor: 'Home Essentials',
    review: "Excellent shopping experience with Dealsy! Fast delivery, great packaging, and the product quality is outstanding. Will definitely shop again!",
    rating: 5
  },
  {
    id: 5,
    customer: 'Ananya',
    location: 'Thrissur',
    vendor: 'Fitness Gear Pro',
    review: "Amazing service and product quality. The customer support team was very helpful in resolving my query. The furniture I purchased looks even better in person!",
    rating: 4
  },
  {
    id: 6,
    customer: 'Rathika',
    location: 'Thrissur',
    vendor: 'Tech Gadgets Inc.',
    review: "Amazing service and product quality. The customer support team was very helpful in resolving my query. The furniture I purchased looks even better in person!",
    rating: 4
  }
];

const CustomerReviews = () => {
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-16">
      <h2 className="text-3xl font-bold text-[#586330]/80 text-center mb-12">
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-[#586330]/80 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.02] transition-transform duration-300"
          >
            {/* Customer Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">{review.customer}</div>
                <div className="text-sm text-white">{review.location}</div>
              </div>
              <div className="text-right">
                {renderStars(review.rating)}
              </div>
            </div>

            {/* Vendor Info */}
            <div className="mb-3">
              <div className="text-xs text-white font-medium mb-1">Vendor:</div>
              <div className="text-sm font-semibold text-gray-900 bg-white/80 px-3 py-1 rounded-full inline-block">
                {review.vendor}
              </div>
            </div>

            {/* Review Text */}
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