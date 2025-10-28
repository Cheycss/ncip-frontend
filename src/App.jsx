import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './components/shared/Login.jsx'
import LoginPage from './components/auth/LoginPage.jsx'
import UserRegistration from './components/user/UserRegistration.jsx'
import UserDashboard from './components/user/UserDashboard.jsx'
// Fixed import for Vercel deployment
import AdminDashboard from './components/admin/AdminDashboard.jsx'
import CocForm from './components/user/CocForm.jsx'
import ApplicationDocuments from './components/user/ApplicationDocuments.jsx'
import ProtectedRoute from './components/shared/ProtectedRoute.jsx'
import './utils/initializeData'


// Simple Error Boundary to surface runtime errors instead of a blank screen
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('App ErrorBoundary caught an error:', error, info)
    this.setState({ info })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui', color: '#111827' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Something went wrong.</h1>
          <pre style={{ background: '#FEF2F2', color: '#991B1B', padding: 12, borderRadius: 8, overflow: 'auto' }}>
            {String(this.state.error)}
          </pre>
          {this.state.info && this.state.info.componentStack && (
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: 'pointer' }}>Stack trace</summary>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.info.componentStack}</pre>
            </details>
          )}
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <ErrorBoundary>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<UserRegistration />} />
          
          {/* User Routes */}
          <Route 
            path="/user" 
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* COC Form Route */}
          <Route 
            path="/user/coc-form" 
            element={
              <ProtectedRoute requiredRole="user">
                <CocForm />
              </ProtectedRoute>
            } 
          />
          
          {/* Application Documents Route */}
          <Route 
            path="/application/:applicationId/documents" 
            element={
              <ProtectedRoute requiredRole="user">
                <ApplicationDocuments />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ErrorBoundary>
      </div>
    </AuthProvider>
  )
}

export default App
