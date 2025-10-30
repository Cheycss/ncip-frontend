import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { getApiBaseUrl } from '../../config/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Save,
  CheckCircle,
  AlertCircle,
  Camera,
  X,
  Edit3,
  Shield
} from 'lucide-react';

// Dynamic API URL helper
const API_BASE_URL = getApiBaseUrl();

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    address: ''
  });
  const [profileInfo, setProfileInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    try {
      const token = localStorage.getItem('ncip_token');
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const profile = response.data.profile;
        setProfileInfo(profile);
        setFormData({
          displayName: profile.display_name || profile.nickname || '',
          phone: profile.phone_number || '',
          address: profile.address || ''
        });
        
        if (profile.avatar_url) {
          setAvatarPreview(profile.avatar_url);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target.result;
        setAvatarPreview(imageData);
        
        try {
          const token = localStorage.getItem('ncip_token');
          await axios.post(`${API_BASE_URL}/profile/avatar`, 
            { avatar_data: imageData },
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          
          setMessage({ type: 'success', text: 'Profile picture updated!' });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
          window.dispatchEvent(new CustomEvent('userAvatarChanged'));
        } catch (error) {
          console.error('Error uploading avatar:', error);
          setMessage({ type: 'error', text: 'Failed to upload avatar' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = async () => {
    try {
      const token = localStorage.getItem('ncip_token');
      await axios.post(`${API_BASE_URL}/profile/avatar`, 
        { avatar_data: null },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setAvatarPreview(null);
      setSelectedAvatar(null);
      setMessage({ type: 'success', text: 'Profile picture removed!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      window.dispatchEvent(new CustomEvent('userAvatarChanged'));
    } catch (error) {
      console.error('Error removing avatar:', error);
      setMessage({ type: 'error', text: 'Failed to remove avatar' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('ncip_token');
      
      const response = await axios.put(`${API_BASE_URL}/profile`, {
        display_name: formData.displayName,
        nickname: formData.displayName,
        phone_number: formData.phone,
        address: formData.address
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        
        const storedUser = JSON.parse(localStorage.getItem('ncip_user') || '{}');
        const updatedUser = {
          ...storedUser,
          displayName: formData.displayName,
          nickname: formData.displayName,
          phone_number: formData.phone,
          address: formData.address
        };
        localStorage.setItem('ncip_user', JSON.stringify(updatedUser));
        window.dispatchEvent(new CustomEvent('userProfileChanged', { detail: updatedUser }));
        
        // Reload profile data
        loadProfileData();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Not set';
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'Not set';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-50 border-2 border-green-200 text-green-700' 
              : 'bg-red-50 border-2 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-3">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              {/* Avatar Section - Professional Design */}
              <div className="text-center mb-6">
                {/* Avatar Display */}
                <div className="relative inline-block mb-6">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-40 h-40 rounded-full object-cover border-4 border-blue-200 shadow-xl"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-4 border-blue-200 shadow-xl">
                      <span className="text-5xl font-bold text-white">
                        {profileInfo?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  
                  {/* Camera Icon Overlay */}
                  <label className="absolute bottom-2 right-2 cursor-pointer p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-110 transform">
                    <Camera className="h-5 w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* User Info */}
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {profileInfo?.first_name} {profileInfo?.last_name}
                </h2>
                <p className="text-gray-600 text-sm mb-4">{profileInfo?.email}</p>
                
                {/* Upload/Remove Buttons */}
                <div className="space-y-2 mb-4">
                  <label className="block w-full cursor-pointer">
                    <div className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Camera className="h-4 w-4" />
                        <span>Change Photo</span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  {avatarPreview && (
                    <button
                      onClick={removeAvatar}
                      className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium text-sm"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <X className="h-4 w-4" />
                        <span>Remove Photo</span>
                      </div>
                    </button>
                  )}
                </div>
                
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Active Account</span>
                </div>
              </div>

              {/* Account Info */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Account ID</span>
                  <span className="font-semibold text-gray-900">#{profileInfo?.user_id || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900">{formatDate(profileInfo?.created_at)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Role</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold">
                    <Shield className="h-3 w-3" />
                    {profileInfo?.role || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Display Name / Nickname
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your display name (e.g., CJ)"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">This name will appear in the header</p>
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900 font-medium">{profileInfo?.email}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="+63 912 345 6789"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Complete Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="Enter your complete address"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none transition-all"
                    />
                  </div>
                </div>


                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        loadProfileData();
                      }}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      <Save className="h-5 w-5" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
