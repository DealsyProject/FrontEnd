import React from 'react';
import MessagesWidget from './widgets/MessagesWidget';
import NotificationsWidget from './widgets/NotificationsWidget';
import QuickStatsWidget from './widgets/QuickStatsWidget';

const SidebarWidgets = ({
  setShowMessages,
  setShowNotifications,
  messageThreads,
  notifications
}) => {
  return (
    <div className="space-y-6">
      <MessagesWidget 
        setShowMessages={setShowMessages}
        messageThreads={messageThreads}
      />
      
      <NotificationsWidget 
        setShowNotifications={setShowNotifications}
        notifications={notifications}
      />
      
      <QuickStatsWidget />
    </div>
  );
};

export default SidebarWidgets;