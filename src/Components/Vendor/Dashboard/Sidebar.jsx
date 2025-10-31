import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ handleLogout, activeView }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      name: "Dashboard", 
      iconColor: "bg-gray-400", 
      path: "/vendor-dashboard",
      key: 'dashboard'
    },
    { 
      name: "Products", 
      iconColor: "bg-gray-400", 
      path: "/products",
      key: 'products'
    },
    { 
      name: "Customers", 
      iconColor: "bg-gray-400", 
      path: "/customers",
      key: 'customers'
    },
    { 
      name: "Invoices", 
      iconColor: "bg-gray-400", 
      path: "/invoices",
      key: 'invoices'
    },
    { 
      name: "Payments", 
      iconColor: "bg-gray-400", 
      path: "/payments",
      key: 'payments'
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Default logout function if not provided
  const defaultLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tempUserData');
    navigate('/');
  };

  // Use provided handleLogout or default one
  const logoutFunction = handleLogout || defaultLogout;

  // Determine if a menu item is active
  const isActive = (menuItem) => {
    // For dashboard, check both activeView prop and current path
    if (activeView) {
      return activeView === menuItem.key;
    }
    // For other pages, check current path
    return location.pathname === menuItem.path;
  };

  return (
    <div className="w-64 bg-green-100 flex flex-col">
      <div className="p-4 border-b border-pink-200">
        <h1 className="text-xl font-bold text-green-800">Dealsy</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const active = isActive(item);
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                active 
                  ? 'bg-green-200 text-green-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span 
                className={`w-5 h-5 rounded transition-colors ${
                  active ? 'bg-green-600' : item.iconColor
                }`}
              ></span>
              <span className={active ? 'font-semibold' : ''}>{item.name}</span>
            </button>
          );
        })}

        <button
          onClick={logoutFunction}
          className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg w-full text-left"
        >
          <span className="w-5 h-5 bg-gray-400 rounded"></span>
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;