import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className=" bg-gradient-to-b from-indigo-600 to-indigo-300 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Dealsy</h4>
            <p className="text-gray-300 text-sm">
              Your trusted partner for connecting with verified customers and growing your business.
            </p>
          </div>
          
          {/* Quick Links Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-white transition duration-200">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition duration-200">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition duration-200">Contact</Link></li>
            </ul>
          </div>
          
          {/* Account Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/login" className="hover:text-white transition duration-200">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition duration-200">Register</Link></li>
              <li><Link to="/vendor-register" className="hover:text-white transition duration-200">Become a Vendor</Link></li>
            </ul>
          </div>
          
          {/* Contact Info Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: support@dealsy.com</li>
              <li>Phone: +91 9876543210</li>
              <li>Address: India</li>
            </ul>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-300">
          <p>&copy; 2024 Dealsy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;