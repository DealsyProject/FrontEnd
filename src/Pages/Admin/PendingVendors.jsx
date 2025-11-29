import React, { useState, useEffect } from "react";
import axiosInstance from "../../Components/utils/axiosInstance.js";
import Navbar from "../../Components/Admin/Navbar.jsx";

export default function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardCounts, setDashboardCounts] = useState({
    totalVendors: 0,
    activeVendors: 0,
    blockedVendors: 0,
  });

  // Fetch vendors
  const fetchVendors = async () => {
    try {
      const res = await axiosInstance.get("/Admin/vendors");
      setVendors(res.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError("Failed to fetch vendors.");
    }
    setLoading(false);
  };

  // Fetch vendor dashboard counts
  const fetchDashboardCounts = async () => {
    try {
      const [totalVendorsRes, activeVendorsRes, blockedVendorsRes] =
        await Promise.all([
          axiosInstance.get("/Admin/total-vendors"),
          axiosInstance.get("/Admin/active-vendors"),
          axiosInstance.get("/Admin/blocked-vendors"),
        ]);

      setDashboardCounts({
        totalVendors: totalVendorsRes.data,
        activeVendors: activeVendorsRes.data,
        blockedVendors: blockedVendorsRes.data,
      });
    } catch (err) {
      console.error("Error fetching vendor dashboard counts:", err);
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchDashboardCounts();
  }, []);

  // Block / Unblock vendor
  const handleToggle = async (vendor) => {
    try {
      const userId = vendor.UserId;
      if (!userId) return alert("Vendor UserId not found!");

      if (vendor.IsBlocked) {
        await axiosInstance.put(`/Admin/unblock/${userId}`);
      } else {
        await axiosInstance.put(`/Admin/block/${userId}`);
      }

      await fetchVendors();
      await fetchDashboardCounts();
    } catch (err) {
      console.error("Error blocking/unblocking:", err);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 w-full">
      <Navbar />

      <main className="pt-24 px-6 sm:px-12 lg:px-20">
        <h1 className="text-3xl font-bold mb-6">Vendors List</h1>

        {/* Dashboard counts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-sm font-medium">Total Vendors</p>
            <p className="text-xl font-bold">{dashboardCounts.totalVendors}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-sm font-medium">Active Vendors</p>
            <p className="text-xl font-bold text-green-600">
              {dashboardCounts.activeVendors}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-sm font-medium">Blocked Vendors</p>
            <p className="text-xl font-bold text-red-600">
              {dashboardCounts.blockedVendors}
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
            Loading vendors...
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-300 shadow-xl overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100">
                  <th className="px-6 py-4 text-left">Full Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Company Name</th>
                  <th className="px-6 py-4 text-left">Created On</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {vendors.length > 0 ? (
                  vendors.map((v, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 transition-colors ${
                        index !== vendors.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4">{v.FullName}</td>
                      <td className="px-6 py-4">{v.Email}</td>
                      <td className="px-6 py-4">{v.PhoneNumber}</td>
                      <td className="px-6 py-4">{v.CompanyName}</td>

                      <td className="px-6 py-4">
                        {v.CreatedOn
                          ? new Date(v.CreatedOn).toLocaleDateString()
                          : "Invalid Date"}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            v.IsBlocked
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {v.IsBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggle(v)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium shadow-md transition ${
                            v.IsBlocked
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                        >
                          {v.IsBlocked ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-10 text-gray-500"
                    >
                      No vendors found.
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
