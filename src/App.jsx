import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//customer imports
import CustomerHome from './Pages/customer/CustomerHome';
import CustomerRegistration from './Pages/customer/CustomerRegistration';
import CustomerProducts from './Pages/customer/CustomerProducts';
import CustomerProductView from './Pages/customer/CustomerProductview';
import CustomerProfile from './Pages/customer/CustomerProfile';
import CustomerCart from './Pages/customer/CustomerCart';
import CustomerWishList from './Pages/customer/CustomerWishList';
import CustomerCheckout from './Pages/customer/CustomerCheckout';
import CustomerChat from './Pages/customer/CustomerChat';


// Vendor Imports 


// Support Team Import components
import Helpcenter from './Pages/SupportTeam/Helpcenter';
import CustemerVenderDetails from "./Pages/SupportTeam/CustemerVenderDetails"
import ReturnRefundTracker from './Pages/SupportTeam/ReturnRefundTracker';

//Vender imports

// Import components

import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import VendorRegister from './Pages/Vendor/VendorRegister';
import Subscription from './Pages/Vendor/Subscription';
import Home from './Pages/Vendor/Home';
import ProductDetail from './Components/Vendor/Home/ProductDetail';
import Dashboard from './Pages/Vendor/Dashboard/Dashboard';
import Products from './Pages/Vendor/Dashboard/Products';
import CustomerReviews from './Components/Vendor/Home/CustomerReviews';
import Customers from './Pages/Vendor/Dashboard/Customers';
import Invoices from './Pages/Vendor/Dashboard/Invoices';
import Payments from './Pages/Vendor/Dashboard/Payments';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {/* Public Routes */}
          <Route path="/VendorHome" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vendor-register" element={<VendorRegister />} />
          <Route path="/reviews" element={<CustomerReviews />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          
      


          {/* Vendor Routes - Accessible to all */}
          <Route path="/product/:id" element={<ProductDetail />} />      

          <Route path="/vendor-dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/payments" element={<Payments />} />

          {/* Customer Routes */}
          <Route path="/" element={<CustomerHome />} />
          <Route path="/customer-register" element={<CustomerRegistration />} />
          <Route path="/customerproducts" element={<CustomerProducts />} />


          <Route path="/customerproductview/:id" element={<CustomerProductView />} />
          <Route path="/customerprofile" element={<CustomerProfile />} />
          <Route path="/customercart" element={<CustomerCart />} />
          <Route path="/customerwishlist" element={<CustomerWishList />} />
          <Route path="/customercheckout" element={<CustomerCheckout />} />
          <Route path="/customerchat" element={<CustomerChat />} />

          




                     {/* Support Team Routes */}
          <Route path="/support-helpcenter" element={<Helpcenter/>} />
          <Route path="/support-custemervenderdetails" element={<CustemerVenderDetails/>} />
          <Route path="/support-returnrefundtracker" element={<ReturnRefundTracker/>} />

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;