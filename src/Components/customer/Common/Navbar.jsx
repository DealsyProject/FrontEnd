import { FaRegHeart, FaRegUser, FaSearch } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-transparent px-8 py-4 flex items-center justify-between w-full">
      {/* Left: Brand and Search */}
      <div className="flex items-center space-x-4">
        <div
          onClick={() => navigate('/')}
          className="bg-white/40 backdrop-blur-md rounded-full px-6 py-2 cursor-pointer flex items-center"
        >
          <span className="font-serif text-2xl font-bold select-none">Dealsy</span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="looking for?"
            className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full text-sm outline-none"
          />
          <FaSearch className="absolute right-3 top-2 text-gray-500" />
        </div>
      </div>

      {/* Center: Navigation Links */}
      <div className="bg-white/40 backdrop-blur-md rounded-full px-6 py-2 flex items-center space-x-4">
        <button
          onClick={() => navigate('/customerproducts')}
          className="text-sm font-medium hover:text-[#586330] transition"
        >
          Products
        </button>
        <button
          onClick={() => navigate('/about')}
          className="text-sm font-medium hover:text-[#586330] transition"
        >
          About Us
        </button>
        <button
          onClick={() => navigate('/contact')}
          className="text-sm font-medium hover:text-[#586330] transition"
        >
          Contact
        </button>
      </div>

      {/* Right: Chat and Auth Buttons */}
      <div className="flex items-center space-x-4">
        <div className="bg-white/40 backdrop-blur-md rounded-full px-3 py-2 cursor-pointer flex items-center">
          <button className="bg-[#586330] text-white rounded-full px-3 py-2 flex items-center">
            <IoChatbubbleEllipsesOutline className="text-xl cursor-pointer"
              onClick={() => navigate('/customerchat')}
            />
          </button>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-3">
          <FaRegHeart
            className="text-xl cursor-pointer hover:text-[#586330] transition"
            onClick={() => navigate('/customerwishlist')}
          />
          <FiShoppingCart
            className="text-xl cursor-pointer hover:text-[#586330] transition"
            onClick={() => navigate('/customercart')}
          />
          <FaRegUser
            className="text-xl cursor-pointer hover:text-[#586330] transition"
            onClick={() => navigate('/customerprofile')}
          />
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2">
          <button
            onClick={() => navigate('/login')}
            className="bg-[#586330] text-white px-4 py-2 rounded-full font-medium cursor-pointer hover:bg-[#465127] transition"
          >
            Login &rarr;
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-[#586330] text-white px-4 py-2 rounded-full font-medium cursor-pointer hover:bg-[#465127] transition"
          >
            Sign Up &rarr;
          </button>
        </div>
      </div>
    </nav>
  );
}
