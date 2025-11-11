import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  // Light green header: bg-green-50, dark text, light border
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-green-50 text-gray-900 border-b border-green-200 shadow-sm flex items-center justify-between px-6 py-4">
      
      {/* Menu Button */}
      {/* Icon is dark gray, hover is vibrant green */}
      <button onClick={toggleMenu} className="text-gray-600 hover:text-green-700 transition-colors">
        <Menu className="w-6 h-6" />
      </button>

      {/* Logo / Title (Darker text for prominence) */}
      <h1 className="text-xl font-bold ml-2 text-green-900">Marketplace Admin</h1>

      {/* Desktop Navigation */}
      {/* Default links are medium gray, hover is vibrant green */}
      <nav className="hidden md:flex gap-8 text-sm text-gray-600 font-medium">
        <Link to="/admin" className="hover:text-green-700 transition-colors">Dashboard</Link>
        <Link to="/productPage" className="hover:text-green-700 transition-colors">Products</Link>
        <Link to="/orders" className="hover:text-green-700 transition-colors">Orders</Link>
        <Link to="/user" className="hover:text-green-700 transition-colors">Customers</Link>
        <Link to="/ChatSupport" className="hover:text-green-700 transition-colors">Chat Support</Link>
        <Link to="/Transaction" className="hover:text-green-700 transition-colors">Transactions</Link>
        <Link to="/Vendors" className="hover:text-green-700 transition-colors">Vendors</Link>
        <Link to="/product-returns" className="hover:text-green-700 transition-colors">Product Returns</Link>
        <Link to="/support-team" className="hover:text-green-700 transition-colors">Support Team</Link>
      </nav>

      {/* User/Bell/Avatar - Light green circle */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-green-200 border-2 border-green-300"></div>
      </div>

      {/* Sidebar (Mobile Menu) */}
      {/* Sidebar background is white, links use light green hover */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white text-gray-900 flex flex-col p-6 z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-500 font-semibold">MENU</h2>
          {/* Close button icon is dark, hover is vibrant green */}
          <button onClick={toggleMenu} className="text-gray-600 hover:text-green-700 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links - Light green hover effect */}
        <nav className="flex flex-col gap-1 overflow-y-auto flex-1">
          <Link onClick={toggleMenu} to="/admin" className="py-3 px-4 text-lg text-gray-800 hover:bg-green-100 rounded-lg transition-colors">Dashboard</Link>
          <Link onClick={toggleMenu} to="/productPage" className="py-3 px-4 text-lg text-gray-800 hover:bg-green-100 rounded-lg transition-colors">Products</Link>
          <Link onClick={toggleMenu} to="/orders" className="py-3 px-4 text-lg text-gray-800 hover:bg-green-100 rounded-lg transition-colors">Orders</Link>
          <Link onClick={toggleMenu} to="/user" className="py-3 px-4 text-lg text-gray-800 hover:bg-green-100 rounded-lg transition-colors">Customers</Link>
          <Link onClick={toggleMenu} to="/ChatSupport" className="py-3 px-4 text-lg text-gray-800 hover:bg-green-100 rounded-lg transition-colors">Chat Support</Link>
          <Link onClick={toggleMenu} to="/Transaction" className="py-3 px-4 text-lg text-gray-800 hover:bg-green-100 rounded-lg transition-colors">Transactions</Link>
          <Link onClick={toggleMenu} to="/Vendors" className="py-3 px-4 text-lg text-gray-800 hover:bg-green-100 rounded-lg transition-colors">Vendors</Link>
          <Link onClick={toggleMenu} to="/product-returns" className="py-3 px-4 text-lg text-gray-800 hover:bg-green-100 rounded-lg transition-colors">Product Returns</Link>
          <Link onClick={toggleMenu} to="/support-team" className="py-3 px-4 text-lg text-gray-800 hover:bg-green-100 rounded-lg transition-colors">Support Team</Link>
        </nav>
      </div>
    </header>
  );
}
