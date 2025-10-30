// SupportTeamPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Admin/Navbar.jsx';

const SupportTeamPage = () => {
  const colors = {
    backgroundDark: '#0a101b',
    surfaceDark: '#101923',
    primary: '#1173d4',
    borderDark: '#374151',
    textDark: '#f9fafb',
    textSecondaryDark: '#9ca3af',
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
      updated[editIndex] = { ...newMember };
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
    <div className="font-display" style={{ backgroundColor: colors.backgroundDark, color: colors.textDark, paddingTop: '80px' }}>
      <div className="flex min-h-screen w-full">
        <Navbar />
     

        <main className="flex-1 p-8">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-black">Support Team Management</p>
                <p style={{ color: colors.textSecondaryDark }}>Add, edit, view profiles and manage roles.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowModal(true); setEditIndex(null); setNewMember({ name: '', email: '', phone: '', role: '', status: 'Active', bio: '' }); }}
                  className="flex items-center gap-2 rounded-lg h-10 px-4 text-sm font-bold text-white"
                  style={{ backgroundColor: colors.primary }}>
                  <span className="material-symbols-outlined"></span> Add New Member
                </button>
              </div>
            </div>

            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: colors.surfaceDark, borderColor: colors.borderDark }}>
              <table className="w-full text-sm text-left">
                <thead style={{ backgroundColor: colors.backgroundDark, color: colors.textSecondaryDark }}>
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
                    <tr key={member.id} className="border-b" style={{ borderColor: colors.borderDark }}>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src="https://via.placeholder.com/40" alt="" className="w-10 h-10 rounded-full" />
                        <div>
                          <div className="font-semibold">{member.name}</div>
                          <div style={{ color: colors.textSecondaryDark }}>{member.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{member.role}</td>
                      <td className="px-6 py-4">{member.active}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: member.status === 'Active' ? '#166534' : '#4b5563', color: member.status === 'Active' ? '#a7f3d0' : '#d1d5db' }}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        {/* View profile: navigates to separate page */}
                        <Link to={`/support/${member.id}`} className="p-2 rounded-lg" style={{ color: colors.textSecondaryDark }}>
                          <span className="material-symbols-outlined">person</span>
                        </Link>

                        <button onClick={() => { setEditIndex(index); setNewMember(member); setShowModal(true); }} className="p-2 rounded-lg" style={{ color: colors.textSecondaryDark }}>
                          <span className="material-symbols-outlined">edit</span>
                        </button>

                        <button onClick={() => handleDelete(index)} className="p-2 rounded-lg" style={{ color: '#ef4444' }}>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#101923] p-6 rounded-xl w-[420px] border" style={{ borderColor: colors.borderDark }}>
            <h2 className="text-xl font-bold mb-4">{editIndex !== null ? 'Edit Member' : 'Add New Member'}</h2>

            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} className="rounded-lg px-3 py-2 border" style={{ backgroundColor: colors.backgroundDark, color: colors.textDark, borderColor: colors.borderDark }} />
              <input type="email" placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} className="rounded-lg px-3 py-2 border" style={{ backgroundColor: colors.backgroundDark, color: colors.textDark, borderColor: colors.borderDark }} />
              <input type="text" placeholder="Phone" value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} className="rounded-lg px-3 py-2 border" style={{ backgroundColor: colors.backgroundDark, color: colors.textDark, borderColor: colors.borderDark }} />
              <input type="text" placeholder="Role" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} className="rounded-lg px-3 py-2 border" style={{ backgroundColor: colors.backgroundDark, color: colors.textDark, borderColor: colors.borderDark }} />
              <textarea placeholder="Bio" value={newMember.bio} onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })} className="rounded-lg px-3 py-2 border" rows={3} style={{ backgroundColor: colors.backgroundDark, color: colors.textDark, borderColor: colors.borderDark }} />
              <select value={newMember.status} onChange={(e) => setNewMember({ ...newMember, status: e.target.value })} className="rounded-lg px-3 py-2 border" style={{ backgroundColor: colors.backgroundDark, color: colors.textDark, borderColor: colors.borderDark }}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => { setShowModal(false); setEditIndex(null); }} className="px-4 py-2 rounded-lg border" style={{ borderColor: colors.borderDark, color: colors.textSecondaryDark }}>Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: colors.primary }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTeamPage;
