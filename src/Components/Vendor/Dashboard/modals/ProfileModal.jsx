import React from 'react';

const ProfileModal = ({
  setShowProfile,
  profileForm,
  handleInputChange,
  idCardInputRef,
  handleIdCardUpload,
  idCardPreview,
  handleRemoveIdCard,
  profileInputRef,
  handleProfileImageUpload,
  profilePreview,
  handleRemoveProfileImage,
  handleProfileCancel,
  handleProfileSave,
  handleBackdropClick
}) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-6xl h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Create Your Profile</h2>
          <button 
            onClick={() => setShowProfile(false)}
            className="text-gray-500 hover:text-gray-700 text-xl p-2"
          >
            ✕
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="space-y-6">
             
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendor General Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendorName"
                      value={profileForm.vendorName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter vendor name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload ID Card</label>
                    <input
                      type="file"
                      ref={idCardInputRef}
                      onChange={handleIdCardUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div 
                      onClick={() => idCardInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      {idCardPreview ? (
                        <div className="relative">
                          <img 
                            src={idCardPreview} 
                            alt="ID Card Preview" 
                            className="max-h-32 mx-auto rounded"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveIdCard();
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ✕
                          </button>
                          <p className="text-sm text-green-600 mt-2">ID Card uploaded successfully</p>
                        </div>
                      ) : (
                        <div>
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-gray-500">Click to upload ID card</span>
                          <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, PDF</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              
              <div>
                <div className="mb-4">
                  <label className="block text-sm  font-medium text-gray-700 mb-2">
                    Vendor Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vendorCategory"
                    value={profileForm.vendorCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                    <option value="Books & Media">Books & Media</option>
                    <option value="Food & Beverages">Food & Beverages</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                  <textarea
                    name="about"
                    value={profileForm.about}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your business, products, and services..."
                  />
                </div>
              </div>

              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profileForm.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="emailAddress"
                      value={profileForm.emailAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActiveMember"
                      checked={profileForm.isActiveMember}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Active Member</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Payment & Tax Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment & Tax Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Payment Terms</label>
                    <select
                      name="paymentTerms"
                      value={profileForm.paymentTerms}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Net 30 Days">Net 30 Days</option>
                      <option value="Net 15 Days">Net 15 Days</option>
                      <option value="Net 60 Days">Net 60 Days</option>
                      <option value="Due on Receipt">Due on Receipt</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      value={profileForm.taxId}
                      onChange={handleInputChange}
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter tax ID (GSTIN, EIN, etc.)"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Picture Upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload your picture</h3>
                <input
                  type="file"
                  ref={profileInputRef}
                  onChange={handleProfileImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div 
                  onClick={() => profileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {profilePreview ? (
                    <div className="relative">
                      <img 
                        src={profilePreview} 
                        alt="Profile Preview" 
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveProfileImage();
                        }}
                        className="absolute top-4 right-1/2 translate-x-12 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ✕
                      </button>
                      <p className="text-sm text-green-600">Profile picture uploaded</p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-gray-500">Click to upload profile picture</span>
                      <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG</p>
                    </div>
                  )}
                </div>
              </div>

              

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  onClick={handleProfileCancel}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfileSave}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;