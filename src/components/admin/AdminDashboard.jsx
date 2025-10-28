import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Menu, ChevronLeft, Smartphone, Monitor } from 'lucide-react'
import Applications from './Applications'
import Services from './Services'
import Users from './Users'
import UserRegistrations from './UserRegistrations'
import PendingRegistrations from './PendingRegistrations'
import Profile from './Profile'
import Reports from './Reports'
import Genealogy from './Genealogy'
import RequirementSettings from './RequirementSettings'
import DocumentReview from './DocumentReview';
import apiService from '../../services/apiService'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isMobile, setIsMobile] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    nickname: user?.first_name || 'Admin',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    position: user?.position || 'Administrator',
    address: user?.address || '',
    bio: user?.bio || ''
  })
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    totalPurposes: 0,
    pendingApplications: 0,
    pendingRegistrations: 0,
    newApplications: 0,
    newRegistrations: 0
  })

  useEffect(() => {
    // Detect mobile device
    const checkMobileDevice = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                      window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarVisible(false)
      }
    }
    
    checkMobileDevice()
    window.addEventListener('resize', checkMobileDevice)
    
    loadStats()
    loadProfileData()
    loadAvatar()
    
    // Listen for avatar changes from Profile component
    const handleAvatarChange = () => {
      loadAvatar()
      loadProfileData()
    }
    
    // Listen for profile changes
    const handleProfileChange = (event) => {
      loadAvatar()
      loadProfileData()
    }
    
    // Listen for realtime purposes changes
    const handlePurposesChange = (event) => {
      loadStats()
    }
    
    // Listen for application/registration changes
    const handleApplicationsChange = () => {
      loadStats()
    }
    
    const handleRegistrationsChange = () => {
      loadStats()
    }
    
    window.addEventListener('avatarChanged', handleAvatarChange)
    window.addEventListener('profileChanged', handleProfileChange)
    window.addEventListener('purposesChanged', handlePurposesChange)
    window.addEventListener('applicationsChanged', handleApplicationsChange)
    window.addEventListener('registrationsChanged', handleRegistrationsChange)
    
    // Auto-refresh stats every 5 seconds for real-time updates
    const statsInterval = setInterval(() => {
      loadStats()
    }, 5000)
    
    return () => {
      window.removeEventListener('resize', checkMobileDevice)
      window.removeEventListener('avatarChanged', handleAvatarChange)
      window.removeEventListener('profileChanged', handleProfileChange)
      window.removeEventListener('purposesChanged', handlePurposesChange)
      window.removeEventListener('applicationsChanged', handleApplicationsChange)
      window.removeEventListener('registrationsChanged', handleRegistrationsChange)
      clearInterval(statsInterval)
    }
  }, [])

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        nickname: user.first_name || 'Admin',
        email: user.email || '',
        phone_number: user.phone_number || '',
        position: user.position || 'Administrator',
        address: user.address || ''
      }))
    }
  }, [user])

  const loadAvatar = async () => {
    try {
      // First check localStorage for saved avatar
      const savedAvatar = localStorage.getItem('adminProfileAvatar')
      if (savedAvatar) {
        setAvatarPreview(savedAvatar)
        return
      }
      
      // Try to get from API
      const response = await apiService.profile.get()
      if (response.success && response.profile?.avatar_url) {
        setAvatarPreview(response.profile.avatar_url)
      } else {
        setAvatarPreview(null)
      }
    } catch (error) {
      console.error('Error loading avatar:', error)
      // Fallback to localStorage
      const savedAvatar = localStorage.getItem('adminProfileAvatar')
      setAvatarPreview(savedAvatar || null)
    }
  }

  const loadStats = async () => {
    try {
      // Load pending registrations from new API
      // Dynamic API URL
      const getApiUrl = () => {
        const currentHost = window.location.hostname;
        if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
          return `http://${currentHost}:3001`;
        }
        return 'http://localhost:3001';
      };
      
      const pendingRegsResponse = await fetch(`${getApiUrl()}/api/pending-registrations/pending`);
      const pendingRegsData = await pendingRegsResponse.json();
      const pendingRegistrations = pendingRegsData.success ? pendingRegsData.registrations : [];

      const [usersRes, appsRes, purposesRes] = await Promise.all([
        apiService.users.getAll(),
        apiService.applications.getAllAdmin(),
        apiService.purposes.getAll()
      ])

      const users = usersRes.users || []
      const applications = appsRes.applications || []
      const purposes = purposesRes.purposes || []

      // Count applications that need attention (submitted or under review)
      const pendingApps = applications.filter(app => 
        app.application_status === 'submitted' || app.application_status === 'under_review'
      ).length

      setStats({
        totalUsers: users.length,
        totalApplications: applications.length,
        totalPurposes: purposes.length,
        pendingApplications: pendingApps,
        pendingRegistrations: pendingRegistrations.length,
        newApplications: applications.filter(app => app.application_status === 'submitted').length,
        newRegistrations: pendingRegistrations.length
      })
    } catch (error) {
      console.error('Error loading stats:', error)
      setStats({
        totalUsers: 0,
        totalApplications: 0,
        totalPurposes: 0,
        pendingApplications: 0,
        pendingRegistrations: 0
      })
    }
  }

  const loadProfileData = async () => {
    try {
      // First check localStorage for updated profile
      const adminProfile = JSON.parse(localStorage.getItem('adminProfile') || '{}')
      const storedUser = JSON.parse(localStorage.getItem('ncip_user') || '{}')
      
      // Try to get from API
      const response = await apiService.profile.get()
      if (response.success && response.profile) {
        const profile = response.profile
        setProfileData({
          firstName: adminProfile.firstName || profile.first_name || storedUser.firstName || user?.first_name || '',
          lastName: adminProfile.lastName || profile.last_name || storedUser.lastName || user?.last_name || '',
          nickname: adminProfile.nickname || profile.nickname || profile.display_name || storedUser.nickname || user?.first_name || 'Admin',
          position: adminProfile.position || profile.position || 'System Administrator',
          email: profile.email || storedUser.email || user?.email || '',
          phone_number: profile.phone_number || storedUser.phone_number || user?.phone_number || '',
          address: profile.address || storedUser.address || user?.address || ''
        })
      } else {
        // Fallback to localStorage if API fails
        setProfileData({
          firstName: adminProfile.firstName || storedUser.firstName || user?.first_name || '',
          lastName: adminProfile.lastName || storedUser.lastName || user?.last_name || '',
          nickname: adminProfile.nickname || storedUser.nickname || user?.first_name || 'Admin',
          position: adminProfile.position || 'System Administrator',
          email: storedUser.email || user?.email || '',
          phone_number: storedUser.phone_number || user?.phone_number || '',
          address: storedUser.address || user?.address || ''
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      // Fallback to localStorage
      const adminProfile = JSON.parse(localStorage.getItem('adminProfile') || '{}')
      const storedUser = JSON.parse(localStorage.getItem('ncip_user') || '{}')
      setProfileData({
        firstName: adminProfile.firstName || storedUser.firstName || user?.first_name || '',
        lastName: adminProfile.lastName || storedUser.lastName || user?.last_name || '',
        nickname: adminProfile.nickname || storedUser.nickname || user?.first_name || 'Admin',
        position: adminProfile.position || 'System Administrator',
        email: storedUser.email || user?.email || '',
        phone_number: storedUser.phone_number || user?.phone_number || '',
        address: storedUser.address || user?.address || ''
      })
    }
  }

  const handleLogout = () => {
    logout()
  }

  const handleProfileClick = () => {
    setActiveSection('profile')
  }

  const handleBackToDashboard = () => {
    setActiveSection('dashboard')
    loadProfileData() // Reload profile data when returning from profile
    loadAvatar() // Reload avatar when returning from profile
  }

  const sidebarItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0" />
        </svg>
      )
    },
    {
      id: 'applications',
      name: 'Applications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      badge: stats.totalApplications > 0 ? stats.totalApplications : null
    },
    {
      id: 'documents',
      name: 'Requirement Review',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      component: 'documents'
    },
    {
      id: 'registrations',
      name: 'Registrations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      badge: stats.pendingRegistrations > 0 ? stats.pendingRegistrations : null
    },
    {
      id: 'purposes',
      name: 'Purposes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      badge: null
    },
    {
      id: 'users',
      name: 'Users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      badge: null
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'genealogy',
      name: 'Genealogy',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ]

  const getPageTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Dashboard Overview'
      case 'applications': return 'Applications Management'
      case 'registrations': return 'Registrations'
      case 'purposes': return 'Purposes Management'
      case 'users': return 'User Management'
      case 'reports': return 'Reports & Analytics'
      case 'genealogy': return 'Genealogy Verification'
      case 'profile': return 'Profile Settings'
      default: return 'Dashboard'
    }
  }

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Welcome Banner - Professional Design */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="relative p-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}></div>
          </div>
          
          {/* Content */}
          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Welcome back, {profileData.nickname || user?.username || 'Admin'}!
                  </h1>
                  <p className="text-blue-100 text-base mt-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg border border-white border-opacity-30">
                  <p className="text-sm text-white font-medium">
                    <span className="font-bold">{stats.pendingApplications + stats.pendingRegistrations}</span> items need your attention
                  </p>
                </div>
              </div>
            </div>
            
            {/* Time Widget */}
            <div className="hidden lg:block">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
                <div className="text-center">
                  <p className="text-5xl font-bold text-white mb-1">
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </p>
                  <p className="text-sm text-blue-100 font-medium">
                    {Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 transform hover:scale-105 transition-all cursor-pointer" onClick={() => setActiveSection('users')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Total Users</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border-2 border-indigo-200 p-6 transform hover:scale-105 transition-all cursor-pointer" onClick={() => setActiveSection('applications')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Total Applications</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border-2 border-yellow-200 p-6 transform hover:scale-105 transition-all cursor-pointer" onClick={() => setActiveSection('applications')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-yellow-900">{stats.pendingApplications}</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Pending Review</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 p-6 transform hover:scale-105 transition-all cursor-pointer" onClick={() => setActiveSection('registrations')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-900">{stats.pendingRegistrations}</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">New Registrations</p>
        </div>
      </div>

      {/* Quick Actions & System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveSection('documents')}
              className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all hover:shadow-lg"
            >
              <div className="text-blue-600 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-900">Review Documents</p>
            </button>
            <button
              onClick={() => setActiveSection('applications')}
              className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all hover:shadow-lg"
            >
              <div className="text-blue-600 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-900">Manage Applications</p>
            </button>
            <button
              onClick={() => setActiveSection('users')}
              className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all hover:shadow-lg"
            >
              <div className="text-blue-600 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-900">User Management</p>
            </button>
            <button
              onClick={() => setActiveSection('reports')}
              className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all hover:shadow-lg"
            >
              <div className="text-blue-600 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-900">View Reports</p>
            </button>
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            System Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Active Users</p>
                  <p className="text-xs text-gray-600">Currently online</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-900">{stats.totalUsers}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Pending Actions</p>
                  <p className="text-xs text-gray-600">Requires attention</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-yellow-900">{stats.pendingApplications + stats.pendingRegistrations}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">System Status</p>
                  <p className="text-xs text-gray-600">All systems operational</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-200 text-green-900 rounded-full text-xs font-bold">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboardContent()
      case 'applications':
        return <Applications onStatsUpdate={loadStats} />
      case 'documents':
        return <DocumentReview />
      case 'registrations':
        return <PendingRegistrations />
      case 'purposes':
        return <Services />
      case 'users':
        return <Users />
      case 'reports':
        return <Reports />
      case 'genealogy':
        return <Genealogy />
      case 'profile':
        return <Profile />
      default:
        return renderDashboardContent()
    }
  }

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Animated Sidebar */}
      <div 
        className={`${isMobile ? 'fixed' : 'fixed'} left-0 top-0 h-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-2xl transition-all duration-300 z-50 ${
          sidebarVisible && !isMobile ? 'w-72 translate-x-0' : 
          sidebarVisible && isMobile ? 'w-full translate-x-0' : 
          'w-0 -translate-x-full'
        }`}
      >
        {sidebarVisible && (
          <div className="flex flex-col flex-grow h-full w-72 overflow-y-auto">
            {/* Professional Header */}
            <div className="flex items-center flex-shrink-0 px-6 py-6 bg-white bg-opacity-10 backdrop-blur-sm border-b border-white border-opacity-20">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <img className="h-8 w-8" src="/NCIPLogo.png" alt="NCIP" />
              </div>
              <div className="ml-4">
                <span className="text-xl font-bold text-white tracking-wide">NCIP Admin</span>
                <p className="text-blue-100 text-sm">Management Portal</p>
              </div>
            </div>
            
            <div className="flex-grow flex flex-col py-6">
              <nav className="flex-1 px-4 space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`${
                      activeSection === item.id
                        ? 'bg-white text-blue-700 shadow-xl border-l-4 border-blue-500'
                        : 'text-white hover:bg-white hover:bg-opacity-15 hover:text-white border-l-4 border-transparent'
                    } group w-full flex items-center px-5 py-4 text-sm font-medium rounded-r-xl transition-all duration-200 ease-in-out`}
                  >
                    <span className={`${
                      activeSection === item.id ? 'text-blue-600' : 'text-blue-200'
                    } mr-4 flex-shrink-0 w-5 h-5`}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left font-semibold">{item.name}</span>
                    {item.badge && (
                      <span className={`${
                        activeSection === item.id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-500 text-white'
                      } inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full min-w-[24px] shadow-md`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
              
              {/* Professional Logout Section */}
              <div className="px-4 py-4 border-t border-white border-opacity-20 bg-white bg-opacity-5">
                <button
                  onClick={handleLogout}
                  className="group w-full flex items-center px-5 py-4 text-sm font-medium text-white hover:bg-red-500 hover:bg-opacity-20 hover:text-red-100 rounded-xl transition-all duration-200 ease-in-out border border-transparent hover:border-red-400 hover:border-opacity-30"
                >
                  <svg className="mr-4 h-5 w-5 flex-shrink-0 text-red-300 group-hover:text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 0v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5m6 0V4a2 2 0 00-2-2H6a2 2 0 00-2 2v1" />
                  </svg>
                  <span className="flex-1 text-left font-semibold">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${
        sidebarVisible && !isMobile ? 'ml-72' : 'ml-0'
      }`}>
        {/* Simple Compact Header */}
        <header className="bg-blue-600 shadow-sm border-b border-blue-700">
          <div className="px-6">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleSidebar}
                  className="p-1 rounded text-white hover:bg-blue-700 transition-colors"
                >
                  {sidebarVisible ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </button>
                <h1 className="text-xl font-semibold text-white">{getPageTitle()}</h1>
              </div>
              <div className="flex items-center space-x-2">
                
                {/* Notifications - Pending Applications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
                    title={`${stats.newApplications + stats.pendingApplications + stats.pendingRegistrations} pending items need attention`}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {(stats.newApplications + stats.pendingApplications + stats.pendingRegistrations) > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {stats.newApplications + stats.pendingApplications + stats.pendingRegistrations}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown - Modern Clean UI */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                      {/* Header */}
                      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-white">Notifications</h3>
                          {(stats.newApplications > 0 || stats.newRegistrations > 0) && (
                            <span className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white border-opacity-30">
                              {stats.newApplications + stats.newRegistrations} New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-blue-100 mt-1">
                          {stats.newApplications + stats.pendingApplications + stats.pendingRegistrations} pending items
                        </p>
                      </div>
                      
                      {/* Notifications List */}
                      <div className="max-h-96 overflow-y-auto">
                        {/* New Applications */}
                        {stats.newApplications > 0 && (
                          <button
                            onClick={() => {
                              setActiveSection('applications')
                              setShowNotifications(false)
                            }}
                            className="w-full p-5 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 transition-all duration-200 border-b border-gray-100 text-left group"
                          >
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-bold text-gray-900 text-base">New Applications</p>
                                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm animate-pulse">
                                    {stats.newApplications}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {stats.newApplications} new application{stats.newApplications !== 1 ? 's' : ''} submitted
                                </p>
                                <div className="flex items-center text-xs text-purple-600 font-semibold group-hover:text-purple-700">
                                  <span>View now</span>
                                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </button>
                        )}

                        {/* Pending Registrations */}
                        {stats.pendingRegistrations > 0 && (
                          <button
                            onClick={() => {
                              setActiveSection('registrations')
                              setShowNotifications(false)
                            }}
                            className="w-full p-5 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 border-b border-gray-100 text-left group"
                          >
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-bold text-gray-900 text-base">User Registrations</p>
                                  {stats.newRegistrations > 0 && (
                                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm animate-pulse">
                                      {stats.newRegistrations}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {stats.pendingRegistrations} user{stats.pendingRegistrations !== 1 ? 's' : ''} waiting for approval
                                </p>
                                <div className="flex items-center text-xs text-green-600 font-semibold group-hover:text-green-700">
                                  <span>Approve now</span>
                                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </button>
                        )}

                        {/* No notifications - Empty State */}
                        {stats.newApplications === 0 && stats.pendingApplications === 0 && stats.pendingRegistrations === 0 && (
                          <div className="p-12 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="text-gray-900 font-bold text-lg mb-1">All caught up!</p>
                            <p className="text-sm text-gray-500">No pending notifications at the moment</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile - Enhanced */}
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-3 hover:bg-blue-700 rounded-lg px-3 py-2 transition-colors"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-white/20">
                      <span className="text-sm font-bold text-blue-600">
                        {profileData.firstName?.charAt(0)?.toUpperCase() || 'A'}
                      </span>
                    </div>
                  )}
                  <div className="text-left hidden md:block">
                    <div className="text-sm font-medium text-white">
                      {profileData.nickname || user?.username || user?.firstName || 'Admin'}
                    </div>
                    <div className="text-xs text-blue-200">
                      Admin Officer IV
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 overflow-y-auto bg-gray-50 ${isMobile ? 'px-3 py-4' : 'px-6 py-8'}`}>
          <div className={`${isMobile ? 'w-full' : 'max-w-7xl mx-auto'}`}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
