import React, { useState } from 'react';
import { Check, X, Search, Eye, Mail, Phone, MapPin, Store, Calendar, Filter, Download, Plus, Edit, Trash2 } from 'lucide-react';
import Navbar from '../../Components/Admin/Navbar.jsx'; 


export default function VendorManagement() {
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: 'Vendor One',
      email: 'vendor1@email.com',
      shopName: 'Tech Gadgets',
      phone: '123-456-7890',
      address: '123 Tech Street, City, Country',
      category: 'Electronics',
      joinDate: '2024-01-15',
      status: 'pending',
      totalOrders: 0,
      rating: 0,
    },
    {
      id: 2,
      name: 'Vendor Two',
      email: 'vendor2@email.com',
      shopName: 'Home Decor',
      phone: '987-654-3210',
      address: '456 Home Road, City, Country',
      category: 'Home & Garden',
      joinDate: '2024-02-20',
      status: 'approved',
      totalOrders: 45,
      rating: 4.5,
    },
    {
      id: 3,
      name: 'Vendor Three',
      email: 'vendor3@email.com',
      shopName: 'Fashion Hub',
      phone: '555-555-5555',
      address: '789 Fashion Ave, City, Country',
      category: 'Fashion',
      joinDate: '2024-03-10',
      status: 'rejected',
      totalOrders: 0,
      rating: 0,
    },
  ]);

  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    shopName: '',
    phone: '',
    address: '',
    category: 'Electronics',
  });

  const categories = ['all', 'Electronics', 'Fashion', 'Home & Garden', 'Food & Beverage', 'Sports', 'Books'];

  const handleApprove = (id) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, status: 'approved' } : v));
    alert('Vendor approved successfully!');
  };

  const handleReject = (id) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, status: 'rejected' } : v));
    alert('Vendor rejected!');
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(v => v.id !== id));
      alert('Vendor deleted successfully!');
    }
  };

  const handleAddVendor = (e) => {
    e.preventDefault();
    const vendor = {
      ...newVendor,
      id: Date.now(),
      status: 'pending',
      joinDate: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      rating: 0,
    };
    setVendors([...vendors, vendor]);
    setNewVendor({ name: '', email: '', shopName: '', phone: '', address: '', category: 'Electronics' });
    setShowAddModal(false);
    alert('Vendor added successfully!');
  };

  const handleEditVendor = (e) => {
    e.preventDefault();
    setVendors(vendors.map(v => v.id === selectedVendor.id ? selectedVendor : v));
    setShowEditModal(false);
    setSelectedVendor(null);
    alert('Vendor updated successfully!');
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Shop Name', 'Phone', 'Address', 'Category', 'Status', 'Join Date', 'Total Orders', 'Rating'],
      ...filteredVendors.map(v => [v.name, v.email, v.shopName, v.phone, v.address, v.category, v.status, v.joinDate, v.totalOrders, v.rating])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendors_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredVendors = vendors.filter(vendor => 
    vendor.status === activeTab &&
    (filterCategory === 'all' || vendor.category === filterCategory) &&
    (vendor.name.toLowerCase().includes(search.toLowerCase()) ||
     vendor.email.toLowerCase().includes(search.toLowerCase()) ||
     vendor.shopName.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    pending: vendors.filter(v => v.status === 'pending').length,
    approved: vendors.filter(v => v.status === 'approved').length,
    rejected: vendors.filter(v => v.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Navbar />
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">Vendor Management</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm sm:text-base">Add Vendor</span>
          </button>
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm sm:text-base">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-gray-500 text-sm mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-gray-500 text-sm mb-1">Approved</div>
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-gray-500 text-sm mb-1">Rejected</div>
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 overflow-x-auto pb-2">
        {['pending', 'approved', 'rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium whitespace-nowrap text-sm sm:text-base transition-colors ${
              activeTab === tab ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({stats[tab]})
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or shop"
            className="w-full bg-white border border-gray-300 rounded-lg pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Filter</span>
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4 sm:mb-6 shadow-sm">
          <div className="text-sm font-medium mb-3 text-gray-700">Filter by Category</div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors shadow-sm ${
                  filterCategory === cat ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Vendor List */}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-lg">
        {filteredVendors.length === 0 && (
          <div className="p-8 sm:p-12 text-gray-500 text-center text-sm sm:text-base">No vendors found</div>
        )}
        {filteredVendors.map(vendor => (
          <div key={vendor.id} className="flex flex-col lg:flex-row justify-between items-start border-b border-gray-200 last:border-b-0 p-4 sm:p-5 lg:p-6 hover:bg-green-50 transition-colors gap-4">
            <div className="flex-1 w-full lg:w-auto space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-900 text-base sm:text-lg">{vendor.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Joined: {vendor.joinDate}</div>
                </div>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">{vendor.category}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Store className="w-4 h-4 flex-shrink-0" />
                  <span>{vendor.shopName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{vendor.address}</span>
                </div>
              </div>
              {vendor.status === 'approved' && (
                <div className="flex gap-4 text-xs text-gray-600">
                  <span>Orders: {vendor.totalOrders}</span>
                  <span>Rating: {vendor.rating > 0 ? `${vendor.rating}⭐` : 'N/A'}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full lg:w-auto lg:flex-shrink-0">
              {vendor.status === 'pending' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(vendor.id)}
                    className="flex-1 lg:flex-none lg:min-w-[100px] px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-md"
                  >
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(vendor.id)}
                    className="flex-1 lg:flex-none lg:min-w-[100px] px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-md"
                  >
                    <X className="w-4 h-4 flex-shrink-0" />
                    <span>Reject</span>
                  </button>
                </div>
              ) : (
                <span className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide text-center ${vendor.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                  {vendor.status.toUpperCase()}
                </span>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedVendor(vendor)}
                  className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => { setSelectedVendor(vendor); setShowEditModal(true); }}
                  className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(vendor.id)}
                  className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center justify-center shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Vendor Modal */}
      {selectedVendor && !showEditModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedVendor(null)}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 border border-gray-300 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Vendor Details</h3>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="text-gray-900 font-medium">{selectedVendor.name}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="text-gray-900">{selectedVendor.email}</span></div>
              <div><span className="text-gray-500">Shop Name:</span> <span className="text-gray-900">{selectedVendor.shopName}</span></div>
              <div><span className="text-gray-500">Phone:</span> <span className="text-gray-900">{selectedVendor.phone}</span></div>
              <div><span className="text-gray-500">Address:</span> <span className="text-gray-900">{selectedVendor.address}</span></div>
              <div><span className="text-gray-500">Category:</span> <span className="text-gray-900">{selectedVendor.category}</span></div>
              <div><span className="text-gray-500">Join Date:</span> <span className="text-gray-900">{selectedVendor.joinDate}</span></div>
              <div><span className="text-gray-500">Status:</span> <span className={`font-medium ${selectedVendor.status === 'approved' ? 'text-green-600' : selectedVendor.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{selectedVendor.status.toUpperCase()}</span></div>
              {selectedVendor.status === 'approved' && (
                <>
                  <div><span className="text-gray-500">Total Orders:</span> <span className="text-gray-900">{selectedVendor.totalOrders}</span></div>
                  <div><span className="text-gray-500">Rating:</span> <span className="text-gray-900">{selectedVendor.rating > 0 ? `${selectedVendor.rating}⭐` : 'N/A'}</span></div>
                </>
              )}
            </div>
            <button
              onClick={() => setSelectedVendor(null)}
              className="mt-6 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 border border-gray-300 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Add New Vendor</h3>
            <form onSubmit={handleAddVendor} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500 shadow-sm"
                  value={newVendor.name}
                  onChange={e => setNewVendor({...newVendor, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500 shadow-sm"
                  value={newVendor.email}
                  onChange={e => setNewVendor({...newVendor, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Shop Name *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500 shadow-sm"
                  value={newVendor.shopName}
                  onChange={e => setNewVendor({...newVendor, shopName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500 shadow-sm"
                  value={newVendor.phone}
                  onChange={e => setNewVendor({...newVendor, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500 shadow-sm"
                  value={newVendor.address}
                  onChange={e => setNewVendor({...newVendor, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Category *</label>
                <select
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500 shadow-sm"
                  value={newVendor.category}
                  onChange={e => setNewVendor({...newVendor, category: e.target.value})}
                >
                  {categories.filter(c => c !== 'all').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-md"
                >
                  Add Vendor
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {showEditModal && selectedVendor && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 border border-gray-300 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Edit Vendor</h3>
            <form onSubmit={handleEditVendor} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500 shadow-sm"
                  value={selectedVendor.name}
                  onChange={e => setSelectedVendor({...selectedVendor, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500 shadow-sm"
                  value={selectedVendor.email}
                  onChange={e => setSelectedVendor({...selectedVendor, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Shop Name *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500 shadow-sm"
                  value={selectedVendor.shopName}
                  onChange={e => setSelectedVendor({...selectedVendor, shopName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500 shadow-sm"
                  value={selectedVendor.phone}
                  onChange={e => setSelectedVendor({...selectedVendor, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500 shadow-sm"
                  value={selectedVendor.address}
                  onChange={e => setSelectedVendor({...selectedVendor, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Category *</label>
                <select
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500 shadow-sm"
                  value={selectedVendor.category}
                  onChange={e => setSelectedVendor({...selectedVendor, category: e.target.value})}
                >
                  {categories.filter(c => c !== 'all').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-md"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedVendor(null); }}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}