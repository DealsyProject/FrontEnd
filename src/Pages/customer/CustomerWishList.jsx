import React, { useState } from "react";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";
import { Trash2 } from "lucide-react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Plant & Pot",
      price: 681,
      img: "https://images.unsplash.com/photo-1616627452104-6fe055a451db?auto=format&fit=crop&w=400&q=80",
      desc: "Showcasing plant and pot",
    },
    {
      id: 2,
      name: "Hot Wheels",
      price: 681,
      img: "https://images.unsplash.com/photo-1606813909365-7b7c184f2b7b?auto=format&fit=crop&w=400&q=80",
      desc: "Muscle car blue",
    },
    {
      id: 3,
      name: "Nike Sneaker",
      price: 681,
      img: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba8?auto=format&fit=crop&w=400&q=80",
      desc: "Orange & white sneaker",
    },
  ]);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

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
                  key={item.id}
                  className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">{item.desc}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="font-semibold text-gray-900">₹{item.price}</span>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
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
