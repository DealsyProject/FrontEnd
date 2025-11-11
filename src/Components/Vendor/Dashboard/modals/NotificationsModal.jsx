import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationsModal = ({ setShowNotifications, notifications }) => {
  const [updatedNotifications, setUpdatedNotifications] = useState(notifications);
  const [showCustomerProfile, setShowCustomerProfile] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerReviews, setCustomerReviews] = useState([]);

  
  const generateCustomerData = (customerName) => {
    
    const customerId = customerName.toLowerCase().replace(/\s+/g, '-');
    
    return {
      id: customerId,
      name: customerName,
      email: `${customerId}@example.com`,
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalOrders: Math.floor(Math.random() * 50) + 1,
      totalSpent: Math.floor(Math.random() * 10000) + 1000,
      averageRating: (Math.random() * 2 + 3).toFixed(1), 
      location: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ'][Math.floor(Math.random() * 5)],
      phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: '👤'
    };
  };

  
  const generateReviews = (customerId, customerName) => {
    const products = ['Wireless Headphones', 'Smart Watch', 'Bluetooth Speaker', 'Laptop Backpack', 'Desk Lamp', 'Fitness Tracker', 'Phone Case', 'Water Bottle'];
    const vendors = ['Tech Gadgets Inc.', 'Audio Solutions', 'Office Supplies Co.', 'Home Essentials', 'Fitness Gear Pro'];
    
    const reviewCount = Math.floor(Math.random() * 5) + 1; 
    
    return Array.from({ length: reviewCount }, (_, index) => ({
      id: index + 1,
      product: products[Math.floor(Math.random() * products.length)],
      rating: Math.floor(Math.random() * 2) + 4, 
      comment: `Great product! ${customerName} was very satisfied with the quality and service.`,
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      vendor: vendors[Math.floor(Math.random() * vendors.length)]
    }));
  };

  
  const handleProfileView = (customerName) => {
    console.log('Opening profile for:', customerName); 
    
    
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
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">({parseFloat(rating).toFixed(1)})</span>
      </div>
    );
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
             
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                      {selectedCustomer.avatar}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedCustomer.name}</h3>
                    <p className="text-gray-600">{selectedCustomer.email}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Member since:</span>
                      <span className="font-medium">{new Date(selectedCustomer.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedCustomer.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Orders:</span>
                      <span className="font-medium text-blue-600">{selectedCustomer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="font-medium text-green-600">${selectedCustomer.totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg. Rating:</span>
                      <div className="flex items-center">
                        {renderStars(selectedCustomer.averageRating)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

             
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

                
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Order Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">${selectedCustomer.totalSpent.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{selectedCustomer.averageRating}</div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
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
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Back to Notifications
            </button>
            
          </div>
        </div>
      </div>
    );
  };

  
  console.log('All customers in notifications:', updatedNotifications.map(n => n.customer));

  return (
    <>
      {showCustomerProfile ? (
        <CustomerProfile />
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col">
            
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700 text-xl bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white rounded-xl shadow">
                {updatedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-6 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          <span className="text-blue-600">
                            {notification.customer}
                          </span>{' '}
                          has ordered your {notification.product}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{notification.date}</p>
                      </div>

                      <div className="flex items-center space-x-3 ml-4">
                        
                        <button
                          onClick={() => handleProfileView(notification.customer)}
                          className="px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg hover:bg-green-200 transition flex items-center"
                        >
                          👤 Profile View
                        </button>

                        
                        <button
                          onClick={() => handleDelivered(notification.id)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition flex items-center ${
                            notification.status === 'Delivered'
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800'
                          }`}
                        >
                          {notification.status === 'Delivered' ? '✅ Delivered' : '📦 Mark Delivered'}
                        </button>

                        
                        {/* <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            notification.action === 'Accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {notification.action}
                        </span> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationsModal;