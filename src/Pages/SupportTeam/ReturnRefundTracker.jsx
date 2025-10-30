// src/Pages/SupportTeam/ReturnRefundTracker.jsx
import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search, RefreshCw, Download, Plus, Package, DollarSign, Calendar,
  CheckCircle, Clock, AlertCircle, XCircle, CreditCard, Mail, Phone,
  Filter, TrendingUp, ArrowUpRight, ArrowDownRight, ChevronRight,
  Moon, Sun, MoreVertical, MessageCircle, Users, BarChart3, ShoppingBag,
  Truck, ShieldCheck, MessageSquare, Star, Zap, Bell, Settings,
  ChevronLeft, ChevronDown, Upload, Eye, Edit, Trash2, Copy
} from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";

// Enhanced Sparkline with multiple variants
const Sparkline = ({ data, color, variant = "line" }) => {
  if (variant === "bar") {
    return (
      <ResponsiveContainer width="100%" height={32}>
        <BarChart data={data.map((v, i) => ({ v, index: i }))}>
          <Bar dataKey="v" fill={color} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={data.map(v => ({ v }))}>
        <Line 
          type="monotone" 
          dataKey="v" 
          stroke={color} 
          strokeWidth={2} 
          dot={false}
          strokeLinecap="round"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Priority Indicator Component
const PriorityIndicator = ({ priority, darkMode = false }) => {
  const config = {
    High: { color: "bg-red-500", pulse: "animate-pulse" },
    Medium: { color: "bg-amber-500", pulse: "" },
    Low: { color: "bg-emerald-500", pulse: "" }
  };
  const cfg = config[priority] || config.Medium;
  
  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${cfg.color} ${cfg.pulse}`} />
      <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {priority}
      </span>
    </div>
  );
};

// Enhanced Return Card with more details
function ReturnCard({ item, onClick, viewMode = "grid", darkMode = false }) {
  const statusConfig = {
    Completed: { 
      bg: darkMode ? "bg-emerald-900/30" : "bg-emerald-50", 
      text: darkMode ? "text-emerald-300" : "text-emerald-700", 
      icon: CheckCircle, 
      stroke: "#059669",
      progress: 100
    },
    Processing: { 
      bg: darkMode ? "bg-blue-900/30" : "bg-blue-50", 
      text: darkMode ? "text-blue-300" : "text-blue-700", 
      icon: Clock, 
      stroke: "#2563eb",
      progress: 60
    },
    Pending: { 
      bg: darkMode ? "bg-purple-900/30" : "bg-purple-50", 
      text: darkMode ? "text-purple-300" : "text-purple-700", 
      icon: AlertCircle, 
      stroke: "#7c3aed",
      progress: 30
    },
  };
  
  const cfg = statusConfig[item.refundStatus] || statusConfig.Pending;
  const Icon = cfg.icon;
  
  const trend = [1200, 1300, 1100, 1400, 1250, item.refundAmount, item.refundAmount];
  const daysOpen = differenceInDays(new Date(), parseISO(item.returnDate));

  if (viewMode === "list") {
    return (
      <motion.tr
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'} cursor-pointer transition-colors`}
        onClick={onClick}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={item.productImage}
              alt={item.productName}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.productName}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.id}
              </p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {item.customerName}
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {item.email}
          </p>
        </td>
        <td className="px-6 py-4">
          <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ₹{item.refundAmount.toLocaleString()}
          </p>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text} flex items-center gap-1`}>
              <Icon size={12} /> {item.refundStatus}
            </span>
            <PriorityIndicator priority={item.priority} darkMode={darkMode} />
          </div>
        </td>
        <td className="px-6 py-4">
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {format(parseISO(item.returnDate), "dd MMM yyyy")}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {daysOpen} days open
          </div>
        </td>
        <td className="px-6 py-4">
          <button className={`p-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}>
            <MoreVertical size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
          </button>
        </td>
      </motion.tr>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl shadow-sm border p-5 cursor-pointer group hover:shadow-md transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900' 
          : 'bg-white border-gray-100 hover:shadow-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img
            src={item.productImage}
            alt={item.productName}
            className={`w-12 h-12 rounded-lg object-cover ring-2 transition-all ${
              darkMode 
                ? 'ring-gray-700 group-hover:ring-blue-900' 
                : 'ring-gray-100 group-hover:ring-blue-100'
            }`}
          />
          <div>
            <p className={`font-semibold line-clamp-1 transition-colors ${
              darkMode 
                ? 'text-white group-hover:text-blue-300' 
                : 'text-gray-900 group-hover:text-blue-700'
            }`}>
              {item.productName}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {item.id}
            </p>
          </div>
        </div>
        <button
          onClick={e => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-all p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <MoreVertical size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {item.customerName}
          </span>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {item.productCategory}
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text} flex items-center gap-1`}>
          <Icon size={12} /> {item.refundStatus}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className={`flex justify-between text-xs mb-1 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <span>Progress</span>
          <span>{cfg.progress}%</span>
        </div>
        <div className={`w-full rounded-full h-1.5 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div 
            className={`h-1.5 rounded-full transition-all duration-1000 ${
              cfg.bg.includes('emerald') ? 'bg-emerald-500' :
              cfg.bg.includes('blue') ? 'bg-blue-500' :
              'bg-purple-500'
            }`}
            style={{ width: `${cfg.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ₹{item.refundAmount.toLocaleString()}
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {item.paymentMethod}
          </p>
        </div>
        <div className="w-20">
          <Sparkline data={trend} color={cfg.stroke} />
        </div>
      </div>

      <div className={`flex items-center justify-between text-xs mt-3 ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <div className="flex items-center gap-2">
          <Calendar size={12} />
          <span>{format(parseISO(item.returnDate), "dd MMM")}</span>
        </div>
        <div className="flex items-center gap-2">
          <PriorityIndicator priority={item.priority} darkMode={darkMode} />
          <span>•</span>
          <span>{daysOpen}d</span>
        </div>
      </div>
    </motion.div>
  );
}

// Analytics Chart Component
const AnalyticsChart = ({ data, type = "line", darkMode = false }) => {
  const chartData = [
    { name: 'Jan', returns: 45, refunds: 38, revenue: 125000 },
    { name: 'Feb', returns: 52, refunds: 45, revenue: 142000 },
    { name: 'Mar', returns: 48, refunds: 42, revenue: 138000 },
    { name: 'Apr', returns: 65, refunds: 58, revenue: 165000 },
    { name: 'May', returns: 58, refunds: 52, revenue: 152000 },
    { name: 'Jun', returns: 72, refunds: 65, revenue: 188000 },
  ];

  const textColor = darkMode ? '#d1d5db' : '#374151';
  const gridColor = darkMode ? '#374151' : '#e5e7eb';

  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" tick={{ fill: textColor }} />
          <YAxis tick={{ fill: textColor }} />
          <Tooltip 
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderColor: darkMode ? '#374151' : '#e5e7eb',
              color: textColor
            }}
          />
          <Legend wrapperStyle={{ color: textColor }} />
          <Bar dataKey="returns" fill="#2563eb" radius={[4, 4, 0, 0]} />
          <Bar dataKey="refunds" fill="#7c3aed" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="name" tick={{ fill: textColor }} />
        <YAxis tick={{ fill: textColor }} />
        <Tooltip 
          contentStyle={{
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
            borderColor: darkMode ? '#374151' : '#e5e7eb',
            color: textColor
          }}
        />
        <Legend wrapperStyle={{ color: textColor }} />
        <Line type="monotone" dataKey="returns" stroke="#2563eb" strokeWidth={2} />
        <Line type="monotone" dataKey="refunds" stroke="#7c3aed" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Quick Stats Component
const QuickStats = ({ stats, darkMode }) => {
  const statCards = [
    {
      label: "Total Returns",
      value: stats.total,
      change: "+12%",
      trend: "up",
      icon: ShoppingBag,
      color: "text-blue-600"
    },
    {
      label: "Completed",
      value: stats.completed,
      change: "+8%",
      trend: "up",
      icon: CheckCircle,
      color: "text-emerald-600",
      sub: `${Math.round((stats.completed / stats.total) * 100)}% success rate`
    },
    {
      label: "In Progress",
      value: stats.processing,
      change: "-3%",
      trend: "down",
      icon: Clock,
      color: "text-purple-600"
    },
    {
      label: "Total Refunded",
      value: `₹${stats.totalRefund.toLocaleString()}`,
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "text-indigo-600",
      sub: `Avg ₹${stats.avgRefund} per return`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`rounded-2xl p-5 shadow-sm border hover:shadow-md transition-shadow ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900' 
              : 'bg-white border-gray-100 hover:shadow-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {stat.label}
            </p>
            <div className="flex items-center gap-1">
              <stat.icon size={20} className={stat.color} />
              <span className={`text-xs font-medium ${
                stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
          <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {stat.value}
          </p>
          {stat.sub && (
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {stat.sub}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// Main Dashboard Component
export default function ReturnRefundTracker() {
  const [returns] = useState([
    // ... your existing returns data
    {
      id: "RR-2024-001", customerName: "Anitha Suresh", email: "anitha.suresh@email.com",
      phone: "+91 9876543210", productName: "Wireless Bluetooth Headphones Pro",
      productCategory: "Electronics", productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
      orderId: "ORD-2024-00123", orderDate: "2024-01-10", returnDate: "2024-01-15",
      refundDate: "2024-01-18", returnReason: "Product not as described", refundAmount: 2499,
      shippingFee: 99, refundFeeRefunded: true, refundStatus: "Completed",
      trackingNumber: "RTN-001-456789", paymentMethod: "Credit Card",
      notes: "Customer received item with damaged packaging. Quick resolution appreciated.",
      returnMethod: "Courier Pickup", qualityCheck: "Passed", inspector: "Abin",
      refundTransactionId: "TXN-REF-782341", priority: "High",
      customerRating: 5, resolutionTime: 3
    },
    {
      id: "RR-2024-005", customerName: "Karthik Dev", email: "karthik.dev@email.com",
      phone: "+91 8989898989", productName: "Insulated Water Bottle 1L",
      productCategory: "Home & Living", productImage: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&h=100&fit=crop",
      orderId: "ORD-2024-00211", orderDate: "2024-01-20", returnDate: "2024-01-24",
      refundDate: "2024-01-30", returnReason: "Color different from website", refundAmount: 899,
      shippingFee: 50, refundFeeRefunded: true, refundStatus: "Completed",
      trackingNumber: "RTN-001-456793", paymentMethod: "Wallet",
      notes: "Customer accepted partial refund. Color variation was minimal.", 
      returnMethod: "Drop-off Center", qualityCheck: "Passed", inspector: "Seema S.", 
      refundTransactionId: "TXN-REF-782351", priority: "Medium",
      customerRating: 4, resolutionTime: 6
    },
    {
      id: "RR-2024-002", customerName: "Rahul Menon", email: "rahul.menon@email.com",
      phone: "+91 8765432109", productName: "Smart Fitness Band X1", productCategory: "Wearables",
      productImage: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100&h=100&fit=crop",
      orderId: "ORD-2024-00145", orderDate: "2024-01-12", returnDate: "2024-01-16",
      refundDate: "-", returnReason: "Defective product - Screen not working", refundAmount: 1799,
      shippingFee: 79, refundFeeRefunded: false, refundStatus: "Processing",
      trackingNumber: "RTN-001-456790", paymentMethod: "UPI",
      notes: "Technical team verification in progress. Awaiting quality check report.",
      returnMethod: "Drop-off Center", qualityCheck: "Pending", inspector: "-", 
      refundTransactionId: "-", priority: "Medium",
      customerRating: 3, resolutionTime: null
    },
    {
      id: "RR-2024-006", customerName: "Sneha Thomas", email: "sneha.thomas@email.com",
      phone: "+91 9123456709", productName: "Cotton Summer Dress", productCategory: "Apparel",
      productImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=100&h=100&fit=crop",
      orderId: "ORD-2024-00231", orderDate: "2024-01-22", returnDate: "2024-01-25",
      refundDate: "-", returnReason: "Size too small", refundAmount: 1299,
      shippingFee: 0, refundFeeRefunded: false, refundStatus: "Pending",
      trackingNumber: "RTN-001-456794", paymentMethod: "Credit Card",
      notes: "Awaiting pickup. Customer requested exchange but item out of stock.",
      returnMethod: "Courier Pickup", qualityCheck: "Not Started", inspector: "", 
      refundTransactionId: "-", priority: "High",
      customerRating: 2, resolutionTime: null
    }
  ]);

  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [timeRange, setTimeRange] = useState("30d");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date");

  const stats = useMemo(() => {
    const completed = returns.filter(r => r.refundStatus === "Completed");
    const totalRefund = completed.reduce((s, r) => s + r.refundAmount, 0);
    const avgResolutionTime = completed.length > 0 
      ? completed.reduce((sum, r) => sum + (r.resolutionTime || 0), 0) / completed.length 
      : 0;
    
    return {
      total: returns.length,
      completed: completed.length,
      processing: returns.filter(r => r.refundStatus === "Processing").length,
      pending: returns.filter(r => r.refundStatus === "Pending").length,
      totalRefund,
      avgRefund: completed.length ? Math.round(totalRefund / completed.length) : 0,
      avgResolutionTime: Math.round(avgResolutionTime),
      avgCustomerRating: (returns.reduce((sum, r) => sum + r.customerRating, 0) / returns.length).toFixed(1)
    };
  }, [returns]);

  const filtered = useMemo(() => {
    let filteredReturns = returns.filter(r => {
      const matchesSearch =
        r.customerName.toLowerCase().includes(search.toLowerCase()) ||
        r.productName.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || r.refundStatus === statusFilter;
      const matchesPriority = priorityFilter === "All" || r.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    switch (sortBy) {
      case "amount":
        filteredReturns.sort((a, b) => b.refundAmount - a.refundAmount);
        break;
      case "priority":
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        filteredReturns.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case "date":
      default:
        filteredReturns.sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate));
    }

    return filteredReturns;
  }, [returns, search, statusFilter, priorityFilter, sortBy]);

  const openDetail = useCallback((item) => {
    setSelected(item);
    setShowDetail(true);
  }, []);

  const theme = darkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900";

  // Quick actions
  const quickActions = [
    { icon: Filter, label: "Advanced Filter", color: "bg-blue-500" },
    { icon: Download, label: "Export Data", color: "bg-purple-500" },
    { icon: BarChart3, label: "View Reports", color: "bg-indigo-500" },
  ];

  return (
    <div className={`min-h-screen ${theme} transition-colors duration-300`}>
      {/* Enhanced Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
        darkMode 
          ? 'bg-gray-900/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-500 rounded-xl">
                  <Package size={24} className="text-white" />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${
                    darkMode ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    ReturnFlow Pro
                  </h1>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Advanced returns management system
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                title="Toggle theme"
              >
                {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
              </button>
{/* 
              <button className={`p-2 rounded-lg transition-colors relative ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}>
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button> */}
{/* 
              <button className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}>
                <Settings size={20} />
              </button> */}

              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-400'
                }`} size={18} />
                <input
                  type="text"
                  placeholder="Search returns, customers, products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className={`pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-colors ${
                    darkMode 
                      ? 'bg-gray-800 text-white placeholder-gray-400' 
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2.5 border rounded-xl text-sm transition-colors ${
                    darkMode
                      ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter size={16} />
                  Filters
                  <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    darkMode
                      ? 'bg-gray-800 border-gray-600 text-gray-300'
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                  <option value="priority">Sort by Priority</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" 
                    ? darkMode 
                      ? "bg-blue-900/50 text-blue-300" 
                      : "bg-blue-100 text-blue-700"
                    : darkMode
                      ? "hover:bg-gray-800 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" 
                    ? darkMode 
                      ? "bg-blue-900/50 text-blue-300" 
                      : "bg-blue-100 text-blue-700"
                    : darkMode
                      ? "hover:bg-gray-800 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <div className="w-4 h-4 flex flex-col gap-0.5">
                  <div className="bg-current h-1 rounded-sm"></div>
                  <div className="bg-current h-1 rounded-sm"></div>
                  <div className="bg-current h-1 rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-4 mt-4 pb-2">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Status
                    </label>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        darkMode
                          ? 'bg-gray-800 border-gray-600 text-gray-300'
                          : 'bg-white border-gray-300 text-gray-700'
                      }`}
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Priority
                    </label>
                    <select 
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className={`px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        darkMode
                          ? 'bg-gray-800 border-gray-600 text-gray-300'
                          : 'bg-white border-gray-300 text-gray-700'
                      }`}
                    >
                      <option value="All">All Priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Time Range
                    </label>
                    <select 
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className={`px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        darkMode
                          ? 'bg-gray-800 border-gray-600 text-gray-300'
                          : 'bg-white border-gray-300 text-gray-700'
                      }`}
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <section className="mb-8">
          <QuickStats stats={stats} darkMode={darkMode} />
        </section>

        {/* Analytics Overview */}
        <section className="mb-8">
          <div className={`rounded-2xl p-6 shadow-sm border transition-colors ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Returns Analytics
              </h2>
              <div className="flex gap-2">
                <button className={`px-3 py-1 text-sm rounded-lg ${
                  darkMode
                    ? 'bg-blue-900/50 text-blue-300'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  Monthly
                </button>
                <button className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                  Quarterly
                </button>
              </div>
            </div>
            <AnalyticsChart type="line" darkMode={darkMode} />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className={`text-lg font-semibold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 p-4 rounded-xl shadow-sm border hover:shadow-md transition-all ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900'
                    : 'bg-white border-gray-100 hover:shadow-gray-200'
                }`}
              >
                <div className={`p-2 rounded-lg ${action.color} bg-opacity-10`}>
                  <action.icon size={20} className={action.color.replace('bg-', 'text-')} />
                </div>
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Returns Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Recent Returns ({filtered.length})
            </h2>
            <div className={`flex items-center gap-4 text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span>Avg. Resolution: {stats.avgResolutionTime} days</span>
              <span>•</span>
              <span>Customer Rating: {stats.avgCustomerRating}/5</span>
            </div>
          </div>

          {viewMode === "list" ? (
            <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            }`}>
              <table className="w-full">
                <thead>
                  <tr className={`border-b transition-colors ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600' 
                      : 'bg-gray-50 border-gray-100'
                  }`}>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Product
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Customer
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Amount
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Status
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Date
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map(item => (
                      <ReturnCard 
                        key={item.id} 
                        item={item} 
                        onClick={() => openDetail(item)}
                        viewMode="list"
                        darkMode={darkMode}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence>
                {filtered.map(item => (
                  <ReturnCard 
                    key={item.id} 
                    item={item} 
                    onClick={() => openDetail(item)}
                    viewMode="grid"
                    darkMode={darkMode}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {filtered.length === 0 && (
            <div className={`text-center py-16 rounded-2xl border transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            }`}>
              <Package size={48} className={`mx-auto mb-4 ${
                darkMode ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <p className={`mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No returns match your filters.
              </p>
              <p className={`text-sm ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Try adjusting your search criteria or clear filters.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Enhanced FAB */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all z-30"
      >
        <Plus size={24} />
      </motion.button>

      {/* Enhanced Detail Drawer */}
      <AnimatePresence>
        {showDetail && selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowDetail(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className={`fixed right-0 top-0 h-full w-full max-w-2xl shadow-2xl z-50 overflow-y-auto transition-colors ${
                darkMode ? 'bg-gray-900' : 'bg-white'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <button 
                    onClick={() => setShowDetail(false)}
                    className={`p-2 rounded-full transition-colors ${
                      darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <h2 className={`text-2xl font-bold ${
                    darkMode ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    Return Details
                  </h2>
                  <div className="flex gap-2">
                    <button className={`p-2 rounded-full transition-colors ${
                      darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}>
                      <Edit size={18} />
                    </button>
                    <button className={`p-2 rounded-full transition-colors ${
                      darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}>
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={() => setShowDetail(false)}
                      className={`p-2 rounded-full transition-colors ${
                        darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>

                {/* Product & Customer Info */}
                <div className="flex gap-4 mb-6">
                  <img 
                    src={selected.productImage} 
                    alt={selected.productName} 
                    className={`w-24 h-24 rounded-xl object-cover ring-2 ${
                      darkMode ? 'ring-blue-800' : 'ring-blue-200'
                    }`} 
                  />
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {selected.productName}
                    </h3>
                    <p className={`mb-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {selected.customerName}
                    </p>
                    <p className={`text-sm mb-2 ${
                      darkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {selected.email}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`flex items-center gap-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <Phone size={14} />
                        {selected.phone}
                      </span>
                      <span className={`flex items-center gap-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <CreditCard size={14} />
                        {selected.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className={`bg-gradient-to-r rounded-2xl p-5 mb-6 ${
                  darkMode 
                    ? 'from-blue-900/30 to-purple-900/30' 
                    : 'from-blue-50 to-purple-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      {(() => {
                        const cfg = {
                          Completed: { 
                            bg: darkMode ? "bg-emerald-900/50 text-emerald-300" : "bg-emerald-100 text-emerald-700", 
                            icon: CheckCircle 
                          },
                          Processing: { 
                            bg: darkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700", 
                            icon: Clock 
                          },
                          Pending: { 
                            bg: darkMode ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-700", 
                            icon: AlertCircle 
                          },
                        }[selected.refundStatus];
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.bg}`}>
                            <cfg.icon size={14} /> {selected.refundStatus}
                          </span>
                        );
                      })()}
                      <p className={`text-3xl font-bold mt-2 ${
                        darkMode ? 'text-blue-300' : 'text-blue-700'
                      }`}>
                        ₹{selected.refundAmount.toLocaleString()}
                      </p>
                      <p className={`text-sm mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Refund Amount
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <PriorityIndicator priority={selected.priority} darkMode={darkMode} />
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={i < selected.customerRating 
                                ? "text-yellow-400 fill-current" 
                                : darkMode ? "text-gray-600" : "text-gray-300"
                              } 
                            />
                          ))}
                        </div>
                      </div>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Order ID
                      </p>
                      <p className={`font-mono text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {selected.orderId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline & Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Timeline */}
                  <div>
                    <h4 className={`font-semibold mb-4 ${
                      darkMode ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      Timeline
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: "Order Placed", value: selected.orderDate, icon: ShoppingBag },
                        { label: "Return Requested", value: selected.returnDate, icon: Clock },
                        { label: "Refund Processed", value: selected.refundDate === "-" ? "Pending" : selected.refundDate, 
                          icon: DollarSign, highlight: selected.refundDate !== "-" },
                      ].map((t, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            darkMode ? 'bg-gray-800' : 'bg-gray-100'
                          }`}>
                            <t.icon size={16} className={
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            } />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className={
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                              }>
                                {t.label}
                              </span>
                              <span className={`font-medium ${
                                t.highlight 
                                  ? "text-emerald-600" 
                                  : darkMode ? "text-gray-300" : "text-gray-900"
                              }`}>
                                {t.value}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Details */}
                  <div>
                    <h4 className={`font-semibold mb-4 ${
                      darkMode ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Category</p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-900'}>{selected.productCategory}</p>
                      </div>
                      <div>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Return Method</p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-900'}>{selected.returnMethod}</p>
                      </div>
                      <div>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Tracking #</p>
                        <p className={`font-mono ${
                          darkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                          {selected.trackingNumber}
                        </p>
                      </div>
                      <div>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Inspector</p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-900'}>
                          {selected.inspector || "Not assigned"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Quality Check</p>
                        <p className={`font-medium ${
                          selected.qualityCheck === 'Passed' ? 'text-green-600' : 
                          selected.qualityCheck === 'Failed' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {selected.qualityCheck}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reason & Notes */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className={`font-semibold mb-3 ${
                      darkMode ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      Return Reason
                    </h4>
                    <div className={`rounded-xl p-4 ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {selected.returnReason}
                      </p>
                    </div>
                  </div>

                  {selected.notes && (
                    <div>
                      <h4 className={`font-semibold mb-3 ${
                        darkMode ? 'text-blue-300' : 'text-blue-700'
                      }`}>
                        Notes
                      </h4>
                      <div className={`rounded-xl p-4 border ${
                        darkMode 
                          ? 'bg-purple-900/30 border-purple-700' 
                          : 'bg-purple-50 border-purple-200'
                      }`}>
                        <p className={`text-sm ${
                          darkMode ? 'text-purple-200' : 'text-purple-800'
                        }`}>
                          {selected.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className={`flex gap-3 mt-8 pt-6 border-t ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2">
                    <ShieldCheck size={18} /> Process Refund
                  </button>
                  <button className={`flex items-center justify-center gap-2 flex-1 border py-3 rounded-xl font-medium transition-colors ${
                    darkMode
                      ? 'border-blue-600 hover:bg-blue-900/50'
                      : 'border-blue-300 hover:bg-blue-50'
                  }`}>
                    <MessageCircle size={18} /> Contact
                  </button>
                  <button className={`flex items-center justify-center gap-2 px-4 border py-3 rounded-xl font-medium transition-colors ${
                    darkMode
                      ? 'border-gray-600 hover:bg-gray-800'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}>
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}