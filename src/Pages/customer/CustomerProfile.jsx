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
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const menu = ["My Profile", "My Orders", "Returned", "Refunded"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileRes = await axiosInstance.get("/CustomerViewDetails/profile");
        const profileData = profileRes.data.data || profileRes.data;
        setProfile(profileData);

        const photoRes = await axiosInstance.get("/CustomerPicture/photoView");
        if (photoRes.data?.photoUrl) setPhotoUrl(photoRes.data.photoUrl);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to fetch profile or photo details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // FRONTEND: send file to backend; backend handles Cloudinary upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // backend expects 'file'

    try {
      setIsUploading(true);
      const res = await axiosInstance.put("/CustomerPicture/photoUpdate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const returnedUrl = res.data?.photoUrl || res.data?.url;
      if (returnedUrl) {
        setPhotoUrl(returnedUrl);
        alert("Profile picture updated!");
      } else {
        alert("Upload succeeded but server did not return URL");
      }
    } catch (err) {
      console.error("Error uploading photo:", err);
      alert("Failed to upload photo.");
    } finally {
      setIsUploading(false);
      // Reset input value to allow re-uploading same file
      e.target.value = "";
    }
  };

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

  const getField = (field) => profile?.[field] || profile?.[field.toLowerCase()] || "N/A";

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Navbar />
      <main className="flex-grow flex justify-center px-6 py-10">
        <div className="bg-white rounded-xl shadow-md w-full max-w-6xl p-6 flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4 border rounded-xl p-4">
            <div className="flex flex-col items-center relative">
              {loading ? (
                <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse mb-2"></div>
              ) : (
                <div className="relative">
                  <img
                    src={photoUrl || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                    alt="profile"
                    className="w-24 h-24 rounded-full object-cover mb-2 border"
                    onError={() => setPhotoUrl(null)}
                  />
                  <label className="absolute bottom-0 right-1 bg-black text-white p-1.5 rounded-full cursor-pointer hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Pencil size={14} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      disabled={isUploading}
                      className="hidden" 
                    />
                  </label>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="text-white text-xs">Uploading...</div>
                    </div>
                  )}
                </div>
              )}

              {photoUrl && !isUploading && (
                <button onClick={handlePhotoDelete} className="flex items-center gap-1 bg-red-500 text-white text-xs px-3 py-1 rounded-md mt-2 hover:bg-red-600">
                  <Trash2 size={12} /> Delete Photo
                </button>
              )}

              {loading ? (
                <p className="text-gray-500 text-sm mb-4">Loading...</p>
              ) : error ? (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              ) : (
                <p className="text-sm text-gray-600 mb-4 text-center">
                  <span className="font-medium text-gray-800">{getField("FullName")}</span>
                </p>
              )}

              <div className="w-full space-y-2">
                {menu.map((item) => (
                  <button key={item} onClick={() => setActive(item)} className={`w-full border rounded-md py-2 text-sm font-medium transition ${active === item ? "bg-black text-white" : "hover:bg-gray-100 text-gray-700"}`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

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