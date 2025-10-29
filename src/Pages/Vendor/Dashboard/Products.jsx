
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
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: 'Modern Chair', 
      category: 'Furniture', 
      quantity: 1, 
      description: 'Comfortable modern chair with 5% discount', 
      taxRate: '10%', 
      total: 12000, 
      location: 'Warehouse A', 
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80' 
    },
    { 
      id: 2, 
      name: 'Queen Size Bed', 
      category: 'Furniture', 
      quantity: 1, 
      description: 'Luxury queen size bed with 10% discount', 
      taxRate: '20%', 
      total: 8000, 
      location: 'Warehouse B', 
      image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    quantity: 1,
    description: '',
    taxRate: '',
    total: 0,
    location: '',
    image: '', // Set default image for new products
  });

  // ✅ Add Product Handler
  const handleAddProduct = () => {
    setNewProduct({
      name: '',
      category: '',
      quantity: 1,
      description: '',
      taxRate: '',
      total: 0,
      location: '',
      image: '', // Default image for new products
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
      image: newProduct.image || defaultProductImage // Ensure image is set
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
        image: newProduct.image || defaultProductImage // Ensure image is set
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
    setNewProduct({ ...newProduct, image: defaultProductImage });
    toast.info('Image reset to default');
  };

  // ✅ Search Logic
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const filteredProducts = products.filter(
    (product) =>
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center space-x-2"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition transform hover:-translate-y-1">
              {/* Product Image */}
              <div className="mb-4 flex justify-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                  onError={(e) => {
                    e.target.src = defaultProductImage; // Fallback if image fails to load
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h2>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap">
                    {product.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                
                <div className="space-y-2 text-sm text-gray-700">
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
                  <div className="flex justify-between text-lg font-bold text-green-600 border-t pt-2">
                    <span>Total:</span>
                    <span>₹{product.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Update Button */}
              <button
                onClick={() => handleUpdateProduct(product)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
              >
                Update Product
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first product'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddProduct}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                + Add Your First Product
              </button>
            )}
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
          defaultImage={defaultProductImage}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Products;