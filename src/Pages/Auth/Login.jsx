import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../Components/utils/axiosInstance';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!formData.password) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password
      });

      const { data } = response;

      if (response.status === 200) {
        console.log('Login response:', data); // Debug log

        // CORRECTED: Store authentication data with proper field names
        localStorage.setItem('authToken', data.Token); // Note: 'Token' with capital T
        localStorage.setItem(
          'currentUser',
          JSON.stringify({
            userId: data.UserId, // Capital U
            fullName: data.FullName, // Capital F
            email: data.Email, // Capital E
            role: data.Role, // Capital R
            isRegistrationComplete: data.IsRegistrationComplete, // Capital I
            vendorId: data.VendorId || data.vendorId // Include vendorId if available
          })
        );

        toast.success('Login successful!');

        setTimeout(() => {
          const role = data.Role?.toString().toLowerCase();

          if (role === 'vendor') {
            if (data.IsRegistrationComplete) {
              navigate('/vendor-dashboard', { replace: true });
            } else {
              navigate('/vendor-register', { replace: true });
            }
          } else if (role === 'customer') {
            if (data.IsRegistrationComplete) {
              navigate('/', { replace: true });
            } else {
              navigate('/customer-register', { replace: true });
            }
          } else if (role === 'supportteam') {
            navigate('/support-custemervenderdetails', { replace: true });
          } else if (role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        toast.error(error.response.data?.message || 'Login failed');
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Login failed. Please try again.');
      }
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
            'url(https://images.pexels.com/photos-1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1920)',
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
              <h2 className="text-2xl font-semibold text-[#586330]/70 mb-2">
                Login Here
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#586330]/70 hover:bg-[#586330]/80 text-white py-3 px-4 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Submit'}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Not Yet Registered?{' '}
                <Link
                  to="/register"
                  className="text-[#586330]/70 hover:text-[#586330]/90 font-medium"
                >
                  Register Now
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

export default Login;