import React from "react";

export default function HomeFairPriceSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 px-6">
        
        {/* Text Content */}
        <div className="flex-1 space-y-8">
          <h2 className="text-4xl font-serif font-bold mb-4 text-gray-900">
            Everything Under Fair Price.
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-2xl text-gray-800">Pure & Genuine Quality</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Every product is carefully sourced and priced fairly — ensuring value without compromise.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-2xl text-gray-800">Sustainable Choices</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                We focus on sustainability and transparency, giving you full confidence in your purchases.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-2xl text-gray-800">Affordable Everyday</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Our mission is to bring premium products to everyone — without the premium price tag.
              </p>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button className="bg-[#586330] text-white px-6 py-3 rounded-lg hover:bg-[#465026] transition-colors duration-300">
              Shop Now
            </button>
            <button className="bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Image Side */}
        <div className="flex-1 flex justify-center">
          <img
            src="homepics/cartPic.png"
            alt="Shopping Cart"
            className="rounded-2xl w-full md:w-[90%] h-[500px] object-cover shadow-md hover:scale-105 transition-transform duration-500"
          />
        </div>

      </div>
    </section>
  );
}
