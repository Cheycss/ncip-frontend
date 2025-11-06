import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, AlertTriangle, FileText, Download } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import axios from 'axios';
import { getApiUrl } from '../../config/api';

const RequirementsList = ({ applicationId, purposeId, onComplianceUpdate }) => {
  const [requirements, setRequirements] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (applicationId && purposeId) {
      loadRequirementsAndDocuments();
    }
  }, [applicationId, purposeId]);

  const loadRequirementsAndDocuments = async () => {
    try {
      const token = localStorage.getItem('ncip_token');
      
      // Load requirements for this purpose
      const reqResponse = await axios.get(
        `${getApiUrl()}/api/purposes/${purposeId}/requirements`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      // Load existing documents for this application
      const docsResponse = await axios.get(
        `${getApiUrl()}/api/documents/application/${applicationId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      setRequirements(reqResponse.data.requirements || []);
      setDocuments(docsResponse.data.documents || []);
      
      // Calculate compliance
      calculateCompliance(reqResponse.data.requirements || [], docsResponse.data.documents || []);
      
    } catch (err) {
      console.error('Error loading requirements:', err);
      setError('Failed to load requirements');
    } finally {
      setLoading(false);
    }
  };

  const calculateCompliance = (reqs, docs) => {
    const total = reqs.filter(r => r.is_mandatory).length;
    const approved = docs.filter(d => d.document_status === 'approved').length;
    const submitted = docs.filter(d => d.document_status !== 'missing').length;
    const missing = total - submitted;

    if (onComplianceUpdate) {
      onComplianceUpdate({
        total,
        submitted,
        approved,
        missing,
        percentage: total > 0 ? Math.round((approved / total) * 100) : 0
      });
    }
  };

  const handleUploadSuccess = () => {
    loadRequirementsAndDocuments();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      missing: 'bg-gray-100 text-gray-600 border-gray-200'
    };

    const labels = {
      approved: 'Approved',
      pending: 'Pending Review',
      rejected: 'Rejected',
      missing: 'Not Submitted'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badges[status] || badges.missing}`}>
        {labels[status] || 'Missing'}
      </span>
    );
  };

  const handleDownload = async (documentId, filename) => {
    try {
      const token = localStorage.getItem('ncip_token');
      const response = await axios.get(
        `${getApiUrl()}/api/documents/${documentId}/download`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download document');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (requirements.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No requirements found for this purpose</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requirements.map((requirement, index) => {
        const existingDoc = documents.find(d => d.requirement_id === requirement.requirement_id);
        const status = existingDoc?.document_status || 'missing';

        return (
          <div
            key={requirement.requirement_id}
            className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-300 transition-all duration-200"
          >
            {/* Requirement Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">
                        {index + 1}. {requirement.requirement_name}
                      </h3>
                      {requirement.is_mandatory && (
                        <span className="text-red-500 text-sm font-bold">*</span>
                      )}
                    </div>
                    {requirement.description && (
                      <p className="text-sm text-gray-600">{requirement.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>Allowed: {
                        typeof requirement.file_types_allowed === 'string' 
                          ? requirement.file_types_allowed.toUpperCase()
                          : Array.isArray(requirement.file_types_allowed)
                          ? requirement.file_types_allowed.join(', ').toUpperCase()
                          : 'PDF, JPG, PNG'
                      }</span>
                      <span>•</span>
                      <span>Max: {requirement.max_file_size_mb || 5}MB</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  {getStatusBadge(status)}
                </div>
              </div>
            </div>

            {/* Document Upload/Status Area */}
            <div className="p-4">
              {existingDoc && status === 'approved' && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">{existingDoc.original_filename}</span>
                  </div>
                  <button
                    onClick={() => handleDownload(existingDoc.document_id, existingDoc.original_filename)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              )}

              {(!existingDoc || status !== 'approved') && (
                <DocumentUpload
                  applicationId={applicationId}
                  requirement={requirement}
                  existingDocument={existingDoc}
                  onUploadSuccess={handleUploadSuccess}
                />
              )}

              {existingDoc && existingDoc.review_notes && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    <strong>Review Notes:</strong> {existingDoc.review_notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RequirementsList;
