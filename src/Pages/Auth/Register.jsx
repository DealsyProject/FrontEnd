import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerExtraForm from "../../Components/Customer/Registration/CustomerExtraForm";
import VendorExtraForm from "../../Components/Vendor/Registration/VendorExtraForm";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "3",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showExtraForm, setShowExtraForm] = useState(false);
  const [registeredRole, setRegisteredRole] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) return toast.error("Please enter your full name");
    if (!formData.email.trim()) return toast.error("Please enter your email");
    if (!formData.password) return toast.error("Please enter your password");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");
    if (!formData.phoneNumber.trim()) return toast.error("Please enter your phone number");

    setIsLoading(true);
    try {
      const response = await fetch("https://localhost:7001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phoneNumber: formData.phoneNumber.trim(),
          role: parseInt(formData.role),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(
          `Registration successful as ${formData.role === "2" ? "Vendor" : "Customer"}!`
        );

        localStorage.setItem(
          "tempUserData",
          JSON.stringify({
            userId: data.userId,
            fullName: formData.fullName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            role: parseInt(formData.role),
          })
        );

        setRegisteredRole(parseInt(formData.role));
        setShowExtraForm(true);
        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }, 400);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1920)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#586330]/80"></div>
      </div>

      <div className="relative z-10">
        <div className="px-8 py-6">
          <h1 className="text-4xl font-bold text-[#586330]">Dealsy</h1>
        </div>

        {/* MAIN REGISTER FORM */}
        <div className="flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-[#586330] mb-2">
                Who Are You?
              </h2>
            </div>

            {!showExtraForm && (
              <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
                  disabled={isLoading}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
                  disabled={isLoading}
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
                  disabled={isLoading}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
                  disabled={isLoading}
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330]"
                  disabled={isLoading}
                />

                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 text-center">
                    Are You A Customer Or Vendor
                  </p>
                  <div className="flex justify-center gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="3"
                        checked={formData.role === "3"}
                        onChange={handleChange}
                        className="mr-2 text-[#586330]"
                      />
                      Customer
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="2"
                        checked={formData.role === "2"}
                        onChange={handleChange}
                        className="mr-2 text-[#586330]"
                      />
                      Vendor
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Link
                    to="/login"
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-[#586330]/70 hover:bg-[#586330] text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 shadow-lg"
                  >
                    {isLoading ? "Registering..." : "Confirm"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* CONDITIONAL EXTRA FORMS */}
        {showExtraForm && registeredRole === 3 && <CustomerExtraForm navigate={navigate} />}
        {showExtraForm && registeredRole === 2 && <VendorExtraForm navigate={navigate} />}
      </div>

      <ToastContainer />
    </div>
  );
}
