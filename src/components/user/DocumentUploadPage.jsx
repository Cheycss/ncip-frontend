import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, X, Download, ArrowLeft, Users, Clock, CheckCircle2, Calendar, AlertTriangle } from 'lucide-react';
import { getRequirementsByPurpose, getPurposeById, getPurposes } from '../../utils/purposeRequirements';
import EnhancedFileUpload from '../shared/EnhancedFileUpload';
import { getApiUrl } from '../../config/api';

const DocumentUploadPage = ({ application, onBack }) => {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState([]);
  const [purpose, setPurpose] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [applicationStatus, setApplicationStatus] = useState('draft');
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [deadline, setDeadline] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(null);

  // Load application documents and requirements
  useEffect(() => {
    if (application && application.id) {
      loadApplicationDocuments();
      loadRequirements();
      
      // Calculate deadline (20 days from submission)
      if (application.submissionDeadline) {
        const deadlineDate = new Date(application.submissionDeadline);
        setDeadline(deadlineDate);
        
        // Calculate days remaining
        const today = new Date();
        const timeDiff = deadlineDate - today;
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        setDaysRemaining(days > 0 ? days : 0);
      }
    }
  }, [application]);

  const loadApplicationDocuments = async () => {
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('ncip_token');
      
      const response = await fetch(`${apiUrl}/api/documents/application/${application.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUploadedDocuments(result.documents || []);
        }
      } else {
        console.log('No documents found for this application');
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRequirements = async () => {
    try {
      console.log('Loading requirements for application:', application);
      setLoading(true);
      
      // Get purpose from application
      const appPurpose = application?.purpose || 'Educational Assistance';
      
      // Try to get all purposes and find matching one
      const purposes = await getPurposes();
      console.log('Available purposes:', purposes);
      
      // Find purpose by name (case-insensitive)
      const purposeData = purposes.find(p => 
        p.name?.toLowerCase() === appPurpose.toLowerCase() ||
        p.purpose_name?.toLowerCase() === appPurpose.toLowerCase()
      );
      
      if (purposeData) {
        console.log('Found matching purpose:', purposeData);
        setPurpose(purposeData);
        
        // Get requirements from the purpose object
        const reqs = purposeData.requirements || [];
        console.log('Requirements from purpose:', reqs);
        setRequirements(Array.isArray(reqs) ? reqs : []);
      } else {
        // Set default requirements if purpose not found
        console.log('Purpose not found for:', appPurpose, 'Using defaults');
        setPurpose({ name: appPurpose, description: 'Application requirements' });
        setRequirements([
          { id: 'birth_cert', name: 'Birth Certificate (PSA Copy)', required: true },
          { id: 'valid_id', name: 'Valid Government ID', required: true },
          { id: 'barangay_clearance', name: 'Barangay Clearance', required: true },
          { id: 'proof_income', name: 'Proof of Income', required: false }
        ]);
      }
    } catch (error) {
      console.error('Error loading requirements:', error);
      // Ensure requirements is always an array even on error
      setPurpose({ name: 'Default', description: 'Application requirements' });
      setRequirements([
        { id: 'birth_cert', name: 'Birth Certificate', required: true },
        { id: 'valid_id', name: 'Valid ID', required: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (requirementId, event) => {
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

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('requirementId', requirementId);
      formData.append('applicationId', application.id);

      const token = localStorage.getItem('ncip_token');
      const apiUrl = getApiUrl();
      
      // Upload to backend
      const response = await fetch(`${apiUrl}/api/applications/${application.id}/upload-requirement`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          status: 'uploaded',
          fileUrl: result.fileUrl,
          file: file // Store the actual file object for later submission
        };

        const newUploadedFiles = {
          ...uploadedFiles,
          [requirementId]: fileData
        };

        setUploadedFiles(newUploadedFiles);
        localStorage.setItem(`uploads_${application.id}`, JSON.stringify(newUploadedFiles));
        
        // Show success message
        console.log(`✅ Successfully uploaded ${file.name}`);
      } else {
        alert('Failed to upload file: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (requirementId) => {
    const newUploadedFiles = { ...uploadedFiles };
    delete newUploadedFiles[requirementId];
    setUploadedFiles(newUploadedFiles);
    
    // Update localStorage
    localStorage.setItem(`uploads_${application.id}`, JSON.stringify(newUploadedFiles));
  };

  const handleSubmitDocuments = async () => {
    // Safety check
    if (!Array.isArray(requirements)) {
      alert('Requirements not loaded. Please refresh the page.');
      return;
    }
    
    const requiredDocs = requirements.filter(req => req.required);
    const uploadedRequired = requiredDocs.filter(req => uploadedFiles[req.id]);

    if (uploadedRequired.length < requiredDocs.length) {
      alert('Please upload all required documents before submitting');
      return;
    }

    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('ncip_token');
      
      // Create FormData with all uploaded files
      const formData = new FormData();
      
      // Add files to FormData
      Object.entries(uploadedFiles).forEach(([reqId, fileData]) => {
        // Note: In production, you'd store actual File objects
        // For now, we'll send metadata
        formData.append(reqId, JSON.stringify(fileData));
      });
      
      // Submit requirements to backend
      const response = await fetch(`${apiUrl}/api/applications/${application.id}/submit-requirements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit requirements');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local storage
        const storedApps = JSON.parse(localStorage.getItem('ncip_applications') || '[]');
        const updatedApps = storedApps.map(app => 
          app.id === application.id 
            ? { ...app, status: 'requirements_submitted', documentsUploaded: true }
            : app
        );
        
        localStorage.setItem('ncip_applications', JSON.stringify(updatedApps));
        
        // Trigger notification update
        window.dispatchEvent(new Event('notificationUpdate'));
        
        alert('✅ Requirements submitted successfully! Admin will review them soon.');
        if (onBack) onBack();
      } else {
        alert('❌ Failed to submit requirements: ' + (result.message || 'Please try again'));
      }
    } catch (error) {
      console.error('Error submitting requirements:', error);
      alert('❌ Failed to submit requirements: ' + error.message);
    }
  };

  // Early returns - check loading and null states FIRST
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requirements...</p>
        </div>
      </div>
    );
  }

  if (!purpose) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requirements...</p>
        </div>
      </div>
    );
  }

  // Safe to access application and purpose now
  const getUploadProgress = () => {
    // Safety check - ensure requirements is an array
    if (!Array.isArray(requirements) || requirements.length === 0) {
      return {
        uploaded: 0,
        total: 0,
        percentage: 0
      };
    }
    
    const requiredDocs = requirements.filter(req => req.required);
    const uploadedCount = requiredDocs.filter(req => uploadedFiles[req.id]).length;
    return {
      uploaded: uploadedCount,
      total: requiredDocs.length,
      percentage: requiredDocs.length > 0 ? (uploadedCount / requiredDocs.length) * 100 : 0
    };
  };

  const progress = getUploadProgress();

  // Debug logging
  console.log('DocumentUploadPage render:', {
    application,
    purpose,
    requirements,
    requirementsLength: requirements?.length
  });

  if (!application) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload Required Documents</h1>
              <p className="text-gray-600 mt-2">Application #: <span className="font-semibold">{application.application_number}</span></p>
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
