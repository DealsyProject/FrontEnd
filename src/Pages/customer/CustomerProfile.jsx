import React, { useState, useEffect } from "react";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";
import axiosInstance from "../../Components/utils/axiosInstance";
import { Pencil, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const [active, setActive] = useState("My Profile");
  const [profile, setProfile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const menu = ["My Profile", "My Orders", "Returned", "Refunded"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch profile
        const profileRes = await axiosInstance.get("/CustomerViewDetails/profile");
        // console.log("Profile Response:", profileRes.data);

        // Handle wrapped data or PascalCase
        const profileData = profileRes.data.data || profileRes.data; 
        setProfile(profileData);
        
        // Fetch profile photo
        // console.log('-------here-------')
        const photoRes = await axiosInstance.get("/CustomerPicture/photoView");
        console.log("Photo Response:", photoRes.data);
        if (photoRes.data && photoRes.data.photoUrl) {
          setPhotoUrl(photoRes.data.photoUrl);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to fetch profile or photo details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64Image = ev.target?.result;
      // console.log("Uploading image:", base64Image); 
      try {
        await axiosInstance.put("/CustomerPicture/photoUpdate", { photo: base64Image });
        alert("Profile picture updated successfully!");
        setPhotoUrl(base64Image);
      } catch (err) {
        console.error("Error updating photo:", err);
        alert("Failed to update photo.");
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle photo delete
  const handlePhotoDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile photo?")) return;
    try {
      await axiosInstance.delete("/CustomerPicture/photoDelete");
      setPhotoUrl(null);
      alert("Profile picture deleted successfully!");
    } catch (err) {
      console.error("Error deleting photo:", err);
      alert("Failed to delete photo.");
    }
  };

  // Helper to safely get field (handles PascalCase / camelCase)
  const getField = (field) => profile?.[field] || profile?.[field.toLowerCase()] || "N/A";

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Navbar />
      <main className="flex-grow flex justify-center px-6 py-10">
        <div className="bg-white rounded-xl shadow-md w-full max-w-6xl p-6 flex flex-col md:flex-row gap-8">

          {/* Left Sidebar */}
          <div className="w-full md:w-1/4 border rounded-xl p-4">
            <div className="flex flex-col items-center relative">
              {/* Profile Picture */}
              {loading ? (
                <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse mb-2"></div>
              ) : (
                <div className="relative">
                  <img
                    src={photoUrl || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                    alt="profile"
                    className="w-24 h-24 rounded-full object-cover mb-2 border"
                  />
                  <label className="absolute bottom-0 right-1 bg-black text-white p-1.5 rounded-full cursor-pointer hover:bg-gray-800">
                    <Pencil size={14} />
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              )}

              {/* Delete photo */}
              {photoUrl && (
                <button
                  onClick={handlePhotoDelete}
                  className="flex items-center gap-1 bg-red-500 text-white text-xs px-3 py-1 rounded-md mt-2"
                >
                  <Trash2 size={12} /> Delete Photo
                </button>
              )}

              {/* Profile Name */}
              {loading ? (
                <p className="text-gray-500 text-sm mb-4">Loading...</p>
              ) : error ? (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              ) : (
                <p className="text-sm text-gray-600 mb-4 text-center">
                  <span className="font-medium text-gray-800">{getField("FullName")}</span>
                </p>
              )}

              {/* Sidebar Menu */}
              <div className="w-full space-y-2">
                {menu.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActive(item)}
                    className={`w-full border rounded-md py-2 text-sm font-medium transition ${
                      active === item ? "bg-black text-white" : "hover:bg-gray-100 text-gray-700"
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
            {active === "My Profile" && (
              <div>
                <h3 className="text-lg font-semibold mb-6 border-b pb-2">Profile Information</h3>
                {loading ? (
                  <p className="text-gray-500 text-sm">Loading profile...</p>
                ) : error ? (
                  <p className="text-red-500 text-sm">{error}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-600">Full Name</p>
                      <p className="font-medium text-gray-900">{getField("FullName")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{getField("Email")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone Number</p>
                      <p className="font-medium text-gray-900">{getField("PhoneNumber")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">{getField("Address")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Pincode</p>
                      <p className="font-medium text-gray-900">{getField("Pincode")}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {active === "My Orders" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">My Orders</h3>
                <p className="text-gray-600 text-sm">You have no orders yet. Start shopping now!</p>
              </div>
            )}
            {active === "Returned" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Returned Orders</h3>
                <p className="text-gray-600 text-sm">You haven't returned any products yet.</p>
              </div>
            )}
            {active === "Refunded" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Refunded Orders</h3>
                <p className="text-gray-600 text-sm">No refunds have been processed yet.</p>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
