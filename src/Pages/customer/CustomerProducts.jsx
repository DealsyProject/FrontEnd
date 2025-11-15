import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/customer/Common/Navbar";
import Footer from "../../Components/customer/Common/Footer";
import axiosInstance from "../../Components/utils/axiosInstance";

export default function CustomerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'Grocery', name: 'Grocery' },
    { id: 'Furniture', name: 'Furniture' },
    { id: 'Books', name: 'Books' },
    { id: 'Home Appliance', name: 'Home Appliance' },
    { id: 'Cloth', name: 'Cloth' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/Product/all');
      const productsData = response.data.products || [];
      setProducts(productsData);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/Product/search?searchTerm=${encodeURIComponent(searchTerm)}`);
      const searchResults = response.data.products || [];
      setProducts(searchResults);
    } catch (error) {
      console.error("❌ Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (categoryId) => {
    if (categoryId === 'all') {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/Product/category/${categoryId}`);
      const categoryResults = response.data.products || [];
      setProducts(categoryResults);
    } catch (error) {
      console.error("❌ Error filtering by category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!e.target.value.trim()) {
      fetchProducts();
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      searchProducts();
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    filterByCategory(categoryId);
  };

  const ProductCard = ({ product }) => {
    const productImages = product.Images || [];
    const primaryImage = productImages.find(img => img.IsPrimary) || productImages[0];
    const imageUrl = primaryImage?.ImageData || "https://via.placeholder.com/400x300?text=No+Image";

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-200">
        <div className="h-48 bg-gray-200 overflow-hidden relative">
          <img 
            src={imageUrl}
            alt={product.ProductName}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          
          {product.Quantity === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
              Out of Stock
            </div>
          )}

          {product.Rating > 0 && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
              ⭐ {product.Rating.toFixed(1)}
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.ProductName}</h4>
            <span className="text-xs text-[#586330] bg-[#586330]/20 px-2 py-1 rounded-full font-medium">
              {product.ProductCategory}
            </span>
          </div>
          
          <p className="text-gray-500 text-sm mb-2">By {product.VendorName}</p>
          
          <div className="mb-3">
            <span className="text-[#586330] font-bold text-xl">
              ₹{product.Price.toLocaleString('en-IN')}
            </span>
            {product.Rating > 0 && (
              <div className="flex items-center space-x-1 mt-1">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`text-sm ${
                      index < Math.floor(product.Rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-xs text-gray-600 ml-1">({product.Rating})</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
            {product.Description}
          </p>

          <div className="flex justify-between items-center text-sm text-gray-700 mb-4">
            <span className={`font-semibold ${
              product.Quantity > 10 ? 'text-green-600' : 
              product.Quantity > 0 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {product.Quantity > 0 ? `${product.Quantity} in stock` : 'Out of stock'}
            </span>
            <span className="text-gray-500">{productImages.length} image{productImages.length !== 1 ? 's' : ''}</span>
          </div>
          
          <Link
            to={`/customer/product/${product.Id}`}
            className="block w-full bg-[#586330] text-white text-center py-2 rounded-lg hover:bg-[#586330]/80 transition font-medium text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Navbar />
      <main className="flex-grow py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Products</h1>
            <p className="text-gray-600 text-lg">Discover amazing products from trusted vendors</p>
          </header>

          {/* Search and Filter Section */}
          <div className="mb-8 bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search products by name, category, or description..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchSubmit}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330] focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearchSubmit}
                className="px-6 py-3 bg-[#586330] text-white rounded-lg hover:bg-[#586330]/80 transition font-medium"
              >
                Search
              </button>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  fetchProducts();
                }}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
              >
                Reset
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex gap-4 flex-wrap">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-lg transition duration-200 font-medium ${
                    selectedCategory === category.id
                      ? 'bg-[#586330] text-white hover:bg-[#586330]/80 shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#586330] mb-4"></div>
              <p className="text-gray-600 text-lg">Loading products...</p>
            </div>
          )}

          {!loading && (
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {products.length} products
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
              <div className="flex gap-4 text-sm">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Total: {products.length}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  In Stock: {products.filter(p => p.Quantity > 0).length}
                </span>
              </div>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.Id} product={product} />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm || selectedCategory !== 'all' ? 'No products found' : 'No products available'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters' 
                  : selectedCategory !== 'all'
                  ? `No products found in ${categories.find(c => c.id === selectedCategory)?.name} category`
                  : 'Check back later for new products'
                }
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}