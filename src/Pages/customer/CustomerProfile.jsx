import React, { useState } from "react";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";

export default function ProfilePage() {
  const [active, setActive] = useState("My Orders");

  const menu = ["My Orders", "Returned", "Refunded"];

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Navbar />

      <main className="flex-grow flex justify-center px-6 py-10">
        <div className="bg-white rounded-xl shadow-md w-full max-w-6xl p-6 flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/4 border rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Profile</h2>
            <div className="flex flex-col items-center">
              <img
                src="https://i.pravatar.cc/102"
                alt="profile"
                className="w-20 h-20 rounded-full mb-2"
              />
              <p className="text-sm text-gray-600 mb-4">
                Name : <span className="font-medium text-gray-800">Full Name</span>
              </p>

              <div className="w-full space-y-2">
                {menu.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActive(item)}
                    className={`w-full border rounded-md py-2 text-sm font-medium transition ${
                      active === item
                        ? "bg-black text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 border rounded-xl p-6">
            {active === "My Orders" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">My Orders</h3>
                <p className="text-gray-600 text-sm">
                  You have no orders yet. Start shopping now!
                </p>
              </div>
            )}

            {active === "Returned" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Returned Orders</h3>
                <p className="text-gray-600 text-sm">
                  You haven’t returned any products yet.
                </p>
              </div>
            )}

            {active === "Refunded" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Refunded Orders</h3>
                <p className="text-gray-600 text-sm">
                  No refunds have been processed yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
