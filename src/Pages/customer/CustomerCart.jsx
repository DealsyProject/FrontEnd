import React, { useEffect, useState } from "react";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";
import { FaTrashAlt } from "react-icons/fa";
import axiosInstance from "../../Components/utils/axiosInstance";

export default function CustomerCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get(`/Cart`);
      setCart(res.data);
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = async (cartItemId, currentQty) => {
    try {
      // Update quantity by adding a new item with increased quantity
      const productId = cart.find(item => item.id === cartItemId)?.productId;
      if (!productId) return;

      await axiosInstance.post(`/Cart`, {
        productId: productId,
        quantity: currentQty + 1
      });
      
      // Refresh cart to get updated data
      fetchCart();
    } catch (error) {
      console.error("❌ Error increasing quantity:", error);
    }
  };

  const decreaseQty = async (cartItemId, currentQty) => {
    try {
      if (currentQty <= 1) {
        // If quantity is 1, remove the item entirely
        await removeItem(cartItemId);
        return;
      }

      // Update quantity by adding a new item with decreased quantity
      const productId = cart.find(item => item.id === cartItemId)?.productId;
      if (!productId) return;

      await axiosInstance.post(`/Cart`, {
        productId: productId,
        quantity: currentQty - 1
      });
      
      // Refresh cart to get updated data
      fetchCart();
    } catch (error) {
      console.error("❌ Error decreasing quantity:", error);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await axiosInstance.delete(`/Cart/${cartItemId}`);
      setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  };

  const clearCart = async () => {
    try {
      await axiosInstance.delete(`/Cart/clear`);
      setCart([]);
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 49;
  const finalTotal = total + shippingFee;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-pink-50">
        <Navbar />
        <main className="flex-grow flex justify-center items-center">
          <div className="text-center">Loading cart...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Navbar />
      <main className="flex-grow flex justify-center items-start px-6 py-10">
        <div className="bg-white shadow-lg rounded-xl w-full max-w-5xl p-8 flex flex-col md:flex-row gap-10">
          {/* Left side: Items */}
          <div className="flex-1 border-r border-gray-200 pr-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold mb-1">Shopping Cart</h2>
                <p className="text-sm text-gray-500">
                  You have {cart.length} item{cart.length !== 1 && "s"} in your cart
                </p>
              </div>
              {cart.length > 0 && (
                <button 
                  onClick={clearCart}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Clear Cart
                </button>
              )}
            </div>

            <div className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Your cart is empty
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.product?.images?.[0]?.imageData || "https://via.placeholder.com/400x300?text=No+Image"} 
                        alt={item.productName} 
                        className="w-16 h-16 object-cover rounded-md" 
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.product?.productName || item.productName}</h3>
                        <p className="text-sm text-gray-500">{item.product?.productCategory || "General"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => decreaseQty(item.id, item.quantity)} 
                          className="px-2 py-1 hover:bg-gray-200"
                        >
                          −
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button 
                          onClick={() => increaseQty(item.id, item.quantity)} 
                          className="px-2 py-1 hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-gray-800 font-medium">₹{item.price}</p>
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right side: Summary */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full max-w-sm space-y-6">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>₹{shippingFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-gray-900 text-lg">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-md transition ${
                  cart.length === 0 
                    ? "bg-gray-400 text-gray-100 cursor-not-allowed" 
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {cart.length === 0 ? "Cart is Empty" : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}