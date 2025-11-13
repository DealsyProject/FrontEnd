import React, { useState, useEffect } from "react";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";
import { Trash2 } from "lucide-react";
import axiosInstance from "../../Components/utils/axiosInstance";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const customerId = localStorage.getItem("customerId"); // assuming it's stored after login

  // ✅ Fetch wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get(`/Wishlist/${customerId}`);
        setWishlist(response.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };
    if (customerId) fetchWishlist();
  }, [customerId]);

  // ✅ Remove product from wishlist
  const removeFromWishlist = async (wishlistId) => {
    try {
      await axiosInstance.delete(`/Wishlist/${wishlistId}`);
      setWishlist((prev) => prev.filter((item) => item.wishlistId !== wishlistId));
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-50">
        <p className="text-gray-700 text-lg">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Navbar />

      <main className="flex-grow px-6 py-10 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Wishlist</h2>

          {wishlist.length === 0 ? (
            <div className="text-center text-gray-600 py-16">
              <p>Your wishlist is empty 😔</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.wishlistId}
                  className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col"
                >
                  <img
                    src={item.productImage || "https://via.placeholder.com/300"}
                    alt={item.productName}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {item.productName}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    {item.productDescription || "No description available"}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="font-semibold text-gray-900">
                      ₹{item.price || "—"}
                    </span>
                    <button
                      onClick={() => removeFromWishlist(item.wishlistId)}
                      className="text-gray-500 hover:text-red-500 transition"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
