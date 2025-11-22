import React, { useState, useEffect } from 'react';

const ProductModal = ({
  title,
  newProduct,
  setNewProduct,
  onSave,
  onClose,
  handleImageUpload,
  handleRemoveImage,
  categories = [],
  isSaving = false,
  editingProduct = null // Add this prop to know if we're in edit mode
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const defaultCategories = [
    { id: 'Grocery', name: 'Grocery' },
    { id: 'Furniture', name: 'Furniture' },
    { id: 'Books', name: 'Books' },
    { id: 'Home Appliance', name: 'Home Appliance' },
    { id: 'Cloth', name: 'Cloth' }
  ];

  const categoryList = categories.length > 0 ? categories : defaultCategories;

  // Helper function to check if an image is a File object (new image) or URL string (existing image)
  const isFileObject = (img) => img instanceof File;
  const isImageUrl = (img) => typeof img === 'string' && (img.startsWith('http') || img.startsWith('https'));

  // Helper function to get image source URL
  const getImageSrc = (img) => {
    if (isFileObject(img)) {
      return URL.createObjectURL(img);
    } else if (isImageUrl(img)) {
      return img;
    }
    return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400';
  };

  const handleInputChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumberInputChange = (field, value) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setNewProduct(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  // Count existing and new images separately
  const existingImages = newProduct.images ? newProduct.images.filter(img => isImageUrl(img)) : [];
  const newImages = newProduct.images ? newProduct.images.filter(img => isFileObject(img)) : [];
  const totalImages = existingImages.length + newImages.length;

  // Reset active image index when images change
  useEffect(() => {
    if (activeImageIndex >= totalImages) {
      setActiveImageIndex(Math.max(0, totalImages - 1));
    }
  }, [totalImages, activeImageIndex]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#586330] text-white p-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-green-100 mt-1">Fill in the product details below (Upload up to 3 images)</p>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Product Details */}
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Wireless Bluetooth Headphones"
                  value={newProduct.productName || ''}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#586330] focus:border-transparent outline-none transition"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={newProduct.productCategory || ''}
                  onChange={(e) => handleInputChange('productCategory', e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#586330] focus:border-transparent outline-none bg-white transition"
                >
                  <option value="">Select a category</option>
                  {categoryList.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price & Quantity Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={newProduct.price || ''}
                    onChange={(e) => handleNumberInputChange('price', e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#586330] focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={newProduct.quantity || ''}
                    onChange={(e) => handleNumberInputChange('quantity', e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#586330] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Describe your product features, specifications, and benefits..."
                  value={newProduct.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows="5"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#586330] focus:border-transparent outline-none resize-none transition"
                />
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (1-3 images) *
                {existingImages.length > 0 && (
                  <span className="text-xs text-green-600 ml-2">
                    {existingImages.length} existing image(s) • {newImages.length} new image(s)
                  </span>
                )}
              </label>

              {/* Main Image Preview */}
              {totalImages > 0 ? (
                <div className="space-y-3">
                  {/* Large Preview */}
                  <div className="relative">
                    <img 
                      src={getImageSrc(newProduct.images[activeImageIndex])}
                      alt={`Product preview ${activeImageIndex + 1}`}
                      className="w-full h-64 object-cover rounded-lg border-2 border-[#586330]"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                      {activeImageIndex + 1} / {totalImages}
                    </div>
                    {/* Image Type Badge */}
                    {newProduct.images[activeImageIndex] && (
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                        isFileObject(newProduct.images[activeImageIndex]) 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-green-500 text-white'
                      }`}>
                        {isFileObject(newProduct.images[activeImageIndex]) ? 'NEW' : 'EXISTING'}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Images */}
                  <div className="grid grid-cols-3 gap-3">
                    {newProduct.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={getImageSrc(img)}
                          alt={`Thumbnail ${index + 1}`}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-full h-24 object-cover rounded-lg cursor-pointer transition-all ${
                            activeImageIndex === index
                              ? 'border-4 border-[#586330] ring-2 ring-[#586330] ring-offset-2'
                              : 'border-2 border-gray-300 hover:border-[#586330] opacity-70 hover:opacity-100'
                          }`}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400';
                          }}
                        />
                        
                        {/* Image Type Indicator */}
                        <div className={`absolute top-1 left-1 w-2 h-2 rounded-full ${
                          isFileObject(img) ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        
                        {/* Remove Button - Only show for new images or if we want to allow removing existing ones */}
                        {(isFileObject(img) || true) && ( // Set to true if you want to allow removing existing images
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                              if (activeImageIndex >= newProduct.images.length - 1) {
                                setActiveImageIndex(Math.max(0, newProduct.images.length - 2));
                              }
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                            title={isFileObject(img) ? "Remove new image" : "Remove existing image"}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add More Images Slots */}
                    {totalImages < 3 && (
                      <label className="cursor-pointer">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                          multiple
                        />
                        <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#586330] hover:bg-gray-50 transition">
                          <div className="text-center">
                            <span className="text-3xl text-gray-400">+</span>
                            <p className="text-xs text-gray-500 mt-1">Add Image</p>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              ) : (
                // Empty State - No Images
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                    <div className="text-6xl mb-3">📷</div>
                    <p className="text-gray-600 font-medium mb-2">No images uploaded</p>
                    <p className="text-gray-500 text-sm mb-4">Upload 1-3 product images</p>
                    <label className="inline-block">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        multiple
                      />
                      <div className="px-6 py-3 bg-[#586330] text-white rounded-lg hover:bg-[#586330]/90 transition cursor-pointer font-medium">
                        Upload Images
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <span className="font-medium text-blue-800">💡 Tip:</span> 
                {editingProduct ? (
                  <>
                    Blue dot indicates new images, green dot indicates existing images. 
                    You can mix existing and new images. Removing existing images will delete them permanently.
                  </>
                ) : (
                  "Upload 1-3 high-quality images. First image will be the primary display image."
                )}
                <br />
                <span className="text-blue-700">Supported: JPEG, PNG, WebP • Max: 5MB each</span>
              </p>
            </div>
          </div>

          {/* Required Fields Note */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800 flex items-center">
              <span className="text-yellow-500 mr-2">⚠️</span>
              Fields marked with * are required. Please fill all required fields.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="px-6 py-3 bg-[#586330] text-white rounded-lg hover:bg-[#586330]/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingProduct ? 'Update Product' : 'Save Product'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;