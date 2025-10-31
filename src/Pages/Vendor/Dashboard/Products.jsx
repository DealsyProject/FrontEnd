import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductModal from '../../../Components/Vendor/Dashboard/modals/ProductModal';
import Sidebar from '../../../Components/Vendor/Dashboard/Sidebar';
import { useNavigate } from 'react-router-dom';

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

  // Sample product data with same structure as PostedProduct
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: 'Modern Chair', 
      vendor: 'Furniture World',
      category: 'furniture', 
      quantity: 1, 
      description: 'Comfortable modern chair with premium materials and ergonomic design. Perfect for home or office use with exceptional comfort even during long sitting hours.', 
      taxRate: '10%', 
      price: '₹12,000',
      total: 12000, 
      location: 'Warehouse A', 
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      detailImages: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'
      ],
      colors: [
        { name: 'Black', value: '#000000' },
        { name: 'White', value: '#FFFFFF' },
        { name: 'Brown', value: '#8B4513' }
      ]
    },
    { 
      id: 2, 
      name: 'Queen Size Bed', 
      vendor: 'Furniture Masters',
      category: 'furniture', 
      quantity: 1, 
      description: 'Luxury queen size bed with premium wood finish and comfortable mattress. Features elegant design that complements any bedroom decor.', 
      taxRate: '20%', 
      price: '₹8,000',
      total: 8000, 
      location: 'Warehouse B', 
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400',
      detailImages: [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400'
      ],
      colors: [
        { name: 'Walnut', value: '#773F1A' },
        { name: 'Oak', value: '#DAAD86' }
      ]
    },
    { 
      id: 3, 
      name: 'Organic Grocery Bundle', 
      vendor: 'Fresh Market',
      category: 'grocery', 
      quantity: 1, 
      description: 'Premium organic fruits and vegetables sourced directly from local farms. Includes fresh seasonal produce ensuring highest quality and nutritional value.', 
      taxRate: '5%', 
      price: '₹1,299',
      total: 1299, 
      location: 'Cold Storage', 
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
      detailImages: [
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'
      ],
      colors: [
        { name: 'Mixed', value: '#7B9B7B' }
      ]
    },
    { 
      id: 4, 
      name: 'Kitchen Utensil Set', 
      vendor: 'Cislin Home',
      category: 'cislin', 
      quantity: 1, 
      description: 'Complete kitchen utensil set made from high-quality stainless steel and heat-resistant materials. Includes all essential tools for modern cooking needs.', 
      taxRate: '18%', 
      price: '₹6,599',
      total: 6599, 
      location: 'Warehouse C', 
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      detailImages: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'
      ],
      colors: [
        { name: 'Silver', value: '#C0C0C0' },
        { name: 'Black', value: '#000000' }
      ]
    },
  ]);

  // Categories for filtering - matching PostedProduct categories
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'grocery', name: 'Grocery' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'cislin', name: 'Home Essentials' }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    vendor: '',
    category: '',
    quantity: 1,
    description: '',
    taxRate: '',
    price: '',
    total: 0,
    location: '',
    image: '',
    detailImages: [],
    colors: []
  });

  // Filter products based on active category and search
  const filteredProducts = products.filter(product => 
    (activeCategory === 'all' || product.category === activeCategory) &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.vendor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      name: '',
      vendor: '',
      category: '',
      quantity: 1,
      description: '',
      taxRate: '',
      price: '',
      total: 0,
      location: '',
      image: '',
      detailImages: [],
      colors: []
    });
    setShowAddModal(true);
  };

  // ✅ Update Product Handler
  const handleUpdateProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({ ...product });
    setShowUpdateModal(true);
  };

  // ✅ Save New Product
  const handleSaveNewProduct = () => {
    if (!newProduct.name || !newProduct.category) {
      toast.error('Product Name and Category are required!');
      return;
    }

    const newId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    setProducts([...products, { 
      ...newProduct, 
      id: newId,
      image: newProduct.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    }]);
    setShowAddModal(false);
    toast.success('Product added successfully!');
  };

  // ✅ Save Updated Product
  const handleSaveUpdatedProduct = () => {
    if (!newProduct.name || !newProduct.category) {
      toast.error('Product Name and Category are required!');
      return;
    }

    setProducts(products.map((p) => 
      p.id === editingProduct.id ? { 
        ...newProduct, 
        id: editingProduct.id,
        image: newProduct.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
      } : p
    ));
    setShowUpdateModal(false);
    toast.success('Product updated successfully!');
  };

  // ✅ Image Upload Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct({ ...newProduct, image: imageUrl });
      toast.success('Image uploaded successfully!');
    }
  };

  const handleRemoveImage = () => {
    setNewProduct({ ...newProduct, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' });
    toast.info('Image reset to default');
  };

  // Search Logic
  const handleSearch = (e) => setSearchTerm(e.target.value);

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
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Product</span>
          </button>
        </header>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products by name, category, vendor, or description..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Product Categories - Same as PostedProduct */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={`px-4 py-2 rounded-lg transition duration-200 font-medium ${
                activeCategory === category.id
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {productsToShow.length} of {filteredProducts.length} products
          </p>
        </div>

        {/* Product Grid - Same styling as PostedProduct */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsToShow.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              {/* Product Image */}
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {product.vendor}
                  </span>
                </div>
                
                <div className="mb-3">
                  <span className="text-green-600 font-bold text-lg">{product.price}</span>
                  <span className="text-xs text-gray-500 bg-green-100 text-green-700 px-2 py-1 rounded ml-2 capitalize">
                    {product.category === 'cislin' ? 'Home Essentials' : product.category}
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
                  <div className="flex justify-between">
                    <span className="font-medium">Tax Rate:</span>
                    <span>{product.taxRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span className="truncate ml-2">{product.location || 'Not specified'}</span>
                  </div>
                </div>
                
                {/* Update Button */}
                <button
                  onClick={() => handleUpdateProduct(product)}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-medium"
                >
                  Update Product
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Message */}
        {productsToShow.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No products found matching your search.' : 'No products found in this category.'}
            </p>
          </div>
        )}

        {/* Load More Button */}
        {visibleProducts < filteredProducts.length && (
          <div className="text-center mt-8">
            <button 
              onClick={handleLoadMore}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 font-medium"
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
          onClose={() => setShowAddModal(false)}
          handleImageUpload={handleImageUpload}
          handleRemoveImage={handleRemoveImage}
        />
      )}

      {showUpdateModal && (
        <ProductModal
          title="Update Product"
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          onSave={handleSaveUpdatedProduct}
          onClose={() => setShowUpdateModal(false)}
          handleImageUpload={handleImageUpload}
          handleRemoveImage={handleRemoveImage}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Products;