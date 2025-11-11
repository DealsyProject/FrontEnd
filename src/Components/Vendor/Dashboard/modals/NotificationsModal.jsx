import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AlertTriangle, Package, CheckCircle, User, Star, MapPin, Phone, Mail, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
import axiosInstance from '../../../../Components/utils/axiosInstance';

const NotificationsModal = ({ 
  setShowNotifications, 
  notifications, 
  markNotificationAsRead, 
  fetchNotifications,
  refreshNotifications 
}) => {
  const [updatedNotifications, setUpdatedNotifications] = useState([]);
  const [showCustomerProfile, setShowCustomerProfile] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerReviews, setCustomerReviews] = useState([]);
  const [loading, setLoading] = useState(false);

// In NotificationsModal.jsx - Simplified version
useEffect(() => {
  console.log('🔔 [Modal] Received notifications:', notifications);
  
  if (notifications && Array.isArray(notifications)) {
    // Just use the notifications as they come from Dashboard
    setUpdatedNotifications(notifications);
  } else {
    setUpdatedNotifications([]);
  }
}, [notifications]);

// Fix the filtering logic
const outOfStockNotifications = updatedNotifications.filter(n => 
  n.isOutOfStock === true && n.productName && n.message
);

const orderNotifications = updatedNotifications.filter(n => 
  n.isOutOfStock !== true
);

