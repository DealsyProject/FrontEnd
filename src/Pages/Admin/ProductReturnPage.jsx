import React, { useState } from "react";
import { Search, Plus, Trash2, Eye } from 'lucide-react';
import Navbar from "../../Components/Admin/Navbar.jsx"; 

export default function ProductReturnPage() {
  // Updated mock data for better demonstration
  const [returns, setReturns] = useState([
    { id: 1, product: "Wireless Keyboard", customer: "John Doe", reason: "Defective", date: "2025-10-28" },
    { id: 2, product: "Gaming Mouse Pad", customer: "Sarah Lee", reason: "Wrong Item", date: "2025-10-27" },
    { id: 3, product: "4K Monitor 27in", customer: "David Smith", reason: "Damaged", date: "2025-10-26" },
    { id: 4, product: "Ergonomic Chair", customer: "Alice Johnson", reason: "Other", date: "2025-10-25" },
  ]);

  const [newReturn, setNewReturn] = useState({ product: "", customer: "", reason: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewItem, setViewItem] = useState(null);
  const [toast, setToast] = useState("");

  // Helper for status tag colors
  const getReasonColor = (reason) => {
    switch (reason) {
      case 'Defective': return 'text-red-700 bg-red-100 border border-red-200';
      case 'Damaged': return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
      case 'Wrong Item': return 'text-blue-700 bg-blue-100 border border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border border-gray-200';
    }
  };

  // ✅ Add Return
  const handleAddReturn = () => {
    if (!newReturn.product || !newReturn.customer || !newReturn.reason) {
      showToast("⚠️ Please fill all fields!");
      return;
    }

    const newEntry = {
      ...newReturn,
      id: returns.length + 1,
      date: new Date().toISOString().slice(0, 10),
    };

    setReturns([...returns, newEntry]);
    setNewReturn({ product: "", customer: "", reason: "" });
    showToast("✅ New return added successfully!");
  };

  // ✅ Delete Return
  const handleDelete = (id) => {
    setReturns(returns.filter((r) => r.id !== id));
    showToast("🗑️ Return deleted!");
  };

  // ✅ Toast Handler
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // ✅ Filtering logic (search + filter)
  const filteredReturns = returns.filter((r) => {
    const matchesSearch =
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || r.reason === filter;

    return matchesSearch && matchesFilter;
  });

  // New primary color: indigo-600
  const primaryColor = "indigo-600";
  const hoverColor = "indigo-700";
  const accentColor = "indigo-50";
  const focusRing = "indigo-500";

  return (
    // Updated padding now that the fixed Navbar is gone (pt-12 instead of pt-28)
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 pt-20 relative font-sans">
      <div className="max-w-6xl mx-auto">
        <Navbar />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800">Product Returns Dashboard</h1>
            <p className="text-gray-500 text-md mt-1">
              Manage, view, and process returned products efficiently.
            </p>
          </div>
          <button
            onClick={handleAddReturn}
            // Primary button color changed to indigo
            className={`bg-${primaryColor} hover:bg-${hoverColor} text-white px-5 py-3 rounded-xl shadow-lg font-semibold flex items-center gap-2 transition-transform transform hover:scale-[1.02]`}
          >
            <Plus className="w-5 h-5" /> Log New Return
          </button>
        </div>

        {/* Add Return Form - Enhanced Card Styling */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Quick Entry</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <input
              placeholder="Product Name"
              value={newReturn.product}
              onChange={(e) => setNewReturn({ ...newReturn, product: e.target.value })}
              // Input styling changed to indigo focus ring
              className={`bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-${focusRing} outline-none shadow-inner transition-shadow`}
            />
            <input
              placeholder="Customer Name"
              value={newReturn.customer}
              onChange={(e) => setNewReturn({ ...newReturn, customer: e.target.value })}
              // Input styling changed to indigo focus ring
              className={`bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-${focusRing} outline-none shadow-inner transition-shadow`}
            />
            <select
              value={newReturn.reason}
              onChange={(e) => setNewReturn({ ...newReturn, reason: e.target.value })}
              // Select styling changed to indigo focus ring
              className={`bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-700 focus:ring-2 focus:ring-${focusRing} outline-none shadow-inner appearance-none transition-shadow`}
            >
              <option value="">Select Reason</option>
              <option value="Defective">Defective</option>
              <option value="Damaged">Damaged</option>
              <option value="Wrong Item">Wrong Item</option>
              <option value="Other">Other</option>
            </select>
            <button
              onClick={handleAddReturn}
              // Button color changed to indigo
              className={`bg-${primaryColor} hover:bg-${hoverColor} text-white rounded-lg px-4 py-3 font-semibold shadow-md transition-colors`}
            >
              <Plus className="w-4 h-4 inline mr-1 -mt-0.5" /> Submit
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 min-w-[200px] sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              placeholder="Search by Product or Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              // Search input styling changed to indigo focus ring
              className={`bg-white border border-gray-300 rounded-xl p-3 pl-12 text-md text-gray-900 focus:ring-2 focus:ring-${focusRing} outline-none w-full shadow-md transition-shadow`}
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            // Filter select styling changed to indigo focus ring
            className={`bg-white border border-gray-300 rounded-xl p-3 text-md text-gray-700 focus:ring-2 focus:ring-${focusRing} outline-none shadow-md appearance-none`}
          >
            <option value="All">Filter by Reason (All)</option>
            <option value="Defective">Defective</option>
            <option value="Damaged">Damaged</option>
            <option value="Wrong Item">Wrong Item</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-md">
            {/* Table Header styling changed */}
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
                    // Row hover effect changed to indigo accent
                    className={`border-t border-gray-200 hover:bg-${accentColor} transition-colors`}
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
                        // Action button styling changed to indigo
                        className={`bg-white hover:bg-gray-100 text-${primaryColor} border border-gray-300 px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-colors`}
                      >
                        <Eye className="w-4 h-4 inline mr-1 -mt-0.5" /> View
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        // Action button styling remains red for delete
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
                    🔍 No returns match the current criteria. Try adjusting the search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-8 text-gray-500 text-md">
          Showing <span className={`text-${primaryColor} font-bold`}>{filteredReturns.length}</span> of{" "}
          <span className={`text-${primaryColor} font-bold`}>{returns.length}</span> total returns processed.
        </div>
      </div>

      {/* Toast - Changed background to indigo accent */}
      {toast && (
        <div className={`fixed bottom-8 right-8 bg-${primaryColor} text-white px-5 py-3 rounded-xl shadow-2xl text-md font-medium animate-in fade-in slide-in-from-bottom-4 duration-500 z-50`}>
          {toast}
        </div>
      )}

      {/* Modal - Updated to new theme and styling */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-2xl border border-gray-200 w-full max-w-sm shadow-2xl text-gray-900 transform transition-all scale-100 animate-in zoom-in-95 duration-300">
            <h3 className={`text-2xl font-extrabold mb-5 text-${primaryColor}`}>Return Details</h3>
            <div className="space-y-3 text-md">
                <p className="flex justify-between items-center border-b pb-2"><strong className="text-gray-600">ID:</strong> <span className="font-mono bg-gray-50 px-2 py-1 rounded">{viewItem.id}</span></p>
                <p className="flex justify-between items-center"><strong className="text-gray-600">Product:</strong> <span className="font-medium">{viewItem.product}</span></p>
                <p className="flex justify-between items-center"><strong className="text-gray-600">Customer:</strong> <span className="font-medium">{viewItem.customer}</span></p>
                <p className="flex justify-between items-center"><strong className="text-gray-600">Reason:</strong> <span className={`font-medium ${getReasonColor(viewItem.reason).split(' ')[0]}`}>{viewItem.reason}</span></p>
                <p className="flex justify-between items-center"><strong className="text-gray-600">Date Logged:</strong> <span className="text-gray-700">{viewItem.date}</span></p>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setViewItem(null)}
                // Button color changed to indigo
                className={`bg-${primaryColor} hover:bg-${hoverColor} text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg`}
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
