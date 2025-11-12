// SupportTeamPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Admin/Navbar.jsx';

const SupportTeamPage = () => {
  // 🫒 Olive green theme (#586330)
  const colors = {
    backgroundLight: '#f8f8f8',
    surfaceLight: '#ffffff',
    primary: '#586330',
    borderLight: '#e5e7eb',
    textLight: '#1f2937',
    textSecondaryLight: '#6b7280',
    statusActiveBg: '#e5e9d3',
    statusActiveText: '#3f4722',
    statusInactiveBg: '#f3f4f6',
    statusInactiveText: '#4b5563',
    deleteAction: '#ef4444',
  };

  const [members, setMembers] = useState([
    { id: 1, name: "Olivia Rhye", email: "olivia@example.com", phone: "9876543210", role: "L2 Support", active: "2 hours ago", status: "Active", bio: "Experienced support engineer." },
    { id: 2, name: "Phoenix Baker", email: "phoenix@example.com", phone: "9876501234", role: "Supervisor", active: "Yesterday", status: "Active", bio: "Team lead." },
    { id: 3, name: "Lana Steiner", email: "lana@example.com", phone: "9876509999", role: "L1 Support", active: "3 days ago", status: "Inactive", bio: "" },
    { id: 4, name: "Demi Wilkinson", email: "demi@example.com", phone: "9876511111", role: "L1 Support", active: "5 minutes ago", status: "Active", bio: "" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', role: '', status: 'Active', bio: '' });
  const [editIndex, setEditIndex] = useState(null);

  const handleSave = () => {
    if (!newMember.name || !newMember.email) {
      alert('Please enter name and email');
      return;
    }

    if (editIndex !== null) {
      const updated = [...members];
      updated[editIndex] = { ...newMember, id: members[editIndex].id, active: members[editIndex].active }; 
      setMembers(updated);
    } else {
      setMembers([...members, { ...newMember, id: Date.now(), active: "Just now" }]);
    }
    setShowModal(false);
    setEditIndex(null);
    setNewMember({ name: '', email: '', phone: '', role: '', status: 'Active', bio: '' });
  };

  const handleDelete = (index) => {
    if (!window.confirm('Delete this member?')) return;
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
  };

  return (
    <div className="font-display" style={{ backgroundColor: colors.backgroundLight, color: colors.textLight, paddingTop: '80px' }}>
      <div className="flex min-h-screen w-full">
        <Navbar />

        <main className="flex-1 p-8">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-black">Support Team Management</p>
                <p style={{ color: colors.textSecondaryLight }}>Add, edit, view profiles and manage roles.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowModal(true); setEditIndex(null); setNewMember({ name: '', email: '', phone: '', role: '', status: 'Active', bio: '' }); }}
                  className="flex items-center gap-2 rounded-lg h-10 px-4 text-sm font-bold text-white"
                  style={{ backgroundColor: colors.primary }}>
                   Add New Member
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl shadow-lg border overflow-hidden" style={{ backgroundColor: colors.surfaceLight, borderColor: colors.borderLight }}>
              <table className="w-full text-sm text-left" style={{ color: colors.textLight }}>
                <thead style={{ backgroundColor: colors.backgroundLight, color: colors.textSecondaryLight }}>
                  <tr>
                    <th className="p-4">Member</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Last Active</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr key={member.id} className="border-b" style={{ borderColor: colors.borderLight }}>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src="https://via.placeholder.com/40" alt="" className="w-10 h-10 rounded-full" />
                        <div>
                          <div className="font-semibold">{member.name}</div>
                          <div style={{ color: colors.textSecondaryLight }}>{member.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{member.role}</td>
                      <td className="px-6 py-4" style={{ color: colors.textSecondaryLight }}>{member.active}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium" 
                          style={{ 
                            backgroundColor: member.status === 'Active' ? colors.statusActiveBg : colors.statusInactiveBg, 
                            color: member.status === 'Active' ? colors.statusActiveText : colors.statusInactiveText 
                          }}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                    

                        <button onClick={() => { setEditIndex(index); setNewMember(members[index]); setShowModal(true); }} className="p-2 rounded-lg hover:bg-gray-100" style={{ color: colors.textSecondaryLight }}>
                          <span className="material-symbols-outlined">edit</span>
                        </button>

                        <button onClick={() => handleDelete(index)} className="p-2 rounded-lg hover:bg-red-50" style={{ color: colors.deleteAction }}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="p-6 rounded-xl w-[420px] border shadow-2xl" style={{ backgroundColor: colors.surfaceLight, borderColor: colors.borderLight, color: colors.textLight }}>
            <h2 className="text-xl font-bold mb-4">{editIndex !== null ? 'Edit Member' : 'Add New Member'}</h2>

            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} className="rounded-lg px-3 py-2 border" style={{ backgroundColor: colors.backgroundLight, color: colors.textLight, borderColor: colors.borderLight }} />
              <input type="email" placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} className="rounded-lg px-3 py-2 border" style={{ backgroundColor: colors.backgroundLight, color: colors.textLight, borderColor: colors.borderLight }} />
              <input type="text" placeholder="Phone" value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} className="rounded-lg px-3 py-2 border" style={{ backgroundColor: colors.backgroundLight, color: colors.textLight, borderColor: colors.borderLight }} />
              <input type="text" placeholder="Role" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} className="rounded-lg px-3 py-2 border" style={{ backgroundColor: colors.backgroundLight, color: colors.textLight, borderColor: colors.borderLight }} />
              <textarea placeholder="Bio" value={newMember.bio} onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })} className="rounded-lg px-3 py-2 border" rows={3} style={{ backgroundColor: colors.backgroundLight, color: colors.textLight, borderColor: colors.borderLight }} />
              <select value={newMember.status} onChange={(e) => setNewMember({ ...newMember, status: e.target.value })} className="rounded-lg px-3 py-2 border" style={{ backgroundColor: colors.backgroundLight, color: colors.textLight, borderColor: colors.borderLight }}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => { setShowModal(false); setEditIndex(null); }} className="px-4 py-2 rounded-lg border hover:bg-gray-50" style={{ borderColor: colors.borderLight, color: colors.textSecondaryLight }}>Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90" style={{ backgroundColor: colors.primary }}>Save</button>
            </div> 
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTeamPage;
