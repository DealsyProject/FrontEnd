import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import CustomerExtraForm from "../../Components/customer/Registration/CustomerExtraForm";
import VendorExtraForm from "../../Components/Vendor/Registration/VendorExtraForm";
import { Link } from "react-router-dom";

export default function Register() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      role: 3,
      // Vendor details
      companyName: "",
      companyOwnerName: "",
      companyEmail: "",
      location: "",
      // Customer details
      address: "",
      pincode: ""
    },
    validate: (values) => {
      const errors = {};

      // Basic info validation (matches backend)
      if (!values.fullName.trim()) {
        errors.fullName = "Full name is required";
      }

      if (!values.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email format";
      }

      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      } else if (!/[A-Z]/.test(values.password)) {
        errors.password = "Password must contain at least one uppercase letter";
      } else if (!/[0-9]/.test(values.password)) {
        errors.password = "Password must contain at least one number";
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (!values.phoneNumber.trim()) {
        errors.phoneNumber = "Phone number is required";
      }

      // Vendor-specific validation
      if (values.role === 2) {
        if (!values.companyName.trim()) {
          errors.companyName = "Company name is required";
        } else if (values.companyName.length < 2 || values.companyName.length > 200) {
          errors.companyName = "Company name must be between 2 and 200 characters";
        }

        if (!values.companyOwnerName.trim()) {
          errors.companyOwnerName = "Company owner name is required";
        } else if (values.companyOwnerName.length < 2 || values.companyOwnerName.length > 100) {
          errors.companyOwnerName = "Company owner name must be between 2 and 100 characters";
        }

        if (!values.companyEmail.trim()) {
          errors.companyEmail = "Company email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.companyEmail)) {
          errors.companyEmail = "Invalid company email format";
        }

        if (!values.location.trim()) {
          errors.location = "Location is required";
        } else if (values.location.length < 2 || values.location.length > 200) {
          errors.location = "Location must be between 2 and 200 characters";
        }
      }

      // Customer-specific validation
      if (values.role === 3) {
        if (!values.address.trim()) {
          errors.address = "Address is required";
        }

        if (!values.pincode.trim()) {
          errors.pincode = "Pincode is required";
        } else if (!/^\d{5,6}$/.test(values.pincode)) {
          errors.pincode = "Invalid pincode format (5-6 digits)";
        }
      }

      return errors;
    },
    onSubmit: async (values) => {
      setErrorMsg("");
      setSuccessMsg("");

      const payload = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        phoneNumber: values.phoneNumber,
        role: values.role
      };

      // Add role-specific details
      if (values.role === 2) {
        payload.vendorDetails = {
          companyName: values.companyName,
          companyOwnerName: values.companyOwnerName,
          companyEmail: values.companyEmail,
          location: values.location
        };
      } else if (values.role === 3) {
        payload.customerDetails = {
          address: values.address,
          pincode: values.pincode
        };
      }

      try {
        setIsLoading(true);
        const response = await axios.post(
          "https://localhost:7001/api/Auth/register",
          payload
        );
        setSuccessMsg("Registration successful! Please log in.");
        console.log("✅ Registration success:", response.data);
        formik.resetForm();
      } catch (error) {
        console.error("❌ Registration error:", error);
        setErrorMsg(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  });

  const handleRoleChange = (e) => {
    const roleValue = Number(e.target.value);
    formik.setFieldValue("role", roleValue);
  };

  const handleExtraChange = (e) => {
    const { name, value } = e.target;
    formik.setFieldValue(name, value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

              <form onSubmit={formik.handleSubmit} className="space-y-3 text-gray-900">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Full Name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#586330] ${
                      formik.touched.fullName && formik.errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.fullName}</div>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Email"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#586330] ${
                      formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                  )}
                </div>

                {/* Password Field with Eye Icon */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Password"
                    className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-[#586330] ${
                      formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {/* Eye Icon for Password */}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                  )}
                </div>

                {/* Confirm Password Field with Eye Icon */}
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Confirm Password"
                    className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-[#586330] ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {/* Eye Icon for Confirm Password */}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleConfirmPasswordVisibility}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Phone Number"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#586330] ${
                      formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</div>
                  )}
                </div>

                {/* Role Selection */}
                <div className="flex justify-around mt-4">
                  <label className="flex items-center gap-2 text-gray-700">
                    <input
                      type="radio"
                      name="role"
                      value="3"
                      checked={formik.values.role === 3}
                      onChange={handleRoleChange}
                      className="text-[#586330] focus:ring-[#586330]"
                    />
                    Customer
                  </label>

                  <label className="flex items-center gap-2 text-gray-700">
                    <input
                      type="radio"
                      name="role"
                      value="2"
                      checked={formik.values.role === 2}
                      onChange={handleRoleChange}
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
                  disabled={isLoading || !formik.isValid}
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
              {formik.values.role === 3 && (
                <CustomerExtraForm
                  extraData={{
                    address: formik.values.address,
                    pincode: formik.values.pincode
                  }}
                  handleExtraChange={handleExtraChange}
                  isLoading={isLoading}
                  errors={formik.errors}
                  touched={formik.touched}
                />
              )}
              {formik.values.role === 2 && (
                <VendorExtraForm
                  extraData={{
                    companyName: formik.values.companyName,
                    companyOwnerName: formik.values.companyOwnerName,
                    companyEmail: formik.values.companyEmail,
                    location: formik.values.location
                  }}
                  handleExtraChange={handleExtraChange}
                  isLoading={isLoading}
                  errors={formik.errors}
                  touched={formik.touched}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}