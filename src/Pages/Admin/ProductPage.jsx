import React, { useState } from 'react';
import { Search, Edit, Trash2, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import Navbar from '../../Components/Admin/Navbar.jsx'; 

export default function ProductsPage() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Wireless Headphones', sku: 'SKU: WH-00001', category: 'Electronics', price: '$250', stock: 120, status: 'active', image: '' },
    { id: 2, name: 'Mens T-shirt (Premium)', sku: 'SKU: MT-00002', category: 'Clothing', price: '$350', stock: 300, status: 'active', image: '' },
    { id: 3, name: 'Smart Coffee Maker', sku: 'SKU: CM-00003', category: 'Home Goods', price: '$300', stock: 8, status: 'low', image: '' },
    { id: 4, name: 'Classic Leather Wallet', sku: 'SKU: LW-00004', category: 'Accessories', price: '$799', stock: 0, status: 'inactive', image: '' },
    { id: 5, name: '4K Ultra Monitor', sku: 'SKU: MU-00005', category: 'Electronics', price: '$950', stock: 45, status: 'active', image: '' },
    { id: 6, name: 'Winter Coat', sku: 'SKU: WC-00006', category: 'Clothing', price: '$120', stock: 15, status: 'low', image: '' },
  ]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedProducts, setSelectedProducts] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-600/20 text-green-400';
      case 'low': return 'bg-yellow-600/20 text-yellow-400';
      case 'inactive': return 'bg-red-600/20 text-red-400';
      default: return 'bg-slate-600/20 text-slate-400';
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All' || p.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleSelectProduct = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const bulkDelete = () => {
    setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
  };

  const bulkActivate = () => {
    setProducts(prev => prev.map(p => selectedProducts.includes(p.id) ? { ...p, status: 'active' } : p));
    setSelectedProducts([]);
  };

  const bulkDeactivate = () => {
    setProducts(prev => prev.map(p => selectedProducts.includes(p.id) ? { ...p, status: 'inactive' } : p));
    setSelectedProducts([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans w-full">
      <Navbar />
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 px-6 sm:px-12 py-4">
        <h1 className="text-xl font-bold text-blue-400">Marketplace Dashboard</h1>
      </div>

      <main className="pb-16 pt-8 px-6 sm:px-12 lg:px-20">
        <div className="mb-2">
          <h2 className="text-3xl sm:text-4xl font-semibold">Product Inventory</h2>
          <p className="text-slate-400 text-sm mt-1">View, search, and manage all your marketplace listings.</p>
        </div>

        {/* Filters Section */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 mb-4 mt-6 flex flex-wrap items-center gap-4">
          <div className="flex-1 relative min-w-full sm:min-w-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-11 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home Goods">Home Goods</option>
            <option value="Accessories">Accessories</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="low">Low</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="flex gap-2 mb-4">
            <button onClick={bulkDelete} className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium">Delete Selected</button>
            <button onClick={bulkActivate} className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium">Activate Selected</button>
            <button onClick={bulkDeactivate} className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-medium">Deactivate Selected</button>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-xl overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase"> 
                  <input type="checkbox" 
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={(e) => e.target.checked ? setSelectedProducts(filteredProducts.map(p => p.id)) : setSelectedProducts([])}
                  />
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Category</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Price</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Stock</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4 text-center">
                      <input type="checkbox" checked={selectedProducts.includes(p.id)} onChange={() => toggleSelectProduct(p.id)} />
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      {/* Thumbnail */}
                      <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center text-xs font-bold text-white">
                        {p.name[0]}
                      </div>
                      {p.name}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{p.category}</td>
                    <td className="px-6 py-4 text-center text-white font-medium">{p.price}</td>
                    <td className="px-6 py-4 text-center flex items-center justify-center gap-1">
                      {p.stock <= 0 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      {p.stock > 0 && p.stock <= 20 && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                      <span>{p.stock}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                      <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors">
                        <Edit className="w-4 h-4 text-slate-400 hover:text-blue-400" />
                      </button>
                      <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors">
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-slate-500 py-10">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
