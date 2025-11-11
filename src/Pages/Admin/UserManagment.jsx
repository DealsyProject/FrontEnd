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

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'customer': return 'text-[#586330]';
      case 'vendor': return 'text-[#586330]';
      case 'support staff': return 'text-[#586330]';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'text-[#586330]' : 'text-gray-600';
  };

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
    <div className="min-h-screen w-full bg-gray-100 text-gray-900 font-sans">
      <Navbar />
      <main className="pt-24 px-4 sm:px-6 lg:px-12 pb-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">User Management</h2>
          <p className="text-gray-500 text-xs sm:text-sm">
            Manage all user types including vendors, customers, and support staff.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#586330] focus:border-[#586330] shadow-sm"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#586330] focus:border-[#586330] shadow-sm"
          >
            <option value="All">All Roles</option>
            <option value="Customer">Customer</option>
            <option value="Vendor">Vendor</option>
            <option value="Support Staff">Support Staff</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#586330] focus:border-[#586330] shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

        
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto shadow-lg">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
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
                  <tr
                    key={user.id}
                    className={`${index !== filteredUsers.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-gray-50 transition-colors`}
                  >
                    <td className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                      <div>
                        <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{user.name}</div>
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
                        <button className="p-2 bg-transparent hover:bg-gray-200 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4 text-gray-500 hover:text-[#586330]" />
                        </button>
                        <button className="p-2 bg-transparent hover:bg-gray-200 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-gray-500 hover:text-[#586330]" />
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
                  <td colSpan="5" className="text-center text-gray-500 py-10">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
