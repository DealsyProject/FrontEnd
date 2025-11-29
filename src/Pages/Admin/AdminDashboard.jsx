import React, { useState, useEffect } from "react";
import { Plus, RefreshCw, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import CountUp from "react-countup";
import axios from "axios";
import Navbar from "../../Components/Admin/Navbar.jsx";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Revenue", value: 250000 },
    { label: "Vendors", value: 0 },
    { label: "Customers", value: 0 },
    { label: "Support", value: 0 },
  ]);

  const [activities] = useState([
    { type: "add", title: "New Product Added", description: '"Vintage Leather Bag" was added by Vendor1', time: "2 hours ago" },
    { type: "refresh", title: "Support Ticket resolved", description: "Ticket #12345 regarding a payment issue was resolved", time: "3 hours ago" },
    { type: "remove", title: "Product Removed", description: '"Old Chair" was removed by Vendor2', time: "5 hours ago" },
  ]);

  const [chartData] = useState([
    { month: "Jan", sales: 30000 },
    { month: "Feb", sales: 50000 },
    { month: "Mar", sales: 40000 },
    { month: "Apr", sales: 60000 },
    { month: "May", sales: 50000 },
    { month: "Jun", sales: 70000 },
    { month: "Jul", sales: 65000 },
    { month: "Aug", sales: 80000 },
    { month: "Sep", sales: 75000 },
    { month: "Oct", sales: 90000 },
    { month: "Nov", sales: 85000 },
    { month: "Dec", sales: 100000 },
  ]);

  const [activeFilter, setActiveFilter] = useState("12months");
  const [loading, setLoading] = useState(true);

  // Fetch active vendors, customers and support counts
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/plain",
        },
      };

      // --- CRITICAL CHANGE HERE ---
      // Changed "total-Support" to "active-support" to use the new backend endpoint
      const [activeVendorsRes, activeCustomersRes, activeSupportRes] = await Promise.all([
        axios.get("https://localhost:7001/api/Admin/active-vendors", config),
        axios.get("https://localhost:7001/api/Admin/active-customers", config),
        axios.get("https://localhost:7001/api/Admin/active-support", config), // <-- FIXED
      ]);

      const totalVendors = parseInt(activeVendorsRes.data, 10) || 0;
      const totalCustomers = parseInt(activeCustomersRes.data, 10) || 0;
      // Renamed variable from totalSupportRes to activeSupportRes for clarity/consistency
      const totalSupport = parseInt(activeSupportRes.data, 10) || 0; 

      setStats((prev) =>
        prev.map((stat) => {
          if (stat.label === "Vendors") return { ...stat, value: totalVendors };
          if (stat.label === "Customers") return { ...stat, value: totalCustomers };
          if (stat.label === "Support") return { ...stat, value: totalSupport };
          return stat;
        })
      );

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        localStorage.removeItem("authToken");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFilter = (filterType) => setActiveFilter(filterType);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-12">
        <Navbar />

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
          <h2 className="text-3xl font-semibold mb-4 sm:mb-0" style={{ color: "#586330" }}>
            Dashboard
          </h2>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 hover:shadow-md transition">
              <div className="text-gray-500 text-sm mb-2">{stat.label}</div>
              <div className="text-3xl font-bold" style={{ color: "#586330" }}>
                <CountUp end={stat.value} duration={1.5} separator="," />
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sales Overview */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <h3 className="text-xl font-semibold" style={{ color: "#586330" }}>Sales Overview</h3>
              <div className="flex flex-wrap gap-2">
                {["12months", "30days", "7days"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilter(filter)}
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm ${activeFilter === filter ? "text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    style={activeFilter === filter ? { backgroundColor: "#586330" } : {}}
                  >
                    {filter === "12months" ? "Last 12 Months" : filter === "30days" ? "Last 30 Days" : "Last 7 Days"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-medium text-gray-700 mb-2">Sales Trend</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.5rem", color: "#000" }}
                    />
                    <Line type="monotone" dataKey="sales" stroke="#586330" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold" style={{ color: "#586330" }}>Recent Activity</h3>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4">
              {activities.map((activity, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div
                    className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${
                      activity.type === "add"
                        ? "bg-gray-100"
                        : activity.type === "refresh"
                        ? "bg-sky-100"
                        : "bg-rose-100"
                    }`}
                  >
                    {activity.type === "add" && <Plus className="w-5 h-5" style={{ color: "#586330" }} />}
                    {activity.type === "refresh" && <RefreshCw className="w-5 h-5 text-sky-600" />}
                    {activity.type === "remove" && <Minus className="w-5 h-5 text-rose-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-800 mb-1">{activity.title}</h4>
                    <p className="text-gray-500 text-xs mb-1">{activity.description}</p>
                    <span className="text-gray-400 text-xs">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}