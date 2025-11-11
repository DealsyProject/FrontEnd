// src/components/register/VendorFields.jsx
import React from "react";

export default function VendorExtraForm({ extraData, handleExtraChange, isLoading }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-[#586330] text-center">
        Vendor Details
      </h3>

      <input
        type="text"
        name="companyName"
        value={extraData.companyName || ""}
        onChange={handleExtraChange}
        placeholder="Company Name"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
        disabled={isLoading}
      />

      <input
        type="text"
        name="companyOwnerName"
        value={extraData.companyOwnerName || ""}
        onChange={handleExtraChange}
        placeholder="Owner Name"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
        disabled={isLoading}
      />

      <input
        type="email"
        name="companyEmail"
        value={extraData.companyEmail || ""}
        onChange={handleExtraChange}
        placeholder="Company Email"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
        disabled={isLoading}
      />

      <input
        type="text"
        name="location"
        value={extraData.location || ""}
        onChange={handleExtraChange}
        placeholder="Location"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
        disabled={isLoading}
      />
    </div>
  );
}
