import React, { useState, useEffect } from 'react'
import { Bell, X, AlertTriangle, Clock, CheckCircle, Info, AlertCircle } from 'lucide-react'

const NotificationSystem = ({ userId }) => {
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (userId) {
      loadNotifications()
      // Set up interval to check for new notifications
      const interval = setInterval(loadNotifications, 30000) // Check every 30 seconds
      return () => clearInterval(interval)
    }
  }, [userId])

  const loadNotifications = () => {
    try {
      const allNotifications = JSON.parse(localStorage.getItem('ncip_notifications') || '[]')
      
      // Remove duplicate notifications (same title, message, and user_id within 1 second)
      const uniqueNotifications = []
      const seen = new Set()
      
      allNotifications.forEach(notification => {
        const key = `${notification.user_id}-${notification.title}-${notification.message}-${Math.floor(new Date(notification.created_at).getTime() / 1000)}`
        if (!seen.has(key)) {
          seen.add(key)
          uniqueNotifications.push(notification)
        }
      })
      
      // Save cleaned notifications back
      if (uniqueNotifications.length !== allNotifications.length) {
        localStorage.setItem('ncip_notifications', JSON.stringify(uniqueNotifications))
      }
      
      const userNotifications = uniqueNotifications
        .filter(notification => notification.user_id === userId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      
      setNotifications(userNotifications)
      setUnreadCount(userNotifications.filter(n => !n.is_read).length)
      
      console.log('Total notifications:', uniqueNotifications.length)
      console.log('User notifications:', userNotifications.length)
      console.log('Unread count:', userNotifications.filter(n => !n.is_read).length)
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const markAsRead = (notificationId) => {
    try {
      const allNotifications = JSON.parse(localStorage.getItem('ncip_notifications') || '[]')
      const updatedNotifications = allNotifications.map(notification => 
        notification.notification_id === notificationId 
          ? { ...notification, is_read: true }
          : notification
      )
      localStorage.setItem('ncip_notifications', JSON.stringify(updatedNotifications))
      loadNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = () => {
    try {
      const allNotifications = JSON.parse(localStorage.getItem('ncip_notifications') || '[]')
      const updatedNotifications = allNotifications.map(notification => 
        notification.user_id === userId 
          ? { ...notification, is_read: true }
          : notification
      )
      localStorage.setItem('ncip_notifications', JSON.stringify(updatedNotifications))
      loadNotifications()
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = (notificationId) => {
    try {
      const allNotifications = JSON.parse(localStorage.getItem('ncip_notifications') || '[]')
      const updatedNotifications = allNotifications.filter(
        notification => notification.notification_id !== notificationId
      )
      localStorage.setItem('ncip_notifications', JSON.stringify(updatedNotifications))
      loadNotifications()
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'document_expiry':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case 'deadline_reminder':
        return <Clock className="w-5 h-5 text-red-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getNotificationBgColor = (type, isRead) => {
    const baseColor = isRead ? 'bg-gray-50' : 'bg-white'
    const borderColor = isRead ? 'border-gray-200' : 'border-blue-200'
    
    switch (type) {
      case 'document_expiry':
        return `${baseColor} ${isRead ? 'border-gray-200' : 'border-orange-200'}`
      case 'deadline_reminder':
        return `${baseColor} ${isRead ? 'border-gray-200' : 'border-red-200'}`
      case 'success':
        return `${baseColor} ${isRead ? 'border-gray-200' : 'border-green-200'}`
      case 'error':
        return `${baseColor} ${isRead ? 'border-gray-200' : 'border-red-200'}`
      case 'warning':
        return `${baseColor} ${isRead ? 'border-gray-200' : 'border-yellow-200'}`
      default:
        return `${baseColor} ${borderColor}`
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
    
    return date.toLocaleDateString()
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.notification_id}
                    className={`p-4 border-l-4 ${getNotificationBgColor(notification.notification_type, notification.is_read)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.notification_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-medium ${notification.is_read ? 'text-gray-600' : 'text-gray-900'}`}>
                            {notification.title}
                          </h4>
                          <p className={`text-sm mt-1 ${notification.is_read ? 'text-gray-500' : 'text-gray-700'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.notification_id)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.notification_id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete notification"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button
                onClick={() => setShowNotifications(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Close notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Notification creation utility
export const createNotification = (userId, title, message, type = 'info', applicationId = null) => {
  try {
    const notifications = JSON.parse(localStorage.getItem('ncip_notifications') || '[]')
    
    // Check if a similar notification already exists (within last 5 seconds)
    const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString()
    const isDuplicate = notifications.some(notification => 
      notification.user_id === userId &&
      notification.title === title &&
      notification.message === message &&
      notification.created_at > fiveSecondsAgo
    )
    
    if (isDuplicate) {
      console.log('Duplicate notification prevented:', title)
      return null
    }
    
    const newNotification = {
      notification_id: Date.now() + Math.random(),
      user_id: userId,
      application_id: applicationId,
      title,
      message,
      notification_type: type,
      is_read: false,
      is_sent: true,
      send_via_email: true,
      send_via_sms: false,
      scheduled_send_date: null,
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
    
    notifications.push(newNotification)
    localStorage.setItem('ncip_notifications', JSON.stringify(notifications))
    
    return newNotification
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

// Document expiration checker
export const checkDocumentExpirations = () => {
  try {
    const applications = JSON.parse(localStorage.getItem('ncip_applications') || '[]')
    const documents = JSON.parse(localStorage.getItem('ncip_application_documents') || '[]')
    const configs = JSON.parse(localStorage.getItem('ncip_system_configurations') || '[]')
    
    // Get notification days from config (default: 30,15,7,1)
    const notificationConfig = configs.find(c => c.config_key === 'document_expiry_notification_days')
    const notificationDays = notificationConfig 
      ? notificationConfig.config_value.split(',').map(d => parseInt(d.trim()))
      : [30, 15, 7, 1]
    
    const today = new Date()
    
    documents.forEach(doc => {
      if (doc.expiration_date && doc.document_status === 'approved') {
        const expirationDate = new Date(doc.expiration_date)
        const daysUntilExpiry = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24))
        
        // Check if we should send a notification
        if (notificationDays.includes(daysUntilExpiry) && daysUntilExpiry >= 0) {
          const application = applications.find(app => app.application_id === doc.application_id)
          if (application) {
            createNotification(
              application.user_id,
              'Document Expiring Soon',
              `Your ${doc.original_filename} will expire in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}. Please renew it to avoid application delays.`,
              'document_expiry',
              application.application_id
            )
          }
        }
        
        // Mark as expired if past expiration date
        if (daysUntilExpiry < 0 && doc.document_status !== 'expired') {
          doc.document_status = 'expired'
          localStorage.setItem('ncip_application_documents', JSON.stringify(documents))
          
          const application = applications.find(app => app.application_id === doc.application_id)
          if (application) {
            createNotification(
              application.user_id,
              'Document Expired',
              `Your ${doc.original_filename} has expired. Please submit a new copy to continue your application.`,
              'error',
              application.application_id
            )
          }
        }
      }
    })
  } catch (error) {
    console.error('Error checking document expirations:', error)
  }
}

// Deadline checker
export const checkApplicationDeadlines = () => {
  try {
    const applications = JSON.parse(localStorage.getItem('ncip_applications') || '[]')
    const deadlines = JSON.parse(localStorage.getItem('ncip_application_deadlines') || '[]')
    
    const today = new Date()
    
    deadlines.forEach(deadline => {
      if (!deadline.is_met && !deadline.is_overdue) {
        const deadlineDate = new Date(deadline.deadline_date)
        const daysUntilDeadline = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))
        
        const application = applications.find(app => app.application_id === deadline.application_id)
        if (!application) return
        
        // Send reminder notifications
        if ([7, 3, 1].includes(daysUntilDeadline) && daysUntilDeadline >= 0) {
          createNotification(
            application.user_id,
            'Deadline Reminder',
            `You have ${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} left to submit required documents for your ${application.service_type} application.`,
            'deadline_reminder',
            application.application_id
          )
        }
        
        // Mark as overdue
        if (daysUntilDeadline < 0) {
          deadline.is_overdue = true
          localStorage.setItem('ncip_application_deadlines', JSON.stringify(deadlines))
          
          createNotification(
            application.user_id,
            'Deadline Missed',
            `The deadline for your ${application.service_type} application has passed. Your application may be cancelled if requirements are not submitted soon.`,
            'error',
            application.application_id
          )
        }
      }
    })
  } catch (error) {
    console.error('Error checking application deadlines:', error)
  }
}

export default NotificationSystem
