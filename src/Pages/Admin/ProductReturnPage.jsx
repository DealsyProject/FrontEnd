import React, { useState } from "react";
import { Search, Plus, Trash2, Eye } from 'lucide-react';
import Navbar from "../../Components/Admin/Navbar.jsx"; 

export default function ProductReturnPage() {
  const [returns, setReturns] = useState([
    { id: 1, product: "Wireless Keyboard", customer: "John Doe", reason: "Defective", date: "2025-10-28" },
    { id: 2, product: "Gaming Mouse Pad", customer: "Sarah Lee", reason: "Wrong Item", date: "2025-10-27" },
    { id: 3, product: "4K Monitor 27in", customer: "David Smith", reason: "Damaged", date: "2025-10-26" },
    { id: 4, product: "Ergonomic Chair", customer: "Alice Johnson", reason: "Other", date: "2025-10-25" },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewItem, setViewItem] = useState(null);
  const [toast, setToast] = useState("");

  const getReasonColor = (reason) => {
    switch (reason) {
      case 'Defective': return 'text-red-700 bg-red-100 border border-red-200';
      case 'Damaged': return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
      case 'Wrong Item': return 'text-blue-700 bg-blue-100 border border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border border-gray-200';
    }
  };

  const handleDelete = (id) => {
    setReturns(returns.filter((r) => r.id !== id));
    showToast("🗑️ Return deleted!");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const filteredReturns = returns.filter((r) => {
    const matchesSearch =
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || r.reason === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 pt-20 relative font-sans">
      <div className="max-w-6xl mx-auto">
        <Navbar />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800">Product Returns Dashboard</h1>
            <p className="text-gray-500 text-md mt-1">
              Manage, view, and process returned products efficiently.
            </p>
          </div>
        </div>

        {/* 🔍 Search & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 min-w-[200px] sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              placeholder="Search by Product or Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl p-3 pl-12 text-md text-gray-900 focus:ring-2 focus:ring-[#586330] outline-none w-full shadow-md transition-shadow"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-xl p-3 text-md text-gray-700 focus:ring-2 focus:ring-[#586330] outline-none shadow-md appearance-none"
          >
            <option value="All">Filter by Reason (All)</option>
            <option value="Defective">Defective</option>
            <option value="Damaged">Damaged</option>
            <option value="Wrong Item">Wrong Item</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* 🔽 Table */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-md">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm border-b border-gray-200">
              <tr>
                <th className="py-4 px-6 text-left">ID</th>
                <th className="py-4 px-6 text-left">Product</th>
                <th className="py-4 px-6 text-left">Customer</th>
                <th className="py-4 px-6 text-left">Reason</th>
                <th className="py-4 px-6 text-left">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.length > 0 ? (
                filteredReturns.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-gray-200 hover:bg-[#e5e9d3] transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-600">{r.id}</td>
                    <td className="py-4 px-6 font-medium text-gray-900">{r.product}</td>
                    <td className="py-4 px-6">{r.customer}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getReasonColor(r.reason)} shadow-sm`}>
                        {r.reason}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{r.date}</td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <button
                        onClick={() => setViewItem(r)}
                        className="bg-white hover:bg-gray-100 text-[#586330] border border-gray-300 px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-colors"
                      >
                        <Eye className="w-4 h-4 inline mr-1 -mt-0.5" /> View
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4 inline mr-1 -mt-0.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-gray-500 py-10 text-md"
                  >
                    🔍 No returns match the current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-gray-500 text-md">
          Showing <span className="text-[#586330] font-bold">{filteredReturns.length}</span> of{" "}
          <span className="text-[#586330] font-bold">{returns.length}</span> total returns processed.
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 bg-[#586330] text-white px-5 py-3 rounded-xl shadow-2xl text-md font-medium animate-in fade-in slide-in-from-bottom-4 duration-500 z-50">
          {toast}
        </div>
      )}

      {viewItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-2xl border border-gray-200 w-full max-w-sm shadow-2xl text-gray-900">
            <h3 className="text-2xl font-extrabold mb-5 text-[#586330]">Return Details</h3>

            <div className="space-y-3 text-md">
              <p className="flex justify-between border-b pb-2">
                <strong className="text-gray-600">ID:</strong> <span className="font-mono bg-gray-50 px-2 py-1 rounded">{viewItem.id}</span>
              </p>
              <p className="flex justify-between"><strong className="text-gray-600">Product:</strong> {viewItem.product}</p>
              <p className="flex justify-between"><strong className="text-gray-600">Customer:</strong> {viewItem.customer}</p>
              <p className="flex justify-between"><strong className="text-gray-600">Reason:</strong> {viewItem.reason}</p>
              <p className="flex justify-between"><strong className="text-gray-600">Date Logged:</strong> {viewItem.date}</p>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setViewItem(null)}
                className="bg-[#586330] hover:bg-[#4b572a] text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
