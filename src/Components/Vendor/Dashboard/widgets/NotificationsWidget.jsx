import React from 'react';
import { AlertTriangle } from 'lucide-react';

const NotificationsWidget = ({ setShowNotifications, notifications }) => {
  // Calculate counts
  const totalNotifications = notifications.length;
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const outOfStockCount = notifications.filter(n => n.type === 'OUT_OF_STOCK' && !n.isRead).length;

  // Get latest notifications (max 3)
  const latestNotifications = notifications.slice(0, 3);

  return (
    <div className="bg-[#586330]/20 rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {latestNotifications.map((notification) => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
            setShowNotifications={setShowNotifications} 
          />
        ))}
        
        {latestNotifications.length === 0 && (
          <div className="text-center py-4">
            <div className="text-gray-400 text-3xl mb-2">🔔</div>
            <p className="text-sm text-gray-500">No notifications</p>
          </div>
        )}
      </div>
      
      {/* Quick Stats */}
      {outOfStockCount > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {outOfStockCount} product{outOfStockCount !== 1 ? 's' : ''} out of stock
            </span>
          </div>
        </div>
      )}
      
      <ViewAllButton 
        onClick={() => setShowNotifications(true)} 
        text={`View All Notifications (${totalNotifications})`}
        className="hover:bg-[#586330]/20 mt-4"
      />
    </div>
  );
};

const NotificationItem = ({ notification, setShowNotifications }) => {
  const isOutOfStock = notification.type === 'OUT_OF_STOCK';
  const isUnread = !notification.isRead;

  return (
    <div 
      className={`bg-white rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow border-l-4 ${
        isOutOfStock ? 'border-l-red-500' : 
        isUnread ? 'border-l-blue-500' : 'border-l-gray-300'
      }`}
      onClick={() => setShowNotifications(true)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className={`text-sm font-medium ${
            isOutOfStock ? 'text-red-800' : 'text-gray-800'
          }`}>
            {isOutOfStock && '⚠️ '}
            {notification.title}
          </p>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {notification.message}
          </p>
        </div>
        {isUnread && (
          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
        )}
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500">
          {new Date(notification.createdAt).toLocaleDateString()}
        </p>
        <StatusBadge 
          type={notification.type} 
          priority={notification.priority} 
          isRead={notification.isRead} 
        />
      </div>
    </div>
  );
};

const StatusBadge = ({ type, priority, isRead }) => {
  const getBadgeConfig = () => {
    if (type === 'OUT_OF_STOCK') {
      return {
        text: 'Out of Stock',
        className: 'bg-red-100 text-red-800'
      };
    }
    
    if (priority === 'HIGH') {
      return {
        text: 'Urgent',
        className: 'bg-orange-100 text-orange-800'
      };
    }
    
    if (!isRead) {
      return {
        text: 'New',
        className: 'bg-blue-100 text-blue-800'
      };
    }
    
    return {
      text: 'Read',
      className: 'bg-gray-100 text-gray-800'
    };
  };

  const config = getBadgeConfig();

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${config.className}`}>
      {config.text}
    </span>
  );
};

const ViewAllButton = ({ onClick, text, className }) => (
  <button 
    onClick={onClick} 
    className={`w-full py-2 border border-[#586330] text-[#586330] rounded-lg transition-colors font-medium ${className}`}
  >
    {text}
  </button>
);

export default NotificationsWidget;