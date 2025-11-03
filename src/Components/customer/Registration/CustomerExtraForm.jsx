// src/components/register/CustomerFields.jsx
import React from "react";

export default function CustomerExtraForm({ extraData, handleExtraChange, isLoading }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-[#586330] text-center">
        Customer Details
      </h3>

      <input
        type="text"
        name="address"
        value={extraData.address || ""}
        onChange={handleExtraChange}
        placeholder="Address"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
        disabled={isLoading}
      />

      <input
        type="text"
        name="pincode"
        value={extraData.pincode || ""}
        onChange={handleExtraChange}
        placeholder="Pin Code (6 digits)"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
        disabled={isLoading}
        maxLength={6}
      />
    </div>
  );
}
