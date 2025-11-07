import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductModal from '../../../Components/Vendor/Dashboard/modals/ProductModal';
import Sidebar from '../../../Components/Vendor/Dashboard/Sidebar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Components/utils/axiosInstance'

const Products = () => {
  const navigate = useNavigate();
  
  // Add logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tempUserData');
    navigate('/');
  };

  const activeView = 'products';
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false); // Track save state

  // Updated product data structure to match backend DTOs
  const [products, setProducts] = useState([]);

  // Categories for filtering - MUST match backend categories exactly
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'Grocery', name: 'Grocery' },
    { id: 'Furniture', name: 'Furniture' },
    { id: 'Books', name: 'Books' },
    { id: 'Home Appliance', name: 'Home Appliance' },
    { id: 'Cloth', name: 'Cloth' }
  ];

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/Product/all');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Updated new product structure to match CreateProductDto
  const [newProduct, setNewProduct] = useState({
    productName: '',
    description: '',
    price: 0,
    quantity: 1,
    productCategory: '',
    image: '',
    rating: 0
  });

  // Filter products based on active category and search
  const filteredProducts = products.filter(product => {
    const categoryMatch = activeCategory === 'all' || 
      product.productCategory?.toLowerCase() === activeCategory.toLowerCase();
    
    const searchMatch = 
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  // Products to display (with load more functionality)
  const productsToShow = filteredProducts.slice(0, visibleProducts);

  // Handle category filter
  const handleCategoryFilter = (categoryId) => {
    setActiveCategory(categoryId);
    setVisibleProducts(6);
  };

  // Handle load more
  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + 3);
  };

  // ✅ Add Product Handler
  const handleAddProduct = () => {
    setNewProduct({
      productName: '',
      description: '',
      price: 0,
      quantity: 1,
      productCategory: '',
      image: '',
      rating: 0
    });
    setShowAddModal(true);
  };

  // ✅ Update Product Handler
  const handleUpdateProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({ 
      productName: product.productName,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      productCategory: product.productCategory,
      image: product.image,
      rating: product.rating || 0
    });
    setShowUpdateModal(true);
  };

  // ✅ Validate product data
  const validateProduct = () => {
    if (!newProduct.productName?.trim()) {
      toast.error('Product Name is required!');
      return false;
    }
    if (!newProduct.productCategory?.trim()) {
      toast.error('Category is required!');
      return false;
    }
    if (!newProduct.description?.trim()) {
      toast.error('Description is required!');
      return false;
    }
    if (newProduct.price <= 0) {
      toast.error('Price must be greater than 0!');
      return false;
    }
    if (newProduct.quantity < 0) {
      toast.error('Quantity cannot be negative!');
      return false;
    }
    if (!newProduct.image?.trim()) {
      toast.error('Product Image is required!');
      return false;
    }
    return true;
  };

  // ✅ Save New Product - API call
  const handleSaveNewProduct = async () => {
    if (!validateProduct()) {
      return;
    }

    setSaving(true);
    try {
      const productData = {
        productName: newProduct.productName.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
        productCategory: newProduct.productCategory.trim(),
        image: newProduct.image,
        rating: parseFloat(newProduct.rating) || 0
      };

      await axiosInstance.post('/api/Product/create', productData);
      
      // Refresh products list
      await fetchProducts();
      
      // Close modal and reset state
      setShowAddModal(false);
      setNewProduct({
        productName: '',
        description: '',
        price: 0,
        quantity: 1,
        productCategory: '',
        image: '',
        rating: 0
      });
      
      toast.success('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.errorMessage ||
                          'Failed to add product';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Save Updated Product - API call
  const handleSaveUpdatedProduct = async () => {
    if (!validateProduct()) {
      return;
    }

    setSaving(true);
    try {
      const productData = {
        id: editingProduct.id,
        productName: newProduct.productName.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
        productCategory: newProduct.productCategory.trim(),
        image: newProduct.image,
        rating: parseFloat(newProduct.rating) || 0
      };

      await axiosInstance.put(`/api/Product/update/${editingProduct.id}`, productData);
      
      // Refresh products list
      await fetchProducts();
      
      // Close modal and reset state
      setShowUpdateModal(false);
      setEditingProduct(null);
      setNewProduct({
        productName: '',
        description: '',
        price: 0,
        quantity: 1,
        productCategory: '',
        image: '',
        rating: 0
      });
      
      toast.success('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.errorMessage ||
                          'Failed to update product';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete Product Handler
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/Product/delete/${productId}`);
      
      // Refresh products list
      await fetchProducts();
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      toast.error(errorMessage);
    }
  };

  // ✅ Image Upload Handlers with Base64 conversion
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB for Base64)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setNewProduct({ ...newProduct, image: base64String });
        toast.success('Image uploaded successfully!');
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setNewProduct({ ...newProduct, image: '' });
    toast.info('Image removed');
  };

  // Search Logic
  const handleSearch = (e) => setSearchTerm(e.target.value);

  // Format price for display
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} activeView={activeView} />

      {/* Main Content */}
      <div className="flex-1 p-6 text-black">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Products Available</h1>
          <button
            onClick={handleAddProduct}
            className="bg-[#586330] text-white px-6 py-2 rounded-lg hover:bg-[#586330]/60 transition flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Product</span>
          </button>
        </header>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products by name, category, or description..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330] focus:border-transparent"
          />
        </div>

        {/* Product Categories */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={`px-4 py-2 rounded-lg transition duration-200 font-medium ${
                activeCategory === category.id
                  ? 'bg-[#586330] text-white hover:bg-[#586330]/60'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Product Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {productsToShow.length} of {filteredProducts.length} products
            </p>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsToShow.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              {/* Product Image */}
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'} 
                  alt={product.productName}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">{product.productName}</h4>
                  {product.rating > 0 && (
                    <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                      ⭐ {product.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                
                <div className="mb-3">
                  <span className="text-[#586330] font-bold text-lg">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-gray-500 bg-[#586330]/20 text-[#586330]/70 px-2 py-1 rounded ml-2">
                    {product.productCategory}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                {/* Additional Product Details */}
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Quantity:</span>
                    <span>{product.quantity}</span>
                  </div>
                  {product.vendorId && (
                    <div className="flex justify-between">
                      <span className="font-medium">Vendor ID:</span>
                      <span>{product.vendorId}</span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdateProduct(product)}
                    className="flex-1 bg-[#586330]/60 text-white py-2 rounded-md hover:bg-[#586330]/70 transition font-medium text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Message */}
        {!loading && productsToShow.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No products found matching your search.' : 'No products found in this category.'}
            </p>
          </div>
        )}

        {/* Load More Button */}
        {!loading && visibleProducts < filteredProducts.length && (
          <div className="text-center mt-8">
            <button 
              onClick={handleLoadMore}
              className="px-6 py-3 bg-[#586330] text-white rounded-lg hover:bg-[#586330]/60 transition duration-200 font-medium"
            >
              Load More Products
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <ProductModal
          title="Add New Product"
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          onSave={handleSaveNewProduct}
          onClose={() => {
            setShowAddModal(false);
            setNewProduct({
              productName: '',
              description: '',
              price: 0,
              quantity: 1,
              productCategory: '',
              image: '',
              rating: 0
            });
          }}
          handleImageUpload={handleImageUpload}
          handleRemoveImage={handleRemoveImage}
          categories={categories.filter(cat => cat.id !== 'all')}
          isSaving={saving}
        />
      )}

      {showUpdateModal && (
        <ProductModal
          title="Update Product"
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          onSave={handleSaveUpdatedProduct}
          onClose={() => {
            setShowUpdateModal(false);
            setEditingProduct(null);
            setNewProduct({
              productName: '',
              description: '',
              price: 0,
              quantity: 1,
              productCategory: '',
              image: '',
              rating: 0
            });
          }}
          handleImageUpload={handleImageUpload}
          handleRemoveImage={handleRemoveImage}
          categories={categories.filter(cat => cat.id !== 'all')}
          isSaving={saving}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Products;