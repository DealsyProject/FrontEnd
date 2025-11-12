import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#586330] text-white border-b border-[#4b572a] shadow-md flex items-center justify-between px-6 py-4">
      
      {/* Menu Button */}
      <button onClick={toggleMenu} className="text-white hover:text-gray-200 transition-colors">
        <Menu className="w-6 h-6" />
      </button>

      {/* Logo / Title */}
      <h1 className="text-xl font-bold ml-2 text-white">Marketplace Admin</h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-8 text-sm text-gray-100 font-medium">
        <Link to="/admin" className="hover:text-[#d7dcc4] transition-colors">Dashboard</Link>
        <Link to="/productPage" className="hover:text-[#d7dcc4] transition-colors">Products</Link>
        <Link to="/orders" className="hover:text-[#d7dcc4] transition-colors">Orders</Link>
        <Link to="/user" className="hover:text-[#d7dcc4] transition-colors">Customers</Link>
        <Link to="/ChatSupport" className="hover:text-[#d7dcc4] transition-colors">Chat Support</Link>
        <Link to="/Transaction" className="hover:text-[#d7dcc4] transition-colors">Transactions</Link>
        <Link to="/Vendors" className="hover:text-[#d7dcc4] transition-colors">Vendors</Link>
        <Link to="/product-returns" className="hover:text-[#d7dcc4] transition-colors">Product Returns</Link>
        <Link to="/support-team" className="hover:text-[#d7dcc4] transition-colors">Support Team</Link>
      </nav>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#d7dcc4] border-2 border-[#b6bc9e]"></div>
      </div>

      {/* Sidebar (Mobile Menu) */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white text-gray-900 flex flex-col p-6 z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-500 font-semibold">MENU</h2>
          <button onClick={toggleMenu} className="text-gray-600 hover:text-[#586330] transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 overflow-y-auto flex-1">
          <Link onClick={toggleMenu} to="/admin" className="py-3 px-4 text-lg text-gray-800 hover:bg-[#e5e9d3] rounded-lg transition-colors">Dashboard</Link>
          <Link onClick={toggleMenu} to="/productPage" className="py-3 px-4 text-lg text-gray-800 hover:bg-[#e5e9d3] rounded-lg transition-colors">Products</Link>
          <Link onClick={toggleMenu} to="/orders" className="py-3 px-4 text-lg text-gray-800 hover:bg-[#e5e9d3] rounded-lg transition-colors">Orders</Link>
          <Link onClick={toggleMenu} to="/user" className="py-3 px-4 text-lg text-gray-800 hover:bg-[#e5e9d3] rounded-lg transition-colors">Customers</Link>
          <Link onClick={toggleMenu} to="/ChatSupport" className="py-3 px-4 text-lg text-gray-800 hover:bg-[#e5e9d3] rounded-lg transition-colors">Chat Support</Link>
          <Link onClick={toggleMenu} to="/Transaction" className="py-3 px-4 text-lg text-gray-800 hover:bg-[#e5e9d3] rounded-lg transition-colors">Transactions</Link>
          <Link onClick={toggleMenu} to="/Vendors" className="py-3 px-4 text-lg text-gray-800 hover:bg-[#e5e9d3] rounded-lg transition-colors">Vendors</Link>
          <Link onClick={toggleMenu} to="/product-returns" className="py-3 px-4 text-lg text-gray-800 hover:bg-[#e5e9d3] rounded-lg transition-colors">Product Returns</Link>
          <Link onClick={toggleMenu} to="/support-team" className="py-3 px-4 text-lg text-gray-800 hover:bg-[#e5e9d3] rounded-lg transition-colors">Support Team</Link>
        </nav>
      </div>
    </header>
  );
}
