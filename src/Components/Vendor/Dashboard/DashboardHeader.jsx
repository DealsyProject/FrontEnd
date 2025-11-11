// Components/Vendor/Dashboard/DashboardHeader.jsx
import React from 'react';
import ProfileModal from './modals/ProfileModal';
import ProfileDisplay from './ProfileDisplay';

const DashboardHeader = ({
  activeView,
  setShowMessages,
  setShowNotifications,
  showProfile,
  setShowProfile,
  handleLogout,
  messageThreads,
  notifications,
  userData,
  vendorData,
  profileForm,
  profilePreview,
  isProfileCreated,
  isUpdating,
  handleInputChange,
  handleProfileSave,
  handleProfileCancel,
  handleProfileImageUpload,
  handleRemoveProfileImage,
  profileInputRef,
  handleBackdropClick
}) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center relative">
      <h2 className="text-2xl font-bold text-gray-800">
        {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
      </h2>

      <div className="flex items-center space-x-4">
        {/* Message Button */}
        <button
          onClick={() => setShowMessages(true)}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
          title="Messages"
        >
          Messages
          {messageThreads?.filter(m => m.unread)?.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#586330] rounded-full"></span>
          )}
        </button>

        {/* Notification Button */}
        <button
          onClick={() => setShowNotifications(true)}
          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors relative"
          title="Notifications"
        >
          Notifications
          {notifications?.filter(n => n.status === 'New')?.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#586330] rounded-full"></span>
          )}
        </button>

        {/* Profile Display */}
        <ProfileDisplay
          userData={userData}
          vendorData={vendorData}
          isProfileCreated={isProfileCreated}
          profileForm={profileForm}
          profilePreview={profilePreview}
          setShowProfile={setShowProfile}
          handleRemoveProfileImage={handleRemoveProfileImage}
        />
      </div>

      {/* Profile Modal - Render inside Header */}
      {showProfile && (
        <ProfileModal
          setShowProfile={setShowProfile}
          profileForm={profileForm}
          handleInputChange={handleInputChange}
          profileInputRef={profileInputRef}
          handleProfileImageUpload={handleProfileImageUpload}
          profilePreview={profilePreview}
          handleRemoveProfileImage={handleRemoveProfileImage}
          handleProfileCancel={handleProfileCancel}
          handleProfileSave={handleProfileSave}
          handleBackdropClick={handleBackdropClick}
          isUpdating={isUpdating}
        />
      )}
    </header>
  );
};

export default DashboardHeader;