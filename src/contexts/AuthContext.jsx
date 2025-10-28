import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Dynamic API URL - works both locally and on network
  const getApiBaseUrl = () => {
    const currentHost = window.location.hostname;
    
    // If accessing via IP address, use the same IP for API
    if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
      return `http://${currentHost}:3001/api`;
    }
    
    // Default to localhost for local development
    return 'http://localhost:3001/api';
  };

  const API_BASE_URL = getApiBaseUrl()

  const getAuthHeaders = () => {
    const token = localStorage.getItem('ncip_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Logout function (defined early so interceptor can use it)
  const logout = async () => {
    localStorage.removeItem('ncip_user')
    localStorage.removeItem('ncip_token')
    setUser(null)
    setError(null)
    window.location.href = '/login'
  }

  // Setup axios interceptor to handle token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Check if error is due to expired token
        if (error.response?.status === 401 && 
            (error.response?.data?.message?.includes('expired') || 
             error.response?.data?.message?.includes('Token expired'))) {
          console.log('Token expired, logging out...')
          logout()
        }
        return Promise.reject(error)
      }
    )

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [])

  // Check if user is authenticated on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('ncip_user')
    const token = localStorage.getItem('ncip_token')
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error('Failed to parse stored user data:', error)
        localStorage.removeItem('ncip_user')
        localStorage.removeItem('ncip_token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    
    try {
      // Make POST request to backend API
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: credentials.email,
        password: credentials.password
      })

      if (response.data.success) {
        const { token, user } = response.data
        
        // Save token and user data to localStorage
        localStorage.setItem('ncip_token', token)
        localStorage.setItem('ncip_user', JSON.stringify(user))
        
        setUser(user)
        
        return { success: true, user }
      } else {
        const errorMessage = response.data.message || 'Login failed'
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (error) {
      // Handle axios errors
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    setError(null)
    
    try {
      // Mock registration - just return success
      await new Promise(resolve => setTimeout(resolve, 500))
      return { success: true, message: 'Registration successful' }
    } catch (error) {
      const errorMessage = 'Registration failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Admin functions for user management
  const fetchUsers = async () => {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    })
    return response.data?.users || []
  }

  const createUser = async (payload) => {
    const response = await axios.post(`${API_BASE_URL}/users`, payload, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    })
    return response.data?.user
  }

  const updateUser = async (userId, payload) => {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, payload, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    })
    return response.data?.user
  }

  const updateUserStatus = async (userId, isActive) => {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/status`, { is_active: isActive }, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    })
    return response.data
  }

  const deleteUser = async (userId) => {
    const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
      headers: getAuthHeaders()
    })
    return response.data
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    // Admin functions
    fetchUsers,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
