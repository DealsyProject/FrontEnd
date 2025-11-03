import React, { useState } from "react";
import axios from "axios";
import CustomerExtraForm from "../../Components/customer/Registration/CustomerExtraForm";
import VendorExtraForm from "../../Components/Vendor/Registration/VendorExtraForm";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: 3, // default as customer
  });

  const [extraData, setExtraData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ✅ handle basic inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "role" ? Number(value) : value,
    });
  };

  // ✅ handle nested extra data
  const handleExtraChange = (e) => {
    const { name, value } = e.target;
    setExtraData({
      ...extraData,
      [name]: value,
    });
  };

  // ✅ handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      ...formData,
      vendorDetails: formData.role === 2 ? extraData : null,
      customerDetails: formData.role === 3 ? extraData : null,
    };

    try {
      setIsLoading(true);
      const response = await axios.post("https://localhost:7062/api/Auth/register", payload);
      setSuccessMsg("Registration successful! Please log in.");
      console.log("✅ Registration success:", response.data);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        role: 3,
      });
      setExtraData({});
    } catch (error) {
      console.error("❌ Registration error:", error);
      setErrorMsg(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1920)",
      }}
    >
      <div className="bg-white bg-opacity-90 p-5 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#586330] mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
            required
          />

          {/* Phone Number */}
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
            required
          />

          {/* Role Selection */}
          <div className="flex justify-around mt-4">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="radio"
                name="role"
                value="3"
                checked={formData.role === 3}
                onChange={handleChange}
                className="text-[#586330] focus:ring-[#586330]"
              />
              Customer
            </label>

            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="radio"
                name="role"
                value="2"
                checked={formData.role === 2}
                onChange={handleChange}
                className="text-[#586330] focus:ring-[#586330]"
              />
              Vendor
            </label>
          </div>

          {/* Conditional Fields */}
          {formData.role === 3 && (
            <CustomerExtraForm
              extraData={extraData}
              handleExtraChange={handleExtraChange}
              isLoading={isLoading}
            />
          )}
          {formData.role === 2 && (
            <VendorExtraForm
              extraData={extraData}
              handleExtraChange={handleExtraChange}
              isLoading={isLoading}
            />
          )}

          {/* Error & Success */}
          {errorMsg && (
            <p className="text-red-600 text-center text-sm">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-green-600 text-center text-sm">{successMsg}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#586330] hover:bg-[#495628] text-white font-medium py-3 rounded-lg transition duration-200"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
