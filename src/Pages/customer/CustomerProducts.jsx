import React, { useEffect, useState } from "react";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";
import CustomerProductCard from "../../Components/customer/Product/CustomerProductCard";
import axiosInstance from "../../Components/utils/axiosInstance";

export default function CustomerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/Product/all");

        // ✅ Extract array safely - handle different response formats
        let data = [];
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data.products && Array.isArray(response.data.products)) {
          data = response.data.products;
        } else if (Array.isArray(response.data.$values)) {
          data = response.data.$values;
        }

        // ✅ Transform for display
        const formatted = data.map((p) => {
          const primaryImage = p.images?.[0];
          return {
            id: p.id,
            name: p.productName,
            description: p.description || "No description available",
            price: p.price ?? 0, // Keep as number for calculations
            category: p.productCategory || "General",
            rating: p.rating ?? 0,
            image:
              primaryImage?.imageData ||
              "https://via.placeholder.com/400x300?text=No+Image",
            vendorName: p.vendorName || "Unknown Vendor",
            quantity: p.quantity || 0
          };
        });

        setProducts(formatted);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex-grow px-8 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Our Products
        </h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <CustomerProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}