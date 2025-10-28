// Automatic Application Cancellation System
// This utility handles automatic cancellation of applications that miss deadlines

import { createNotification } from '../components/shared/NotificationSystem'

/**
 * Check for overdue applications and automatically cancel them
 * This function should be called periodically (e.g., daily via cron job or scheduled task)
 */
export const checkAndCancelOverdueApplications = () => {
  try {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]')
    const deadlines = JSON.parse(localStorage.getItem('application_deadlines') || '[]')
    const configs = JSON.parse(localStorage.getItem('system_configurations') || '[]')
    
    // Get auto-cancel configuration (default: 7 days after deadline)
    const autoCancelConfig = configs.find(c => c.config_key === 'auto_cancel_overdue_days')
    const autoCancelDays = autoCancelConfig ? parseInt(autoCancelConfig.config_value) : 7
    
    const today = new Date()
    const cancelledApplications = []
    
    // Check each deadline
    deadlines.forEach(deadline => {
      if (deadline.is_overdue && !deadline.is_met) {
        const deadlineDate = new Date(deadline.deadline_date)
        const daysSinceDeadline = Math.floor((today - deadlineDate) / (1000 * 60 * 60 * 24))
        
        // Auto-cancel if past the grace period
        if (daysSinceDeadline >= autoCancelDays) {
          const application = applications.find(app => app.application_id === deadline.application_id)
          
          if (application && application.application_status !== 'cancelled' && application.application_status !== 'completed') {
            // Cancel the application
            application.application_status = 'cancelled'
            application.cancellation_reason = 'Automatic cancellation due to missed deadline'
            application.cancelled_at = new Date().toISOString()
            application.updated_at = new Date().toISOString()
            
            cancelledApplications.push(application)
            
            // Create notification for user
            createNotification(
              application.user_id,
              'Application Cancelled',
              `Your application ${application.application_number} has been automatically cancelled due to missing the submission deadline by ${daysSinceDeadline} days. You can re-apply if needed.`,
              'error',
              application.application_id
            )
            
            // Log the cancellation
            console.log(`Auto-cancelled application ${application.application_number} for user ${application.user_id}`)
          }
        }
      }
    })
    
    // Save updated applications
    if (cancelledApplications.length > 0) {
      localStorage.setItem('applications', JSON.stringify(applications))
      
      // Create admin notification summary
      const adminUsers = JSON.parse(localStorage.getItem('users') || '[]').filter(user => user.role === 'admin')
      adminUsers.forEach(admin => {
        createNotification(
          admin.user_id,
          'Applications Auto-Cancelled',
          `${cancelledApplications.length} applications were automatically cancelled due to missed deadlines. Review the cancelled applications for any necessary follow-up actions.`,
          'warning'
        )
      })
    }
    
    return {
      success: true,
      cancelledCount: cancelledApplications.length,
      cancelledApplications: cancelledApplications.map(app => ({
        application_id: app.application_id,
        application_number: app.application_number,
        user_id: app.user_id,
        service_type: app.service_type
      }))
    }
  } catch (error) {
    console.error('Error in automatic cancellation process:', error)
    return {
      success: false,
      error: error.message,
      cancelledCount: 0,
      cancelledApplications: []
    }
  }
}

/**
 * Check for applications approaching auto-cancellation and send warnings
 * This should be called before the actual cancellation (e.g., 2-3 days before)
 */
export const sendCancellationWarnings = () => {
  try {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]')
    const deadlines = JSON.parse(localStorage.getItem('application_deadlines') || '[]')
    const configs = JSON.parse(localStorage.getItem('system_configurations') || '[]')
    
    // Get auto-cancel configuration
    const autoCancelConfig = configs.find(c => c.config_key === 'auto_cancel_overdue_days')
    const autoCancelDays = autoCancelConfig ? parseInt(autoCancelConfig.config_value) : 7
    
    const today = new Date()
    const warningsSent = []
    
    // Send warnings 2 days before auto-cancellation
    const warningThreshold = autoCancelDays - 2
    
    deadlines.forEach(deadline => {
      if (deadline.is_overdue && !deadline.is_met) {
        const deadlineDate = new Date(deadline.deadline_date)
        const daysSinceDeadline = Math.floor((today - deadlineDate) / (1000 * 60 * 60 * 24))
        
        // Send warning if approaching auto-cancellation
        if (daysSinceDeadline === warningThreshold) {
          const application = applications.find(app => app.application_id === deadline.application_id)
          
          if (application && application.application_status !== 'cancelled' && application.application_status !== 'completed') {
            createNotification(
              application.user_id,
              'Application Cancellation Warning',
              `Your application ${application.application_number} will be automatically cancelled in 2 days if required documents are not submitted. Please submit your documents immediately to avoid cancellation.`,
              'warning',
              application.application_id
            )
            
            warningsSent.push({
              application_id: application.application_id,
              application_number: application.application_number,
              user_id: application.user_id
            })
          }
        }
      }
    })
    
    return {
      success: true,
      warningsSent: warningsSent.length,
      warnings: warningsSent
    }
  } catch (error) {
    console.error('Error sending cancellation warnings:', error)
    return {
      success: false,
      error: error.message,
      warningsSent: 0,
      warnings: []
    }
  }
}

