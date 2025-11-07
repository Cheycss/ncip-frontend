import React, { useState, useEffect } from 'react';
import { Eye, MessageSquare, CheckCircle, XCircle, Clock, ArrowLeft, ArrowRight, FileText, Download, Archive, AlertTriangle, Calendar, X, ZoomIn, ZoomOut, RotateCw, RotateCcw, FileX } from 'lucide-react';
import axios from 'axios';
import { getApiBaseUrl } from '../../config/api';
import CocFormViewer from './CocFormViewer'

const Applications = ({ onStatsUpdate }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [currentCommentPage, setCurrentCommentPage] = useState('')
  const [commentText, setCommentText] = useState('')
  const [showFormViewer, setShowFormViewer] = useState(false)
  const [currentViewingPage, setCurrentViewingPage] = useState(null)
  const [documentZoom, setDocumentZoom] = useState(100)
  const [documentRotation, setDocumentRotation] = useState(0)
  const [pageStatus, setPageStatus] = useState('pending')
  const [comments, setComments] = useState({})
  const [currentComment, setCurrentComment] = useState('')

  // Dynamic API URL - works both locally and on network
  const API_BASE_URL = getApiBaseUrl()

  const getAuthHeaders = () => {
    const token = localStorage.getItem('ncip_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const transformApplication = (apiApp) => {
    const firstName = apiApp?.applicant?.first_name || apiApp?.first_name || ''
    const lastName = apiApp?.applicant?.last_name || apiApp?.last_name || ''
    const applicantName = [firstName, lastName].filter(Boolean).join(' ') || apiApp?.applicant_name || 'Unknown'

    return {
      id: apiApp.application_id,
      applicationNumber: apiApp.application_number,
      serviceType: apiApp.service_type,
      purpose: apiApp.purpose,
      status: apiApp.application_status || apiApp.status,
      priority: apiApp.priority,
      submittedAt: apiApp.submitted_at,
      createdAt: apiApp.created_at,
      updatedAt: apiApp.updated_at,
      reviewerNotes: apiApp.reviewer_notes || '',
      firstName,
      lastName,
      applicantName,
      email: apiApp?.applicant?.email || apiApp?.email || 'No email',
      phoneNumber: apiApp?.applicant?.phone_number || '',
      address: apiApp?.applicant?.address || '',
      formData: apiApp?.coc_form || {},
      requirements: apiApp?.requirements || null,
      pageStatuses: apiApp?.page_statuses || {},
      comments: apiApp?.comments || {},
      reviewProgress: apiApp?.review_progress || 0,
      documents: apiApp?.documents || []
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  // Helper function to check if requirement is expired
  const isRequirementExpired = (requirement) => {
    if (!requirement || !requirement.expiresAt) return false;
    return new Date(requirement.expiresAt) < new Date();
  };

  // Helper function to format expiration date
  const formatExpirationDate = (dateString) => {
    if (!dateString) return 'No expiration';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper function to get days until expiration
  const getDaysUntilExpiration = (dateString) => {
    if (!dateString) return null;
    const expirationDate = new Date(dateString);
    const today = new Date();
    const diffTime = expirationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handlePageApproval = async (pageNum, status) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/applications/${selectedApplication.id}/page-approval`,
        {
          pageNumber: pageNum,
          status: status,
          reviewerNotes: currentComment
        },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        // Update local state
        setSelectedApplication(prev => ({
          ...prev,
          pageStatuses: {
            ...prev.pageStatuses,
            [`page${pageNum}`]: status
          }
        }));
        
        // Check if all pages are approved
        const allPagesApproved = [1,2,3,4,5,6].every(num => {
          if (num === pageNum) return status === 'approved';
          return selectedApplication.pageStatuses?.[`page${num}`] === 'approved';
        });
        
        if (allPagesApproved) {
          // Update application status to ready for requirements
          await updateApplicationStatus(selectedApplication.id, 'ready_for_requirements');
          alert('All pages approved! User has been notified to submit requirements.');
        }
        
        setCurrentViewingPage(null);
        alert(`Page ${pageNum} ${status}!`);
      }
    } catch (error) {
      console.error('Error updating page status:', error);
      alert('Failed to update page status');
    }
  };

  const loadApplications = async () => {
    setLoading(true)

    try {
      const response = await axios.get(`${API_BASE_URL}/applications/admin/all`, {
        headers: getAuthHeaders()
      })

      const apiApplications = response.data?.applications || []
      const processedApplications = apiApplications.map(transformApplication).map(app => {
        const updatedApp = { ...app }

        if (app.requirements) {
          let hasExpiredRequirements = false
          Object.entries(app.requirements).forEach(([key, requirement]) => {
            if (isRequirementExpired(requirement)) {
              updatedApp.requirements[key] = { ...requirement, status: 'expired' }
              hasExpiredRequirements = true
            }
          })

          if (hasExpiredRequirements && app.status === 'under_review') {
            updatedApp.status = 'requires_resubmission'
          }
        }

        return updatedApp
      })

      setApplications(processedApplications)
    } catch (error) {
      console.error('Error loading applications:', error)
      setApplications([])
    } finally {
      setLoading(false)
    }

    if (onStatsUpdate) {
      onStatsUpdate()
    }
  }

  const updateApplicationStatus = async (id, newStatus, reviewerNotes = '') => {
    try {
      await axios.put(`${API_BASE_URL}/applications/${id}/status`, {
        status: newStatus,
        reviewer_notes: reviewerNotes
      }, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      })

      const updatedApplications = applications.map(app =>
        app.id === id ? { ...app, status: newStatus, reviewerNotes, updatedAt: new Date().toISOString() } : app
      )
      setApplications(updatedApplications)

      const application = updatedApplications.find(app => app.id === id)
      if (application) {
        sendNotificationToUser(application, newStatus)
      }

      if (onStatsUpdate) onStatsUpdate()
    } catch (error) {
      console.error('Error updating application status:', error)
      alert(error.response?.data?.message || 'Failed to update application status. Please try again.')
    }
  }

  const sendNotificationToUser = (application, status) => {
    const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]')
    console.log('Creating notification for application:', application.id, 'status:', status) // Debug log
    
    let message = ''
    let type = 'info'
    
    switch (status) {
      case 'under_review':
        message = `Your ${application.serviceType} application is now under review by our team.`
        type = 'info'
        break
      case 'approved':
        message = `Great news! Your ${application.serviceType} application has been approved.`
        type = 'success'
        break
      case 'rejected':
        message = `Your ${application.serviceType} application has been rejected. Please check the comments for details.`
        type = 'error'
        break
      default:
        console.log('Unknown status, skipping notification:', status) // Debug log
        return
    }
    
    const notification = {
      id: Date.now(),
      applicationId: application.id,
      title: 'Application Status Update',
      message: message,
      type: type,
      status: status,
      applicationName: application.serviceType,
      purpose: application.purpose,
      timestamp: new Date().toISOString(),
      read: false
    }
    
    console.log('Created notification:', notification) // Debug log
    
    const updatedNotifications = [notification, ...notifications]
    localStorage.setItem('user_notifications', JSON.stringify(updatedNotifications))
    console.log('Saved notifications to localStorage:', updatedNotifications) // Debug log
  }

  const updatePageStatus = (appId, page, status, comment = '') => {
    const updatedApplications = applications.map(app => {
      if (app.id === appId) {
        const newPageStatuses = { ...app.pageStatuses, [page]: status }
        const newComments = comment ? { ...app.comments, [page]: comment } : app.comments
        
        // Calculate overall status based on page statuses
        const pageValues = Object.values(newPageStatuses)
        let overallStatus = 'under_review'
        
        if (pageValues.every(s => s === 'approved')) {
          overallStatus = 'approved'
        } else if (pageValues.some(s => s === 'rejected')) {
          overallStatus = 'rejected'
        } else if (pageValues.some(s => s === 'under_review' || s === 'approved')) {
          overallStatus = 'under_review'
        }
        
        const reviewProgress = pageValues.filter(s => s !== 'pending').length
        
        return {
          ...app,
          pageStatuses: newPageStatuses,
          comments: newComments,
          status: overallStatus,
          reviewProgress,
          updatedAt: new Date().toISOString()
        }
      }
      return app
    })
    
    setApplications(updatedApplications)
    localStorage.setItem('applications', JSON.stringify(updatedApplications))
    
    // Trigger real-time update event
    window.dispatchEvent(new Event('applicationsChanged'))
    
    // Update user applications
    const userApps = JSON.parse(localStorage.getItem('user_applications') || '[]')
    const updatedUserApps = userApps.map(app => {
      if (app.id === appId) {
        const updatedApp = updatedApplications.find(a => a.id === appId)
        return {
          ...app,
          status: updatedApp.status,
          pageStatuses: updatedApp.pageStatuses,
          comments: updatedApp.comments,
          updatedAt: updatedApp.updatedAt
        }
      }
      return app
    })
    
    localStorage.setItem('user_applications', JSON.stringify(updatedUserApps))
    
    if (onStatsUpdate) {
      onStatsUpdate()
    }
  }

  // New handler functions for enhanced features
  const handleViewForms = (application) => {
    setSelectedApplication(application);
    setShowFormViewer(true);
  };

  const closeViewers = () => {
    setShowFormViewer(false);
    setSelectedApplication(null);
  };

  const handleApproveApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to approve the forms? The user will then be able to upload requirements.')) {
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/applications/${applicationId}/status`,
        { status: 'forms_approved' },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        // Refresh applications list
        loadApplications();
        // Update stats if callback provided
        if (onStatsUpdate) {
          onStatsUpdate();
        }
        alert('Forms approved successfully! User can now upload requirements.');
      }
    } catch (error) {
      console.error('Error approving forms:', error);
      alert('Failed to approve forms. Please try again.');
    }
  };

  const handleViewRequirements = async (applicationId) => {
    // This would redirect to the Requirements Review tab
    // For now, we'll show an alert
    alert('This will redirect to the Requirements Review tab to view uploaded documents.');
  };

  const handleApproveRequirements = async (applicationId) => {
    if (!window.confirm('Are you sure you want to approve the requirements? This will allow certificate generation.')) {
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/applications/${applicationId}/status`,
        { status: 'approved' },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        // Refresh applications list
        loadApplications();
        // Update stats if callback provided
        if (onStatsUpdate) {
          onStatsUpdate();
        }
        alert('Requirements approved successfully! Certificate can now be issued.');
      }
    } catch (error) {
      console.error('Error approving requirements:', error);
      alert('Failed to approve requirements. Please try again.');
    }
  };

  const handleRejectRequirements = async (applicationId) => {
    const reason = prompt('Please provide a reason for rejecting the requirements:');
    if (!reason) return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/applications/${applicationId}/status`,
        { 
          status: 'requirements_rejected',
          reviewer_notes: reason 
        },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        // Refresh applications list
        loadApplications();
        // Update stats if callback provided
        if (onStatsUpdate) {
          onStatsUpdate();
        }
        alert('Requirements rejected. User will need to resubmit.');
      }
    } catch (error) {
      console.error('Error rejecting requirements:', error);
      alert('Failed to reject requirements. Please try again.');
    }
  };

  const handleRejectApplication = async (applicationId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/applications/${applicationId}/status`,
        { 
          status: 'rejected',
          reviewer_notes: reason 
        },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        // Refresh applications list
        loadApplications();
        // Update stats if callback provided
        if (onStatsUpdate) {
          onStatsUpdate();
        }
        alert('Application rejected successfully!');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application. Please try again.');
    }
  };

  const handleGenerateCertificate = async (applicationId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/applications/${applicationId}/certificate`,
        {},
        { 
          headers: getAuthHeaders(),
          responseType: 'blob'
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${applicationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Update application status to certificate_issued
      await axios.put(
        `${API_BASE_URL}/applications/${applicationId}/status`,
        { status: 'certificate_issued' },
        { headers: getAuthHeaders() }
      );

      // Refresh applications list
      loadApplications();
      if (onStatsUpdate) {
        onStatsUpdate();
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    }
  };

  // Removed duplicate function - using async version above

  const handleCommentSubmit = () => {
    updatePageStatus(selectedApplication.id, currentCommentPage, 'rejected', commentText)
    setShowCommentModal(false)
    setCurrentCommentPage('')
    setCommentText('')
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'submitted': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200'
      case 'under_review': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'ready_for_requirements': return 'bg-green-50 text-green-700 border-green-200'
      case 'certificate_issued': return 'bg-purple-50 text-purple-700 border-purple-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusDotColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-400'
      case 'approved': return 'bg-emerald-400'
      case 'rejected': return 'bg-red-400'
      case 'under_review': return 'bg-blue-400'
      default: return 'bg-gray-400'
    }
  }

  const archiveApplication = (id) => {
    if (window.confirm('Are you sure you want to archive this application?')) {
      const updatedApplications = applications.map(app =>
        app.id === id ? { ...app, status: 'archived', updatedAt: new Date().toISOString() } : app
      )
      setApplications(updatedApplications)
      localStorage.setItem('applications', JSON.stringify(updatedApplications))
      
      // Also update user applications
      const userApps = JSON.parse(localStorage.getItem('user_applications') || '[]')
      const updatedUserApps = userApps.map(app =>
        app.id === id ? { ...app, status: 'archived', updatedAt: new Date().toISOString() } : app
      )
      localStorage.setItem('user_applications', JSON.stringify(updatedUserApps))
      
      if (onStatsUpdate) onStatsUpdate()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading applications...</p>
        </div>
      </div>
    )
  }

  if (selectedApplication) {
    console.log('Selected application:', selectedApplication)
    console.log('Form data:', selectedApplication.formData)
    console.log('Submission type:', selectedApplication.submissionType)
    
    const pageKey = `page${currentPage}`
    const pageStatus = selectedApplication.pageStatuses?.[pageKey] || 'pending'
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="flex items-center text-blue-600 hover:text-blue-700 mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Applications
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Review Application</h2>
              <p className="text-gray-600">
                {selectedApplication.applicantName || selectedApplication.name || 'Unknown'} - {selectedApplication.purpose || 'No purpose specified'}
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDotColor(selectedApplication.status)}`}></div>
                {selectedApplication.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Progress: {selectedApplication.reviewProgress || 0}/5 pages reviewed
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {selectedApplication.submissionType === 'pdf_upload' ? (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">PDF Application Review</h3>
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">PDF Application: {selectedApplication.name || 'Uploaded PDF'}</p>
                <p className="text-sm text-gray-500">Uploaded: {new Date(selectedApplication.uploadedAt || selectedApplication.createdAt).toLocaleDateString()}</p>
                {selectedApplication.data && (
                  <button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = selectedApplication.data
                      link.download = selectedApplication.name || 'application.pdf'
                      link.click()
                    }}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                  >
                    <Download className="w-4 h-4 mr-2 inline" />
                    Download PDF
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                <div className="space-y-4">
                  {/* Current Page Viewer */}
                  {currentViewingPage ? (
                    <div className="bg-white rounded-lg border-2 border-blue-200">
                      <div className="bg-blue-50 p-4 border-b border-blue-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Viewing Page {currentViewingPage}</h3>
                          <button
                            onClick={() => setCurrentViewingPage(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        {/* PDF Viewer */}
                        <div className="relative bg-gray-100 rounded-lg" style={{ height: '600px' }}>
                          <iframe
                            src={`${API_BASE_URL}/applications/documents/view/${selectedApplication.id}/${selectedApplication.documents.find(d => d.type === `page${currentViewingPage}`)?.fileName}?token=${localStorage.getItem('ncip_token')}`}
                            className="w-full h-full border-0"
                            title={`Page ${currentViewingPage}`}
                          />
                        </div>
                        {/* View Controls */}
                        <div className="flex items-center justify-center gap-4 mt-4">
                          <a
                            href={`${API_BASE_URL}/applications/documents/view/${selectedApplication.id}/${selectedApplication.documents.find(d => d.type === `page${currentViewingPage}`)?.fileName}?token=${localStorage.getItem('ncip_token')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Open in New Tab
                          </a>
                          <a
                            href={`${API_BASE_URL}/applications/documents/view/${selectedApplication.id}/${selectedApplication.documents.find(d => d.type === `page${currentViewingPage}`)?.fileName}?token=${localStorage.getItem('ncip_token')}`}
                            download
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        </div>
                        {/* Page Approval Actions */}
                        <div className="flex justify-center gap-4 mt-6">
                          <button
                            onClick={() => handlePageApproval(currentViewingPage, 'approved')}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Approve Page {currentViewingPage}
                          </button>
                          <button
                            onClick={() => handlePageApproval(currentViewingPage, 'rejected')}
                            className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                          >
                            <XCircle className="w-5 h-5" />
                            Reject Page {currentViewingPage}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Page Grid View */
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">COC Forms Submitted</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((pageNum) => {
                          const pageDoc = selectedApplication.documents.find(doc => 
                            doc.type === `page${pageNum}`
                          );
                          const pageStatus = selectedApplication.pageStatuses?.[`page${pageNum}`] || 'pending';
                          return (
                            <div key={pageNum} className="bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all cursor-pointer"
                                 onClick={() => pageDoc && setCurrentViewingPage(pageNum)}>
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-gray-900">Page {pageNum}</h4>
                                  {pageStatus === 'approved' && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Approved</span>
                                  )}
                                  {pageStatus === 'rejected' && (
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Rejected</span>
                                  )}
                                  {pageStatus === 'pending' && pageDoc && (
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Review</span>
                                  )}
                                </div>
                                {pageDoc ? (
                                  <div className="text-center py-4">
                                    <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Click to view</p>
                                  </div>
                                ) : (
                                  <div className="text-center py-4">
                                    <FileX className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Not uploaded</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                  
                  {/* Application Details */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Application Details</h4>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <dt className="font-medium text-gray-500">Purpose:</dt>
                        <dd className="text-gray-900">{selectedApplication.purpose || 'Not specified'}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-500">Service Type:</dt>
                        <dd className="text-gray-900">{selectedApplication.serviceType}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-500">Submitted:</dt>
                        <dd className="text-gray-900">{new Date(selectedApplication.submittedAt).toLocaleDateString()}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-500">Status:</dt>
                        <dd className="text-gray-900">{selectedApplication.status}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              ) : selectedApplication.formData && Object.keys(selectedApplication.formData).length > 0 ? (
                <CocFormViewer 
                  formData={selectedApplication.formData}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  selectedPurpose={selectedApplication.purpose}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <h3 className="text-lg font-semibold mb-1">No Form Data Available</h3>
                  <p className="text-gray-600">This application doesn't have form data to display.</p>
                </div>
              )}
            </>
          )}
          
          {/* Page Actions */}
          <div className="bg-gray-50 rounded-xl p-6 mt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-gray-900">Page Review</h3>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                  pageStatus === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  pageStatus === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                  pageStatus === 'under_review' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    pageStatus === 'approved' ? 'bg-emerald-500' :
                    pageStatus === 'rejected' ? 'bg-red-500' :
                    pageStatus === 'under_review' ? 'bg-blue-500' :
                    'bg-amber-500'
                  }`}></div>
                  {pageStatus === 'pending' ? 'Pending Review' : 
                   pageStatus === 'under_review' ? 'Under Review' :
                   pageStatus === 'approved' ? 'Approved' : 'Rejected'}
                </div>
              </div>
              
              <div className="flex space-x-3">
                {pageStatus !== 'approved' && (
                  <button
                    onClick={() => handlePageApproval(pageKey, 'approve')}
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approve Page
                  </button>
                )}
                
                {pageStatus !== 'rejected' && (
                  <button
                    onClick={() => handlePageApproval(pageKey, 'reject')}
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject Page
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          {selectedApplication.comments?.[pageKey] && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Admin Comment:</h4>
              <p className="text-red-700">{selectedApplication.comments[pageKey]}</p>
            </div>
          )}
        </div>

        {/* Comment Modal */}
        {showCommentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Rejection Comment</h3>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommentSubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject with Comment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Search Applications
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by applicant name, email, or service type..."
                className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Filter by Status
            </label>
            <div className="flex items-center justify-start gap-3">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({applications.length})
              </button>
              <button
                onClick={() => setStatusFilter('submitted')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'submitted'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending Review ({applications.filter(app => ['pending', 'under_review', 'submitted'].includes(app.status)).length})
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'approved'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ready for Certificate ({applications.filter(app => app.status === 'approved').length})
              </button>
              <button
                onClick={() => setStatusFilter('certificate_issued')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'certificate_issued'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed ({applications.filter(app => app.status === 'certificate_issued').length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">Loading applications...</p>
          </div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-600 mb-6">
            {applications.length === 0 
              ? "No applications have been submitted yet. Applications will appear here once users submit their forms."
              : `No applications match your current filters. Showing 0 of ${applications.length} total applications.`
            }
          </p>
          <div className="text-sm text-gray-500">
            <p>Debug info:</p>
            <p>Total applications: {applications.length}</p>
            <p>Filtered applications: {filteredApplications.length}</p>
            <p>Status filter: {statusFilter}</p>
            <p>Search term: "{searchTerm}"</p>
          </div>
          <button
            onClick={loadApplications}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Refresh Applications
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Application ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Date Submitted
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {console.log('Rendering table rows for applications:', filteredApplications)}
                {filteredApplications.map((application, index) => {
                  console.log(`Rendering application ${index}:`, application)
                  return (
                    <tr key={application.id} className="hover:bg-gray-50 transition-colors duration-200">
                      {/* Applicant */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600">
                                {(application.firstName || application.applicantName || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {`${application.firstName || ''} ${application.lastName || ''}`.trim() || application.applicantName || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Application ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">
                          {application.id}
                        </div>
                      </td>
                      
                      {/* Purpose */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.purpose || 'Not specified'}
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDotColor(application.status)}`}></div>
                          {(application.status || 'pending').replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      
                      {/* Date Submitted */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(application.submittedAt || application.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(application.submittedAt || application.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-2">
                          {/* View Forms Button */}
                          <button
                            onClick={() => handleViewForms(application)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors shadow-sm"
                            title="View Application Forms"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View Forms
                          </button>

                          {/* Step 3: Approve Requirements - For requirements_submitted status */}
                          {application.status === 'requirements_submitted' && (
                            <>
                              <button
                                onClick={() => handleViewRequirements(application.id)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors shadow-sm"
                                title="View Submitted Requirements"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Review Requirements
                              </button>
                              <button
                                onClick={() => handleApproveRequirements(application.id)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                title="Approve Requirements"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve Requirements
                              </button>
                              <button
                                onClick={() => handleRejectRequirements(application.id)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                                title="Reject Requirements"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject Requirements
                              </button>
                            </>
                          )}

                          {/* Step 4: Generate Certificate - Only after both forms and requirements approved */}
                          {application.status === 'approved' && (
                            <button
                              onClick={() => handleGenerateCertificate(application.id)}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                              title="Generate Certificate of Confirmation"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Issue Certificate
                            </button>
                          )}

                          {/* Final Status - Certificate Issued */}
                          {application.status === 'certificate_issued' && (
                            <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Certificate Issued
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Summary Stats */}
      {filteredApplications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredApplications.length}</div>
              <div className="text-sm text-gray-500">Total Shown</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">
                {filteredApplications.filter(app => app.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {filteredApplications.filter(app => app.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-500">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredApplications.filter(app => app.status === 'under_review').length}
              </div>
              <div className="text-sm text-gray-500">Under Review</div>
            </div>
          </div>
        </div>
      )}

      {/* Form Viewer Modal */}
      {showFormViewer && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Application Forms</h3>
                <p className="text-sm text-gray-600">
                  {selectedApplication.firstName} {selectedApplication.lastName} - {selectedApplication.purpose}
                </p>
              </div>
              <button
                onClick={closeViewers}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {selectedApplication.formData && Object.keys(selectedApplication.formData).length > 0 ? (
                <CocFormViewer 
                  formData={selectedApplication.formData}
                  currentPage={1}
                  setCurrentPage={() => {}}
                  selectedPurpose={selectedApplication.purpose}
                  readOnly={true}
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Form Data</h4>
                  <p className="text-gray-600">This application doesn't have form data to display.</p>
                </div>
              )}
              
              {/* Uploaded Documents Section */}
              {selectedApplication.documents && selectedApplication.documents.length > 0 && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Uploaded Documents ({selectedApplication.documents.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedApplication.documents.map((doc, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg border border-blue-200 hover:border-blue-400 transition-colors">
                        <div className="flex items-start">
                          <FileText className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate" title={doc.fileName}>
                              {doc.fileName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {doc.type?.replace('page', 'Page ')} • {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Buttons Footer - Only show for submitted applications */}
            {selectedApplication.status === 'submitted' && (
              <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    handleRejectApplication(selectedApplication.id);
                    closeViewers();
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Reject Application
                </button>
                <button
                  onClick={() => {
                    handleApproveApplication(selectedApplication.id);
                    closeViewers();
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve Forms
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Applications
