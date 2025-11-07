import React from 'react';

const ProductModal = ({
  title,
  newProduct,
  setNewProduct,
  onSave,
  onClose,
  handleImageUpload,
  handleRemoveImage,
  categories = [],
  isSaving = false
}) => {
  // Fallback categories if none provided
  const defaultCategories = [
    { id: 'Grocery', name: 'Grocery' },
    { id: 'Furniture', name: 'Furniture' },
    { id: 'Books', name: 'Books' },
    { id: 'Home Appliance', name: 'Home Appliance' },
    { id: 'Cloth', name: 'Cloth' }
  ];

  const categoryList = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 my-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

        <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Wireless Bluetooth Headphones"
              value={newProduct.productName || ''}
              onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={newProduct.productCategory || ''}
              onChange={(e) => setNewProduct({ ...newProduct, productCategory: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Select a category</option>
              {categoryList.map((category) => (
                <option key={category.id} value={category.id || category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              placeholder="e.g., 89.99"
              min="0"
              step="0.01"
              value={newProduct.price || ''}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              placeholder="e.g., 50"
              min="0"
              value={newProduct.quantity || 1}
              onChange={(e) =>
                setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 1 })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              placeholder="e.g., High-quality wireless Bluetooth headphones with noise cancellation..."
              value={newProduct.description || ''}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              rows="4"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating (0-5)
            </label>
            <input
              type="number"
              placeholder="e.g., 4.5"
              min="0"
              max="5"
              step="0.1"
              value={newProduct.rating || 0}
              onChange={(e) => setNewProduct({ ...newProduct, rating: parseFloat(e.target.value) || 0 })}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image *
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-gray-600 hover:bg-gray-50 transition">
                  📁 Choose Image
                </div>
              </label>
              {newProduct.image && (
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                    <img 
                      src={newProduct.image} 
                      alt="preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400';
                      }}
                    />
                  </div>
                  <button
                    onClick={handleRemoveImage}
                    className="text-red-500 hover:text-red-700 font-bold"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2 bg-[#586330]/60 text-white rounded-md hover:bg-[#586330]/90 transition font-medium"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;