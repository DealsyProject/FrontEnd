import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import Navbar from '../../Components/Admin/Navbar.jsx';

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [orders] = useState([
    { id: 'ORD1234', date: '2024-05-25', customer: 'Jack Fred', vendor: 'Tech Gadgets', total: '$2,024', status: 'shipped' },
    { id: 'ORD2134', date: '2024-05-25', customer: 'Ted Clarke', vendor: 'Laevuvel Co.', total: '$225', status: 'delivered' },
    { id: 'ORD245', date: '2024-05-25', customer: 'Rean Joseph', vendor: 'GTech Comp', total: '$2,000', status: 'processing' },
    { id: 'ORD278', date: '2024-05-25', customer: 'Kia Melvin', vendor: 'Speaker King', total: '$2,000', status: 'shipped' },
    { id: 'ORD098', date: '2024-05-25', customer: 'Hevish', vendor: 'IBM', total: '$205', status: 'delivered' },
    { id: 'ORD827', date: '2024-05-25', customer: 'Clinton', vendor: 'Home Decor', total: '$2,000', status: 'processing' }
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'shipped':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.vendor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesFromDate = !fromDate || order.date >= fromDate;
    const matchesToDate = !toDate || order.date <= toDate;
    return matchesSearch && matchesStatus && matchesFromDate && matchesToDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans w-full">
      <Navbar />

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 sm:px-12 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-emerald-600">Marketplace Dashboard</h1>
      </div>

      <main className="pb-16 pt-8 px-6 sm:px-12 lg:px-20">
        <div className="mb-2">
          <h2 className="text-3xl sm:text-4xl font-semibold text-emerald-700">Orders</h2>
          <p className="text-gray-500 text-sm mt-1">Manage and track all marketplace orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8 mt-6 shadow-md">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 relative min-w-full sm:min-w-0">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID, customer, or vendor"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-11 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition shadow-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 shadow-sm"
              >
                <option value="All">All Status</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="processing">Processing</option>
              </select>

              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 shadow-sm"
              />

              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 shadow-sm"
              />

              <button
                onClick={() => { setSearch(''); setStatusFilter('All'); setFromDate(''); setToDate(''); }}
                className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm transition shadow-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200 bg-emerald-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-emerald-700 uppercase tracking-wider">Order ID</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-emerald-700 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-emerald-700 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-emerald-700 uppercase tracking-wider">Vendor</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-emerald-700 uppercase tracking-wider">Total</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-emerald-700 uppercase tracking-wider">Status</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-emerald-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={`${index !== filteredOrders.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-emerald-50 transition`}
                  >
                    <td className="px-6 py-4 font-medium text-emerald-700">{order.id}</td>
                    <td className="text-center px-6 py-4 text-gray-600">{order.date}</td>
                    <td className="px-6 py-4 text-gray-800">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-600">{order.vendor}</td>
                    <td className="text-center px-6 py-4 text-gray-900 font-medium">{order.total}</td>
                    <td className="text-center px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="text-center px-6 py-4">
                      <button
                        title="View Details"
                        className="p-2 bg-gray-100 hover:bg-emerald-100 rounded-full transition group"
                      >
                        <Eye className="w-4 h-4 text-gray-500 group-hover:text-emerald-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500 text-lg">
                    No orders found.
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
