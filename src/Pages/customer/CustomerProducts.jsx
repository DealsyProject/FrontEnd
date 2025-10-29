import React from "react";
import Footer from "../../Components/customer/Common/Footer";
import Navbar from "../../Components/customer/Common/Navbar";

export default function CustomerProducts() {
  const product = {
    name: "Eco-Friendly Ceramic Mug",
    price: "₹499",
    description:
      "This handcrafted ceramic mug is perfect for your daily coffee or tea. Made with eco-friendly materials and a smooth matte finish for a premium feel.",
    image:
      "https://plus.unsplash.com/premium_photo-1719289718424-0f5071da5a3a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
    category: "Kitchen Essentials",
    rating: 4.5,
    stock: 12,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* ✅ Navbar should stay at the top */}
      <Navbar />

      {/* ✅ Main product section */}
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="bg-white max-w-3xl w-full rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product Image */}
            <div className="bg-gray-50 flex items-center justify-center p-6">
              <img
                src={product.image}
                alt={product.name}
                className="rounded-md object-cover h-64 w-64"
              />
            </div>

            {/* Product Details */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  Category: {product.category}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {product.description}
                </p>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg font-semibold text-[#3b450d]">
                    {product.price}
                  </span>
                  <span className="text-sm text-yellow-500">
                    ⭐ {product.rating} / 5
                  </span>
                </div>

                <p
                  className={`text-sm font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-[#3b450d] hover:bg-[#2e350b] text-white py-2 rounded-md text-sm font-medium transition">
                  Add to Cart
                </button>
                <button className="flex-1 border border-[#3b450d] text-[#3b450d] hover:bg-[#f4f4f4] py-2 rounded-md text-sm font-medium transition">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ✅ Footer stays at bottom */}
      <Footer />
    </div>
  );
}
