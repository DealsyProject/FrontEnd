import React from "react";
import { Link } from "react-router-dom";

function NavbarSupport() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo / Title */}
        <h1 className="text-xl font-bold tracking-wide"> Deasly Support Team</h1>

        {/* Menu Links */}
        <ul className="flex space-x-8 text-sm font-medium">
          <li>
            <Link
              to="/support-custemervenderdetails"
              className="hover:text-yellow-300 transition duration-200"
            >
              Customer/Vendor Details
            </Link>
          </li>
          <li>
            <Link
              to="/support-helpcenter"
              className="hover:text-yellow-300 transition duration-200"
            >
              Help Center
            </Link>
          </li>
          <li>
            <Link
              to="/support-returnrefundtracker"
              className="hover:text-yellow-300 transition duration-200"
            >
              Return Tracker
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavbarSupport;
