import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Components/utils/axiosInstance';

const VendorRegister = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyOwnerName: '',
    companyEmail: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (!token || !user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    const userData = JSON.parse(user);
    
    // Fix: Check for both string 'Vendor' and numeric 2
    if (userData.role !== 'Vendor' && userData.role !== 2) {
      toast.error('Only vendors can access this page');
      navigate('/');
      return;
    }

    // Optional: If vendor registration is already complete, redirect to dashboard
    if (userData.isRegistrationComplete) {
      toast.info('Vendor registration already completed');
      navigate('/vendor-dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.companyName.trim() || 
        !formData.companyOwnerName.trim() || 
        !formData.companyEmail.trim() || 
        !formData.location.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axiosInstance.post('/api/auth/register-vendor', formData);

      if (response.status === 200) {
        toast.success('Vendor registration completed successfully!');
        
        // Update user registration status
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const updatedUser = {
          ...user,
          isRegistrationComplete: true
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Remove temporary data
        localStorage.removeItem('tempUserData');
        
        // Navigate to dashboard after success
        setTimeout(() => {
          navigate('/vendor-dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Vendor registration error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Vendor registration failed';
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-400 to-indigo-00 "></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="px-8 py-6">
          <h1 className="text-4xl font-bold text-indigo-600">Dealsy</h1>
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold text-indigo-400 mb-6 text-center">
              Complete Vendor Registration
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
              <div>
                <label htmlFor="vendor-companyName" className="sr-only">
                  Company Name
                </label>
                <input
                  type="text"
                  id="vendor-companyName"
                  name="companyName"
                  placeholder="Enter Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                  autoComplete="organization"
                />
              </div>
              
              <div>
                <label htmlFor="vendor-companyOwnerName" className="sr-only">
                  Company Owner Name
                </label>
                <input
                  type="text"
                  id="vendor-companyOwnerName"
                  name="companyOwnerName"
                  placeholder="Enter Company Owner Name"
                  value={formData.companyOwnerName}
                  onChange={handleChange}
                  className="w-full px-4 py-2  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                  autoComplete="name"
                />
              </div>
              
              <div>
                <label htmlFor="vendor-companyEmail" className="sr-only">
                  Company Email
                </label>
                <input
                  type="email"
                  id="vendor-companyEmail"
                  name="companyEmail"
                  placeholder="Enter Company Email"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              
              <div>
                <label htmlFor="vendor-location" className="sr-only">
                  Location
                </label>
                <input
                  type="text"
                  id="vendor-location"
                  name="location"
                  placeholder="Enter Location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                  autoComplete="address-level2"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-500 hover:bg-indigo text-white py-3 px-4 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-[#6B4E4E] transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </form>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegister;