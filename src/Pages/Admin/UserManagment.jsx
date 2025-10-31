import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';


import Navbar from '../../Components/Admin/Navbar.jsx';

export default function UserManagement() {
  const [users] = useState([
    { id: 1, name: 'Sophia Clark', email: 'sophia.clark@email.com', userId: '12345', role: 'Customer', status: 'Active' },
    { id: 2, name: 'Ethan Bennett', email: 'ethan.bennett@email.com', userId: '67890', role: 'Vendor', status: 'Active' },
    { id: 3, name: 'Olivia Carter', email: 'olivia.carter@email.com', userId: '11223', role: 'Support Staff', status: 'Active' },
    { id: 4, name: 'Liam Harper', email: 'liam.harper@email.com', userId: '33445', role: 'Customer', status: 'Inactive' }
  ]);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Helper function to return role-specific color classes for the light theme
  const getRoleColor = (role) => {
    switch(role.toLowerCase()) {
      case 'customer': return 'text-blue-600';
      case 'vendor': return 'text-purple-600';
      case 'support staff': return 'text-cyan-600';
      default: return 'text-gray-600';
    }
  };

  // Helper function to return status-specific color classes for the light theme
  const getStatusColor = (status) => {
    return status === 'Active' ? 'text-green-600' : 'text-gray-600';
  };

  // Filtered users logic remains the same
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.userId.includes(search);
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    // LIGHT THEME: Main background is light gray, main text is dark gray
    <div className="min-h-screen w-full bg-gray-100 text-gray-900 font-sans">
      <Navbar />
      <main className="pt-24 px-4 sm:px-6 lg:px-12 pb-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">User Management</h2>
          {/* Secondary text color */}
          <p className="text-gray-500 text-xs sm:text-sm">Manage all user types including vendors, customers, and support staff.</p>
        </div>

        {/* Search + Filters + Add User */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Search Input */}
          <div className="flex-1 relative">
            {/* Search icon uses secondary text color */}
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              // LIGHT THEME: White background, light border, dark text
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            // LIGHT THEME: White background, light border, dark text
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="All">All Roles</option>
            <option value="Customer">Customer</option>
            <option value="Vendor">Vendor</option>
            <option value="Support Staff">Support Staff</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            // LIGHT THEME: White background, light border, dark text
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Add User Button - Primary EMERALD GREEN accent */}
          <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/30">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>

        {/* Users Table */}
        {/* LIGHT THEME: White surface, light border */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto shadow-lg">
          <table className="w-full min-w-[640px]">
            <thead>
              {/* LIGHT THEME: Light gray header background */}
              <tr className="border-b border-gray-200 bg-gray-50">
                {/* Secondary text color for headers */}
                <th className="text-left px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="text-left px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  // LIGHT THEME: Light border, light hover
                  <tr key={user.id} className={`${index !== filteredUsers.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-gray-50 transition-colors`}>
                    <td className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                      <div>
                        {/* Main text color */}
                        <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{user.name}</div>
                        {/* Secondary text color for email */}
                        <div className="text-xs sm:text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 text-gray-600 text-sm sm:text-base">{user.userId}</td>
                    <td className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                      <span className={`font-medium text-sm sm:text-base ${getRoleColor(user.role)}`}>{user.role}</span>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                      <span className={`font-medium text-sm sm:text-base ${getStatusColor(user.status)}`}>{user.status}</span>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                      <div className="flex items-center justify-end gap-2">
                        {/* Action buttons - light gray background on hover */}
                        <button className="p-2 bg-transparent hover:bg-gray-200 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                        </button>
                        <button className="p-2 bg-transparent hover:bg-gray-200 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-gray-500 hover:text-blue-500" />
                        </button>
                        <button className="p-2 bg-transparent hover:bg-gray-200 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-10">No users found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
