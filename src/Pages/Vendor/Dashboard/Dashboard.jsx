// src/pages/Vendor/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
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
import axiosInstance from '../../../Components/utils/axiosInstance';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [outOfStockNotifications, setOutOfStockNotifications] = useState([]);

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

 const fetchOutOfStockNotifications = useCallback(async () => {
  try {
    console.log('🔔 [DEBUG] Fetching out-of-stock notifications...');
    
    if (!vendorData?.id) {
      console.log('❌ No vendor ID available');
      return;
    }

    const response = await axiosInstance.get('/Notification/vendor-out-of-stock');
    
    console.log('🔔 [DEBUG] Raw API response:', response.data);
    
    if (response.data.notifications && Array.isArray(response.data.notifications)) {
      const formattedNotifications = response.data.notifications.map(notification => {
        console.log('🔔 [DEBUG] Processing notification:', notification);
        return {
          id: notification.id,
          type: notification.type || 'OUT_OF_STOCK',
          title: notification.title || 'Out of Stock Alert',
          message: notification.message,
          productName: notification.productName,
          productId: notification.productId,
          createdAt: notification.createdAt || notification.createdOn,
          isRead: notification.isRead || false,
          priority: notification.priority || 'HIGH',
          isOutOfStock: true, // ← FORCE THIS TO TRUE
          ...notification // Keep original properties but override isOutOfStock
        };
      });
      
      console.log('🔔 [DEBUG] Formatted out-of-stock notifications:', formattedNotifications);
      setOutOfStockNotifications(formattedNotifications);
    } else {
      console.log('❌ No notifications array found');
      setOutOfStockNotifications([]);
    }
  } catch (error) {
    console.error('❌ Error fetching out-of-stock notifications:', error);
    setOutOfStockNotifications([]);
  }
}, [vendorData?.id]);

// Add this function to your Dashboard.jsx
const testNotificationEndpoint = async () => {
  try {
    console.log('🧪 [API TEST] Testing /Notification/vendor-out-of-stock endpoint directly');
    const response = await axiosInstance.get('/Notification/vendor-out-of-stock');
    
    console.log('🧪 [API TEST] Response status:', response.status);
    console.log('🧪 [API TEST] Response headers:', response.headers);
    console.log('🧪 [API TEST] Full response:', response);
    console.log('🧪 [API TEST] Response data:', response.data);
    
    if (response.data.notifications) {
      console.log('🧪 [API TEST] Notifications count:', response.data.notifications.length);
      response.data.notifications.forEach((notif, index) => {
        console.log(`🧪 [API TEST] Notification ${index}:`, notif);
        console.log(`🧪 [API TEST] Has id:`, notif.id);
        console.log(`🧪 [API TEST] Has type:`, notif.type);
        console.log(`🧪 [API TEST] Has productId:`, notif.productId);
      });
    } else {
      console.log('🧪 [API TEST] No notifications array in response');
    }
    
    return response.data;
  } catch (error) {
    console.error('🧪 [API TEST] Error:', error);
    console.error('🧪 [API TEST] Error details:', error.response?.data);
    return null;
  }
};

// Call this function in your useEffect
useEffect(() => {
  if (vendorData?.id) {
    console.log('🚀 Vendor data loaded, testing notifications...');
    testNotificationEndpoint(); // Test the endpoint directly
    fetchOutOfStockNotifications();
    
    const interval = setInterval(() => {
      fetchOutOfStockNotifications();
    }, 15000);
    
    return () => clearInterval(interval);
  }
}, [vendorData?.id, fetchOutOfStockNotifications]);

// Add this check to see if the vendor IDs match
console.log('🔍 [VENDOR CHECK] Logged in vendor ID:', vendorData?.id);
console.log('🔍 [VENDOR CHECK] Notification was sent to vendor ID: 1');
console.log('🔍 [VENDOR CHECK] Do they match?', vendorData?.id === 1);


