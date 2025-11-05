import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getApiBaseUrl } from '../../config/api'
import axios from 'axios'
import { getAvatarProps } from '../../utils/avatarGenerator'
import CocForm from './CocForm'
import CocFormPage1 from './CocFormPage1'
import CocFormPage2 from './CocFormPage2'
import CocFormPage3 from './CocFormPage3'
import CocFormPage4 from './CocFormPage4'
import CocFormPage5 from './CocFormPage5'
import CocFormPage6Review from './CocFormPage6'
import Apply from './Apply'
import EnhancedApply from './EnhancedApply'
import ReApply from './ReApply'
import ApplicationStatus from './ApplicationStatus'
import Profile from './ProfileNew'
import NotificationSystem from '../shared/NotificationSystem'
import { 
  Home, 
  FileText, 
  Calendar, 
  User, 
  LogOut,
  Bell,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Menu,
  X,
  ChevronLeft,
  Download,
  Upload,
  Smartphone,
  Monitor,
  ChevronDown,
  RefreshCw,
  RotateCcw,
  Mail,
  Phone,
  Lock
} from 'lucide-react'

const UserDashboard = () => {
  const { user, logout } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: ''
  })
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [applications, setApplications] = useState([])
  const [services, setServices] = useState([])
  const [expandedRequirements, setExpandedRequirements] = useState({})
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedPurpose, setSelectedPurpose] = useState(null)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [currentFormStep, setCurrentFormStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const checkMobileDevice = () => {
      const isMobile = window.innerWidth <= 768
      setIsMobileDevice(isMobile)
      if (isMobile) {
        setSidebarVisible(false)
      }
    }
    checkMobileDevice()
    window.addEventListener('resize', checkMobileDevice)

    // Load avatar from database
    const loadAvatar = async () => {
      try {
        const token = localStorage.getItem('ncip_token')
        if (!token) return

        const response = await axios.get(`${getApiBaseUrl()}/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (response.data.success) {
          // Update avatar - set to null if removed, or the URL if exists
          setAvatarPreview(response.data.profile.avatar_url || null)
        }
      } catch (error) {
        console.error('Error loading avatar:', error)
      }
    }
    loadAvatar()

    // Listen for avatar changes
    const handleAvatarChange = () => {
      loadAvatar()
    }
    
    // Listen for profile changes
    const handleProfileChange = () => {
      loadProfileFromDB()
    }
    
    // Load profile data from database
    const loadProfileFromDB = async () => {
      try {
        const token = localStorage.getItem('ncip_token')
        if (!token) return

        const response = await axios.get(`${getApiUrl()}/api/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (response.data.success) {
          const profile = response.data.profile
          // Update localStorage with display name
          const storedUser = JSON.parse(localStorage.getItem('ncip_user') || '{}')
          const updatedUser = {
            ...storedUser,
            displayName: profile.display_name || profile.nickname,
            nickname: profile.display_name || profile.nickname
          }
          localStorage.setItem('ncip_user', JSON.stringify(updatedUser))
          
          // Force re-render
          setProfileData(prev => ({
            ...prev,
            ...updatedUser
          }))
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }
    loadProfileFromDB()
    
    window.addEventListener('userAvatarChanged', handleAvatarChange)
    window.addEventListener('userProfileChanged', handleProfileChange)

    return () => {
      window.removeEventListener('resize', checkMobileDevice)
      window.removeEventListener('userAvatarChanged', handleAvatarChange)
      window.removeEventListener('userProfileChanged', handleProfileChange)
    }
  }, [])

  useEffect(() => {
    loadApplications()
    loadServices()
    loadNotifications()
    
    const section = searchParams.get('section')
    if (section) {
      setActiveSection(section)
    }
  }, [searchParams])

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem('ncip_token')
      if (!token) return

      // Fetch applications from backend API
      const response = await axios.get(`${getApiUrl()}/api/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        // Transform backend data to match frontend format
        const transformedApps = response.data.applications.map(app => ({
          id: app.application_id,
          userId: app.user_id,
          type: app.service_type,
          serviceType: app.service_type,
          purpose: app.purpose,
          status: app.application_status,
          submittedAt: app.submitted_at,
          createdAt: app.created_at,
          dateSubmitted: app.submitted_at,
          applicationNumber: app.application_number,
          // Include form data if available
          formData: {
            applicant_name: app.applicant_name,
            birth_date: app.birth_date,
            civil_status: app.civil_status,
            province: app.province,
            municipality: app.municipality,
            barangay: app.barangay,
            tribe_affiliation: app.tribe_affiliation
          }
        }))
        setApplications(transformedApps)
      }
    } catch (error) {
      console.error('Error loading applications:', error)
      // Fallback to localStorage if API fails
      const storedApplications = JSON.parse(localStorage.getItem('ncip_applications') || '[]')
      const userApplications = storedApplications.filter(app => app.userId === user?.id)
      setApplications(userApplications)
    }
  }

  const loadServices = () => {
    const storedServices = JSON.parse(localStorage.getItem('ncip_services') || '[]')
    setServices(storedServices)
  }

  const loadNotifications = () => {
    const storedNotifications = JSON.parse(localStorage.getItem('ncip_notifications') || '[]')
    const userNotifications = storedNotifications.filter(notif => notif.userId === user?.id)
    setNotifications(userNotifications)
    setUnreadCount(userNotifications.filter(notif => !notif.read).length)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSave = () => {
    alert('Profile updated successfully!')
  }

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }
    // TODO: Implement actual password change API call
    alert('Password changed successfully!')
    setShowPasswordModal(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }


  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-100'
      case 'approved': return 'text-emerald-600 bg-emerald-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'under_review': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'under_review': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const renderDashboardContent = () => (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {profileData.firstName || user?.firstName || 'User'}!</h1>
            <p className="text-blue-100 text-base md:text-lg">
              Manage your NCIP applications and track your progress
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Professional Clean Design */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
          <p className="text-xs text-gray-500 mt-1">Applications</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase">Pending</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {applications.filter(app => app.status === 'pending' || app.status === 'under_review').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">In Review</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase">Approved</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {applications.filter(app => app.status === 'approved').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Completed</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <XCircle className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase">Rejected</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {applications.filter(app => app.status === 'rejected').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Declined</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Recent Applications</h3>
              {applications.length > 0 && (
                <button 
                  onClick={() => setActiveSection('applications')}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View All →
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          {app.type || app.serviceType || 'Certificate of Confirmation'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(app.submittedAt || app.dateSubmitted || app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="uppercase">{app.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">No Applications Yet</h4>
                <p className="text-gray-600 mb-4 text-sm">Start your first application for NCIP services</p>
                <button 
                  onClick={() => setActiveSection('apply')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Apply Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-100">
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          </div>
          
          <div className="p-6 space-y-3">
            <button
              onClick={() => setActiveSection('apply')}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all border-2 border-blue-200 group"
            >
              <div className="p-3 bg-blue-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-900">New Application</p>
                <p className="text-sm text-gray-600">Apply for certificates</p>
              </div>
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setActiveSection('status')}
              className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border-2 border-gray-200 group"
            >
              <div className="p-3 bg-green-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-900">Track Status</p>
                <p className="text-sm text-gray-600">Check application progress</p>
              </div>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setActiveSection('reapply')}
              className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border-2 border-gray-200 group"
            >
              <div className="p-3 bg-amber-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-900">Re-Apply</p>
                <p className="text-sm text-gray-600">Resubmit expired documents</p>
              </div>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderApplicationsContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">My Applications</h2>
        <p className="text-gray-600 mt-2">Track and manage your service applications</p>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {app.type || app.serviceType || 'Certificate of Confirmation'}
                    </h3>
                    {app.purpose && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Purpose:</span> {app.purpose}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Application ID:</span> {app.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Submitted:</span> {new Date(app.submittedAt || app.dateSubmitted || app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    {app.status.replace('_', ' ').charAt(0).toUpperCase() + app.status.replace('_', ' ').slice(1)}
                  </div>
                </div>

                {/* Form Pages Status (if available) */}
                {app.pageStatuses && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Form Progress</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(app.pageStatuses).map(([page, status]) => (
                        <div key={page} className="flex items-center gap-2">
                          {status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-700 capitalize">{page.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  {app.status === 'pending' && (
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Upload className="w-4 h-4" />
                      Update Documents
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-600 mb-6">You haven't submitted any applications yet.</p>
          <button 
            onClick={() => setActiveSection('apply')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Start Your First Application
          </button>
        </div>
      )}
    </div>
  )

  const renderProfileContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-2xl text-white overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white/30 shadow-xl">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getAvatarProps(user).colors.bg} rounded-full flex items-center justify-center ${getAvatarProps(user).colors.text} text-5xl font-bold`}>
                      {getAvatarProps(user).initials}
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-white text-blue-600 p-3 rounded-full cursor-pointer hover:bg-blue-50 transition-all duration-200 shadow-lg group-hover:scale-110">
                  <Upload className="w-5 h-5" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  {profileData.firstName || user?.firstName} {profileData.lastName || user?.lastName}
                </h2>
                <p className="text-blue-100 text-lg mb-4">{profileData.email || user?.email}</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                    <span className="text-sm font-medium">Role: User</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                    <span className="text-sm font-medium">Status: Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                <p className="text-sm text-gray-600">Update your personal details</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter last name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="+63 912 345 6789"
                  />
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Complete Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Enter your complete address"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Security Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Account Security</h3>
                <p className="text-sm text-gray-600">Manage your password and security settings</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-all duration-300">
                <Lock className="w-5 h-5" />
              </div>
              <span className="relative">Change Password</span>
              <div className="relative bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform duration-300">
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button 
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button 
            onClick={handleProfileSave}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Save Changes
          </button>
        </div>

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Change Password</h2>
                    <p className="text-blue-100 text-sm">Update your account password</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="text-white hover:text-blue-100 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter current password"
                    />
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new password (min 6 characters)"
                    />
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm new password"
                    />
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-blue-900 font-medium mb-2">Password Requirements:</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• At least 6 characters long</li>
                    <li>• Must match confirmation password</li>
                  </ul>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const handleBackToApply = () => {
    setSelectedService(null)
    setCurrentFormStep(1)
    setFormData({})
  }

  const handleNextStep = (pageData) => {
    if (pageData) {
      setFormData(prev => ({ ...prev, ...pageData }))
    }
    setCurrentFormStep(currentFormStep + 1)
  }

  const handlePreviousStep = () => {
    setCurrentFormStep(currentFormStep - 1)
  }

  const handleCompleteApplication = () => {
    // Save complete application to localStorage
    const applications = JSON.parse(localStorage.getItem('ncip_applications') || '[]')
    const newApplication = {
      id: Date.now().toString(),
      userId: user?.id || 'user',
      type: 'Certificate of Confirmation',
      purpose: selectedService?.purpose || 'General',
      status: 'under_review',
      submittedAt: new Date().toISOString(),
      formData: formData,
      pageStatuses: {
        page1: 'completed',
        page2: 'completed', 
        page3: 'completed',
        page4: 'completed',
        page5: 'completed',
        documents: 'completed'
      }
    }
    
    applications.push(newApplication)
    localStorage.setItem('ncip_applications', JSON.stringify(applications))
    
    // Reset and go to applications
    setSelectedService(null)
    setCurrentFormStep(1)
    setFormData({})
    setActiveSection('applications')
    loadApplications()
  }

  const renderApplicationForm = () => {
    if (!selectedService) return <Apply onSelectService={setSelectedService} />

    switch (currentFormStep) {
      case 1:
        return (
          <CocFormPage1 
            formData={formData}
            onNext={handleNextStep}
            onBack={handleBackToApply}
            selectedPurpose={selectedService?.purpose}
          />
        )
      case 2:
        return (
          <CocFormPage2 
            formData={formData}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
          />
        )
      case 3:
        return (
          <CocFormPage3 
            formData={formData}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
            selectedPurpose={selectedService}
          />
        )
      case 4:
        return (
          <CocFormPage4 
            formData={formData}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
          />
        )
      case 5:
        return (
          <CocFormPage5 
            formData={formData}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
          />
        )
      case 6:
        return (
          <CocFormPage6Review 
            formData={formData}
            onBack={handlePreviousStep}
            onNext={handleCompleteApplication}
          />
        )
      default:
        return <Apply onSelectService={setSelectedService} />
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboardContent()
      case 'apply': return renderApplicationForm()
      case 'reapply': return <ReApply />
      case 'applications': return renderApplicationsContent()
      case 'status': return <ApplicationStatus />
      case 'profile': return <Profile />
      default: return renderDashboardContent()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay for mobile */}
      {sidebarVisible && isMobileDevice && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={() => setSidebarVisible(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-600 to-blue-800 shadow-2xl transition-all duration-300 z-40 ${
          sidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } w-64`}
      >
        <div className="p-6 border-b border-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">N</span>
            </div>
            <div className="text-white">
              <h2 className="font-bold text-lg">NCIP Portal</h2>
              <p className="text-blue-200 text-sm">User Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard' },
            { id: 'apply', icon: FileText, label: 'Apply' },
            { id: 'reapply', icon: RefreshCw, label: 'Re-Apply' },
            { id: 'status', icon: CheckCircle, label: 'Application Status' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id)
                if (isMobileDevice) {
                  setSidebarVisible(false)
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-blue-100 hover:bg-blue-500/30 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-500">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-blue-500/30 hover:text-white rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarVisible && !isMobileDevice ? 'ml-64' : 'ml-0'}`}>
        {/* Header - Professional Design */}
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl border-b-2 border-blue-800">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSidebar}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-all hover:scale-105"
                >
                  <Menu className="w-5 h-5 text-white" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white capitalize">
                    {activeSection === 'apply' ? 'Apply for Certificate' : 
                     activeSection === 'reapply' ? 'Re-Apply for Certificate' : activeSection}
                  </h1>
                  <p className="text-blue-100 text-sm mt-0.5">
                    {activeSection === 'dashboard' && 'Overview of your NCIP services'}
                    {activeSection === 'apply' && 'Submit new applications'}
                    {activeSection === 'reapply' && 'Resubmit applications with expired documents'}
                    {activeSection === 'applications' && 'Track your submitted applications'}
                    {activeSection === 'status' && 'View required forms and track application status'}
                    {activeSection === 'profile' && 'Manage your account settings'}
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                {/* Notifications - Professional Design */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 hover:bg-white/10 rounded-xl transition-all hover:scale-105"
                    title={`${unreadCount} unread notifications`}
                  >
                    <Bell className="w-5 h-5 text-white" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown - Modern Clean UI */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      {/* Header */}
                      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white border-opacity-30">
                              {unreadCount} New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-blue-100 mt-1">
                          Stay updated with your applications
                        </p>
                      </div>
                      
                      {/* Notifications List */}
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => {
                                if (notification.link) {
                                  setActiveSection(notification.link)
                                }
                                setShowNotifications(false)
                              }}
                              className={`w-full p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-gray-100 text-left group ${
                                !notification.read ? 'bg-blue-50/50' : ''
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow ${
                                  notification.type === 'success' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                                  notification.type === 'warning' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                                  notification.type === 'error' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                                  'bg-gradient-to-br from-blue-500 to-blue-600'
                                }`}>
                                  <Bell className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-bold text-gray-900 text-base">{notification.title}</p>
                                    {!notification.read && (
                                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(notification.created_at).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          /* No notifications - Empty State */
                          <div className="p-12 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">All caught up!</h4>
                            <p className="text-sm text-gray-500">You have no new notifications</p>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Profile Button */}
                <button
                  onClick={() => setActiveSection('profile')}
                  className="flex items-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:scale-105 backdrop-blur-sm border border-white/20"
                >
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Profile" 
                      className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className={`w-9 h-9 bg-gradient-to-br ${getAvatarProps(user).colors.bg} rounded-full flex items-center justify-center ${getAvatarProps(user).colors.text} text-sm font-bold shadow-md border-2 border-white`}>
                      {getAvatarProps(user).initials}
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <div className="text-white font-bold text-sm">
                      {profileData?.displayName || profileData?.nickname || user?.displayName || user?.nickname || `${user?.firstName} ${user?.lastName}`}
                    </div>
                    <div className="text-blue-100 text-xs">View Profile</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default UserDashboard
