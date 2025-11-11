// src/pages/Vendor/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// Import components
import MessagesModal from '../../../Components/Vendor/Dashboard/modals/MessagesModal';
import NotificationsModal from '../../../Components/Vendor/Dashboard/modals/NotificationsModal';
import Sidebar from "../../../Components/Vendor/Dashboard/Sidebar";
import DashboardHeader from '../../../Components/Vendor/Dashboard/DashboardHeader';
import DashboardMain from '../../../Components/Vendor/Dashboard/DashboardMain';
import LoadingState from '../../../Components/Vendor/Dashboard/LoadingState';
import ErrorState from '../../../Components/Vendor/Dashboard/ErrorState';

// Import hooks
import { useDashboardData } from '../../../Components/Vendor/Dashboard/hooks/useDashboardData';
import { useProfile } from '../../../Components/Vendor/Dashboard/hooks/useProfile';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();

  // Fetch dashboard data
  const {
    userData,
    vendorData,
    financialData,
    recentActivities,
    isLoading,
    messageThreads,
    notifications,
    fetchDashboardData
  } = useDashboardData(navigate);

  // Profile hook
  const {
    profileForm,
    profilePreview,
    isProfileCreated,
    isUpdating,
    handleInputChange,
    handleProfileSave,
    handleProfileCancel,
    handleProfileImageUpload,
    handleRemoveProfileImage,
    profileInputRef
  } = useProfile(setShowProfile, fetchDashboardData);

  // Load data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tempUserData');
    navigate('/login');
  };

  // Handle backdrop click for modals
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowProfile(false);
    }
  };

  // Loading & error states
  if (isLoading) return <LoadingState />;
  if (!userData) return <ErrorState message="Unable to load user data" />;

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* External Modals */}
      {showMessages && (
        <MessagesModal
          setShowMessages={setShowMessages}
          messageThreads={messageThreads}
        />
      )}

      {showNotifications && (
        <NotificationsModal
          setShowNotifications={setShowNotifications}
          notifications={notifications}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        handleLogout={handleLogout}
        activeView={activeView}
        setActiveView={setActiveView}
        userData={userData}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Profile Modal */}
        <DashboardHeader
          activeView={activeView}
          setShowMessages={setShowMessages}
          setShowNotifications={setShowNotifications}
          showProfile={showProfile}
          setShowProfile={setShowProfile}
          handleLogout={handleLogout}
          messageThreads={messageThreads}
          notifications={notifications}
          userData={userData}
          vendorData={vendorData}
          profileForm={profileForm}
          profilePreview={profilePreview}
          isProfileCreated={isProfileCreated}
          isUpdating={isUpdating}
          handleInputChange={handleInputChange}
          handleProfileSave={handleProfileSave}
          handleProfileCancel={handleProfileCancel}
          handleProfileImageUpload={handleProfileImageUpload}
          handleRemoveProfileImage={handleRemoveProfileImage}
          profileInputRef={profileInputRef}
          handleBackdropClick={handleBackdropClick} // Pass backdrop handler
        />

        {/* Main Dashboard Content */}
        <DashboardMain
          activeView={activeView}
          financialData={financialData}
          recentActivities={recentActivities}
          setShowMessages={setShowMessages}
          setShowNotifications={setShowNotifications}
          messageThreads={messageThreads}
          notifications={notifications}
        />
      </div>
    </div>
  );
};

export default Dashboard;