import React, { useState, useEffect } from 'react';
import { Bell, Package, X, RefreshCw, Wifi, WifiOff } from 'lucide-react';

const NotificationsModal = ({ 
  setShowNotifications, 
  notifications = [], 
  outOfStockNotifications = [], 
  otherNotifications = [],
  markNotificationAsRead, 
  refreshNotifications,
  unreadCount = 0,
  isConnected = false
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  console.log('🔔 [Modal] Received notifications:', notifications);
  console.log('📦 [Modal] Real out-of-stock notifications:', outOfStockNotifications);
  console.log('📝 [Modal] Other notifications:', otherNotifications);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshNotifications();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    await markNotificationAsRead(notificationId);
  };

  const getDisplayNotifications = () => {
    switch (activeTab) {
      case 'outOfStock':
        return outOfStockNotifications;
      case 'other':
        return otherNotifications;
      default:
        return notifications;
    }
  };

  const displayNotifications = getDisplayNotifications();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold">Notifications</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{unreadCount} unread</span>
                <div className={`flex items-center space-x-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <RefreshCw className={`h-5 w-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowNotifications(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-1 px-6">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All ({notifications.length})
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'outOfStock'
                  ? 'bg-red-100 text-red-700 border-b-2 border-red-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('outOfStock')}
            >
              Out of Stock ({outOfStockNotifications.length})
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'other'
                  ? 'bg-gray-100 text-gray-700 border-b-2 border-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('other')}
            >
              Other ({otherNotifications.length})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-6">
          {displayNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications found</p>
              <p className="text-sm">Notifications will appear here when available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.isRead
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-blue-50 border-blue-200'
                  } ${
                    notification.isOutOfStock ? 'border-l-4 border-l-red-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {notification.isOutOfStock && (
                          <Package className="h-4 w-4 text-red-500" />
                        )}
                        <h3 className={`font-medium ${
                          notification.isRead ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                        {notification.priority && (
                          <span className={`px-2 py-1 rounded ${
                            notification.priority === 'HIGH' 
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {notification.priority}
                          </span>
                        )}
                        {notification.isOutOfStock && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        className="ml-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;