import React, { useState } from "react";
import { Plus, RefreshCw, Minus, Search, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import CountUp from "react-countup";
import Navbar from "../../Components/Admin/Navbar.jsx";

export default function AdminDashboard() {
  const [stats] = useState([
    { label: "Revenue", value: 250000 },
    { label: "Vendors", value: 250 },
    { label: "Customers", value: 150 },
    { label: "Customer Bills", value: 120000 },
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

  const handleAddProduct = () => alert("Add Product Clicked!");
  const handleRefresh = () => alert("Data Refreshed!");
  const handleRemove = () => alert("Product Removed!");
  const handleFilter = (filterType) => setActiveFilter(filterType);

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-12">
        <Navbar />

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
          <h2 className="text-3xl font-semibold mb-4 sm:mb-0 text-emerald-700">Dashboard</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleAddProduct} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition">
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 transition">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={handleRemove} className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm hover:bg-rose-600 transition">
              <Minus className="w-4 h-4" /> Remove
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 hover:shadow-md transition">
              <div className="text-gray-500 text-sm mb-2">{stat.label}</div>
              <div className="text-3xl font-bold text-emerald-700">
                <CountUp end={stat.value} duration={1.5} separator="," />
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Sales Overview */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
              <h3 className="text-xl font-semibold text-emerald-700">Sales Overview</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleFilter("12months")} className={`px-3 py-1 rounded-full text-xs sm:text-sm ${activeFilter==="12months" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                  Last 12 Months
                </button>
                <button onClick={() => handleFilter("30days")} className={`px-3 py-1 rounded-full text-xs sm:text-sm ${activeFilter==="30days" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                  Last 30 Days
                </button>
                <button onClick={() => handleFilter("7days")} className={`px-3 py-1 rounded-full text-xs sm:text-sm ${activeFilter==="7days" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                  Last 7 Days
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sales Trend */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-medium text-gray-700 mb-2">Sales Trend</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', color: '#000' }} />
                    <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top Selling */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-medium text-gray-700 mb-2">Top Selling Products</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', color: '#000' }} />
                    <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-emerald-700">Recent Activity</h3>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button className="flex items-center p-2 bg-gray-100 rounded text-gray-600 hover:bg-emerald-50 text-xs sm:text-sm">
                <Search className="w-4 h-4 mr-2 text-emerald-500" /> Date Range <ArrowRight className="w-3 h-3 ml-2 text-emerald-500" />
              </button>
              <button className="flex items-center p-2 bg-gray-100 rounded text-gray-600 hover:bg-emerald-50 text-xs sm:text-sm">
                Activity Type <ArrowRight className="w-3 h-3 ml-2 text-emerald-500" />
              </button>
            </div>

            {/* Activity List */}
            <div className="overflow-y-auto flex-1 space-y-4">
              {activities.map((activity, idx) => ( 
                <div key={idx} className="flex gap-4 items-start">
                  <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${activity.type === "add" ? "bg-emerald-100" : activity.type==="refresh" ? "bg-sky-100" : "bg-rose-100"}`}>
                    {activity.type === "add" && <Plus className="w-5 h-5 text-emerald-600" />}
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
