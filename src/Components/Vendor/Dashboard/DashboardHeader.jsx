import React from 'react';
import ProfileDisplay from './ProfileDisplay';

const DashboardHeader = ({
  activeView,
  setShowMessages,
  setShowNotifications,
  setShowProfile,
  messageThreads,
  notifications,
  userData,
  isProfileCreated,
  profileForm,
  profilePreview,
  handleRemoveProfileImage
}) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">
        {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
      </h2>
      <div className="flex items-center space-x-4">
        <MessageButton 
          setShowMessages={setShowMessages} 
          messageThreads={messageThreads} 
        />
        
        <NotificationButton 
          setShowNotifications={setShowNotifications} 
          notifications={notifications} 
        />
        
        <ProfileDisplay
          userData={userData}
          isProfileCreated={isProfileCreated}
          profileForm={profileForm}
          profilePreview={profilePreview}
          setShowProfile={setShowProfile}
          handleRemoveProfileImage={handleRemoveProfileImage}
        />
        
       
      </div>
    </header>
  );
};

const MessageButton = ({ setShowMessages, messageThreads }) => (
  <button 
    onClick={() => setShowMessages(true)} 
    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
    title="Messages"
  >
    💬
    {messageThreads.filter(msg => msg.unread).length > 0 && (
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#586330] rounded-full"></span>
    )}
  </button>
);

const NotificationButton = ({ setShowNotifications, notifications }) => (
  <button 
    onClick={() => setShowNotifications(true)} 
    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors relative"
    title="Notifications"
  >
    🔔
    {notifications.filter(notif => notif.status === 'New').length > 0 && (
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#586330] rounded-full"></span>
    )}
  </button>
);



export default DashboardHeader;