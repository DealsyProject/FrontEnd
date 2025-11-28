import React from "react";

export default function CustomerExtraForm({ extraData, handleExtraChange, isLoading, errors, touched }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-[#586330] text-center">
        Fill
      </h3>

      <div>
        <input
          type="text"
          name="address"
          value={extraData.address || ""}
          onChange={handleExtraChange}
          onBlur={handleExtraChange}
          placeholder="Address"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#586330] ${
            touched.address && errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {touched.address && errors.address && (
          <div className="text-red-500 text-sm mt-1">{errors.address}</div>
        )}
      </div>

      <div>
        <input
          type="text"
          name="pincode"
          value={extraData.pincode || ""}
          onChange={handleExtraChange}
          onBlur={handleExtraChange}
          placeholder="Pin Code (6 digits)"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#586330] ${
            touched.pincode && errors.pincode ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
          maxLength={6}
        />
        {touched.pincode && errors.pincode && (
          <div className="text-red-500 text-sm mt-1">{errors.pincode}</div>
        )}
      </div>
    </div>
  );
}