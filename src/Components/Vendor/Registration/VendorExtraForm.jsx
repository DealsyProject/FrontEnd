import React from "react";

export default function VendorExtraForm({ extraData, handleExtraChange, isLoading, errors, touched }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-[#586330] text-center">
        Vendor Details
      </h3>

      <div>
        <input
          type="text"
          name="companyName"
          value={extraData.companyName || ""}
          onChange={handleExtraChange}
          onBlur={handleExtraChange}
          placeholder="Company Name"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#586330] ${
            touched.companyName && errors.companyName ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {touched.companyName && errors.companyName && (
          <div className="text-red-500 text-sm mt-1">{errors.companyName}</div>
        )}
      </div>

      <div>
        <input
          type="text"
          name="companyOwnerName"
          value={extraData.companyOwnerName || ""}
          onChange={handleExtraChange}
          onBlur={handleExtraChange}
          placeholder="Owner Name"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#586330] ${
            touched.companyOwnerName && errors.companyOwnerName ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {touched.companyOwnerName && errors.companyOwnerName && (
          <div className="text-red-500 text-sm mt-1">{errors.companyOwnerName}</div>
        )}
      </div>

      <div>
        <input
          type="email"
          name="companyEmail"
          value={extraData.companyEmail || ""}
          onChange={handleExtraChange}
          onBlur={handleExtraChange}
          placeholder="Company Email"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#586330] ${
            touched.companyEmail && errors.companyEmail ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {touched.companyEmail && errors.companyEmail && (
          <div className="text-red-500 text-sm mt-1">{errors.companyEmail}</div>
        )}
      </div>

      <div>
        <input
          type="text"
          name="location"
          value={extraData.location || ""}
          onChange={handleExtraChange}
          onBlur={handleExtraChange}
          placeholder="Location"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#586330] ${
            touched.location && errors.location ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {touched.location && errors.location && (
          <div className="text-red-500 text-sm mt-1">{errors.location}</div>
        )}
      </div>
    </div>
  );
}