/**
 * Get statistics about overdue applications
 */
export const getOverdueApplicationStats = () => {
  try {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]')
    const deadlines = JSON.parse(localStorage.getItem('application_deadlines') || '[]')
    
    const today = new Date()
    const stats = {
      totalOverdue: 0,
      approachingCancellation: 0,
      eligibleForCancellation: 0,
      byServiceType: {},
      byDaysOverdue: {
        '1-3': 0,
        '4-7': 0,
        '8-14': 0,
        '15+': 0
      }
    }
    
    deadlines.forEach(deadline => {
      if (deadline.is_overdue && !deadline.is_met) {
        const application = applications.find(app => app.application_id === deadline.application_id)
        
        if (application && application.application_status !== 'cancelled' && application.application_status !== 'completed') {
          const deadlineDate = new Date(deadline.deadline_date)
          const daysSinceDeadline = Math.floor((today - deadlineDate) / (1000 * 60 * 60 * 24))
          
          stats.totalOverdue++
          
          // Count by service type
          if (!stats.byServiceType[application.service_type]) {
            stats.byServiceType[application.service_type] = 0
          }
          stats.byServiceType[application.service_type]++
          
          // Count by days overdue
          if (daysSinceDeadline <= 3) {
            stats.byDaysOverdue['1-3']++
          } else if (daysSinceDeadline <= 7) {
            stats.byDaysOverdue['4-7']++
          } else if (daysSinceDeadline <= 14) {
            stats.byDaysOverdue['8-14']++
          } else {
            stats.byDaysOverdue['15+']++
          }
          
          // Check if approaching cancellation (within 2 days)
          if (daysSinceDeadline >= 5) {
            stats.approachingCancellation++
          }
          
          // Check if eligible for cancellation
          if (daysSinceDeadline >= 7) {
            stats.eligibleForCancellation++
          }
        }
      }
    })
    
    return stats
  } catch (error) {
    console.error('Error getting overdue application stats:', error)
    return {
      totalOverdue: 0,
      approachingCancellation: 0,
      eligibleForCancellation: 0,
      byServiceType: {},
      byDaysOverdue: {
        '1-3': 0,
        '4-7': 0,
        '8-14': 0,
        '15+': 0
      }
    }
  }
}

/**
 * Manually cancel an application (admin function)
 */
export const manuallyCancel = (applicationId, reason, adminUserId) => {
  try {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]')
    const application = applications.find(app => app.application_id === applicationId)
    
    if (!application) {
      throw new Error('Application not found')
    }
    
    if (application.application_status === 'cancelled') {
      throw new Error('Application is already cancelled')
    }
    
    // Cancel the application
    application.application_status = 'cancelled'
    application.cancellation_reason = reason
    application.cancelled_by = adminUserId
    application.cancelled_at = new Date().toISOString()
    application.updated_at = new Date().toISOString()
    
    localStorage.setItem('applications', JSON.stringify(applications))
    
    // Notify the user
    createNotification(
      application.user_id,
      'Application Cancelled',
      `Your application ${application.application_number} has been cancelled. Reason: ${reason}. You can re-apply if needed.`,
      'error',
      application.application_id
    )
    
    return {
      success: true,
      application: {
        application_id: application.application_id,
        application_number: application.application_number,
        cancellation_reason: reason
      }
    }
  } catch (error) {
    console.error('Error manually cancelling application:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Initialize the automatic cancellation system
 * This should be called when the application starts
 */
export const initializeAutoCancellation = () => {
  // Set up periodic checks (every 24 hours)
  const checkInterval = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  
  // Initial check
  setTimeout(() => {
    sendCancellationWarnings()
    checkAndCancelOverdueApplications()
  }, 5000) // Wait 5 seconds after initialization
  
  // Set up recurring checks
  setInterval(() => {
    sendCancellationWarnings()
    checkAndCancelOverdueApplications()
  }, checkInterval)
  
  console.log('Automatic application cancellation system initialized')
}

export default {
  checkAndCancelOverdueApplications,
  sendCancellationWarnings,
  getOverdueApplicationStats,
  manuallyCancel,
  initializeAutoCancellation
}
