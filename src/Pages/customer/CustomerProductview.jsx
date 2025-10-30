import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";

export default function CustomerProductView() {
  const [wishlist, setWishlist] = useState(false);
  const [mainImage, setMainImage] = useState(
    "https://plus.unsplash.com/premium_photo-1719289718424-0f5071da5a3a?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070"
  );

  const mainProduct = {
    name: "Eco-Friendly Ceramic Mug",
    subheading: "Sustainable everyday use",
    price: "₹499",
    description:
      "This handcrafted ceramic mug is perfect for your daily coffee or tea. Made with eco-friendly materials and a smooth matte finish for a premium feel.",
    images: [
      "https://images.unsplash.com/photo-1592782239353-381b0ab5a617?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=722",
      "https://plus.unsplash.com/premium_photo-1719017276568-1c6e871bc471?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171",
      "https://plus.unsplash.com/premium_photo-1719617327169-c7c1f3bd18c1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1332",
    ],
  };

  const relatedProducts = [
    {
      name: "Blue Coffee Cup",
      desc: "Sustainable everyday use",
      price: "₹299",
      img: "https://plus.unsplash.com/premium_photo-1718401701449-74ee891283d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    },
    {
      name: "Heart design mug",
      desc: "Sustainable everyday use",
      price: "₹349",
      img: "https://images.unsplash.com/photo-1633677491302-db7fc823561b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    },
    {
      name: "yellow coffee cup",
      desc: "Sustainable everyday use",
      price: "₹399",
      img: "https://images.unsplash.com/photo-1685384338018-1774719d5b69?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fde7e7]">
      {/* ✅ Navbar */}
      <Navbar />

      {/* ✅ Main Content */}
      <main className="flex-grow flex flex-col items-center py-10 px-5">
        {/* Main Product Section */}
        <div className="bg-white rounded-xl shadow-md p-8 max-w-5xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* Product Image Section */}
            <div className="relative flex flex-col items-center">
              <img
                src={mainImage}
                alt={mainProduct.name}
                className="w-full h-80 object-cover rounded-lg shadow-sm transition-all duration-300"
              />

              {/* Wishlist Heart Button */}
              <button
                onClick={() => setWishlist(!wishlist)}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
                title={wishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlist ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-600 text-xl" />
                )}
              </button>

              {/* Thumbnails */}
              <div className="flex gap-4 mt-5">
                {mainProduct.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="product thumbnail"
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition ${
                      img === mainImage
                        ? "border-[#3b450d]"
                        : "border-transparent hover:border-gray-400"
                    }`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            </div>

            {/* Product Info Section */}
            <div>
              <h1 className="text-3xl font-semibold mb-2 text-gray-800">
                {mainProduct.name}
              </h1>
              <p className="text-gray-500 mb-4">{mainProduct.subheading}</p>
              <p className="text-2xl font-semibold text-[#3b450d] mb-4">
                {mainProduct.price}
              </p>
              <p className="text-gray-600 mb-6">{mainProduct.description}</p>

              {/* Wishlist + Buy Now Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setWishlist(!wishlist)}
                  className={`flex-1 px-6 py-2 rounded-md transition font-medium ${
                    wishlist
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "border border-[#3b450d] text-[#3b450d] hover:bg-[#f4f4f4]"
                  }`}
                >
                  {wishlist ? "Added to Wishlist ❤️" : "Add to Wishlist"}
                </button>
                <button className="flex-1 bg-[#3b450d] text-white px-6 py-2 rounded-md hover:bg-[#2e350b] transition">
                  Buy Now
                </button>
              </div>

              <p className="text-gray-400 text-xs mt-4">
                Free shipping on orders above ₹999
              </p>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="max-w-6xl w-full mt-16">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            Related Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {relatedProducts.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4 cursor-pointer group"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-44 object-cover rounded-lg mb-3 group-hover:scale-105 transition"
                />
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-medium text-gray-800">
                    {item.name}
                  </h3>
                  <FaRegHeart className="text-gray-500 hover:text-red-500 cursor-pointer" />
                </div>
                <p className="text-sm text-gray-500 mb-2">{item.desc}</p>
                <p className="text-gray-900 font-semibold">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}
