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
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-12">

        <Navbar />

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
          <h2 className="text-3xl font-semibold mb-4 sm:mb-0">Dashboard</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleAddProduct} className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg text-sm hover:bg-green-700 transition">
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 transition">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={handleRemove} className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg text-sm hover:bg-red-700 transition">
              <Minus className="w-4 h-4" /> Remove
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-slate-700 transition">
              <div className="text-slate-400 text-sm mb-2">{stat.label}</div>
              <div className="text-3xl font-bold">
                <CountUp end={stat.value} duration={1.5} separator="," />
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Sales Overview */}
          <div className="lg:col-span-2 bg-slate-900 rounded-lg border border-slate-800 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
              <h3 className="text-xl font-semibold">Sales Overview</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleFilter("12months")} className={`px-3 py-1 rounded-full text-xs sm:text-sm ${activeFilter==="12months" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>Last 12 Months</button>
                <button onClick={() => handleFilter("30days")} className={`px-3 py-1 rounded-full text-xs sm:text-sm ${activeFilter==="30days" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>Last 30 Days</button>
                <button onClick={() => handleFilter("7days")} className={`px-3 py-1 rounded-full text-xs sm:text-sm ${activeFilter==="7days" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>Last 7 Days</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sales Trend */}
              <div className="bg-slate-950 rounded-lg p-6 border border-slate-800">
                <h4 className="text-lg font-medium mb-2">Sales Trend</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem', color: '#fff' }} />
                    <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top Selling */}
              <div className="bg-slate-950 rounded-lg p-6 border border-slate-800">
                <h4 className="text-lg font-medium mb-2">Top Selling Products</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem', color: '#fff' }} />
                    <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Recent Activity</h3>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button className="flex items-center p-2 bg-slate-800 rounded text-slate-400 hover:bg-slate-700 text-xs sm:text-sm">
                <Search className="w-4 h-4 mr-2" /> Date Range <ArrowRight className="w-3 h-3 ml-2" />
              </button>
              <button className="flex items-center p-2 bg-slate-800 rounded text-slate-400 hover:bg-slate-700 text-xs sm:text-sm">
                Activity Type <ArrowRight className="w-3 h-3 ml-2" />
              </button>
            </div>

            {/* Activity List */}
            <div className="overflow-y-auto flex-1 space-y-4">
              {activities.map((activity, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${activity.type === "add" ? "bg-green-500/20" : activity.type==="refresh" ? "bg-blue-500/20" : "bg-red-500/20"}`}>
                    {activity.type === "add" && <Plus className="w-5 h-5 text-green-500" />}
                    {activity.type === "refresh" && <RefreshCw className="w-5 h-5 text-blue-500" />}
                    {activity.type === "remove" && <Minus className="w-5 h-5 text-red-500" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{activity.title}</h4>
                    <p className="text-slate-400 text-xs mb-1">{activity.description}</p>
                    <span className="text-slate-500 text-xs">{activity.time}</span>
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