console.log('🔔 [Modal] Real out-of-stock notifications:', outOfStockNotifications);
console.log('🔔 [Modal] Other notifications:', orderNotifications);

  console.log('Out of stock notifications:', outOfStockNotifications);
  console.log('Order notifications:', orderNotifications);

   const handleMarkAsRead = async (notificationId) => {
    try {
      setLoading(true);
      console.log('Marking notification as read:', notificationId);
      
      await axiosInstance.put(`/Notification/mark-read/${notificationId}`);
      
      // Refresh notifications after marking as read
      if (refreshNotifications) {
        await refreshNotifications();
      } else if (fetchNotifications) {
        await fetchNotifications();
      }
      
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    } finally {
      setLoading(false);
    }
  };


  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      const unreadNotifications = updatedNotifications.filter(n => !n.isRead);
      
      if (unreadNotifications.length === 0) {
        toast.info('All notifications are already read');
        return;
      }
      
      // Mark all unread notifications as read
      const markPromises = unreadNotifications.map(notification => 
        axiosInstance.put(`/Notification/mark-read/${notification.id}`)
      );
      
      await Promise.all(markPromises);
      
      // Update local state
      setUpdatedNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      
      // Refresh notifications
      if (fetchNotifications) {
        await fetchNotifications();
      }
      
      toast.success(`Marked ${unreadNotifications.length} notifications as read`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (productId, productName) => {
    try {
      toast.info(`Redirecting to restock ${productName}`, { position: 'top-right' });
      console.log('Restock product:', productName, 'ID:', productId);
      
      // Close notifications modal
      setShowNotifications(false);
      
      // You can implement navigation to products page here
      // For example: navigate('/vendor/products');
      // Or dispatch an event to open products page
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navigateToProducts', { 
          detail: { productId, productName } 
        }));
      }, 1000);
      
    } catch (error) {
      console.error('Error handling restock:', error);
      toast.error('Failed to process restock request');
    }
  };

  // Add a function to create test notifications for development
  const createTestNotifications = () => {
    const testNotifications = [
      {
        id: 1,
        type: 'OUT_OF_STOCK',
        title: 'Out of Stock Alert',
        message: 'Your product "Wireless Bluetooth Headphones" is out of stock. Please restock to continue sales.',
        productName: 'Wireless Bluetooth Headphones',
        productId: 123,
        createdAt: new Date().toISOString(),
        isRead: false,
        priority: 'HIGH'
      },
      {
        id: 2,
        type: 'OUT_OF_STOCK',
        title: 'Low Stock Warning',
        message: 'Your product "Smart Fitness Watch" is running low. Only 2 items left in stock.',
        productName: 'Smart Fitness Watch',
        productId: 124,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isRead: false,
        priority: 'MEDIUM'
      },
      {
        id: 3,
        type: 'ORDER',
        title: 'New Order Received',
        message: 'Customer John Smith placed an order for "Wireless Earbuds" (Quantity: 2)',
        customer: 'John Smith',
        product: 'Wireless Earbuds',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        isRead: false,
        priority: 'NORMAL'
      },
      {
        id: 4,
        type: 'ORDER',
        title: 'Order Delivered',
        message: 'Your order for "Laptop Backpack" has been successfully delivered to Sarah Johnson.',
        customer: 'Sarah Johnson',
        product: 'Laptop Backpack',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        isRead: true,
        priority: 'NORMAL'
      }
    ];
    setUpdatedNotifications(testNotifications);
    toast.info('Test notifications loaded for demonstration');
  };

  const generateCustomerData = (customerName) => {
    const names = customerName.split(' ');
    const firstName = names[0];
    const lastName = names[1] || '';
    const customerId = customerName.toLowerCase().replace(/\s+/g, '-');
    
    return {
      id: customerId,
      name: customerName,
      firstName: firstName,
      lastName: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalOrders: Math.floor(Math.random() * 50) + 1,
      totalSpent: Math.floor(Math.random() * 10000) + 1000,
      averageRating: (Math.random() * 2 + 3).toFixed(1),
      location: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ'][Math.floor(Math.random() * 5)],
      phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: '👤',
      loyaltyTier: ['Bronze', 'Silver', 'Gold', 'Platinum'][Math.floor(Math.random() * 4)]
    };
  };

  const generateReviews = (customerId, customerName) => {
    const products = [
      'Wireless Headphones', 
      'Smart Watch', 
      'Bluetooth Speaker', 
      'Laptop Backpack', 
      'Desk Lamp', 
      'Fitness Tracker', 
      'Phone Case', 
      'Water Bottle',
      'Wireless Earbuds',
      'Tablet Stand'
    ];
    const vendors = ['Tech Gadgets Inc.', 'Audio Solutions', 'Office Supplies Co.', 'Home Essentials', 'Fitness Gear Pro'];
    const comments = [
      'Excellent product quality and fast shipping!',
      'Very satisfied with my purchase. Will buy again.',
      'Good value for money. The product meets my expectations.',
      'Outstanding customer service and product quality.',
      'Fast delivery and the product works perfectly.',
      'Great product! Highly recommended to others.',
      'Good quality and reasonable pricing.',
      'Exceeded my expectations. Very happy with the purchase.',
      'Product arrived on time and in perfect condition.',
      'Excellent shopping experience from start to finish.'
    ];
    
    const reviewCount = Math.floor(Math.random() * 5) + 1;
    
    return Array.from({ length: reviewCount }, (_, index) => ({
      id: index + 1,
      product: products[Math.floor(Math.random() * products.length)],
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      comment: comments[Math.floor(Math.random() * comments.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      vendor: vendors[Math.floor(Math.random() * vendors.length)],
      helpful: Math.floor(Math.random() * 20)
    }));
  };

  const handleProfileView = (customerName) => {
    if (!customerName || customerName === 'Unknown Customer') {
      toast.warning('Customer information not available');
      return;
    }

    const customer = generateCustomerData(customerName);
    const reviews = generateReviews(customer.id, customerName);
    
    setSelectedCustomer(customer);
    setCustomerReviews(reviews);
    setShowCustomerProfile(true);
    toast.info(`Opening profile for ${customerName}`, { position: 'top-right' });
  };

  const handleDelivered = (id) => {
    setUpdatedNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              status: n.status === 'Delivered' ? 'Pending' : 'Delivered',
            }
          : n
      )
    );
    toast.success('Product status updated successfully!', { position: 'bottom-right' });
  };

  const handleCloseProfile = () => {
    setShowCustomerProfile(false);
    setSelectedCustomer(null);
    setCustomerReviews([]);
  };

  const renderStars = (rating) => {
    const numericRating = parseFloat(rating);
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= numericRating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">({numericRating.toFixed(1)})</span>
      </div>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      HIGH: { color: 'bg-red-100 text-red-800 border-red-200', text: 'URGENT' },
      MEDIUM: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'MEDIUM' },
      NORMAL: { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'NORMAL' },
      LOW: { color: 'bg-gray-100 text-gray-800 border-gray-200', text: 'LOW' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.NORMAL;
    return (
      <span className={`text-xs px-2 py-1 rounded-full border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return date.toLocaleDateString();
  };

  const CustomerProfile = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Customer Profile</h2>
              <p className="text-gray-600">Detailed customer information and review history</p>
            </div>
            <button
              onClick={handleCloseProfile}
              className="text-gray-500 hover:text-gray-700 text-xl bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Info Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border-4 border-white shadow">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedCustomer.name}</h3>
                    <p className="text-gray-600">{selectedCustomer.email}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCustomer.loyaltyTier === 'Platinum' ? 'bg-purple-100 text-purple-800' :
                        selectedCustomer.loyaltyTier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                        selectedCustomer.loyaltyTier === 'Silver' ? 'bg-gray-100 text-gray-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {selectedCustomer.loyaltyTier} Member
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-gray-600 text-sm">Member since:</span>
                        <p className="font-medium">{new Date(selectedCustomer.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-gray-600 text-sm">Location:</span>
                        <p className="font-medium">{selectedCustomer.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-gray-600 text-sm">Phone:</span>
                        <p className="font-medium">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-gray-600 text-sm">Total Orders:</span>
                        <p className="font-medium text-blue-600">{selectedCustomer.totalOrders}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-gray-600 text-sm">Total Spent:</span>
                        <p className="font-medium text-green-600">${selectedCustomer.totalSpent.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-gray-600 text-sm">Avg. Rating:</span>
                        <div className="flex items-center">
                          {renderStars(selectedCustomer.averageRating)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews and Statistics */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">Review History</h3>
                    <p className="text-gray-600">Customer's recent product reviews</p>
                  </div>

                  <div className="p-6">
                    {customerReviews.length > 0 ? (
                      <div className="space-y-6">
                        {customerReviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-800">{review.product}</h4>
                                <p className="text-sm text-gray-500">Vendor: {review.vendor}</p>
                              </div>
                              <div className="text-right">
                                {renderStars(review.rating)}
                                <p className="text-sm text-gray-500 mt-1">
                                  {new Date(review.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                              {review.comment}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-gray-500">
                                {review.helpful} people found this helpful
                              </span>
                              <button className="text-sm text-blue-600 hover:text-blue-800">
                                Helpful
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 text-6xl mb-4">📝</div>
                        <h4 className="text-lg font-semibold text-gray-600 mb-2">No Reviews Yet</h4>
                        <p className="text-gray-500">This customer hasn't written any reviews yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Statistics */}
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Order Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="text-2xl font-bold text-green-600">${selectedCustomer.totalSpent.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                      <div className="text-2xl font-bold text-yellow-600">{selectedCustomer.averageRating}</div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="text-2xl font-bold text-purple-600">
                        ${Math.ceil(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Avg Order Value</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={handleCloseProfile}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Back to Notifications
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
              Contact Customer
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {showCustomerProfile ? (
        <CustomerProfile />
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
                {updatedNotifications.some(n => !n.isRead) && (
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark All as Read
                  </button>
                )}
                {/* Test button for development */}
                {process.env.NODE_ENV === 'development' && updatedNotifications.length === 0 && (
                  <button
                    onClick={createTestNotifications}
                    className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    Load Test Data
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700 text-xl bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Debug info for development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Debug Info:</strong> Total notifications: {updatedNotifications.length} | 
                    Out of stock: {outOfStockNotifications.length} | 
                    Other: {orderNotifications.length}
                  </p>
                </div>
              )}

              {/* Out of Stock Notifications Section */}
              {outOfStockNotifications.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-800">Out of Stock Alerts</h3>
                    <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full font-medium">
                      {outOfStockNotifications.length} alert{outOfStockNotifications.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-xl">
                    {outOfStockNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-6 border-b border-red-100 last:border-b-0 transition-all ${
                          notification.isRead ? 'opacity-70' : 'bg-white bg-opacity-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="w-4 h-4 text-red-600" />
                              <p className="font-semibold text-red-800">
                                {notification.title || 'Out of Stock Alert'}
                              </p>
                              {getPriorityBadge(notification.priority)}
                              {!notification.isRead && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-red-700 mb-2">
                              {notification.message || 'Product is out of stock'}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <p className="text-red-600">
                                <strong>Product:</strong> {notification.productName || 'Unknown Product'}
                              </p>
                              <p className="text-red-500">
                                {formatDate(notification.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleRestock(notification.productId, notification.productName)}
                              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                            >
                              <Package className="w-4 h-4" />
                              Restock
                            </button>

                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Mark Read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Notifications Section */}
              {orderNotifications.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Order Notifications</h3>
                    <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full font-medium">
                      {orderNotifications.length} notification{orderNotifications.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow border border-gray-200">
                    {orderNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-6 border-b border-gray-100 last:border-b-0 transition-all ${
                          notification.isRead ? 'opacity-70' : 'bg-blue-50 bg-opacity-30'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-semibold text-gray-800">
                                {notification.title || 'Notification'}
                              </p>
                              {getPriorityBadge(notification.priority)}
                              {!notification.isRead && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3">
                              {notification.message || 'No message content'}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {notification.customer && (
                                <button
                                  onClick={() => handleProfileView(notification.customer)}
                                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                >
                                  <User className="w-3 h-3" />
                                  {notification.customer}
                                </button>
                              )}
                              {notification.product && (
                                <span>
                                  <strong>Product:</strong> {notification.product}
                                </span>
                              )}
                              <span>{formatDate(notification.createdAt)}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            {notification.customer && (
                              <button
                                onClick={() => handleProfileView(notification.customer)}
                                className="px-3 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg hover:bg-green-200 transition flex items-center gap-1"
                              >
                                <User className="w-3 h-3" />
                                Profile
                              </button>
                            )}
                            
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                disabled={loading}
                                className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition flex items-center gap-1 disabled:opacity-50"
                              >
                                <CheckCircle className="w-3 h-3" />
                                Read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Notifications Message */}
              {updatedNotifications.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-gray-300 text-8xl mb-6">🔔</div>
                  <h4 className="text-2xl font-semibold text-gray-500 mb-4">No Notifications</h4>
                  <p className="text-gray-400 text-lg mb-2">You're all caught up!</p>
                  <p className="text-gray-400 mb-8">
                    Notifications will appear here when you have out-of-stock products or new orders.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={createTestNotifications}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                    >
                      <Package className="w-4 h-4" />
                      View Sample Notifications
                    </button>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with quick stats */}
            {updatedNotifications.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>
                    Total: {updatedNotifications.length} • 
                    Unread: {updatedNotifications.filter(n => !n.isRead).length} • 
                    Out of Stock: {outOfStockNotifications.length}
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationsModal;