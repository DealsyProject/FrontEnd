import React, { useEffect, useState } from "react";
import { Search, Download, RefreshCw, Copy, Eye, Users, Mail, Phone, MapPin } from "lucide-react";

export default function CustomerVendorDetails() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchFakeTeamData()
      .then((resp) => {
        setData(resp);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  function fetchFakeTeamData() {
    const fake = [
      { 
        id: 1, 
        name: "Aisha K.", 
        role: "Customer Success Manager", 
        team: "Customer", 
        email: "aisha.k@example.com", 
        phone: "+91-98450-11223", 
        location: "Kochi, IN", 
        active: true,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
      },
      { 
        id: 2, 
        name: "Rahul P.", 
        role: "Customer Support Engineer", 
        team: "Customer", 
        email: "rahul.p@example.com", 
        phone: "+91-98450-33445", 
        location: "Bengaluru, IN", 
        active: true,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      },
      { 
        id: 3, 
        name: "Priya S.", 
        role: "Vendor Relationship Manager", 
        team: "Vendor", 
        email: "priya.s@example.com", 
        phone: "+91-98450-55667", 
        location: "Chennai, IN", 
        active: true,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
      },
      { 
        id: 4, 
        name: "Arjun M.", 
        role: "Vendor Support Specialist", 
        team: "Vendor", 
        email: "arjun.m@example.com", 
        phone: "+91-98450-77889", 
        location: "Hyderabad, IN", 
        active: false,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
      }
    ];

    return new Promise((resolve) => setTimeout(() => resolve(fake), 600));
  }

  // Filtering + searching
  const filtered = data.filter((item) => {
    if (filterTeam !== "all" && item.team.toLowerCase() !== filterTeam) return false;
    if (showOnlyActive && !item.active) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.role.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  });

  // Utilities
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard: " + text);
    });
  }

  function downloadCSV(items) {
    if (!items || items.length === 0) {
      alert("No rows to export");
      return;
    }
    const header = ["id", "name", "role", "team", "email", "phone", "location", "active"];
    const rows = items.map((r) => header.map((h) => JSON.stringify(r[h] ?? "")).join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teams_export.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const refreshData = () => {
    setLoading(true);
    fetchFakeTeamData()
      .then((resp) => {
        setData(resp);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load data");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#586330]/5 to-[#586330]/10 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#586330] rounded-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#586330]">Customer & Vendor Teams</h1>
              <p className="text-gray-600 mt-1">Manage and view customer and vendor team details</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              </div>
              <div className="p-2 bg-[#586330]/10 rounded-lg">
                <Users className="h-5 w-5 text-[#586330]" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Customer Team</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.filter(item => item.team === 'Customer').length}
                </p>
              </div>
              <div className="p-2 bg-[#586330]/10 rounded-lg">
                <Users className="h-5 w-5 text-[#586330]" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.filter(item => item.active).length}
                </p>
              </div>
              <div className="p-2 bg-[#586330]/10 rounded-lg">
                <Users className="h-5 w-5 text-[#586330]" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, role, email, phone or location..."
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#586330] focus:border-[#586330] w-full transition-colors"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#586330] focus:border-[#586330] transition-colors"
                >
                  <option value="all">All teams</option>
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                </select>

                <label className="flex items-center gap-2 text-sm px-3 py-2.5 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={showOnlyActive} 
                    onChange={(e) => setShowOnlyActive(e.target.checked)}
                    className="rounded focus:ring-[#586330] text-[#586330]"
                  />
                  Only active
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => downloadCSV(filtered)} 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Download size={16} />
                Export CSV
              </button>
              <button 
                onClick={refreshData}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button 
                onClick={() => { setQuery(""); setFilterTeam("all"); setShowOnlyActive(false); }} 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#586330] text-white hover:bg-[#4a5428] transition-colors text-sm font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="h-8 w-8 text-[#586330] animate-spin mx-auto mb-3" />
              <p className="text-gray-600">Loading team data...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-600">
              <p>{error}</p>
              <button 
                onClick={refreshData}
                className="mt-3 px-4 py-2 bg-[#586330] text-white rounded-lg hover:bg-[#4a5428] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">Member</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">Role</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">Team</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">Location</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-gray-500">
                          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-lg font-medium text-gray-400">No team members found</p>
                          <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria</p>
                        </td>
                      </tr>
                    )}

                    {filtered.map((row) => (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={row.avatar}
                              alt={row.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{row.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-900">{row.role}</div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            row.team === 'Customer' 
                              ? 'bg-[#586330]/10 text-[#586330]' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {row.team}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail size={14} className="text-gray-400" />
                              <span className="text-gray-600">{row.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone size={14} className="text-gray-400" />
                              <span className="text-gray-600">{row.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={14} className="text-gray-400" />
                            {row.location}
                          </div>
                        </td>
                        <td className="p-4">
                          {row.active ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => copyToClipboard(row.email)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              title="Copy email"
                            >
                              <Copy size={12} />
                              Email
                            </button>
                            <button 
                              onClick={() => alert(JSON.stringify(row, null, 2))}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              title="View details"
                            >
                              <Eye size={12} />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{filtered.length}</span> of <span className="font-semibold">{data.length}</span> team members
                  </p>
                  <p className="text-xs text-gray-500">
                    Fake data included for testing — replace with your real API
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}