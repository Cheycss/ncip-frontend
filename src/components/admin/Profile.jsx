import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Profile = ({ onBack }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    phone: '',
    position: '',
    address: '',
    currentPassword: '',
    newPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [originalAvatar, setOriginalAvatar] = useState(null)
  const [avatarChanged, setAvatarChanged] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(null)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = () => {
    const adminProfile = JSON.parse(localStorage.getItem('adminProfile') || '{}')
    const savedAvatar = localStorage.getItem('adminProfileAvatar')
    
    setFormData({
      firstName: adminProfile.firstName || user?.firstName || '',
      lastName: adminProfile.lastName || user?.lastName || '',
      nickname: adminProfile.nickname || user?.nickname || '',
      email: adminProfile.email || user?.email || '',
      phone: adminProfile.phone || '',
      position: adminProfile.position || '',
      address: adminProfile.address || ''
    })
    
    if (savedAvatar) {
      setAvatarPreview(savedAvatar)
      setOriginalAvatar(savedAvatar)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    setSelectedAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
    setAvatarChanged(true)
  }

  const removeAvatar = () => {
    setSelectedAvatar(null)
    setAvatarPreview(null)
    setOriginalAvatar(null)
    localStorage.removeItem('adminProfileAvatar')
    setAvatarChanged(false)
    setMessage('Avatar removed successfully!')
    setTimeout(() => setMessage(''), 3000)
    
    // Trigger navbar refresh
    window.dispatchEvent(new CustomEvent('avatarChanged'))
  }

  const saveAvatar = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (selectedAvatar) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = e.target.result
          localStorage.setItem('adminProfileAvatar', imageData)
          setOriginalAvatar(imageData)
          setAvatarPreview(imageData)
          setAvatarChanged(false)
          setMessage('Avatar updated successfully!')
          setTimeout(() => setMessage(''), 3000)
          
          // Trigger navbar refresh
          window.dispatchEvent(new CustomEvent('avatarChanged'))
        }
        reader.readAsDataURL(selectedAvatar)
      } else if (avatarPreview) {
        localStorage.setItem('adminProfileAvatar', avatarPreview)
        setOriginalAvatar(avatarPreview)
        setAvatarChanged(false)
        setMessage('Avatar updated successfully!')
        setTimeout(() => setMessage(''), 3000)
        
        // Trigger navbar refresh
        window.dispatchEvent(new CustomEvent('avatarChanged'))
      }
    } catch (error) {
      setMessage('Failed to update avatar. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const cancelAvatar = () => {
    setSelectedAvatar(null)
    setAvatarPreview(originalAvatar)
    setAvatarChanged(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Save to localStorage
      localStorage.setItem('adminProfile', JSON.stringify(formData))
      
      // Update user context
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        nickname: formData.nickname,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        address: formData.address
      }
      
      localStorage.setItem('ncip_user', JSON.stringify(updatedUser))
      
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
      
      // Trigger profile data refresh in AdminDashboard
      window.dispatchEvent(new CustomEvent('profileChanged', { detail: updatedUser }))
    } catch (error) {
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Profile Management</h2>
          <p className="text-sm text-gray-600 mt-2 font-medium">Manage your account information and system preferences</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-b border-gray-200 pb-3">
              Profile Picture
            </h3>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {formData.nickname?.[0]?.toUpperCase() || user?.nickname?.[0]?.toUpperCase() || user?.firstName?.[0]?.toUpperCase() || 'A'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    Upload New Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-2 text-xs text-gray-500 font-medium">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </p>
                </div>
                {avatarChanged && (
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={saveAvatar}
                      disabled={loading}
                      className="px-6 py-3 text-sm font-bold text-white bg-blue-600 border border-blue-600 rounded-xl hover:bg-blue-700 hover:border-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={cancelAvatar}
                      className="px-6 py-3 text-sm font-bold text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 hover:border-gray-400 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {avatarPreview && !avatarChanged && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="px-4 py-2 text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                  >
                    Remove Picture
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-b border-gray-200 pb-3">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                  placeholder="Enter your first name..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                  placeholder="Enter your last name..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Display Name
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                  placeholder="Enter your display name..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                  placeholder="Enter your email address..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                  placeholder="Enter your phone number..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Position/Title
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                  placeholder="Enter your position or title..."
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium resize-none"
                placeholder="Enter your complete address..."
              />
            </div>
          </div>

          {/* Security Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-b border-gray-200 pb-3">
              Security Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                  placeholder="Enter current password..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                  placeholder="Enter new password..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setFormData({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                nickname: user?.nickname || '',
                email: user?.email || '',
                phone: user?.phone || '',
                position: user?.position || '',
                address: user?.address || '',
                currentPassword: '',
                newPassword: ''
              })}
              className="px-6 py-3 text-sm font-bold text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 hover:border-gray-400 transition-all duration-200"
            >
              Reset Changes
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 text-sm font-bold text-white bg-blue-600 border border-blue-600 rounded-xl hover:bg-blue-700 hover:border-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>

        {/* Success Message */}
        {message && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-bold text-emerald-800">{message}</span>
            </div>
          </div>
        )}
      </div>

      {/* Activity Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-b border-gray-200 pb-3">
          Account Activity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {user?.loginCount || 0}
            </div>
            <div className="text-sm font-bold text-blue-800 uppercase tracking-wide">Total Logins</div>
          </div>
          <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Never'}
            </div>
            <div className="text-sm font-bold text-emerald-800 uppercase tracking-wide">Last Login</div>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {user?.role?.toUpperCase() || 'USER'}
            </div>
            <div className="text-sm font-bold text-purple-800 uppercase tracking-wide">Account Type</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
