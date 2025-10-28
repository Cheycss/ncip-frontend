import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, Clock, Download, Eye, User, Calendar, AlertTriangle, X, Filter, Search } from 'lucide-react';
import axios from 'axios';

const DocumentReview = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [reviewModal, setReviewModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [documentUrl, setDocumentUrl] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  // Dynamic API URL helper
  const getApiUrl = () => {
    const currentHost = window.location.hostname;
    if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
      return `http://${currentHost}:3001`;
    }
    return 'http://localhost:3001';
  };

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem('ncip_token');
      const response = await axios.get(`${getApiUrl()}/api/applications/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (applicationId) => {
    try {
      const token = localStorage.getItem('ncip_token');
      const response = await axios.get(`${getApiUrl()}/api/documents/application/${applicationId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleApplicationSelect = (app) => {
    setSelectedApp(app);
    loadDocuments(app.application_id);
  };

  const handleReviewDocument = (doc) => {
    setSelectedDoc(doc);
    setReviewNotes(doc.review_notes || '');
    setReviewModal(true);
  };

  const submitReview = async (status) => {
    try {
      const token = localStorage.getItem('ncip_token');
      await axios.put(
        `${getApiUrl()}/api/documents/${selectedDoc.document_id}/review`,
        {
          status,
          review_notes: reviewNotes
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      setReviewModal(false);
      loadDocuments(selectedApp.application_id);
      loadApplications();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleViewDocument = async (doc) => {
    setSelectedDoc(doc);
    setViewModal(true);
    setLoadingDoc(true);
    setDocumentUrl(null);

    try {
      const token = localStorage.getItem('ncip_token');
      const response = await axios.get(
        `${getApiUrl()}/api/documents/${doc.document_id}/download`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = URL.createObjectURL(response.data);
      setDocumentUrl(url);
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setLoadingDoc(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.application_id?.toString().includes(searchTerm);
    
    if (filter === 'all') return matchesSearch;
    
    const hasDocumentsWithStatus = app.documents?.some(doc => doc.document_status === filter);
    return matchesSearch && hasDocumentsWithStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Professional Header */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Document Review</h1>
                  <p className="text-gray-600 text-sm">Review and manage submitted documents</p>
                </div>
              </div>
              
              {/* Stats Summary */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-800">
                    {applications.length} Applications
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    {applications.filter(app => app.documents?.some(doc => doc.document_status === 'pending')).length} Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by applicant name or application ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
              <p className="text-sm text-gray-600">{filteredApplications.length} applications found</p>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {filteredApplications.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No applications found</p>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {filteredApplications.map((app) => (
                    <button
                      key={app.application_id}
                      onClick={() => handleApplicationSelect(app)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedApp?.application_id === app.application_id
                          ? 'bg-blue-50 border-blue-200 shadow-sm'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {app.applicant_name || 'Unknown Applicant'}
                        </h3>
                        <span className="text-xs text-gray-500">#{app.application_id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {new Date(app.submitted_at || app.created_at).toLocaleDateString()}
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        {app.documents?.length > 0 ? (
                          <span className="text-xs text-blue-600 font-medium">
                            {app.documents.length} document{app.documents.length !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">No documents</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Document Details */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedApp.applicant_name || 'Unknown Applicant'}
                    </h2>
                    <p className="text-gray-600">Application #{selectedApp.application_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedApp.submitted_at || selectedApp.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Required Documents
                </h3>
                
                {documents.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No documents submitted</p>
                    <p className="text-sm text-gray-500 mt-1">Documents will appear here once uploaded</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.document_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div>
                                <h4 className="font-medium text-gray-900">{doc.requirement_name}</h4>
                                <p className="text-sm text-gray-500">{doc.original_name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.document_status)}`}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(doc.document_status)}
                                  {doc.document_status.charAt(0).toUpperCase() + doc.document_status.slice(1)}
                                </div>
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleViewDocument(doc)}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => window.open(`${getApiUrl()}/api/documents/${doc.document_id}/download`, '_blank')}
                              className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                            {doc.document_status === 'pending' && (
                              <button
                                onClick={() => handleReviewDocument(doc)}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Review
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {doc.review_notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Review Notes:</span> {doc.review_notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Application</h3>
              <p className="text-gray-600">Choose an application from the list to review its documents</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Review Document</h3>
                <button
                  onClick={() => setReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-1">{selectedDoc.requirement_name}</h4>
                <p className="text-sm text-gray-600">{selectedDoc.original_name}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add your review comments..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => submitReview('approved')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => submitReview('rejected')}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{selectedDoc.requirement_name}</h3>
              <button
                onClick={() => setViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 h-[70vh] overflow-auto">
              {loadingDoc ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : documentUrl ? (
                <iframe
                  src={documentUrl}
                  className="w-full h-full border-0 rounded-lg"
                  title="Document Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Unable to load document preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentReview;
