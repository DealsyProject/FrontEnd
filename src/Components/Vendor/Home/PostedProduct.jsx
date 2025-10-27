import { Link } from 'react-router-dom';

const PostedProduct = () => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold mb-8">Posted Products</h3>
        
        {/* Product Categories */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition duration-200">
            All Products
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200">
            Grocery
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200">
            Furnitures
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200">
            Cislin
          </button>
        </div>

        {/* Product List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Product Card 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Vendor | Retirement</h4>
            </div>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              The Segall Chain has perfect blend of comfort, durability, and timeless craftsmanship. Metro offers high-quality, 
              best-wood-rinkly smooth market-fruits, its designer for both home and office, and the appropriate service structures 
              comfort even during long sitting hours, making it clear for dining, study, or touring spaces. Each piece is carefully 
              handled through weaker hearts, ensuring strength and elegant design that enhances any room/store.
            </p>
            <Link 
              to="/product/1" 
              className="text-indigo-600 hover:text-indigo-700 font-medium transition duration-200"
            >
              View Details →
            </Link>
          </div>

          {/* Product Card 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Segall Chairs</h4>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Vendor 2 Retirement</span>
            </div>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              The Segall Chain has perfect blend of comfort, durability, and timeless craftsmanship. Metro keeps high-quality, 
              best-wood-rinkly smooth market-fruits, its designer for both home and office, and the appropriate service structures 
              comfort even during long sitting hours, making it clear for dining, study, or touring spaces. Each piece is carefully 
              handled through weaker hearts, ensuring strength and elegant design that enhances any room/store.
            </p>
            <Link 
              to="/product/2" 
              className="text-indigo-600 hover:text-indigo-700 font-medium transition duration-200"
            >
              View Details →
            </Link>
          </div>

          {/* Product Card 3 - Additional example */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Modern Furniture</h4>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Vendor 3</span>
            </div>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Premium quality furniture designed for modern living spaces. Features ergonomic design, sustainable materials, 
              and exceptional craftsmanship that stands the test of time. Perfect for both residential and commercial use.
            </p>
            <Link 
              to="/product/3" 
              className="text-indigo-600 hover:text-indigo-700 font-medium transition duration-200"
            >
              View Details →
            </Link>
          </div>
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition duration-200 font-medium">
            Load More Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default PostedProduct;