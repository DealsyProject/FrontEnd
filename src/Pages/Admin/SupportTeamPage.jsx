import React, { useState, useEffect } from "react";
import axiosInstance from "../../Components/utils/axiosInstance.js";
import Navbar from "../../Components/Admin/Navbar.jsx";

export default function SupportManagement() {
  const [supportUsers, setSupportUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);

  const [newUser, setNewUser] = useState({
    FullName: "",
    Email: "",
    PhoneNumber: "",
    Password: "",
  });

  // Fetch all support users
  const fetchSupportUsers = async () => {
    try {
      const res = await axiosInstance.get("/Admin/support-team");
      setSupportUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load support users.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSupportUsers();
  }, []);

  // Block/unblock
  const handleToggleBlock = async (user) => {
    try {
      const userId = user.UserId;

      if (user.IsBlocked) {
        await axiosInstance.put(`/Admin/unblock/${userId}`);
      } else {
        await axiosInstance.put(`/Admin/block/${userId}`);
      }

      fetchSupportUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  // Start editing
  const startEditing = (user) => {
    setEditingUserId(user.UserId);
    setEditData({
      FullName: user.FullName,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
    });
  };

  // Save edit
  const saveEdit = async (userId) => {
    try {
      await axiosInstance.put("/Admin/support-team/update", {
        UserId: userId,
        FullName: editData.FullName,
        Email: editData.Email,
        PhoneNumber: editData.PhoneNumber,
      });

      setEditingUserId(null);
      fetchSupportUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update user.");
    }
  };

  // Add new support user
  const addSupportUser = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/Admin/support-team/create", newUser);

      setShowAddForm(false);
      setNewUser({ FullName: "", Email: "", PhoneNumber: "", Password: "" });
      fetchSupportUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to add support member.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 w-full">
      <Navbar />

      <main className="pt-24 px-6 sm:px-12 lg:px-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Support Team</h1>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add New
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form
            onSubmit={addSupportUser}
            className="bg-white p-6 rounded-lg shadow-md mb-6 grid gap-4 sm:grid-cols-2"
          >
            <input
              required
              placeholder="Full Name"
              value={newUser.FullName}
              onChange={(e) =>
                setNewUser({ ...newUser, FullName: e.target.value })
              }
              className="p-2 border rounded"
            />

            <input
              required
              type="email"
              placeholder="Email"
              value={newUser.Email}
              onChange={(e) =>
                setNewUser({ ...newUser, Email: e.target.value })
              }
              className="p-2 border rounded"
            />

            <input
              required
              placeholder="Phone Number"
              value={newUser.PhoneNumber}
              onChange={(e) =>
                setNewUser({ ...newUser, PhoneNumber: e.target.value })
              }
              className="p-2 border rounded"
            />

            <input
              required
              type="password"
              placeholder="Password"
              value={newUser.Password}
              onChange={(e) =>
                setNewUser({ ...newUser, Password: e.target.value })
              }
              className="p-2 border rounded"
            />

            <button
              type="submit"
              className="col-span-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create Support Member
            </button>
          </form>
        )}

        {error && (
          <div className="p-4 mb-6 text-sm text-red-800 bg-red-50 rounded-lg shadow-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-300 shadow-xl overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="px-6 py-4 text-left">Full Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Created On</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {supportUsers.length > 0 ? (
                  supportUsers.map((u) => {
                    const isEditing = editingUserId === u.UserId;

                    return (
                      <tr
                        key={u.UserId}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        {/* Full Name */}
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              className="p-1 border rounded w-full"
                              value={editData.FullName}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  FullName: e.target.value,
                                })
                              }
                            />
                          ) : (
                            u.FullName
                          )}
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              className="p-1 border rounded w-full"
                              type="email"
                              value={editData.Email}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  Email: e.target.value,
                                })
                              }
                            />
                          ) : (
                            u.Email
                          )}
                        </td>

                        {/* Phone Number */}
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              className="p-1 border rounded w-full"
                              value={editData.PhoneNumber}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  PhoneNumber: e.target.value,
                                })
                              }
                            />
                          ) : (
                            u.PhoneNumber
                          )}
                        </td>

                        {/* Created On */}
                        <td className="px-6 py-4">
                          {u.CreatedOn
                            ? new Date(u.CreatedOn).toLocaleDateString()
                            : "Invalid Date"}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              u.IsBlocked
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {u.IsBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-center flex justify-center gap-2">
                          <button
                            onClick={() => handleToggleBlock(u)}
                            className={`px-3 py-1 rounded-lg text-sm text-white shadow ${
                              u.IsBlocked
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {u.IsBlocked ? "Unblock" : "Block"}
                          </button>

                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveEdit(u.UserId)}
                                className="px-3 py-1 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700"
                              >
                                Save
                              </button>

                              <button
                                onClick={() => setEditingUserId(null)}
                                className="px-3 py-1 rounded-lg text-sm bg-gray-400 text-white hover:bg-gray-500"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => startEditing(u)}
                              className="px-3 py-1 rounded-lg text-sm bg-yellow-500 text-white hover:bg-yellow-600"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-500"
                    >
                      No support members found.
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
