import { FaRegHeart, FaRegUser, FaSearch, FaComment } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';



export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-transparent px-8 py-4 flex items-center justify-between w-full">
      {/* Left: Brand and Icons (completely separated, stronger rounding) */}
      <div className="flex items-center space-x-4">
        <div className="bg-white/40 backdrop-blur-md rounded-full px-6 py-2 cursor-pointer flex items-center">
          <span className="font-serif text-2xl font-bold select-none" >Dealsy</span>
        </div>
        <div >
          <div className="relative">
            <input
              type="text"
              placeholder="looking for?"
              className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full text-sm outline-none"
            />
            <FaSearch className="absolute right-3 top-2 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Center: Navigation Links (even more round) */}
      <div className="bg-white/40 backdrop-blur-md rounded-full px-6 py-2  flex items-center space-x-4">
        <a href="/products" className="text-sm font-medium">Products</a>
        <a href="/how-to" className="text-sm font-medium">How-to</a>
        <a href="/contact" className="text-sm font-medium">Contact Us</a>
      </div>

      {/* Right: Chat/Search and Auth Buttons in separate, strongly rounded glassy containers */}
      <div className="flex items-center space-x-4">
        <div className="bg-white/40 backdrop-blur-md rounded-full px-3 py-2 cursor-pointer flex items-center">
          <button className="bg-[#586330] text-white rounded-full px-3 py-2 flex items-center ">
            <IoChatbubbleEllipsesOutline className="text-xl" />
          </button>
        </div>
        
        <div className="bg-white/40 backdrop-blur-md rounded-full px-4 py-2  flex items-center space-x-3">
          <FaRegHeart className="text-xl cursor-pointer" />
          <FiShoppingCart className="text-xl cursor-pointer" />
          <FaRegUser className="text-xl cursor-pointer" />
        </div>
        <div className="bg-white/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2">
          <button className="bg-[#586330] text-white px-4 py-2 rounded-full font-medium cursor-pointer">
            Login &rarr;
          </button>
          <button className="bg-[#586330] text-white px-4 py-2 rounded-full font-medium cursor-pointer">
            Sign Up &rarr;
          </button>
        </div>
      </div>
    </nav>
  );
}