// Add this function to manually check if notification ID 4 exists
const checkSpecificNotification = async () => {
  try {
    console.log('🔎 [SPECIFIC CHECK] Checking for notification ID 4');
    const allNotifications = await axiosInstance.get('/Notification/vendor');
    console.log('🔎 [SPECIFIC CHECK] All vendor notifications:', allNotifications.data);
    
    if (allNotifications.data.notifications) {
      const notification4 = allNotifications.data.notifications.find(n => n.id === 4);
      console.log('🔎 [SPECIFIC CHECK] Notification with ID 4:', notification4);
    }
  } catch (error) {
    console.error('🔎 [SPECIFIC CHECK] Error:', error);
  }
};

// Call this after sending a notification
  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await axiosInstance.put(`/Notification/mark-read/${notificationId}`);
      
      // Update both notification states
      setOutOfStockNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      // Refresh main dashboard data to update regular notifications
      if (fetchDashboardData) {
        fetchDashboardData();
      }
      
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  // Function to refresh all notifications
  const refreshAllNotifications = useCallback(async () => {
    console.log('Manually refreshing all notifications...');
    await fetchOutOfStockNotifications();
    if (fetchDashboardData) {
      await fetchDashboardData();
    }
  }, [fetchOutOfStockNotifications, fetchDashboardData]);

  // Pass this function to child components
  const refreshNotifications = useCallback(async () => {
    await refreshAllNotifications();
  }, [refreshAllNotifications]);

  // Fetch notifications when vendor data is available
  useEffect(() => {
    if (vendorData?.id) {
      console.log('Vendor data available, setting up notification polling');
      fetchOutOfStockNotifications();
      
      // Set up polling for new notifications (every 15 seconds)
      const interval = setInterval(() => {
        console.log('Polling for new notifications...');
        fetchOutOfStockNotifications();
      }, 15000);
      
      return () => {
        console.log('Cleaning up notification polling');
        clearInterval(interval);
      };
    }
  }, [vendorData?.id, fetchOutOfStockNotifications]);

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

 // ALTERNATIVE: Keep notifications completely separate
const allNotifications = React.useMemo(() => {
  console.log('🔔 [Dashboard] Regular notifications:', notifications);
  console.log('🔔 [Dashboard] Out-of-stock notifications:', outOfStockNotifications);

  // Use ONLY the out-of-stock notifications from the API for out-of-stock
  // Use regular notifications for everything else
  const realOutOfStockNotifications = outOfStockNotifications || [];
  
  const otherNotifications = (notifications || []).filter(n => 
    n.type !== 'OUT_OF_STOCK' // Remove any fake out-of-stock notifications
  );

  const combined = [
    ...otherNotifications.map(n => ({ ...n, isOutOfStock: false })),
    ...realOutOfStockNotifications.map(n => ({ ...n, isOutOfStock: true }))
  ];

  console.log('🔔 [Dashboard] Final combined:', combined);
  return combined;
}, [notifications, outOfStockNotifications]);
  // Debug: Log notification changes
  useEffect(() => {
    console.log('All combined notifications:', allNotifications);
    console.log('Out of stock count:', allNotifications.filter(n => n.isOutOfStock).length);
    console.log('Unread count:', allNotifications.filter(n => !n.isRead).length);
  }, [allNotifications]);

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
          notifications={allNotifications}
          markNotificationAsRead={markNotificationAsRead}
          fetchNotifications={refreshNotifications}
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
          refreshNotifications={refreshNotifications}
        />
      </div>
{/* 
      // Add these debug buttons to your Dashboard temporarily
{process.env.NODE_ENV === 'development' && (
  <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
    <button
      onClick={testNotificationEndpoint}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg"
    >
      🧪 Test API
    </button>
    <button
      onClick={checkSpecificNotification}
      className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg"
    >
      🔎 Check ID 4
    </button>
    <button
      onClick={refreshAllNotifications}
      className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-lg"
    >
      🔄 Refresh All
    </button>
  </div>
)} */}
    </div>
  );
};

export default Dashboard;