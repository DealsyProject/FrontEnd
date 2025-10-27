import React from 'react';
import { MessageCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const About = () => {
  const handleContactUs = () => {
    toast.success('Thank you for your interest! We will contact you soon.', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="relative bg-gradient-to-b from-indigo-600 to-indigo-00 rounded-3xl overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Interior background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <div className="relative z-10 p-12">
          <h2 className="text-4xl font-bold text-white mb-6">About Dealsy</h2>

          <div className="text-white space-y-4 mb-8">
            <p className="text-lg leading-relaxed">
              Welcome to <span className="font-semibold">Dealsy</span>, your one-stop shop for incredible savings on virtually everything you need!
              We know that finding a great deal shouldn't feel like a treasure hunt. That's why we've built this easy-to-navigate online retail site that brings together a massive, curated selection of products across all categories—from home goods and electronics to fashion, beauty, and more—all offered at prices you'll love.
            </p>

            <p className="text-base leading-relaxed">
              Our mission is simple: to make quality, value, and variety accessible to everyone.
            </p>

            <div className="space-y-3 mt-6">
              <p className="text-base">
                <span className="font-semibold">• Unbeatable Prices:</span> We're committed to offering the most competitive prices online. If it's a great deal, it's on Dealsy.
              </p>
              <p className="text-base">
                <span className="font-semibold">• Vast Selection:</span> Our inventory is constantly expanding, ensuring you can find what you're after, no matter how niche your needs may be.
              </p>
              <p className="text-base">
                <span className="font-semibold">• Quality Assurance:</span> We partner with trusted brands and suppliers to guarantee the products you purchase are authentic and reliable.
              </p>
              <p className="text-base">
                <span className="font-semibold">• Simple Shopping:</span> Our site is designed for ease. Find, compare, and purchase your items quickly and securely. Ready to start saving? Dive into our latest deals and see why smart shoppers choose Dealsy!
              </p>
            </div>
          </div>

          <button
            onClick={handleContactUs}
            className="flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
