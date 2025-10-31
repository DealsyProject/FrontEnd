import React, { useState } from "react";
import { toast } from "react-toastify";

export default function VendorExtraForm({ navigate }) {
  const [vendorData, setVendorData] = useState({
    companyName: "",
    companyOwnerName: "",
    companyEmail: "",
    location: "",
  });
  const [isVendorLoading, setIsVendorLoading] = useState(false);

  const handleChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { companyName, companyOwnerName, companyEmail, location } = vendorData;
    if (!companyName || !companyOwnerName || !companyEmail || !location) {
      toast.error("Please fill all fields");
      return;
    }

    setIsVendorLoading(true);
    try {
      const response = await fetch("https://localhost:7001/api/auth/register-vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendorData),
      });
      if (response.ok) {
        toast.success("Vendor registration completed!");
        localStorage.removeItem("tempUserData");
        setTimeout(() => navigate("/"), 1500);
      } else {
        const err = await response.json();
        toast.error(err.message || "Vendor registration failed");
      }
    } catch (err) {
      toast.error("Network or server error");
    } finally {
      setIsVendorLoading(false);
    }
  };

  return (
    <div className="mt-12 p-8 bg-white rounded-3xl shadow-xl max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-green-500 mb-6 text-center">
        Complete Vendor Registration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="companyName"
          value={vendorData.companyName}
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="companyOwnerName"
          value={vendorData.companyOwnerName}
          onChange={handleChange}
          placeholder="Owner Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <input
          type="email"
          name="companyEmail"
          value={vendorData.companyEmail}
          onChange={handleChange}
          placeholder="Company Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="location"
          value={vendorData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={isVendorLoading}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-semibold transition duration-200 disabled:opacity-50"
        >
          {isVendorLoading ? "Submitting..." : "Complete Registration"}
        </button>
      </form>
    </div>
  );
}
