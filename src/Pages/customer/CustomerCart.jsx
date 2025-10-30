import React, { useState } from "react";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";
import { FaTrashAlt } from "react-icons/fa";

export default function CustomerCart() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Plant & Pot",
      desc: "showcasing plant and pot",
      price: 681,
      qty: 1,
      img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      name: "Hot Wheels",
      desc: "muscle car blue",
      price: 681,
      qty: 1,
      img: "https://images.unsplash.com/photo-1610901349897-c0d6f6f05e92?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      name: "Nike",
      desc: "Orange & white sneaker",
      price: 681,
      qty: 1,
      size: "Size: 8",
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    },
  ]);

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Navbar />

      <main className="flex-grow flex justify-center items-start px-6 py-10">
        <div className="bg-white shadow-lg rounded-xl w-full max-w-5xl p-8 flex flex-col md:flex-row gap-10">
          {/* LEFT: Cart items */}
          <div className="flex-1 border-r border-gray-200 pr-6">
            <h2 className="text-lg font-semibold mb-1">Shopping Continue</h2>
            <p className="text-sm text-gray-500 mb-4">
              You have {cart.length} item{cart.length !== 1 && "s"} in your cart
            </p>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                      {item.size && (
                        <p className="text-xs text-gray-400">{item.size}</p>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded-l-md"
                      >
                        −
                      </button>
                      <span className="px-3 text-gray-800 font-medium">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded-r-md"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-gray-800 font-medium">₹{item.price}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                      title="Remove"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Checkout Section */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full max-w-sm space-y-6">
              <div className="flex justify-between text-gray-700 text-sm border-b pb-2">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-700 text-sm border-b pb-2">
                <span>Shipping</span>
                <span>₹49</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 text-base border-b pb-2">
                <span>Total</span>
                <span>₹{total + 49}</span>
              </div>

              <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
