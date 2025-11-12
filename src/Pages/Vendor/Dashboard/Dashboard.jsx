import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
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
import { useNotificationHub } from '../../../Components/Vendor/Dashboard/hooks/useNotificationHub';
import axiosInstance from '../../../Components/utils/axiosInstance';

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
    notifications: dashboardNotifications,
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

  // SignalR hook
  const {
    notifications: signalRNotifications,
    unreadCount,
    isConnected,
    connectionStatus,
    markNotificationAsRead,
    refreshNotifications
  } = useNotificationHub();

  
const allNotifications = useMemo(() => {
  console.log('📊 [Dashboard] Combining notifications');
  console.log('   - Dashboard notifications (raw):', dashboardNotifications);
  console.log('   - SignalR notifications (raw):', signalRNotifications);

  // Use SignalR notifications as primary source when connected
  const primaryNotifications = isConnected && signalRNotifications?.length > 0 
    ? signalRNotifications 
    : dashboardNotifications || [];

  // Normalize notifications to ensure consistent structure
  const normalized = primaryNotifications.map(n => {
    const normalizedNotification = {
      id: n.id,
      type: n.type || '',
      title: n.title || '',
      message: n.message || '',
      productId: n.productId,
      createdAt: n.createdAt || n.createdOn,
      isRead: n.isRead || false,
      priority: n.priority || '',
      isOutOfStock: n.isOutOfStock === true || 
                    n.type?.toLowerCase() === 'out_of_stock' || 
                    n.type?.toLowerCase() === 'out-of-stock',
      source: isConnected ? 'signalr' : 'api',
      // Include raw data for debugging
      _raw: n
    };
    
    console.log(`📊 [Dashboard] Normalized notification ${normalizedNotification.id}:`, normalizedNotification);
    return normalizedNotification;
  });

  console.log('📊 [Dashboard] Final normalized notifications:', normalized);
  return normalized;
}, [signalRNotifications, dashboardNotifications, isConnected]);
  // Separate out-of-stock notifications
  const outOfStockNotifications = useMemo(() => {
    const outOfStock = allNotifications.filter(n => n.isOutOfStock === true);
    console.log('📦 [Dashboard] Out-of-stock notifications:', outOfStock.length);
    return outOfStock;
  }, [allNotifications]);

  // Other notifications (non out-of-stock)
  const otherNotifications = useMemo(() => {
    return allNotifications.filter(n => !n.isOutOfStock);
  }, [allNotifications]);

  // Handle notification marked as read
  const handleMarkNotificationAsRead = useCallback(async (notificationId) => {
    try {
      console.log('📝 [Dashboard] Marking notification as read:', notificationId);
      const success = await markNotificationAsRead(notificationId);
      
      if (success) {
        toast.success('Notification marked as read');
        // Optionally refresh the dashboard data to sync with backend
        fetchDashboardData();
      } else {
        toast.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('❌ [Dashboard] Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  }, [markNotificationAsRead, fetchDashboardData]);

 // Refresh all notifications
const handleRefreshNotifications = useCallback(async () => {
  console.log('🔄 [Dashboard] Refreshing notifications...');
  
  // Try SignalR first, then fallback to API
  if (isConnected) {
    const signalRSuccess = await refreshNotifications();
    if (signalRSuccess) {
      toast.success('Notifications refreshed');
      return;
    }
  }
  
  // Fallback to API refresh
  await fetchDashboardData();
  toast.success('Notifications refreshed');
}, [refreshNotifications, fetchDashboardData, isConnected]);

  // Load data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Show connection status
  useEffect(() => {
    console.log('🔌 [Dashboard] SignalR Connection Status:', connectionStatus);
    console.log('   Connected:', isConnected);
    console.log('   Unread Count:', unreadCount);
    
    if (isConnected) {
      console.log('✅ [Dashboard] Real-time notifications enabled');
    }
  }, [connectionStatus, isConnected, unreadCount]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tempUserData');
    navigate('/login');
  };

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

      {/* Connection Status Indicator */}
      <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-medium z-40 ${
        isConnected 
          ? 'bg-green-100 text-green-800 border border-green-300' 
          : connectionStatus === 'reconnecting'
          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
          : 'bg-red-100 text-red-800 border border-red-300'
      }`}>
        {isConnected ? '🔔 Real-time Enabled' : `🔌 ${connectionStatus}`}
        {unreadCount > 0 && (
          <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
            {unreadCount}
          </span>
        )}
      </div>

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
          notifications={allNotifications}
          outOfStockNotifications={outOfStockNotifications}
          otherNotifications={otherNotifications}
          markNotificationAsRead={handleMarkNotificationAsRead}
          refreshNotifications={handleRefreshNotifications}
          unreadCount={unreadCount}
          isConnected={isConnected}
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
          notifications={allNotifications}
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
          handleBackdropClick={handleBackdropClick}
          unreadCount={unreadCount}
          connectionStatus={connectionStatus}
          outOfStockCount={outOfStockNotifications.length}
        />

        {/* Main Dashboard Content */}
        <DashboardMain
          activeView={activeView}
          financialData={financialData}
          recentActivities={recentActivities}
          setShowMessages={setShowMessages}
          setShowNotifications={setShowNotifications}
          messageThreads={messageThreads}
          notifications={allNotifications}
          outOfStockNotifications={outOfStockNotifications}
          otherNotifications={otherNotifications}
          refreshNotifications={handleRefreshNotifications}
          unreadCount={unreadCount}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
};

export default Dashboard;