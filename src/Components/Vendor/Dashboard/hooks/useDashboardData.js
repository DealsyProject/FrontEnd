import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../Components/utils/axiosInstance'; // Adjust path as needed

export const useDashboardData = (navigate) => {
  const [userData, setUserData] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [financialData, setFinancialData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState([]); // Changed from mock to real state
  const [isLoading, setIsLoading] = useState(true);

  const [messageThreads] = useState([
    { id: 1, title: 'Support Team for Vendor', preview: 'Welcome to Dealsy! How can we help you?', time: '2 hours ago', unread: true },
    { id: 2, title: 'Support Team from Customer', preview: 'Interested in your products...', time: '1 day ago', unread: false }
  ]);

  // Fetch real notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      console.log('🔔 [Dashboard] Fetching notifications from API...');
      
      const response = await axiosInstance.get('/Notification/vendor-out-of-stock');
      
      console.log('🔔 [Dashboard] API response:', response.data);
      
      if (response.data && response.data.notifications) {
        const apiNotifications = response.data.notifications;
        console.log('🔔 [Dashboard] Raw API notifications:', apiNotifications);
        
        // Normalize the notifications to match expected structure
        const normalizedNotifications = apiNotifications.map(notification => ({
          id: notification.id,
          type: notification.type || '',
          title: notification.title || '',
          message: notification.message || '',
          productId: notification.productId,
          createdAt: notification.createdAt,
          isRead: notification.isRead || false,
          priority: notification.priority || '',
          isOutOfStock: notification.isOutOfStock === true,
          source: 'api'
        }));
        
        console.log('🔔 [Dashboard] Normalized notifications:', normalizedNotifications);
        setNotifications(normalizedNotifications);
      } else {
        console.warn('🔔 [Dashboard] No notifications in response');
        setNotifications([]);
      }
    } catch (error) {
      console.error('❌ [Dashboard] Error fetching notifications:', error);
      toast.error('Failed to load notifications');
      setNotifications([]);
    }
  }, []);

  const fetchVendorData = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockVendorData = {
        companyName: 'Vendor ',
        companyEmail: 'vendor@demo.com',
        category: 'Retail',
        about: 'This is a vendor profile',
        taxId: 'TAX123456',
        isActive: true
      };
      
      setVendorData(mockVendorData);
    } catch (error) {
      console.error('Error loading vendor data:', error);
    }
  }, []);

  const fetchFinancialData = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockFinancialData = [
        { title: 'Total Revenue', value: '₹25,430.00', subtitle: '+12% from last month', bgColor: 'bg-blue-500' },
        { title: 'Receivables', value: '₹8,560.00', subtitle: '3 pending invoices', bgColor: 'bg-green-500' },
        { title: 'Overdue Bills', value: '₹2,340.00', subtitle: '2 overdue payments', bgColor: 'bg-red-500' },
        { title: 'Total Expenses', value: '₹15,230.00', subtitle: 'Includes operational costs', bgColor: 'bg-yellow-500' }
      ];
      
      setFinancialData(mockFinancialData);
    } catch (error) {
      console.error('Error loading financial data:', error);
      setFinancialData(getDefaultFinancialData());
    }
  }, []);

  const fetchRecentActivities = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const mockActivities = [
        { type: 'Welcome to Dealsy!', description: 'Start by adding your products and services', date: 'Just now' },
        { type: 'Account Created', description: 'Your vendor account has been successfully created', date: '2 hours ago' },
        { type: 'Profile Setup', description: 'Complete your vendor profile to get started', date: '1 day ago' }
      ];
      
      setRecentActivities(mockActivities);
    } catch (error) {
      console.error('Error loading recent activities:', error);
      setRecentActivities(getDefaultActivities());
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const user = localStorage.getItem('currentUser');
      
      if (!user) {
        toast.error('Please login to access dashboard');
        navigate('/login');
        return;
      }

      const userObj = JSON.parse(user);
      setUserData(userObj);

      // Fetch all data including real notifications
      await Promise.all([
        fetchVendorData(),
        fetchFinancialData(),
        fetchRecentActivities(),
        fetchNotifications() // Add this to fetch real notifications
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, fetchVendorData, fetchFinancialData, fetchRecentActivities, fetchNotifications]);

  return {
    userData,
    vendorData,
    financialData,
    recentActivities,
    isLoading,
    messageThreads,
    notifications, // Now this returns real notifications from API
    fetchDashboardData,
    refreshNotifications: fetchNotifications // Add this for manual refresh
  };
};

const getDefaultFinancialData = (subtitle = 'No data available') => [
  { title: 'Total Revenue', value: '₹0.00', subtitle, bgColor: 'bg-blue-500' },
  { title: 'Receivables', value: '₹0.00', subtitle, bgColor: 'bg-green-500' },
  { title: 'Overdue Bills', value: '₹0.00', subtitle, bgColor: 'bg-red-500' },
  { title: 'Total Expenses', value: '₹0.00', subtitle, bgColor: 'bg-yellow-500' }
];

const getDefaultActivities = () => [
  { type: 'Welcome to Dealsy!', description: 'Start by adding your products and services', date: 'Just now' }
];