import React from 'react';

const ProfileDisplay = ({
  userData,
  isProfileCreated,
  profileForm,
  profilePreview,
  setShowProfile,
  handleRemoveProfileImage
}) => {
  if (!userData) return null;

  if (isProfileCreated && profileForm.vendorName) {
    return (
      <VendorProfile 
        profileForm={profileForm}
        profilePreview={profilePreview}
        setShowProfile={setShowProfile}
        handleRemoveProfileImage={handleRemoveProfileImage}
      />
    );
  }

  return <DefaultProfile userData={userData} />;
};

const VendorProfile = ({ profileForm, profilePreview, setShowProfile, handleRemoveProfileImage }) => (
  <div className="flex items-center space-x-3">
    <ProfileImage 
      profilePreview={profilePreview}
      profileForm={profileForm}
      setShowProfile={setShowProfile}
      handleRemoveProfileImage={handleRemoveProfileImage}
    />
    <span className="text-gray-700 font-medium">{profileForm.vendorName}</span>
  </div>
);

const ProfileImage = ({ profilePreview, profileForm, setShowProfile, handleRemoveProfileImage }) => (
  <div className="relative group">
    {profilePreview ? (
      <>
        <img 
          src={profilePreview} 
          alt="Profile" 
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm transition-all duration-200"
        />
        <ProfileImageOverlay 
          setShowProfile={setShowProfile}
          handleRemoveProfileImage={handleRemoveProfileImage}
        />
      </>
    ) : (
      <InitialAvatar 
        name={profileForm.vendorName}
        setShowProfile={setShowProfile}
      />
    )}
  </div>
);

const ProfileImageOverlay = ({ setShowProfile, handleRemoveProfileImage }) => (
  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
    <div className="flex space-x-1">
      <IconButton 
        onClick={() => setShowProfile(true)}
        icon="✏️"
        title="Edit Profile"
      />
      <IconButton 
        onClick={handleRemoveProfileImage}
        icon="❌"
        title="Remove Photo"
      />
    </div>
  </div>
);

const InitialAvatar = ({ name, setShowProfile }) => (
  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold relative group">
    {name.charAt(0).toUpperCase()}
    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <IconButton 
        onClick={() => setShowProfile(true)}
        icon="✏️"
        title="Edit Profile"
      />
    </div>
  </div>
);

const DefaultProfile = ({ userData }) => (
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
      {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U'}
    </div>
    <span className="text-gray-700 font-medium">{userData.fullName || 'User'}</span>
  </div>
);

const IconButton = ({ onClick, icon, title, className = '' }) => (
  <button 
    onClick={onClick}
    className={`p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors ${className}`}
    title={title}
  >
    {icon}
  </button>
);

export default ProfileDisplay;