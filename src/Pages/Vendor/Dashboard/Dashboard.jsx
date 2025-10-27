import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// Import components
import MessagesModal from '../../../Components/Vendor/Dashboard/modals/MessagesModal';
import NotificationsModal from '../../../Components/Vendor/Dashboard/modals/NotificationsModal';
import ProfileModal from '../../../Components/Vendor/Dashboard/modals/ProfileModal';
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
  
  // Custom hooks for data management
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
  
  const {
    profileForm,
    profilePreview,
    idCardPreview,
    isProfileCreated,
    handleInputChange,
    handleProfileSave,
    handleProfileCancel,
    handleIdCardUpload,
    handleProfileImageUpload,
    handleRemoveProfileImage,
    handleRemoveIdCard,
    idCardInputRef,
    profileInputRef
  } = useProfile(vendorData, userData, setShowProfile);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tempUserData');
    navigate('/login');
  };

  
  // Loading and error states
  if (isLoading) return <LoadingState />;
  if (!userData) return <ErrorState message="Unable to load user data" />;

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Modals */}
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
      
      {showProfile && (
        <ProfileModal 
          setShowProfile={setShowProfile}
          profileForm={profileForm}
          handleInputChange={handleInputChange}
          idCardInputRef={idCardInputRef}
          handleIdCardUpload={handleIdCardUpload}
          idCardPreview={idCardPreview}
          handleRemoveIdCard={handleRemoveIdCard}
          profileInputRef={profileInputRef}
          handleProfileImageUpload={handleProfileImageUpload}
          profilePreview={profilePreview}
          handleRemoveProfileImage={handleRemoveProfileImage}
          handleProfileCancel={handleProfileCancel}
          handleProfileSave={handleProfileSave}
          userData={userData}
          vendorData={vendorData}
        />
      )}

      <Sidebar 
        handleLogout={handleLogout} 
        activeView={activeView} 
        setActiveView={setActiveView}
        userData={userData}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          activeView={activeView}
          setShowMessages={setShowMessages}
          setShowNotifications={setShowNotifications}
          setShowProfile={setShowProfile}
          handleLogout={handleLogout}
          messageThreads={messageThreads}
          notifications={notifications}
          userData={userData}
          isProfileCreated={isProfileCreated}
          profileForm={profileForm}
          profilePreview={profilePreview}
          handleRemoveProfileImage={handleRemoveProfileImage}
        />

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