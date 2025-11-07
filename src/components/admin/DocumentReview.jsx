import React, { useState, useEffect } from 'react';
import { FileText, Clock, Eye, CheckCircle, XCircle, X, Download } from 'lucide-react';
import axios from 'axios';
import { getApiUrl } from '../../config/api';

const DocumentReview = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [reviewModal, setReviewModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem('ncip_token');
      const response = await axios.get(`${getApiUrl()}/api/applications/admin/requirements`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setApplications(response.data.applications);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Error loading requirements:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (applicationId) => {
    console.log('📄 Loading documents for application:', applicationId);
    try {
      const token = localStorage.getItem('ncip_token');
      
      // Get documents from the documents table (requirement documents)
      const response = await axios.get(
        `${getApiUrl()}/api/documents/application/${applicationId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      console.log('📦 Documents API response:', response.data);
      
      if (response.data.success && response.data.documents && response.data.documents.length > 0) {
        // We have documents from the documents table
        const docs = response.data.documents.map(doc => ({
          document_id: doc.document_id,
          requirement_name: doc.document_type || doc.requirement_name || 'Document',
          original_name: doc.file_name || doc.original_name || 'File',
          file_path: doc.file_path,
          uploaded_at: doc.uploaded_at || doc.created_at,
          document_type: doc.document_type,
          is_requirement: doc.is_requirement
        }));
        
        console.log(`✅ Loaded ${docs.length} documents from database:`, docs);
        setDocuments(docs);
      } else {
        console.log('⚠️ No documents found in database');
        setDocuments([]);
      }
    } catch (error) {
      console.error('❌ Error loading documents:', error.response?.data || error.message);
      setDocuments([]);
    }
  };

  const handleCloseModal = () => {
    console.log('🚪 Closing modal and clearing state');
    setReviewModal(false);
    setRejectModal(false);
    setSelectedApp(null);
    setDocuments([]);
    setRejectReason('');
  };

  const handleReviewClick = async (e, app) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔍 Opening review for app:', app.application_id, app.application_number);
    
    try {
      // Clear previous state first
      setDocuments([]);
      setSelectedApp(null);
      
      // Set new state
      setSelectedApp(app);
      setReviewModal(true);
      
      // Load documents for THIS application
      console.log('📄 Loading documents for application ID:', app.application_id);
      await loadDocuments(app.application_id);
    } catch (error) {
      console.error('Error opening review modal:', error);
      alert('Error opening review modal');
    }
  };

  const approveRequirements = async () => {
    try {
      const token = localStorage.getItem('ncip_token');
      await axios.put(
        `${getApiUrl()}/api/applications/${selectedApp.application_id}/requirements-status`,
        {
          status: 'requirements_approved',
          notes: 'All requirements have been verified and approved'
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      alert('✅ Requirements approved successfully!');
      setReviewModal(false);
      setSelectedApp(null);
      loadApplications();
    } catch (error) {
      console.error('Error approving requirements:', error);
      alert('❌ Failed to approve requirements');
    }
  };

  const rejectRequirements = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const token = localStorage.getItem('ncip_token');
      await axios.put(
        `${getApiUrl()}/api/applications/${selectedApp.application_id}/requirements-status`,
        {
          status: 'requirements_rejected',
          notes: rejectReason,
          rejection_reason: rejectReason
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      alert('❌ Requirements rejected');
      setRejectModal(false);
      setReviewModal(false);
      setRejectReason('');
      setSelectedApp(null);
      loadApplications();
    } catch (error) {
      console.error('Error rejecting requirements:', error);
      alert('❌ Failed to reject requirements');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Requirements Review</h1>
      <p className="text-gray-600 mb-6">Review uploaded requirement documents</p>
      
      {applications.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No requirements to review</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div key={app.application_id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {app.first_name} {app.last_name}
                  </h3>
                  <span className="text-sm text-gray-500">#{app.application_id}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>Purpose: {app.purpose}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Submitted: {new Date(app.submitted_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">{app.document_count || 0} documents uploaded</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    app.status === 'requirements_submitted' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'requirements_approved' ? 'bg-green-100 text-green-800' :
                    app.status === 'requirements_rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {app.status === 'requirements_submitted' ? 'Pending Review' :
                     app.status === 'requirements_approved' ? 'Approved' :
                     app.status === 'requirements_rejected' ? 'Rejected' :
                     app.status}
                  </span>
                  
                  <button 
                    type="button"
                    onClick={(e) => handleReviewClick(e, app)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Review Documents
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Review Modal */}
      {reviewModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Review Requirements - {selectedApp.first_name} {selectedApp.last_name}
                </h3>
                <button
                  type="button"
                  onClick={() => setReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Application Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2"><strong>Application ID:</strong> #{selectedApp.application_id}</p>
                  <p className="mb-2"><strong>Name:</strong> {selectedApp.first_name} {selectedApp.last_name}</p>
                  <p className="mb-2"><strong>Purpose:</strong> {selectedApp.purpose}</p>
                  <p className="mb-2"><strong>Email:</strong> {selectedApp.email}</p>
                  <p><strong>Submitted:</strong> {new Date(selectedApp.submitted_at || selectedApp.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-4">Uploaded Documents ({documents.length})</h4>
              
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc, index) => (
                    <div key={doc.document_id || index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{doc.requirement_name || doc.document_type || 'Document'}</h5>
                          <p className="text-sm text-gray-600">{doc.original_name || doc.file_name || 'File'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const token = localStorage.getItem('ncip_token');
                              const url = `${getApiUrl()}/api/documents/requirement/${doc.document_id}/download?token=${token}`;
                              window.open(url, '_blank');
                            }}
                            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const token = localStorage.getItem('ncip_token');
                              const url = `${getApiUrl()}/api/documents/requirement/${doc.document_id}/view?token=${token}`;
                              window.open(url, '_blank');
                            }}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            {selectedApp.status === 'requirements_submitted' && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Review Decision</h4>
                    <p className="text-sm text-gray-600">Approve or reject all submitted requirements</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setRejectModal(true)}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Requirements
                    </button>
                    <button
                      type="button"
                      onClick={approveRequirements}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve All Requirements
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Reject Modal */}
      {rejectModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Reject Requirements</h3>
                <button
                  type="button"
                  onClick={() => setRejectModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for rejecting the requirements for <strong>{selectedApp.first_name} {selectedApp.last_name}</strong>
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={4}
                placeholder="Explain why the requirements are being rejected..."
                required
              />
              
              <div className="flex items-center gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setRejectModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={rejectRequirements}
                  disabled={!rejectReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Reject Requirements
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentReview;