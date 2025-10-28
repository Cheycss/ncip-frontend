import React, { useState, useEffect } from 'react'
import { RefreshCw, FileCheck, FileX, AlertTriangle, Calendar, CheckCircle, Upload, Eye } from 'lucide-react'

const ReApplySystem = ({ userId, onReApply }) => {
  const [applications, setApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [documentStatus, setDocumentStatus] = useState([])
  const [reApplyData, setReApplyData] = useState(null)
  const [showReApplyModal, setShowReApplyModal] = useState(false)

  useEffect(() => {
    loadUserApplications()
  }, [userId])

  const loadUserApplications = () => {
    try {
      const allApplications = JSON.parse(localStorage.getItem('ncip_applications') || '[]')
      const userApplications = allApplications.filter(app => 
        app.user_id === userId && 
        (app.application_status === 'rejected' || app.application_status === 'incomplete' || hasExpiredDocuments(app.application_id))
      )
      setApplications(userApplications)
    } catch (error) {
      console.error('Error loading applications:', error)
    }
  }

  const hasExpiredDocuments = (applicationId) => {
    try {
      const documents = JSON.parse(localStorage.getItem('ncip_application_documents') || '[]')
      const appDocuments = documents.filter(doc => doc.application_id === applicationId)
      return appDocuments.some(doc => doc.document_status === 'expired' || 
        (doc.expiration_date && new Date(doc.expiration_date) < new Date()))
    } catch (error) {
      return false
    }
  }

  const analyzeDocuments = (applicationId) => {
    try {
      const documents = JSON.parse(localStorage.getItem('ncip_application_documents') || '[]')
      const requirements = JSON.parse(localStorage.getItem('ncip_document_requirements') || '[]')
      const application = applications.find(app => app.application_id === applicationId)
      
      if (!application) return []

      const serviceRequirements = requirements.filter(req => 
        req.service_type === application.service_type && req.is_active
      )

      const appDocuments = documents.filter(doc => doc.application_id === applicationId)
      
      return serviceRequirements.map(requirement => {
        const document = appDocuments.find(doc => doc.requirement_id === requirement.requirement_id)
        const today = new Date()
        
        let status = 'missing'
        let canReuse = false
        let expirationDate = null
        let daysUntilExpiry = null

        if (document) {
          expirationDate = document.expiration_date ? new Date(document.expiration_date) : null
          daysUntilExpiry = expirationDate ? Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24)) : null
          
          if (document.document_status === 'expired' || (expirationDate && expirationDate < today)) {
            status = 'expired'
          } else if (document.document_status === 'rejected') {
            status = 'rejected'
          } else if (document.document_status === 'approved' && (!expirationDate || expirationDate > today)) {
            status = 'valid'
            canReuse = true
          } else {
            status = 'pending'
          }
        }

        return {
          requirement,
          document,
          status,
          canReuse,
          expirationDate,
          daysUntilExpiry,
          needsReplacement: status === 'expired' || status === 'rejected' || status === 'missing'
        }
      })
    } catch (error) {
      console.error('Error analyzing documents:', error)
      return []
    }
  }

  const handleSelectApplication = (application) => {
    setSelectedApplication(application)
    const analysis = analyzeDocuments(application.application_id)
    setDocumentStatus(analysis)
  }

  const prepareReApplication = () => {
    if (!selectedApplication || !documentStatus.length) return

    const reusableDocuments = documentStatus.filter(item => item.canReuse)
    const requiredNewDocuments = documentStatus.filter(item => item.needsReplacement)
    
    const reApplyInfo = {
      originalApplication: selectedApplication,
      reusableDocuments: reusableDocuments.length,
      requiredNewDocuments: requiredNewDocuments.length,
      documentAnalysis: documentStatus,
      reason: determineReApplyReason()
    }

    setReApplyData(reApplyInfo)
    setShowReApplyModal(true)
  }

  const determineReApplyReason = () => {
    if (selectedApplication.application_status === 'rejected') return 'rejected_application'
    if (selectedApplication.application_status === 'incomplete') return 'incomplete_requirements'
    if (hasExpiredDocuments(selectedApplication.application_id)) return 'expired_documents'
    return 'user_request'
  }

  const confirmReApplication = () => {
    if (!reApplyData) return

    try {
      // Create new application
      const applications = JSON.parse(localStorage.getItem('ncip_applications') || '[]')
      const newApplicationId = Date.now()
      const newApplicationNumber = `NCIP-${new Date().getFullYear()}-${String(newApplicationId).slice(-6)}`
      
      const newApplication = {
        application_id: newApplicationId,
        user_id: userId,
        application_number: newApplicationNumber,
        service_type: selectedApplication.service_type,
        purpose: selectedApplication.purpose,
        application_status: 'draft',
        submission_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      applications.push(newApplication)
      localStorage.setItem('ncip_applications', JSON.stringify(applications))

      // Create re-application tracking record
      const reApplications = JSON.parse(localStorage.getItem('ncip_re_applications') || '[]')
      const reApplicationRecord = {
        re_application_id: Date.now() + 1,
        original_application_id: selectedApplication.application_id,
        new_application_id: newApplicationId,
        user_id: userId,
        re_application_reason: reApplyData.reason,
        reused_documents_count: reApplyData.reusableDocuments,
        new_documents_required_count: reApplyData.requiredNewDocuments,
        re_application_status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      reApplications.push(reApplicationRecord)
      localStorage.setItem('ncip_re_applications', JSON.stringify(reApplications))

      // Copy reusable documents
      const documents = JSON.parse(localStorage.getItem('ncip_application_documents') || '[]')
      const reusableItems = reApplyData.documentAnalysis.filter(item => item.canReuse && item.document)
      
      reusableItems.forEach(item => {
        const newDocument = {
          ...item.document,
          document_id: Date.now() + Math.random(),
          application_id: newApplicationId,
          reused_from_document_id: item.document.document_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        documents.push(newDocument)
      })

      localStorage.setItem('ncip_application_documents', JSON.stringify(documents))

      // Create notification
      const notifications = JSON.parse(localStorage.getItem('ncip_notifications') || '[]')
      const notification = {
        notification_id: Date.now() + 2,
        user_id: userId,
        application_id: newApplicationId,
        title: 'Re-Application Created',
        message: `Your re-application ${newApplicationNumber} has been created. ${reApplyData.reusableDocuments} documents were reused and ${reApplyData.requiredNewDocuments} new documents are required.`,
        notification_type: 'success',
        is_read: false,
        is_sent: true,
        send_via_email: true,
        send_via_sms: false,
        scheduled_send_date: null,
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }

      notifications.push(notification)
      localStorage.setItem('ncip_notifications', JSON.stringify(notifications))

      // Call parent callback
      if (onReApply) {
        onReApply(newApplication, reApplicationRecord)
      }

      setShowReApplyModal(false)
      setSelectedApplication(null)
      setDocumentStatus([])
      setReApplyData(null)
      loadUserApplications()

      alert(`Re-application created successfully! Application Number: ${newApplicationNumber}`)
    } catch (error) {
      console.error('Error creating re-application:', error)
      alert('Error creating re-application. Please try again.')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'expired':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'rejected':
        return <FileX className="w-5 h-5 text-red-500" />
      case 'missing':
        return <Upload className="w-5 h-5 text-gray-400" />
      default:
        return <FileCheck className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'expired':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'rejected':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'missing':
        return 'bg-gray-50 border-gray-200 text-gray-600'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <RefreshCw className="w-6 h-6 text-blue-600 mr-3" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Re-Apply for Services</h2>
          <p className="text-gray-600">Continue with previous applications that need updates or have expired documents</p>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Available for Re-Application</h3>
          <p className="text-sm text-gray-600">Select an application to analyze document status and create a re-application</p>
        </div>

        <div className="divide-y divide-gray-100">
          {applications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <RefreshCw className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No applications available for re-application</p>
              <p className="text-sm">Applications with expired documents or rejected status will appear here</p>
            </div>
          ) : (
            applications.map((application) => (
              <div
                key={application.application_id}
                className={`p-6 cursor-pointer transition-colors ${
                  selectedApplication?.application_id === application.application_id
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSelectApplication(application)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {application.application_number}
                      </h4>
                      <span className={`ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        application.application_status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : application.application_status === 'incomplete'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {application.application_status === 'rejected' ? 'Rejected' :
                         application.application_status === 'incomplete' ? 'Incomplete' : 'Has Expired Documents'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Service:</span> {application.service_type}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Purpose:</span> {application.purpose}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Submitted:</span> {new Date(application.submission_date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {selectedApplication?.application_id === application.application_id && (
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Document Analysis */}
      {selectedApplication && documentStatus.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Document Status Analysis</h3>
            <p className="text-sm text-gray-600">Review the status of your documents for re-application</p>
          </div>

          <div className="p-6 space-y-4">
            {documentStatus.map((item, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(item.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.requirement.requirement_name}</h4>
                      <p className="text-sm mt-1">{item.requirement.description}</p>
                      
                      {item.document && (
                        <div className="mt-2 text-sm">
                          <p><span className="font-medium">File:</span> {item.document.original_filename}</p>
                          {item.expirationDate && (
                            <p className="flex items-center mt-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span className="font-medium">Expires:</span> {item.expirationDate.toLocaleDateString()}
                              {item.daysUntilExpiry !== null && (
                                <span className={`ml-2 ${item.daysUntilExpiry < 0 ? 'text-red-600' : item.daysUntilExpiry < 30 ? 'text-orange-600' : 'text-green-600'}`}>
                                  ({item.daysUntilExpiry < 0 ? 'Expired' : `${item.daysUntilExpiry} days left`})
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    {item.canReuse ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Can Reuse
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <Upload className="w-3 h-3 mr-1" />
                        New Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {documentStatus.filter(item => item.canReuse).length}
                  </div>
                  <div className="text-sm text-green-700">Documents to Reuse</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {documentStatus.filter(item => item.needsReplacement).length}
                  </div>
                  <div className="text-sm text-red-700">New Documents Needed</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((documentStatus.filter(item => item.canReuse).length / documentStatus.length) * 100)}%
                  </div>
                  <div className="text-sm text-blue-700">Completion Rate</div>
                </div>
              </div>

              <button
                onClick={prepareReApplication}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Create Re-Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Re-Apply Confirmation Modal */}
      {showReApplyModal && reApplyData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Confirm Re-Application</h3>
              <p className="text-sm text-gray-600 mt-1">Review the details before creating your re-application</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Re-Application Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Original Application:</span>
                    <p className="text-blue-800">{reApplyData.originalApplication.application_number}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Service Type:</span>
                    <p className="text-blue-800">{reApplyData.originalApplication.service_type}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Reusable Documents:</span>
                    <p className="text-blue-800">{reApplyData.reusableDocuments} documents</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">New Documents Needed:</span>
                    <p className="text-blue-800">{reApplyData.requiredNewDocuments} documents</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">What happens next?</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    A new application will be created with a new application number
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {reApplyData.reusableDocuments} valid documents will be automatically copied
                  </li>
                  <li className="flex items-start">
                    <Upload className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    You'll need to upload {reApplyData.requiredNewDocuments} new or replacement documents
                  </li>
                  <li className="flex items-start">
                    <Eye className="w-4 h-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    Your application will be reviewed once all requirements are submitted
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={confirmReApplication}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Confirm Re-Application
              </button>
              
              <button
                onClick={() => setShowReApplyModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReApplySystem
