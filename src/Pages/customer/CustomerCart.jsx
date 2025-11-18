import React, { useEffect, useState } from "react";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";
import { FaTrashAlt } from "react-icons/fa";
import axiosInstance from "../../Components/utils/axiosInstance";

export default function CustomerCart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axiosInstance.get(`/Cart`);
        setCart(res.data);
      } catch (error) {
        console.error("❌ Error fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  const increaseQty = async (id) => {
    await axiosInstance.put(`/Cart/update`, { id, action: "increase" });
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  };

  const decreaseQty = async (id) => {
    await axiosInstance.put(`/Cart/update`, { id, action: "decrease" });
    setCart((prev) => prev.map((i) => (i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i)));
  };

  const removeItem = async (id) => {
    await axiosInstance.delete(`/Cart/${id}`);
    setCart((prev) => prev.filter((i) => i.id !== id));
  };
  const clearCart = async () => {
    try {
      const customerId = localStorage.getItem("userId");
      await axiosInstance.delete(`/Cart/clear`);

      setCart([]); // empty the UI
      alert("🗑️ Cart cleared!");
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      alert("Failed to clear cart.");
    }
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Navbar />
      <main className="flex-grow flex justify-center items-start px-6 py-10">
        <div className="bg-white shadow-lg rounded-xl w-full max-w-5xl p-8 flex flex-col md:flex-row gap-10">
          {/* Left side: Items */}
          <div className="flex-1 border-r border-gray-200 pr-6">
            <h2 className="text-lg font-semibold mb-1">Shopping Cart</h2>
            <p className="text-sm text-gray-500 mb-4">
              You have {cart.length} item{cart.length !== 1 && "s"} in your cart
            </p>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={item.imageData} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                      <p className="text-sm text-gray-500">{item.productCategory}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center border rounded-md">
                      <button onClick={() => decreaseQty(item.id)} className="px-2 py-1 hover:bg-gray-200">−</button>
                      <span className="px-3">{item.qty}</span>
                      <button onClick={() => increaseQty(item.id)} className="px-2 py-1 hover:bg-gray-200">+</button>
                    </div>
                    <p className="text-gray-800 font-medium">₹{item.price}</p>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Summary */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full max-w-sm space-y-6">
              <div className="flex justify-between text-gray-700 text-sm border-b pb-2">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 text-base border-b pb-2">
                <span>Total</span>
                <span>₹{total + 49}</span>
              </div>
              <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition">
                Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
