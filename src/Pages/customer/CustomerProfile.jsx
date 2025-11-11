import React, { useState, useEffect } from "react";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";
import axiosInstance from "../../Components/utils/axiosInstance";

export default function ProfilePage() {
  const [active, setActive] = useState("My Profile");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const menu = ["My Profile", "My Orders", "Returned", "Refunded"];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/CustomerViewDetails/profile");
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Unable to fetch profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Navbar />

      <main className="flex-grow flex justify-center px-6 py-10">
        <div className="bg-white rounded-xl shadow-md w-full max-w-6xl p-6 flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/4 border rounded-xl p-4">
            <div className="flex flex-col items-center">
              <img
                src="https://i.pravatar.cc/102"
                alt="profile"
                className="w-20 h-20 rounded-full mb-2"
              />

              {/* ✅ Show loading, error, or profile name */}
              {loading ? (
                <p className="text-gray-500 text-sm mb-4">Loading...</p>
              ) : error ? (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              ) : (
                <p className="text-sm text-gray-600 mb-4 text-center">
                  <span className="font-medium text-gray-800">
                    {profile?.fullName || "N/A"}
                  </span>
                </p>
              )}

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
            {/* ✅ Profile Information */}
            {active === "My Profile" && (
              <div>
                <h3 className="text-lg font-semibold mb-6 border-b pb-2">
                  Profile Information
                </h3>

                {loading ? (
                  <p className="text-gray-500 text-sm">Loading profile...</p>
                ) : error ? (
                  <p className="text-red-500 text-sm">{error}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-600">Full Name</p>
                      <p className="font-medium text-gray-900">
                        {profile?.fullName || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">
                        {profile?.email || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600">Phone Number</p>
                      <p className="font-medium text-gray-900">
                        {profile?.phoneNumber || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">
                        {profile?.address || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600">Pincode</p>
                      <p className="font-medium text-gray-900">
                        {profile?.pincode || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ✅ My Orders */}
            {active === "My Orders" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">My Orders</h3>
                <p className="text-gray-600 text-sm">
                  You have no orders yet. Start shopping now!
                </p>
              </div>
            )}

            {/* ✅ Returned Orders */}
            {active === "Returned" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Returned Orders</h3>
                <p className="text-gray-600 text-sm">
                  You haven’t returned any products yet.
                </p>
              </div>
            )}

            {/* ✅ Refunded Orders */}
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
