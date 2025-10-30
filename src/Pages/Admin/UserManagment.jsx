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
    switch(role.toLowerCase()) {
      case 'customer': return 'text-blue-500';
      case 'vendor': return 'text-purple-500';
      case 'support staff': return 'text-cyan-500';
      default: return 'text-slate-500';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'text-green-500' : 'text-slate-500';
  };

  // Filtered users
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
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <Navbar />
      <main className="pt-24 px-4 sm:px-6 lg:px-12 pb-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-2">User Management</h2>
          <p className="text-cyan-400 text-xs sm:text-sm">Manage all user types including vendors, customers, and support staff.</p>
        </div>

        {/* Search + Filters + Add User */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
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
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Add User Button */}
          <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                <th className="text-left px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-xs font-semibold text-slate-300 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-xs font-semibold text-slate-300 uppercase tracking-wider">User ID</th>
                <th className="text-left px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-xs font-semibold text-slate-300 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-950">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className={`${index !== filteredUsers.length - 1 ? 'border-b border-slate-800' : ''} hover:bg-slate-900/50 transition-colors`}>
                    <td className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                      <div>
                        <div className="font-medium text-white mb-1 text-sm sm:text-base">{user.name}</div>
                        <div className="text-xs sm:text-sm text-slate-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 text-slate-300 text-sm sm:text-base">{user.userId}</td>
                    <td className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                      <span className={`font-medium text-sm sm:text-base ${getRoleColor(user.role)}`}>{user.role}</span>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                      <span className={`font-medium text-sm sm:text-base ${getStatusColor(user.status)}`}>{user.status}</span>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4 text-slate-400 hover:text-white" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-slate-400 hover:text-white" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-slate-500 py-10">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
