import React, { useState, useEffect } from "react";
import axiosInstance from "../../Components/utils/axiosInstance.js";
import Navbar from "../../Components/Admin/Navbar.jsx";

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardCounts, setDashboardCounts] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    activeCustomers: 0,
    blockedCustomers: 0,
  });

  // Fetch customers list
  const fetchCustomers = async () => {
    try {
      const res = await axiosInstance.get("/Admin/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to fetch customers.");
    }
    setLoading(false);
  };

  // Fetch dashboard counts
  const fetchDashboardCounts = async () => {
    try {
      const [totalRes, activeRes, blockedRes] = await Promise.all([
        axiosInstance.get("/Admin/total-customers"),
        axiosInstance.get("/Admin/active-customers"),
        axiosInstance.get("/Admin/blocked-customers"),
      ]);

      setDashboardCounts({
        totalUsers: totalRes.data,
        totalCustomers: totalRes.data,
        activeCustomers: activeRes.data,
        blockedCustomers: blockedRes.data,
      });
    } catch (err) {
      console.error("Error fetching dashboard counts:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchDashboardCounts();
  }, []);

  // Toggle block/unblock customer
  const handleToggle = async (customer) => {
    try {
      const userId = customer.UserId;
      if (!userId) return alert("Customer UserId not found!");

      const url = customer.IsBlocked
        ? `/Admin/unblock/${userId}`
        : `/Admin/block/${userId}`;

      await axiosInstance.put(url);

      // Optimistically update UI
      setCustomers((prev) =>
        prev.map((c) =>
          c.UserId === userId ? { ...c, IsBlocked: !c.IsBlocked } : c
        )
      );

      await fetchDashboardCounts();
    } catch (err) {
      console.error("Error updating customer status:", err);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 w-full">
      <Navbar />

      <main className="pt-24 px-6 sm:px-12 lg:px-20">
        <h1 className="text-3xl font-bold mb-6">Customers List</h1>

        {/* Dashboard counts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-sm font-medium">Total Customers</p>
            <p className="text-xl font-bold">{dashboardCounts.totalCustomers}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-sm font-medium">Active Customers</p>
            <p className="text-xl font-bold text-green-600">
              {dashboardCounts.activeCustomers}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-sm font-medium">Blocked Customers</p>
            <p className="text-xl font-bold text-red-600">
              {dashboardCounts.blockedCustomers}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 shadow-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading customers...
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-300 shadow-xl overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100">
                  <th className="px-6 py-4 text-left">Full Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Created On</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {customers.length > 0 ? (
                  customers.map((c, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 transition-colors ${
                        index !== customers.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4">{c.FullName}</td>
                      <td className="px-6 py-4">{c.Email}</td>
                      <td className="px-6 py-4">{c.PhoneNumber}</td>

                      <td className="px-6 py-4">
                        {c.CreatedOn
                          ? new Date(c.CreatedOn).toLocaleDateString()
                          : "Invalid Date"}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            c.IsBlocked
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {c.IsBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggle(c)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium shadow-md transition ${
                            c.IsBlocked
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                        >
                          {c.IsBlocked ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
