import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#242522] py-8 px-12">
      <div className="flex flex-col md:flex-row justify-between items-start">
        {/* Left: Site Name & Social Icons */}
        <div className="mb-8 md:mb-0">
          <div className="text-lg font-medium text-white mb-4">Dealsy</div>
          <div className="flex space-x-4 mb-4">
            <FaFacebookF className="text-white hover:text-blue-600" />
            <FaLinkedinIn className="text-white hover:text-blue-700" />
            <FaYoutube className="text-white hover:text-red-600" />
            <FaInstagram className="text-white hover:text-pink-500" />
          </div>
        </div>
        {/* Right: Links Grouped by Topic */}
        <div className="grid grid-cols-3 text-white gap-16">
          {["Topic", "Topic", "Topic"].map((topic, idx) => (
            <div key={idx}>
              <div className="font-semibold mb-2">{topic}</div>
              <ul className="space-y-2">
                <li className="text-white text-sm">Page</li>
                <li className="text-white text-sm">Page</li>
                <li className="text-white text-sm">Page</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
