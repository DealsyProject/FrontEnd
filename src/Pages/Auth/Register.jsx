import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!formData.password) {
      toast.error('Please enter your password');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!formData.role) {
      toast.error('Please select a role');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://localhost:7001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phoneNumber: formData.phoneNumber.trim(),
          role: parseInt(formData.role) // Convert to number for enum
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Registration successful as ${formData.role === '2' ? 'Vendor' : 'Customer'}!`);
        
        // Store temporary user data
        const userData = {
          userId: data.userId,
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: parseInt(formData.role)
        };

        localStorage.setItem('tempUserData', JSON.stringify(userData));
        
        // Navigate based on role
        setTimeout(() => {
          if (formData.role === '2') { // Vendor
            navigate('/vendor-register');
          } else { // Customer
            navigate('/customer-register');
          }
        }, 2000);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with overlay - same as other components */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#586330]/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="px-8 py-6">
          <h1 className="text-4xl font-bold text-[#586330]">Dealsy</h1>
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-[#586330] mb-2">Who Are You?</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330] focus:border-transparent"
                  placeholder="Full Name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330] focus:border-transparent"
                  placeholder="Email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330] focus:border-transparent"
                  placeholder="Password"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330] focus:border-transparent"
                  placeholder="Confirm Password"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330] focus:border-transparent"
                  placeholder="Phone Number"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 text-center">Are You A Customer Or Vendor</p>
                <div className="flex justify-center gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="2"
                      onChange={handleChange}
                      className="mr-2 text-[#586330]0 focus:ring-[#586330]"
                      required
                      disabled={isLoading}
                    />
                    Vendor
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="3"
                      onChange={handleChange}
                      className="mr-2 text-[#586330]0 focus:ring-[#586330]"
                      required
                      disabled={isLoading}
                    />
                    Customer
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Link
                  to="/login"
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition duration-200 font-medium text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#586330]/70 hover:bg-[#586330] text-white py-3 px-4 rounded-lg transition duration-200 font-medium disabled:opacity-50 shadow-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-[#586330]/70 hover:text-[#586330]/90 font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;