import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between px-6 py-4">
      
      {/* Menu Button */}
      <button onClick={toggleMenu} className="text-slate-400 hover:text-white">
        <Menu className="w-6 h-6" />
      </button>

      {/* Logo / Title */}
      <h1 className="text-xl font-semibold ml-2">Marketplace Admin</h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-8 text-sm text-slate-400">
        <Link to="/admin" className="hover:text-white">Dashboard</Link>
        <Link to="/productPage" className="hover:text-white">Products</Link>
        <Link to="/orders" className="hover:text-white">Orders</Link>
        <Link to="/user" className="hover:text-white">Customers</Link>
        <Link to="/ChatSupport" className="hover:text-white">Chat Support</Link>
        <Link to="/Transaction" className="hover:text-white">Transactions</Link>
        <Link to="/Vendors" className="hover:text-white">Vendors</Link>
        <Link to="/product-returns" className="hover:text-white">Product Returns</Link>
        <Link to="/support-team" className="hover:text-white">Support Team</Link>
      </nav>

      {/* User/Bell/Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-700"></div>
      </div>

      {/* Sidebar (Mobile Menu) */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-slate-900 text-white flex flex-col p-6 z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-400 hover:text-white">Menu</h2>
          <button onClick={toggleMenu} className="text-xl font-semibold">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 overflow-y-auto flex-1">
          <Link onClick={toggleMenu} to="/admin" className="py-3 px-4 text-lg hover:bg-slate-800 rounded-lg">Dashboard</Link>
          <Link onClick={toggleMenu} to="/productPage" className="py-3 px-4 text-lg hover:bg-slate-800 rounded-lg">Products</Link>
          <Link onClick={toggleMenu} to="/orders" className="py-3 px-4 text-lg hover:bg-slate-800 rounded-lg">Orders</Link>
          <Link onClick={toggleMenu} to="/user" className="py-3 px-4 text-lg hover:bg-slate-800 rounded-lg">Customers</Link>
          <Link onClick={toggleMenu} to="/ChatSupport" className="py-3 px-4 text-lg hover:bg-slate-800 rounded-lg">Chat Support</Link>
          <Link onClick={toggleMenu} to="/Transaction" className="py-3 px-4 text-lg hover:bg-slate-800 rounded-lg">Transactions</Link>
          <Link onClick={toggleMenu} to="/Vendors" className="py-3 px-4 text-lg hover:bg-slate-800 rounded-lg">Vendors</Link>
          <Link onClick={toggleMenu} to="/product-returns" className="py-3 px-4 text-lg hover:bg-slate-800 rounded-lg">Product Returns</Link>
          <Link onClick={toggleMenu} to="/support-team" className="py-3 px-4 text-lg hover:bg-slate-800 rounded-lg">Support Team</Link>
        </nav>
      </div>
    </header>
  );
}
