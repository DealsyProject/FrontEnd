import { ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const colors = [
  { name: 'Green', value: '#7B9B7B' },
  { name: 'Pink', value: '#C9A5A5' },
  { name: 'Orange', value: '#D17B4A' },
  { name: 'Camel', value: '#B8997E' }
];

const productImages = [
  'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600'
];

export default function ProductDetail({ onBack }) {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleBackToList = () => {
    onBack();
  };

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} item(s) of "${selectedColor.name}" color to your cart!`, {
      position: 'top-right',
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Navbar */}
      <nav className="px-8 py-4">
        <div className="text-2xl font-bold text-[#6B4E4E]">Dealsy</div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to List</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={productImages[selectedImage]}
                alt="Product"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                100% Recycled
              </div>

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
            </div>

            <div className="flex gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-24 h-24 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? 'border-[#6B4E4E]'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">The Segall Chair</h1>

            <p className="text-gray-600 leading-relaxed">
              The Segall Chair combines comfort, craftsmanship, and timeless style. Made from premium wood and eco-friendly
              materials, it’s perfect for modern homes or offices.
            </p>

            {/* Color Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Color:</label>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color) => (
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
                    <span className="text-white text-sm font-medium">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 bg-white border rounded-full hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 bg-white border rounded-full hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-[#6B4E4E] text-white px-6 py-3 rounded-full hover:bg-[#5A3D3D] transition"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#6B4E4E] text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Dealsy</h3>
            </div>
            <div>
              <h4 className="font-semibold mb-4">More</h4>
              <ul className="space-y-2">
                {['Lorem Ipsum', 'Lorem Ipsum', 'Lorem Ipsum'].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-sm text-white/80 hover:text-white transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Collections</h4>
              <ul className="space-y-2">
                {['Lorem Ipsum', 'Lorem Ipsum', 'Lorem Ipsum'].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-sm text-white/80 hover:text-white transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2">
                {['Lorem Ipsum', 'Lorem Ipsum'].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-sm text-white/80 hover:text-white transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links</h4>
              <ul className="space-y-2">
                {['Lorem Ipsum', 'Lorem Ipsum', 'Lorem Ipsum'].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-sm text-white/80 hover:text-white transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 text-center">
            <p className="text-sm text-white/60">© 2025 Dealsy LLC. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
