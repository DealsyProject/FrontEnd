import React, { useState } from "react";
import axios from "axios";
import CustomerExtraForm from "../../Components/customer/Registration/CustomerExtraForm";
import VendorExtraForm from "../../Components/Vendor/Registration/VendorExtraForm";
import { Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: 3,
  });

  const [extraData, setExtraData] = useState({}); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "role" ? Number(value) : value,
    });
  };

  const handleExtraChange = (e) => {
    const { name, value } = e.target;
    setExtraData({
      ...extraData,
      [name]: value,
    });
  };

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
      const response = await axios.post(
        "https://localhost:7001/api/Auth/register",
        payload
      );
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
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1920)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#586330]/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* ✅ Top-left logo */}
        <div className="px-8 py-6">
          <h1 className="text-4xl font-bold text-[#586330]">Dealsy</h1>
        </div>

        {/* Form Container */}
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4 -mt-12">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Form */}
            <div>
              <h2 className="text-xl font-semibold text-center text-[#586330]/80 mb-4">
                Create an Account
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3 text-gray-900">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
                  required
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
                  required
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
                  required
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
                  required
                />

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

                {errorMsg && (
                  <p className="text-red-600 text-center text-sm">{errorMsg}</p>
                )}
                {successMsg && (
                  <p className="text-green-600 text-center text-sm">
                    {successMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#586330]/80 hover:bg-[#586330]/90 text-white font-semibold py-3 rounded-full shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>

                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-[#586330]/70 hover:text-[#586330]/90 font-medium"
                    >
                      Login Now
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Right Form - Extra Details */}
            <div className="border-l border-gray-200 pl-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
