import React, { useState } from "react";
import Navbar from '../../Components/Admin/Navbar.jsx';

export default function ProductReturnPage() {
  const [returns, setReturns] = useState([
    { id: 1, product: "Keyboard", customer: "John Doe", reason: "Defective", date: "2025-10-28" },
    { id: 2, product: "Mouse", customer: "Sarah Lee", reason: "Wrong Item", date: "2025-10-27" },
    { id: 3, product: "Monitor", customer: "David Smith", reason: "Damaged", date: "2025-10-26" },
  ]);

  const [newReturn, setNewReturn] = useState({ product: "", customer: "", reason: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewItem, setViewItem] = useState(null);
  const [toast, setToast] = useState("");

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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 pt-28 relative">
      <div className="max-w-6xl mx-auto">
        <Navbar />
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Product Returns</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage, view, and track returned products efficiently.
            </p>
          </div>
          <button
            onClick={handleAddReturn}
            className="bg-gradient-to-r from-indigo-600 to-indigo-400 hover:from-indigo-500 hover:to-indigo-300 text-white px-5 py-2 rounded-lg shadow-md font-medium"
          >
            + Add Return
          </button>
        </div>

        {/* Add Return Form */}
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              placeholder="Product Name"
              value={newReturn.product}
              onChange={(e) => setNewReturn({ ...newReturn, product: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              placeholder="Customer Name"
              value={newReturn.customer}
              onChange={(e) => setNewReturn({ ...newReturn, customer: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <select
              value={newReturn.reason}
              onChange={(e) => setNewReturn({ ...newReturn, reason: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select Reason</option>
              <option value="Defective">Defective</option>
              <option value="Damaged">Damaged</option>
              <option value="Wrong Item">Wrong Item</option>
              <option value="Other">Other</option>
            </select>
            <button
              onClick={handleAddReturn}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2 font-medium shadow"
            >
              Add
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <input
            placeholder="Search by Product or Customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-2 px-4 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none flex-1"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="All">All Reasons</option>
            <option value="Defective">Defective</option>
            <option value="Damaged">Damaged</option>
            <option value="Wrong Item">Wrong Item</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Reason</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.length > 0 ? (
                filteredReturns.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-slate-800 hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="py-3 px-4">{r.id}</td>
                    <td className="py-3 px-4">{r.product}</td>
                    <td className="py-3 px-4">{r.customer}</td>
                    <td className="py-3 px-4">{r.reason}</td>
                    <td className="py-3 px-4 text-slate-400">{r.date}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setViewItem(r)}
                        className="bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1 rounded-lg text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-slate-400 py-6 text-sm"
                  >
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 text-slate-400 text-sm">
          Showing <span className="text-white font-medium">{filteredReturns.length}</span> of{" "}
          <span className="text-white font-medium">{returns.length}</span> returns.
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-bounce">
          {toast}
        </div>
      )}

      {/* Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Return Details</h3>
            <p><strong>Product:</strong> {viewItem.product}</p>
            <p><strong>Customer:</strong> {viewItem.customer}</p>
            <p><strong>Reason:</strong> {viewItem.reason}</p>
            <p><strong>Date:</strong> {viewItem.date}</p>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewItem(null)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
