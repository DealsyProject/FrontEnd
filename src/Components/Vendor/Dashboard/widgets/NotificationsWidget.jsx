import React from 'react';

const NotificationsWidget = ({ setShowNotifications, notifications }) => {
  return (
    <div className="bg-green-50 rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-green-800 mb-4">Notifications</h3>
      <div className="space-y-3">
        {notifications.slice(0, 3).map((notification) => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
            setShowNotifications={setShowNotifications} 
          />
        ))}
      </div>
      <ViewAllButton 
        onClick={() => setShowNotifications(true)} 
        text="View All Notifications"
        className="text-green-700 border-green-300 hover:bg-green-100"
      />
    </div>
  );
};

const NotificationItem = ({ notification, setShowNotifications }) => (
  <div 
    className="bg-white rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => setShowNotifications(true)}
  >
    <p className="text-sm font-medium text-gray-800">
      {notification.customer} - {notification.product}
    </p>
    <div className="flex justify-between items-center mt-1">
      <p className="text-xs text-gray-500">{notification.date}</p>
      <StatusBadge status={notification.status} />
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusStyles = {
    'New': 'bg-yellow-100 text-yellow-800',
    'Info': 'bg-gray-100 text-gray-800',
    'Urgent': 'bg-red-100 text-red-800'
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[status] || statusStyles.Info}`}>
      {status}
    </span>
  );
};

const ViewAllButton = ({ onClick, text, className }) => (
  <button 
    onClick={onClick} 
    className={`w-full mt-4 py-2 border rounded-lg transition-colors ${className}`}
  >
    {text}
  </button>
);

export default NotificationsWidget;