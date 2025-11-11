// src/Components/Vendor/Dashboard/hooks/useProfile.js
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../Components/utils/axiosInstance';

export const useProfile = (setShowProfile, fetchDashboardData) => {
  const [profileForm, setProfileForm] = useState({
    vendorName: '',
    businessType: '',
    description: '',
    about: '',
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const profileInputRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axiosInstance.get('/vendorprofile'); // Fixed URL
        const data = response.data;

        if (data) {
          setProfileForm({
            vendorName: data.vendorName || '',
            businessType: data.businessType || '',
            description: data.description || '',
            about: data.about || '',
          });
          setProfilePreview(data.profileImage || null);
          setIsProfileCreated(true);
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.warn('Failed to load profile:', err);
        }
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfilePreview(ev.target?.result);
      toast.success('Image uploaded');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfileImage = () => {
    setProfilePreview(null);
    if (profileInputRef.current) profileInputRef.current.value = '';
    toast.info('Image removed');
  };

  const handleProfileSave = async () => {
    const { vendorName, businessType, description, about } = profileForm;
    if (!vendorName || !businessType || !description || !about) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsUpdating(true);
    const payload = {
      vendorName,
      businessType,
      description,
      about,
      profileImage: profilePreview
    };

    try {
      let response;
      if (isProfileCreated) {
        response = await axiosInstance.put('/vendorprofile', payload); // Fixed URL
      } else {
        response = await axiosInstance.post('/vendorprofile', payload); // Fixed URL
      }

      toast.success('Profile saved successfully!');
      setIsProfileCreated(true);
      if (fetchDashboardData) fetchDashboardData();

    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save profile';
      toast.error(msg);
    } finally {
      setIsUpdating(false);
      setShowProfile(false); // Always close modal after save attempt
    }
  };

  const handleProfileCancel = () => {
    setShowProfile(false);
    toast.info('Cancelled');
  };

  return {
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
  };
};