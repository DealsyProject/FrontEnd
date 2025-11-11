import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, AlertTriangle, Eye, Download, Bell } from 'lucide-react';
import Navbar from '../../Components/Admin/Navbar.jsx';
import axiosInstance from '../../Components/utils/axiosInstance.js';
import { toast } from 'react-toastify';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('table');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [notifiedProducts, setNotifiedProducts] = useState(new Set());

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get('/Product/all');
      setProducts(response.data.products || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Send out-of-stock notification to vendor
 // Send out-of-stock notification to vendor
const sendOutOfStockNotification = async (product) => {
  try {
    // Check if already notified for this product
    if (notifiedProducts.has(product.id)) {
      toast.info(`Notification already sent to vendor for "${product.productName}"`);
      return;
    }

    const notificationData = {
      vendorId: product.vendorId,
      productId: product.id,
      productName: product.productName,
      message: `Your product "${product.productName}" is out of stock. Please restock to continue sales.`,
      priority: 'HIGH'
    };

    // Send notification to backend - CORRECTED ENDPOINT
    const response = await axiosInstance.post('/Notification/out-of-stock', notificationData);
    
    // Add to notified products set
    setNotifiedProducts(prev => new Set([...prev, product.id]));
    
    toast.success(`Out-of-stock notification sent to vendor for "${product.productName}"`);
    console.log('Notification sent:', response.data);
    
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to send notification';
    toast.error(`Failed to send notification: ${errorMessage}`);
    console.error('Error sending notification:', err);
    
    // Log detailed error information
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
  }
};


  // Auto-detect and notify out-of-stock products
  useEffect(() => {
    if (products.length > 0) {
      const outOfStockProducts = products.filter(product => 
        product.quantity <= 0 && !notifiedProducts.has(product.id)
      );
      
      if (outOfStockProducts.length > 0) {
        console.log(`Found ${outOfStockProducts.length} out-of-stock products that need notification`);
        // You can auto-notify here or let admin manually notify
      }
    }
  }, [products, notifiedProducts]);

  // Export products data
  const exportProducts = () => {
    const dataToExport = filteredProducts.map(product => ({
      'Product Name': product.productName,
      'Category': product.productCategory,
      'Description': product.description,
      'Price': product.price,
      'Quantity': product.quantity,
      'Status': getStatusText(product),
      'Rating': product.rating || 'N/A',
      'Vendor': product.vendorName || 'Unknown Vendor',
      'Created Date': new Date(product.createdOn).toLocaleDateString(),
      'Last Updated': product.modifiedOn ? new Date(product.modifiedOn).toLocaleDateString() : 'N/A'
    }));

    const csv = convertToCSV(dataToExport);
    downloadCSV(csv, 'products_export.csv');
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(value => 
      `"${String(value).replace(/"/g, '""')}"`
    ).join(','));
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Status helpers
  const getStatusColor = (product) => {
    if (product.quantity <= 0) {
      return 'bg-red-100 text-red-700 border border-red-200';
    } else if (product.quantity <= 10) {
      return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    } else {
      return 'bg-[#e5e9d3] text-[#586330] border border-[#a5ad8b]';
    }
  };

  const getStatusText = (product) => {
    if (product.quantity <= 0) return 'Out of Stock';
    if (product.quantity <= 10) return 'Low Stock';
    return 'In Stock';
  };

  const getStockIcon = (product) => {
    if (product.quantity <= 0) {
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    } else if (product.quantity <= 10) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

  // Get image URL - handle both string URLs and image objects
  const getProductImage = (product) => {
    if (!product.images || product.images.length === 0) {
      return null;
    }
    
    if (product.images[0] && typeof product.images[0] === 'object' && product.images[0].imageData) {
      return product.images[0].imageData;
    }
    
    if (typeof product.images[0] === 'string') {
      return product.images[0];
    }
    
    return null;
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.productName?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase()) ||
        product.vendorName?.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'All' || product.productCategory === selectedCategory;
      
      const matchesStatus = selectedStatus === 'All' || 
        (selectedStatus === 'active' && product.quantity > 10) ||
        (selectedStatus === 'low' && product.quantity <= 10 && product.quantity > 0) ||
        (selectedStatus === 'inactive' && product.quantity <= 0);
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'date':
          aValue = new Date(a.createdOn);
          bValue = new Date(b.createdOn);
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        default:
          aValue = a.productName?.toLowerCase();
          bValue = b.productName?.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

  const categories = ['All', ...new Set(products.map(p => p.productCategory).filter(Boolean))];

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Grid View Component
  const ProductGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => {
        const productImage = getProductImage(product);
        const isOutOfStock = product.quantity <= 0;
        const isNotified = notifiedProducts.has(product.id);
        
        return (
          <div key={product.id} className="bg-white rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition-shadow">
            <div className="p-4">
              {/* Product Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  {productImage ? (
                    <img 
                      src={productImage} 
                      alt={product.productName}
                      className="w-12 h-12 rounded object-cover border border-gray-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-12 h-12 bg-[#e5e9d3] rounded flex items-center justify-center text-sm font-bold text-[#586330] border border-[#a5ad8b] ${productImage ? 'hidden' : 'flex'}`}>
                    {product.productName?.[0]?.toUpperCase() || 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{product.productName}</h3>
                    <p className="text-sm text-gray-500 truncate">{product.vendorName || 'Unknown Vendor'}</p>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium capitalize">{product.productCategory?.toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-[#586330]">${product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <div className="flex items-center gap-1">
                    {getStockIcon(product)}
                    <span className={product.quantity <= 10 ? 'font-medium' : ''}>
                      {product.quantity}
                    </span>
                  </div>
                </div>
                {product.rating > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-medium">{product.rating} ★</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Images:</span>
                  <span className="font-medium">{product.images?.length || 0}</span>
                </div>
              </div>

              {/* Status */}
              <div className="mt-3 flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product)}`}>
                  {getStatusText(product)}
                </span>
                {isOutOfStock && isNotified && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Notified
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-center mt-4 pt-3 border-t border-gray-200">
                {isOutOfStock && !isNotified && (
                  <button 
                    onClick={() => sendOutOfStockNotification(product)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    title="Notify Vendor - Out of Stock"
                  >
                    <Bell className="w-4 h-4" />
                    Notify Vendor
                  </button>
                )}
                {isOutOfStock && isNotified && (
                  <button 
                    className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-medium cursor-not-allowed"
                    title="Notification Sent"
                    disabled
                  >
                    <Bell className="w-4 h-4" />
                    Notification Sent
                  </button>
                )}
                {!isOutOfStock && (
                  <button 
                    className="p-2 text-gray-500 hover:text-[#586330] transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans w-full">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans w-full">
      <Navbar />
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 sm:px-12 py-4">
        <h1 className="text-xl font-bold text-[#586330]">Marketplace Dashboard</h1>
      </div>

      <main className="pb-16 pt-8 px-6 sm:px-12 lg:px-20">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        <div className="mb-2">
          <h2 className="text-3xl sm:text-4xl font-semibold">Product Inventory</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor product stock levels and send notifications to vendors</p>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-lg border border-gray-300 p-4 mb-4 mt-6 flex flex-wrap items-center gap-4 shadow-md">
          <div className="flex-1 relative min-w-full sm:min-w-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, description, or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-11 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#586330] focus:ring-2 focus:ring-[#586330]/20 transition-colors shadow-sm"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#586330] shadow-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#586330] shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="active">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="inactive">Out of Stock</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#586330] shadow-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="rating">Sort by Rating</option>
            <option value="date">Sort by Date</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-800 hover:bg-gray-200 transition-colors"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-[#586330] text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#586330] text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Grid
            </button>
          </div>

          <button
            onClick={fetchProducts}
            className="px-4 py-2.5 bg-[#586330] hover:bg-[#4b572a] text-white rounded-lg text-sm font-medium shadow-md transition-colors"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>

          <button
            onClick={exportProducts}
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow-md transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Out of Stock Alert */}
        {filteredProducts.filter(p => p.quantity <= 0).length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Out of Stock Products</h3>
                  <p className="text-red-600 text-sm">
                    {filteredProducts.filter(p => p.quantity <= 0).length} products are out of stock. 
                    Notify vendors to restock.
                  </p>
                </div>
              </div>
              <div className="text-sm text-red-700 font-medium">
                {filteredProducts.filter(p => p.quantity <= 0 && !notifiedProducts.has(p.id)).length} need notification
              </div>
            </div>
          </div>
        )}

        {/* Products Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
          {filteredProducts.filter(p => p.quantity <= 0).length > 0 && (
            <span className="ml-2 text-red-600">
              ({filteredProducts.filter(p => p.quantity <= 0).length} out of stock)
            </span>
          )}
        </div>

        {/* Content */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-lg border border-gray-300 shadow-xl overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const productImage = getProductImage(product);
                    const isOutOfStock = product.quantity <= 0;
                    const isNotified = notifiedProducts.has(product.id);
                    
                    return (
                      <tr key={product.id} className="border-b border-gray-200 hover:bg-[#e5e9d3] transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3 text-gray-900">
                          {productImage ? (
                            <img 
                              src={productImage} 
                              alt={product.productName}
                              className="w-10 h-10 rounded object-cover border border-[#a5ad8b]"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-10 h-10 bg-[#e5e9d3] rounded flex items-center justify-center text-sm font-bold text-[#586330] border border-[#a5ad8b] ${productImage ? 'hidden' : 'flex'}`}>
                            {product.productName?.[0]?.toUpperCase() || 'P'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{product.productName}</span>
                            <span className="text-xs text-gray-500 max-w-xs truncate">
                              {product.description}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {product.vendorName || 'Unknown Vendor'}
                        </td>
                        <td className="px-6 py-4 text-gray-600 capitalize">
                          {product.productCategory?.toLowerCase()}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-900 font-medium">
                          ${product.price}
                        </td>
                        <td className="px-6 py-4 text-center flex items-center justify-center gap-1 text-gray-800">
                          {getStockIcon(product)}
                          <span>{product.quantity}</span>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {product.rating ? `${product.rating} ★` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product)}`}>
                            {getStatusText(product)}
                          </span>
                          {isOutOfStock && isNotified && (
                            <div className="text-xs text-green-600 mt-1">Notified</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                          {new Date(product.createdOn).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isOutOfStock && !isNotified && (
                            <button 
                              onClick={() => sendOutOfStockNotification(product)}
                              className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors"
                              title="Notify Vendor - Out of Stock"
                            >
                              <Bell className="w-3 h-3" />
                              Notify
                            </button>
                          )}
                          {isOutOfStock && isNotified && (
                            <span className="text-xs text-green-600 font-medium">Notification Sent</span>
                          )}
                          {!isOutOfStock && (
                            <button 
                              className="p-2 text-gray-500 hover:text-[#586330] transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr> 
                    <td colSpan="9" className="text-center text-gray-500 py-10">
                      {products.length === 0 ? 'No products found.' : 'No products match your filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <ProductGridView />
        )}
      </main>
    </div>
  );
}