import { useState } from 'react';
import { Link } from 'react-router-dom';

const PostedProduct = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleProducts, setVisibleProducts] = useState(6);

  
  const products = [
    {
      id: 1,
      name: 'Segall Chair',
      vendor: 'Furniture World',
      category: 'furniture',
      description: 'The Segall Chair offers a perfect blend of comfort, durability, and timeless craftsmanship. Designed for both home and office use, it provides exceptional comfort even during long sitting hours. Each piece is carefully crafted with premium materials, ensuring strength and elegant design that enhances any room.',
      price: '₹24,999',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      detailImages: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
      ],
      colors: [
        { name: 'Green', value: '#7B9B7B' },
        { name: 'Pink', value: '#C9A5A5' },
        { name: 'Orange', value: '#D17B4A' },
        { name: 'Camel', value: '#B8997E' }
      ]
    },
    {
      id: 2,
      name: 'Organic Grocery Bundle',
      vendor: 'Fresh Market',
      category: 'grocery',
      description: 'Premium organic fruits and vegetables sourced directly from local farms. Our grocery bundle includes fresh seasonal produce, ensuring the highest quality and nutritional value for your family.',
      price: '₹1,299',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
      detailImages: [
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
        'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800'
      ],
      colors: [
        { name: 'Mixed', value: '#7B9B7B' }
      ]
    },
    {
      id: 3,
      name: 'Kitchen Utensil Set',
      vendor: 'Cislin Home',
      category: 'cislin',
      description: 'Complete kitchen utensil set made from high-quality stainless steel and heat-resistant materials. Includes all essential tools for modern cooking and baking needs.',
      price: '₹6,599',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      detailImages: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        'https://images.unsplash.com/photo-1584620787279-5db6cee2a8bf?w=800'
      ],
      colors: [
        { name: 'Silver', value: '#C0C0C0' },
        { name: 'Black', value: '#000000' }
      ]
    },
    {
      id: 4,
      name: 'Office Desk',
      vendor: 'Office Pro',
      category: 'furniture',
      description: 'Modern office desk with spacious work surface and built-in storage. Features ergonomic design and durable construction perfect for home or professional office settings.',
      price: '₹38,499',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400',
      detailImages: [
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'
      ],
      colors: [
        { name: 'Walnut', value: '#773F1A' },
        { name: 'White', value: '#FFFFFF' },
        { name: 'Black', value: '#000000' }
      ]
    },
    {
      id: 5,
      name: 'Fresh Dairy Package',
      vendor: 'Dairy Delight',
      category: 'grocery',
      description: 'Fresh dairy products including milk, cheese, yogurt, and butter. All products are locally sourced and delivered fresh to your doorstep.',
      price: '₹799',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
      detailImages: [
        'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800'
      ],
      colors: [
        { name: 'Standard', value: '#F5F5DC' }
      ]
    },
    {
      id: 6,
      name: 'Bathroom Accessories',
      vendor: 'Cislin Essentials',
      category: 'cislin',
      description: 'Elegant bathroom accessory set including soap dispensers, toothbrush holders, and towel racks. Modern design with waterproof and rust-resistant materials.',
      price: '₹7,499',
      image: 'https://images.unsplash.com/photo-1584620787279-5db6cee2a8bf?w=400',
      detailImages: [
        'https://images.unsplash.com/photo-1584620787279-5db6cee2a8bf?w=800'
      ],
      colors: [
        { name: 'Chrome', value: '#D4D4D4' },
        { name: 'Brass', value: '#B5A642' }
      ]
    },
    {
      id: 7,
      name: 'Dining Table Set',
      vendor: 'Furniture Masters',
      category: 'furniture',
      description: 'Beautiful dining table set with 6 chairs. Made from solid wood with a elegant finish that complements any dining room decor.',
      price: '₹74,999',
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400',
      detailImages: [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800'
      ],
      colors: [
        { name: 'Mahogany', value: '#C04000' },
        { name: 'Oak', value: '#DAAD86' }
      ]
    },
    {
      id: 8,
      name: 'Snacks & Beverages',
      vendor: 'Quick Bites',
      category: 'grocery',
      description: 'Assorted snacks and beverages package perfect for parties, office meetings, or family gatherings. Includes both healthy and indulgent options.',
      price: '₹1,299',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
      detailImages: [
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'
      ],
      colors: [
        { name: 'Assorted', value: '#FF6B6B' }
      ]
    },
    {
      id: 9,
      name: 'Study Table',
      vendor: 'Study Smart',
      category: 'furniture',
      description: 'Compact study table with bookshelf and drawer. Perfect for students and professionals working from home.',
      price: '₹12,999',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      detailImages: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
      ],
      colors: [
        { name: 'Maple', value: '#D9A066' },
        { name: 'White', value: '#FFFFFF' }
      ]
    }
  ];

  
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'grocery', name: 'Grocery' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'cislin', name: 'Home Essentials' }
  ];

  
  const filteredProducts = products.filter(product => 
    activeCategory === 'all' || product.category === activeCategory
  );

  
  const productsToShow = filteredProducts.slice(0, visibleProducts);

  
  const handleCategoryFilter = (categoryId) => {
    setActiveCategory(categoryId);
    setVisibleProducts(6); 
  };

 
  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + 3);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold mb-8 text-gray-900">Posted Products</h3>
        
        {/* Product Categories */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={`px-4 py-2 rounded-lg transition duration-200 font-medium ${
                activeCategory === category.id
                  ? 'bg-[#586330]/80 text-white hover:bg-[#586330]/90'
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

        {/* Product List */}
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
                  <span className="text-[#586330]/60 font-bold text-lg">{product.price}</span>
                  <span className="text-xs text-gray-500 bg-[#586330]/10 text-[#586330]/70 px-2 py-1 rounded ml-2 capitalize">
                    {product.category === 'cislin' ? 'Home Essentials' : product.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                  {product.description}
                </p>
                
                <Link 
                  to={`/product/${product.id}`}
                  state={{ product }}
                  className="inline-flex items-center text-[#586330]/80 hover:text-[#586330]/100 font-medium transition duration-200"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Message */}
        {productsToShow.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}

        {/* Load More Button */}
        {visibleProducts < filteredProducts.length && (
          <div className="text-center mt-8">
            <button 
              onClick={handleLoadMore}
              className="px-6 py-3 bg-[#586330]/80 text-white rounded-lg hover:bg-[#586330]/90 transition duration-200 font-medium"
            >
              Load More Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PostedProduct;