import { useState, useEffect, useCallback, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductModal from '../../../Components/Vendor/Dashboard/modals/ProductModal';
import Sidebar from '../../../Components/Vendor/Dashboard/Sidebar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Components/utils/axiosInstance';

const Products = () => {
  const navigate = useNavigate();
  const isFetchingRef = useRef(false);
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tempUserData');
    navigate('/');
  }, [navigate]);

  const activeView = 'products';
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'Grocery', name: 'Grocery' },
    { id: 'Furniture', name: 'Furniture' },
    { id: 'Books', name: 'Books' },
    { id: 'Home Appliance', name: 'Home Appliance' },
    { id: 'Cloth', name: 'Cloth' }
  ];

  const [newProduct, setNewProduct] = useState({
    productName: '',
    description: '',
    price: 0,
    quantity: 1,
    productCategory: '',
    images: [],
    rating: 0
  });

  const handleApiError = useCallback((error, defaultMessage) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      handleLogout();
      return;
    }
    
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
      return;
    }
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.errors?.[0]?.errorMessage ||
                        defaultMessage;
    toast.error(errorMessage);
  }, [handleLogout]);

  const fetchProducts = useCallback(async () => {
    if (isFetchingRef.current) {
      console.log('Already fetching products, skipping...');
      return;
    }
    
    try {
      isFetchingRef.current = true;
      setLoading(true);
      console.log('Fetching products from /Product/my-products');
      
      const response = await axiosInstance.get('/Product/my-products');
      console.log('Products API Response:', response.data);
      
      const productsData = response.data.products || [];
      console.log('Products count:', productsData.length);
      
      setProducts(productsData);
      
      if (productsData.length === 0) {
        toast.info('No products found. Add your first product!');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      handleApiError(error, 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [handleApiError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
      
      if (searchResults.length === 0) {
        toast.info('No products found matching your search');
      }
    } catch (error) {
      handleApiError(error, 'Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  // Filter products - handle both PascalCase and camelCase
  const filteredProducts = products.filter(product => {
    if (!product) return false;
    
    const productCategory = product.ProductCategory || product.productCategory || '';
    const productName = product.ProductName || product.productName || '';
    const description = product.Description || product.description || '';
    
    const categoryMatch = activeCategory === 'all' || 
      productCategory.toLowerCase() === activeCategory.toLowerCase();
    
    const searchMatch = 
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const productsToShow = filteredProducts.slice(0, visibleProducts);

  const handleCategoryFilter = (categoryId) => {
    setActiveCategory(categoryId);
    setVisibleProducts(6);
  };

  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + 3);
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

  const handleAddProduct = () => {
    setNewProduct({
      productName: '',
      description: '',
      price: 0,
      quantity: 1,
      productCategory: '',
      images: [],
      rating: 0
    });
    setShowAddModal(true);
  };

  const handleUpdateProduct = (product) => {
    console.log('Editing product:', product);
    setEditingProduct(product);
    
    // Handle both PascalCase and camelCase
    const images = product.Images || product.images || [];
    const imageDataArray = images.map(img => img.ImageData || img.imageData);
    
    setNewProduct({ 
      productName: product.ProductName || product.productName || '',
      description: product.Description || product.description || '',
      price: product.Price || product.price || 0,
      quantity: product.Quantity || product.quantity || 1,
      productCategory: product.ProductCategory || product.productCategory || '',
      images: imageDataArray,
      rating: product.Rating || product.rating || 0
    });
    setShowUpdateModal(true);
  };

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
    if (!newProduct.images || newProduct.images.length === 0) {
      toast.error('At least 1 product image is required!');
      return false;
    }
    if (newProduct.images.length > 3) {
      toast.error('Maximum 3 images allowed!');
      return false;
    }
    return true;
  };

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
        images: newProduct.images,
        rating: parseFloat(newProduct.rating) || 0
      };

      await axiosInstance.post('/Product/create', productData);
      await fetchProducts();
      
      setShowAddModal(false);
      setNewProduct({
        productName: '',
        description: '',
        price: 0,
        quantity: 1,
        productCategory: '',
        images: [],
        rating: 0
      });
      
      toast.success('Product added successfully!');
    } catch (error) {
      handleApiError(error, 'Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUpdatedProduct = async () => {
    if (!validateProduct()) {
      return;
    }

    setSaving(true);
    try {
      const productId = editingProduct.Id || editingProduct.id;
      const productData = {
        id: productId,
        productName: newProduct.productName.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
        productCategory: newProduct.productCategory.trim(),
        images: newProduct.images,
        rating: parseFloat(newProduct.rating) || 0
      };

      await axiosInstance.put(`/Product/update/${productId}`, productData);
      await fetchProducts();
      
      setShowUpdateModal(false);
      setEditingProduct(null);
      setNewProduct({
        productName: '',
        description: '',
        price: 0,
        quantity: 1,
        productCategory: '',
        images: [],
        rating: 0
      });
      
      toast.success('Product updated successfully!');
    } catch (error) {
      handleApiError(error, 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/Product/delete/${productId}`);
      await fetchProducts();
      toast.success('Product deleted successfully!');
    } catch (error) {
      handleApiError(error, 'Failed to delete product');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (newProduct.images.length >= 3) {
        toast.error('Maximum 3 images allowed');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, WebP)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setNewProduct(prev => ({ 
          ...prev, 
          images: [...prev.images, base64String] 
        }));
        toast.success(`Image ${newProduct.images.length + 1} uploaded successfully!`);
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    toast.info(`Image ${index + 1} removed`);
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-sm ${
              index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

 
  const ProductCard = ({ product }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    
    const productImages = product.Images || product.images || [];
    const hasMultipleImages = productImages.length > 1;
    
    const getImageUrl = (image) => {
      if (!image) return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400';
      return image.ImageData || image.imageData || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400';
    };

    const getPrimaryImage = () => {
      if (!productImages.length) return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400';
      
      const primaryImage = productImages.find(img => img.IsPrimary || img.isPrimary);
      if (primaryImage) return getImageUrl(primaryImage);
      
      return getImageUrl(productImages[0]);
    };

    const currentImage = productImages[selectedImageIndex];
    const displayImage = currentImage ? getImageUrl(currentImage) : getPrimaryImage();

    // Handle both PascalCase and camelCase
    const productName = product.ProductName || product.productName || '';
    const productCategory = product.ProductCategory || product.productCategory || '';
    const price = product.Price || product.price || 0;
    const rating = product.Rating || product.rating || 0;
    const description = product.Description || product.description || '';
    const quantity = product.Quantity || product.quantity || 0;
    const createdOn = product.CreatedOn || product.createdOn || new Date();
    const productId = product.Id || product.id;

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-200">
        <div className="h-48 bg-gray-200 overflow-hidden relative group">
          <img 
            src={displayImage}
            alt={productName}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400';
            }}
          />
          
          {hasMultipleImages && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
              {selectedImageIndex + 1}/{productImages.length}
            </div>
          )}

          {quantity === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
              Out of Stock
            </div>
          )}

          {rating > 0 && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
              ⭐ {rating.toFixed(1)}
            </div>
          )}

          {hasMultipleImages && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2 justify-center">
                {productImages.map((img, index) => (
                  <button
                    key={img.Id || img.id || index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(index);
                    }}
                    className={`w-12 h-12 rounded overflow-hidden transition-all ${
                      selectedImageIndex === index 
                        ? 'ring-2 ring-white scale-110' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">{productName}</h4>
            <span className="text-xs text-[#586330] bg-[#586330]/20 px-2 py-1 rounded-full font-medium">
              {productCategory}
            </span>
          </div>
          
          <div className="mb-3">
            <span className="text-[#586330] font-bold text-xl">
              {formatPrice(price)}
            </span>
            {rating > 0 && (
              <div className="mt-1">
                {renderRating(rating)}
              </div>
            )}
          </div>
          
          <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>

          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <div className="flex justify-between">
              <span className="font-medium">Quantity:</span>
              <span className={`font-semibold ${
                quantity > 10 ? 'text-green-600' : 
                quantity > 0 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {quantity} in stock
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Images:</span>
              <span className="text-gray-600">{productImages.length} photo{productImages.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Added:</span>
              <span>{new Date(createdOn).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleUpdateProduct(product)}
              className="flex-1 bg-[#586330] text-white py-2 rounded-lg hover:bg-[#586330]/80 transition font-medium text-sm"
            >
              Update
            </button>
            <button
              onClick={() => handleDeleteProduct(productId)}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Get quantity for stats - handle both cases
  const getQuantity = (p) => (p.Quantity !== undefined ? p.Quantity : p.quantity) || 0;
  const getImages = (p) => (p.Images || p.images) || [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} activeView={activeView} />

      <div className="flex-1 p-6 text-black">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
            <p className="text-gray-600 mt-2">Manage your product inventory and listings</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-[#586330] text-white px-6 py-3 rounded-lg hover:bg-[#586330]/80 transition flex items-center space-x-2 font-medium"
          >
            <span className="text-lg">+</span>
            <span>Add Product</span>
          </button>
        </header>

        <div className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search products by name, category, or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchSubmit}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#586330] focus:border-transparent"
            />
            <button
              onClick={handleSearchSubmit}
              className="px-6 py-3 bg-[#586330] text-white rounded-lg hover:bg-[#586330]/80 transition font-medium"
            >
              Search
            </button>
          
          </div>
        </div>

        <div className="flex gap-4 mb-8 flex-wrap">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={`px-4 py-2 rounded-lg transition duration-200 font-medium ${
                activeCategory === category.id
                  ? 'bg-[#586330] text-white hover:bg-[#586330]/80 shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
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
              Showing {productsToShow.length} of {filteredProducts.length} products
              {activeCategory !== 'all' && ` in ${categories.find(c => c.id === activeCategory)?.name}`}
            </p>
            <div className="flex gap-4 text-sm">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Total: {products.length}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                In Stock: {products.filter(p => getQuantity(p) > 0).length}
              </span>
            </div>
          </div>
        )}

        {!loading && productsToShow.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsToShow.map((product, index) => (
              <ProductCard key={product.Id || product.id || index} product={product} />
            ))}
          </div>
        )}

        {!loading && productsToShow.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm || activeCategory !== 'all' ? 'No products found' : 'No products available'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or filters' 
                : activeCategory !== 'all'
                ? `No products found in ${categories.find(c => c.id === activeCategory)?.name} category`
                : 'Get started by adding your first product'
              }
            </p>
            {products.length === 0 && (
              <button
                onClick={handleAddProduct}
                className="bg-[#586330] text-white px-6 py-3 rounded-lg hover:bg-[#586330]/80 transition font-medium"
              >
                Add Your First Product
              </button>
            )}
          </div>
        )}

        {!loading && visibleProducts < filteredProducts.length && (
          <div className="text-center mt-8">
            <button 
              onClick={handleLoadMore}
              className="px-8 py-3 bg-[#586330] text-white rounded-lg hover:bg-[#586330]/80 transition duration-200 font-medium shadow-md"
            >
              Load More Products ({filteredProducts.length - visibleProducts} remaining)
            </button>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Products Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                <div className="text-sm text-blue-800">Total Products</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => getQuantity(p) > 0).length}
                </div>
                <div className="text-sm text-green-800">In Stock</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {products.filter(p => getQuantity(p) === 0).length}
                </div>
                <div className="text-sm text-yellow-800">Out of Stock</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {products.reduce((sum, p) => sum + getImages(p).length, 0)}
                </div>
                <div className="text-sm text-purple-800">Total Images</div>
              </div>
            </div>
          </div>
        )}
      </div>

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
              images: [],
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
              images: [],
              rating: 0
            });
          }}
          handleImageUpload={handleImageUpload}
          handleRemoveImage={handleRemoveImage}
          categories={categories.filter(cat => cat.id !== 'all')}
          isSaving={saving}
        />
      )}

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Products;