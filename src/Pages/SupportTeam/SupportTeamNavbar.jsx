import  { useState } from 'react';

function SupportTeamNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTicketCount] = useState(4);
  const [userOnline] = useState(true);

 
 const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    console.log('Logging out...');
    navigate("/");
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="flex justify-between items-center px-5 h-16 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center">
          
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <a 
           
            className="relative flex items-center gap-2 px-3 py-2 text-2xl font-bold text-blue-600 bg-blue-50 rounded-lg transition-colors hover:bg-blue-100"
          >
            SupportTeam 
            {activeTicketCount > 0 && (
              <span className="flex items-center justify-center min-w-6 h-6 px-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                {activeTicketCount}
              </span>
            )}
          </a>
          
          <a 
            href="/support-helpcenter" 
            className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg transition-colors hover:text-gray-900 hover:bg-gray-100"
          >
            Helpcenter
          </a>
          
          <a 
            href="/support-custemervenderdetails" 
            className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg transition-colors hover:text-gray-900 hover:bg-gray-100"
          >
           CustemerVenderDetails
          </a>
          
          <a 
            href="/support-returnrefundtracker" 
            className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg transition-colors hover:text-gray-900 hover:bg-gray-100"
          >
              RefundandReturn 
          </a>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="text-lg">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Chat Icon */}
        <button className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          {/* <span className="text-lg"></span> */}
                    <a 
            href="/support-helpcenter" 
            className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg transition-colors hover:text-gray-900 hover:bg-gray-100"
          >
            💬
          </a>
        </button>
        
        {/* User Profile */}
        <div className="relative">
          <div 
            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={toggleDropdown}
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                SU
              </div>
              {/* Online Status Indicator */}
              <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                userOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
            </div>
            
            {/* User Info */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">Support Agent</p>
              <p className="text-xs text-gray-500">admin@company.com</p>
            </div>
            
            {/* Dropdown Arrow */}
            <svg 
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                My Profile
              </div>
              <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                Settings
              </div>
              <div className="border-t border-gray-200 my-1"></div>
              <div 
                className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default SupportTeamNavbar;