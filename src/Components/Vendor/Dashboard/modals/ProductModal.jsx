import React from 'react';

const ProductModal = ({
  title,
  newProduct,
  setNewProduct,
  onSave,
  onClose,
  handleImageUpload,
  handleRemoveImage
}) => (
  <div className="fixed inset-0 text-black bg-green-200 bg-opacity-40 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

      <div className="grid grid-cols-1 gap-3">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={(e) =>
            setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 1 })
          }
          className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="text"
          placeholder="Tax Rate (%)"
          value={newProduct.taxRate}
          onChange={(e) => setNewProduct({ ...newProduct, taxRate: e.target.value })}
          className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="number"
          placeholder="Total"
          value={newProduct.total}
          onChange={(e) => setNewProduct({ ...newProduct, total: e.target.value })}
          className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="text"
          placeholder="Location"
          value={newProduct.location}
          onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
          className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="flex items-center gap-3">
          <label className="flex-1 cursor-pointer">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-gray-600 hover:bg-gray-50">
              Choose Image
            </div>
          </label>
          {newProduct.image && (
            <div className="flex items-center gap-2">
              <img src={newProduct.image} alt="preview" className="w-12 h-12 rounded object-cover" />
              <button
                onClick={handleRemoveImage}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

export default ProductModal;
