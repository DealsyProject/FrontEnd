import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationsModal = ({ setShowNotifications, notifications }) => {
  const [updatedNotifications, setUpdatedNotifications] = useState(notifications);

  // ✅ Handle "Profile View" click
  const handleProfileView = (customer) => {
    toast.info(`Opening profile for ${customer}`, { position: 'top-right' });
    // You could navigate to profile page later if needed
    // navigate(`/vendor/profile/${customerId}`);
  };

  // ✅ Handle "Delivered" click
  const handleDelivered = (id) => {
    setUpdatedNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              status: n.status === 'Delivered' ? 'Pending' : 'Delivered', // toggle example
            }
          : n
      )
    );
    toast.success('Product status updated successfully!', { position: 'bottom-right' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          <button
            onClick={() => setShowNotifications(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Notifications List */}
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
                    {/* ✅ Profile View Button */}
                    <button
                      onClick={() => handleProfileView(notification.customer)}
                      className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full hover:bg-green-200 transition"
                    >
                      Profile View
                    </button>

                    {/* ✅ Delivered Button (always clickable) */}
                    <button
                      onClick={() => handleDelivered(notification.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                        notification.status === 'Delivered'
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800'
                      }`}
                    >
                      {notification.status === 'Delivered' ? 'Delivered' : 'Mark Delivered'}
                    </button>

                    {/* Action Badge */}
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        notification.action === 'Accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {notification.action}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
