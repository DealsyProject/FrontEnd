import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from './Footer';

export default function ProductDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};
  
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || { name: 'Default', value: '#7B9B7B' });
  const [selectedImage, setSelectedImage] = useState(0);

  // If no product data is passed, redirect back
  if (!product) {
    navigate('/products');
    return null;
  }

  const handleBackToList = () => {
    navigate('/');
  };

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? product.detailImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === product.detailImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen ">
      {/* Navbar */}
      <nav className="px-8 py-4">
        <div className="text-2xl font-bold text-green-600">Dealsy</div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={product.detailImages[selectedImage]}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                100% Recycled
              </div>

              {product.detailImages.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {product.detailImages.length > 1 && (
              <div className="flex gap-4">
                {product.detailImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-24 h-24 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? 'border-[#6B4E4E]'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-2xl font-semibold text-green-600 mt-2">{product.price}</p>
              <p className="text-sm text-gray-500 mt-1">Vendor: {product.vendor}</p>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 1 && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Color:</label>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-2 rounded-full transition ${
                        selectedColor.name === color.name
                          ? 'ring-2 ring-gray-800 ring-offset-2'
                          : 'hover:ring-2 hover:ring-gray-400 hover:ring-offset-2'
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      <span className={`text-sm font-medium ${
                        color.value === '#000000' ? 'text-white' : 
                        color.value === '#FFFFFF' ? 'text-black' : 'text-white'
                      }`}>
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Features */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Premium quality materials</li>
                <li>• Eco-friendly and sustainable</li>
                <li>• Direct from trusted vendors</li>
                <li>• Fast and reliable delivery</li>
              </ul>
            </div>

            {/* Contact Vendor */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Interested in this product?</h3>
              <p className="text-green-800 mb-4">Contact the vendor directly for purchases and inquiries.</p>
              <div className="flex items-center justify-between">
                <span className="text-green-700 font-medium">Vendor: {product.vendor}</span>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Contact Vendor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

     <Footer/>
    </div>
  );
}