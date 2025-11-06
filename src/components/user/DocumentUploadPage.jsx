import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, X, Download, ArrowLeft, Users, Clock, CheckCircle2 } from 'lucide-react';
import { getRequirementsByPurpose, getPurposeById } from '../../utils/purposeRequirements';
import EnhancedFileUpload from '../shared/EnhancedFileUpload';
import { getApiUrl } from '../../config/api';

const DocumentUploadPage = ({ application, onBack }) => {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState([]);
  const [purpose, setPurpose] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [applicationStatus, setApplicationStatus] = useState('draft');

  // Load application documents and requirements
  useEffect(() => {
    if (application && application.id) {
      loadApplicationDocuments();
      loadRequirements();
    }
  }, [application]);

  const loadApplicationDocuments = async () => {
    try {
      const response = await fetch(`/api/uploads/application/${application.id}`);
      const result = await response.json();
      
      if (result.success) {
        setUploadedDocuments(result.data.documents || []);
        setApplicationStatus(result.data.application.status);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRequirements = () => {
    if (application && application.purpose) {
      const purposeData = getPurposeById(application.purpose);
      const reqs = getRequirementsByPurpose(application.purpose);
      setPurpose(purposeData);
      setRequirements(reqs);
    }
  };

  const handleFileUpload = (requirementId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, PNG, and PDF files are allowed');
      return;
    }

    setUploading(true);

    // Simulate upload (in real app, upload to server)
    setTimeout(() => {
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        status: 'uploaded'
      };

      const newUploadedFiles = {
        ...uploadedFiles,
        [requirementId]: fileData
      };

      setUploadedFiles(newUploadedFiles);
      
      // Save to localStorage
      localStorage.setItem(`uploads_${application.id}`, JSON.stringify(newUploadedFiles));
      
      setUploading(false);
    }, 1000);
  };

  const handleRemoveFile = (requirementId) => {
    const newUploadedFiles = { ...uploadedFiles };
    delete newUploadedFiles[requirementId];
    setUploadedFiles(newUploadedFiles);
    
    // Update localStorage
    localStorage.setItem(`uploads_${application.id}`, JSON.stringify(newUploadedFiles));
  };

  const handleSubmitDocuments = async () => {
    const requiredDocs = requirements.filter(req => req.required);
    const uploadedRequired = requiredDocs.filter(req => uploadedFiles[req.id]);

    if (uploadedRequired.length < requiredDocs.length) {
      alert('Please upload all required documents before submitting');
      return;
    }

    try {
      const token = localStorage.getItem('ncip_token');
      const apiUrl = getApiUrl();
      
      // Update application status in backend
      const response = await fetch(`${apiUrl}/api/applications/${application.id}/documents-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'documents_submitted',
          documentsUploaded: true,
          uploadedDocuments: uploadedFiles,
          documentsSubmittedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      // Also update localStorage for immediate UI update
      const applications = JSON.parse(localStorage.getItem('ncip_applications') || '[]');
      const updatedApps = applications.map(app => {
        if (app.id === application.id) {
          return {
            ...app,
            documentsUploaded: true,
            uploadedDocuments: uploadedFiles,
            documentsSubmittedAt: new Date().toISOString(),
            status: 'documents_submitted'
          };
        }
        return app;
      });
      
      localStorage.setItem('ncip_applications', JSON.stringify(updatedApps));
      
      alert('Documents submitted successfully!');
      if (onBack) onBack();
    } catch (error) {
      console.error('Error submitting documents:', error);
      alert('Failed to submit documents. Please try again.');
    }
  };

  const getUploadProgress = () => {
    const requiredDocs = requirements.filter(req => req.required);
    const uploadedCount = requiredDocs.filter(req => uploadedFiles[req.id]).length;
    return {
      uploaded: uploadedCount,
      total: requiredDocs.length,
      percentage: requiredDocs.length > 0 ? (uploadedCount / requiredDocs.length) * 100 : 0
    };
  };

  const progress = getUploadProgress();

  if (!application || !purpose) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Application not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload Required Documents</h1>
              <p className="text-gray-600 mt-2">Application ID: <span className="font-semibold">{application.applicationId}</span></p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                ✓ Approved
              </div>
            </div>
          </div>

          {/* Purpose Info */}
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-1">{purpose.name}</h3>
            <p className="text-sm text-blue-700">{purpose.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Upload Progress</span>
            <span className="text-sm font-bold text-blue-600">{progress.uploaded} / {progress.total} Required Documents</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Requirements List */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Documents</h2>
          
          <div className="space-y-4">
            {requirements.map((requirement) => {
              const isUploaded = uploadedFiles[requirement.id];
              
              return (
                <div 
                  key={requirement.id}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    isUploaded 
                      ? 'border-green-300 bg-green-50' 
                      : requirement.required 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className={`w-5 h-5 ${isUploaded ? 'text-green-600' : 'text-blue-600'}`} />
                        <h3 className="font-bold text-gray-900">{requirement.name}</h3>
                        {requirement.required && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                            Required
                          </span>
                        )}
                        {!requirement.required && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                            Optional
                          </span>
                        )}
                      </div>

                      {isUploaded ? (
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">{isUploaded.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {(isUploaded.size / 1024).toFixed(2)} KB
                          </span>
                          <button
                            onClick={() => handleRemoveFile(requirement.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) => handleFileUpload(requirement.id, e)}
                              className="hidden"
                              disabled={uploading}
                            />
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              <Upload className="w-4 h-4" />
                              <span className="font-semibold">Upload File</span>
                            </div>
                          </label>
                          <p className="text-xs text-gray-500 mt-2">
                            Accepted formats: JPG, PNG, PDF (Max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
              >
                Back to Dashboard
              </button>
              
              <button
                onClick={handleSubmitDocuments}
                disabled={progress.uploaded < progress.total}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${
                  progress.uploaded >= progress.total
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit All Documents
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadPage;
