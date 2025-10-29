
import React, { useEffect, useState } from "react";

// CustomerVendorTeams.jsx
// A single-file React component (Tailwind CSS) that fetches "customer" and "vendor" team details
// and displays them in a searchable, filterable table with some fake data and utility actions.

export default function CustemerVenderDetails() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  // Simulate fetching from an API with fake data
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
    // returns a Promise to mimic network request
    const fake = [
      { id: 1, name: "", role: "Customer Success Manager", team: "Customer", email: "aisha.k@example.com", phone: "+91-98450-11223", location: "Kochi, IN", active: true },
      { id: 2, name: "Rahul P.", role: "Customer Support Engineer", team: "Customer", email: "rahul.p@example.com", phone: "+91-98450-33445", location: "Bengaluru, IN", active: true },
     
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
      // optionally show a toast; keep simple here
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Customer & Vendor Teams</h1>
        <p className="text-sm text-gray-500 mb-4">A simple page to fetch and view customer and vendor team details .</p>

        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          <div className="flex gap-2 items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, role, email, phone or location..."
              className="px-3 py-2 border rounded-lg shadow-sm w-64 focus:outline-none"
            />

            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">All teams</option>
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showOnlyActive} onChange={(e) => setShowOnlyActive(e.target.checked)} />
              Only active
            </label>
          </div>

          <div className="flex gap-2">
            <button onClick={() => downloadCSV(filtered)} className="px-3 py-2 rounded-lg border hover:bg-gray-100">Export CSV</button>
            <button onClick={() => { setQuery(""); setFilterTeam("all"); setShowOnlyActive(false); }} className="px-3 py-2 rounded-lg bg-gray-800 text-white">Reset</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : (
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="text-left bg-gray-100">
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Role</th>
                  <th className="p-3 border">Team</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Phone</th>
                  <th className="p-3 border">Location</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">No results found.</td>
                  </tr>
                )}

                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="p-3 border">
                      <div className="font-medium">{row.name}</div>
                    </td>
                    <td className="p-3 border">{row.role}</td>
                    <td className="p-3 border">{row.team}</td>
                    <td className="p-3 border">{row.email}</td>
                    <td className="p-3 border">{row.phone}</td>
                    <td className="p-3 border">{row.location}</td>
                    <td className="p-3 border">
                      {row.active ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Inactive</span>
                      )}
                    </td>
                    <td className="p-3 border">
                      <div className="flex gap-2">
                        <button onClick={() => copyToClipboard(row.email)} className="px-2 py-1 border rounded">Copy Email</button>
                        <button onClick={() => alert(JSON.stringify(row, null, 2))} className="px-2 py-1 border rounded">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500">Fake data included for testing — replace <code>fetchFakeTeamData()</code> with your real API request.</div>
      </div>
    </div>
  );
}
