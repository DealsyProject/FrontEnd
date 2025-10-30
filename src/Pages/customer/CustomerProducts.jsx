import React from "react";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";
import CustomerProductCard from "../../Components/customer/Product/CustomerProductCard";

export default function CustomerProducts() {
  const products = [
    {
      id: 1,
      name: "Eco-Friendly Ceramic Mug",
      price: "₹499",
      category: "Kitchen Essentials",
      rating: 4.5,
      image:
        "https://plus.unsplash.com/premium_photo-1719289718424-0f5071da5a3a?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070",
    },
    {
      id: 2,
      name: "Reusable Bamboo Cutlery Set",
      price: "₹299",
      category: "Eco Kitchen",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1600180758890-6d61df6a0d56?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex-grow px-8 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Our Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <CustomerProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
