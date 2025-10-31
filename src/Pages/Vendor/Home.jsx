import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../../Components/Vendor/Home/Hero';
import PostedProduct from '../../Components/Vendor/Home/PostedProduct';
import CustomerReviews from '../../Components/Vendor/Home/CustomerReviews';
import FeaturesSection from '../../Components/Vendor/Home/FeaturesSection'; 
import Footer from '../../Components/Vendor/Home/Footer';
import About from '../../Components/Vendor/Home/About';
const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
     
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-[#586330]/80">Dealsy</h1>
            <nav className="flex gap-6">
              <Link to="/login" className="text-[#586330]/60 hover:text-gray-900 transition duration-200 mt-2">
                Login
              </Link>
              <Link to="/register" className="bg-[#586330] hover:text-gray-900 p-2 rounded-3xl transition  duration-200">
                Register
              </Link>
            </nav>
          </div>
        </div>
      </header>

        <section>
        <Hero/>
       </section>

      <section>
        <PostedProduct/>
       </section>

      {/* Products Section */}
     
       <section>
        <CustomerReviews/>
       </section>
     
     <section>
        <FeaturesSection/>
     </section>
     <section>
        <About/>
     </section>
      {/* Footer */}
      <section>
        <Footer/>
     </section>
    </div>
  );
};

export default Home;