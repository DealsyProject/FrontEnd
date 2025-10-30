import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';



//admin
import AdminDashboard from './Pages/Admin/AdminDashboard.jsx';
import ProductPage from './Pages/Admin/ProductPage.jsx';
import OrdersPage from './Pages/Admin/OrdersPage.jsx';
import TransactionsPage from './Pages/Admin/TransactionsPage.jsx';
import UserManagement from './Pages/Admin/UserManagment.jsx';
import ChatSupport from './Pages/Admin/ChatSupport.jsx';
import PendingVendors from './Pages/Admin/PendingVendors.jsx';
import ProductReturnPage from "./Pages/Admin/ProductReturnPage.jsx";
import SupportTeamPage from "./Pages/Admin/SupportTeamPage.jsx";


//customer
import CustomerHome from './Pages/customer/CustomerHome';
import CustomerRegistration from './Pages/customer/CustomerRegistration';
import CustomerProducts from './Pages/customer/CustomerProducts';
import CustomerProductView from './Pages/customer/CustomerProductview';
import CustomerProfile from './Pages/customer/CustomerProfile';
import CustomerCart from './Pages/customer/CustomerCart';
import CustomerWishList from './Pages/customer/CustomerWishList';
import CustomerCheckout from './Pages/customer/CustomerCheckout';
import CustomerChat from './Pages/customer/CustomerChat';



// Support Team 
import Helpcenter from './Pages/SupportTeam/Helpcenter';
import CustemerVenderDetails from "./Pages/SupportTeam/CustemerVenderDetails"
import ReturnRefundTracker from './Pages/SupportTeam/ReturnRefundTracker';



//Common for all users
import Login from './Pages/Auth/Login';

//Common for vendor/customer
import Register from './Pages/Auth/Register';



//Vendor
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

      <Routes>

        {/* admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/productPage" element={<ProductPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/Transaction" element={<TransactionsPage />} />
        <Route path="/user" element={<UserManagement />} />
        <Route path="/ChatSupport" element={<ChatSupport />} />
        <Route path="/Vendors" element={<PendingVendors />} />
        <Route path="/product-returns" element={<ProductReturnPage />} />
        <Route path="/support-team" element={<SupportTeamPage />} />



        {/* Vendor */}
        <Route path="/VendorHome" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vendor-register" element={<VendorRegister />} />
        <Route path="/reviews" element={<CustomerReviews />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/vendor-dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/payments" element={<Payments />} />



        {/* Customer  */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/customer-register" element={<CustomerRegistration />} />
        <Route path="/customerproducts" element={<CustomerProducts />} />
        <Route path="/customerproductview/:id" element={<CustomerProductView />} />
        <Route path="/customerprofile" element={<CustomerProfile />} />
        <Route path="/customercart" element={<CustomerCart />} />
        <Route path="/customerwishlist" element={<CustomerWishList />} />
        <Route path="/customercheckout" element={<CustomerCheckout />} />
        <Route path="/customerchat" element={<CustomerChat />} />



        {/* Support Team */}
        <Route path="/support-helpcenter" element={<Helpcenter />} />
        <Route path="/support-custemervenderdetails" element={<CustemerVenderDetails />} />
        <Route path="/support-returnrefundtracker" element={<ReturnRefundTracker />} />


      </Routes>
    </Router>
  );
}

export default App;