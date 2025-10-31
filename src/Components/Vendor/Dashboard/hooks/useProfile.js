import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

export const useProfile = (vendorData, userData, setShowProfile) => {
  const [profileForm, setProfileForm] = useState({
    vendorName: '',
    vendorCategory: '',
    about: '',
    phoneNumber: '',
    emailAddress: '',
    taxId: '',
    paymentTerms: 'Net 30 Days',
    isActiveMember: false
  });
  const [idCardFile, setIdCardFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [idCardPreview, setIdCardPreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  
  const idCardInputRef = useRef(null);
  const profileInputRef = useRef(null);

  
  useEffect(() => {
    if (userData) {
      setProfileForm(prev => ({
        ...prev,
        emailAddress: userData.email || '',
        phoneNumber: userData.phoneNumber || ''
      }));
    }
    
    if (vendorData) {
      setProfileForm(prev => ({
        ...prev,
        vendorName: vendorData.companyName || '',
        vendorCategory: vendorData.category || '',
        about: vendorData.about || '',
        emailAddress: vendorData.companyEmail || userData?.email || '',
        taxId: vendorData.taxId || ''
      }));
      setIsProfileCreated(true);
    }
  }, [userData, vendorData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleIdCardUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setIdCardFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setIdCardPreview(e.target.result);
      reader.readAsDataURL(file);
      toast.success('ID card uploaded successfully!');
    } else {
      toast.error('Please upload an image file');
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setProfilePreview(e.target.result);
      reader.readAsDataURL(file);
      toast.success('Profile picture uploaded successfully!');
    } else {
      toast.error('Please upload an image file');
    }
  };

  const handleRemoveProfileImage = () => {
    setProfileImage(null);
    setProfilePreview(null);
    if (profileInputRef.current) profileInputRef.current.value = '';
    toast.info('Profile picture removed');
  };

  const handleRemoveIdCard = () => {
    setIdCardFile(null);
    setIdCardPreview(null);
    if (idCardInputRef.current) idCardInputRef.current.value = '';
    toast.info('ID card removed');
  };

  const handleProfileSave = async () => {
    if (!profileForm.vendorName || !profileForm.vendorCategory || !profileForm.phoneNumber || !profileForm.emailAddress || !profileForm.taxId) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
      setIsProfileCreated(true);
      toast.success('Profile saved successfully!');
      setShowProfile(false);
      
      
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      localStorage.setItem('currentUser', JSON.stringify({
        ...user,
        vendorProfile: {
          vendorName: profileForm.vendorName,
          email: profileForm.emailAddress
        }
      }));
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  const handleProfileCancel = () => {
    toast.info('Profile creation cancelled');
    setShowProfile(false);
  };

  return {
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
  };
};