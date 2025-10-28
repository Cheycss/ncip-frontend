import React, { useState, useEffect } from 'react';
import { Calendar, FileText, AlertTriangle, CheckCircle, Upload, Clock, RefreshCw } from 'lucide-react';

const ReApply = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [reapplyingRequirements, setReapplyingRequirements] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    loadUserApplications();
  }, []);

  const loadUserApplications = () => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('ncip_user') || '{}');
      const userId = currentUser.id || currentUser.email;
      
      if (userId) {
        const userApplicationsKey = `user_applications_${userId}`;
        const userApps = JSON.parse(localStorage.getItem(userApplicationsKey) || '[]');
        
        // Filter applications that have requirements (only show applications with documents)
        const appsWithRequirements = userApps.filter(app => 
          app.requirements && Object.keys(app.requirements).length > 0
        );
        
        setApplications(appsWithRequirements);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications([]);
    }
    setLoading(false);
  };

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

  // Get requirements that need reapplication
  const getExpiredRequirements = (application) => {
    if (!application.requirements) return [];
    
    return Object.entries(application.requirements).filter(([reqId, requirement]) => 
      isRequirementExpired(requirement)
    );
  };

  // Get valid requirements that can be reused
  const getValidRequirements = (application) => {
    if (!application.requirements) return [];
    
    return Object.entries(application.requirements).filter(([reqId, requirement]) => 
      !isRequirementExpired(requirement)
    );
  };

  const handleFileUpload = (requirementId, file) => {
    if (!file) return;

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only PDF, JPG, or PNG files');
      return;
    }

    setUploadedFiles(prev => ({
      ...prev,
      [requirementId]: {
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }
    }));

    alert(`✅ ${file.name} uploaded successfully!`);
  };

  const handleReapplySubmission = async () => {
    if (!selectedApplication) return;

    const expiredRequirements = getExpiredRequirements(selectedApplication);
    const missingUploads = expiredRequirements.filter(([reqId]) => !uploadedFiles[reqId]);

    if (missingUploads.length > 0) {
      alert(`Please upload files for: ${missingUploads.map(([reqId, req]) => req.name || reqId).join(', ')}`);
      return;
    }

    try {
      // Generate new expiration dates for resubmitted requirements
      const generateExpirationDate = (daysFromNow) => {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toISOString();
      };

      // Update the application with new requirements
      const updatedRequirements = { ...selectedApplication.requirements };
      
      // Update expired requirements with new uploads
      Object.keys(uploadedFiles).forEach(reqId => {
        const uploadedFile = uploadedFiles[reqId];
        updatedRequirements[reqId] = {
          ...uploadedFile,
          submittedAt: new Date().toISOString(),
          expiresAt: generateExpirationDate(365), // 1 year expiration
          status: 'valid'
        };
      });

      // Update user applications
      const currentUser = JSON.parse(localStorage.getItem('ncip_user') || '{}');
      const userId = currentUser.id || currentUser.email;
      const userApplicationsKey = `user_applications_${userId}`;
      const userApps = JSON.parse(localStorage.getItem(userApplicationsKey) || '[]');
      
      const updatedUserApps = userApps.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, requirements: updatedRequirements, status: 'under_review', updatedAt: new Date().toISOString() }
          : app
      );
      
      localStorage.setItem(userApplicationsKey, JSON.stringify(updatedUserApps));

      // Update admin applications
      const adminApps = JSON.parse(localStorage.getItem('applications') || '[]');
      const updatedAdminApps = adminApps.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, requirements: updatedRequirements, status: 'under_review', updatedAt: new Date().toISOString() }
          : app
      );
      
      localStorage.setItem('applications', JSON.stringify(updatedAdminApps));

      alert('✅ Requirements resubmitted successfully! Your application is now under review again.');
      
      // Reset state
      setSelectedApplication(null);
      setUploadedFiles({});
      setReapplyingRequirements({});
      
      // Reload applications
      loadUserApplications();
      
    } catch (error) {
      console.error('Error resubmitting requirements:', error);
      alert('Failed to resubmit requirements. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (selectedApplication) {
    const expiredRequirements = getExpiredRequirements(selectedApplication);
    const validRequirements = getValidRequirements(selectedApplication);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <button
            onClick={() => {
              setSelectedApplication(null);
              setUploadedFiles({});
            }}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            ← Back to Applications
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reapply Requirements</h2>
          <p className="text-gray-600">
            Application: {selectedApplication.purpose} (ID: {selectedApplication.id})
          </p>
        </div>

        {/* Expired Requirements Section */}
        {expiredRequirements.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Expired Requirements</h3>
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                {expiredRequirements.length} expired
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              The following requirements have expired and need to be resubmitted:
            </p>

            <div className="space-y-4">
              {expiredRequirements.map(([reqId, requirement]) => {
                const daysExpired = Math.abs(getDaysUntilExpiration(requirement.expiresAt));
                
                return (
                  <div key={reqId} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {requirement.name || reqId.replace('_', ' ').toUpperCase()}
                        </h4>
                        <p className="text-sm text-red-600">
                          Expired {daysExpired} days ago ({formatExpirationDate(requirement.expiresAt)})
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        EXPIRED
                      </span>
                    </div>

                    {/* File Upload */}
                    {uploadedFiles[reqId] ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <div>
                            <span className="text-sm font-medium text-green-800 block">
                              {uploadedFiles[reqId].name}
                            </span>
                            <span className="text-xs text-green-600">
                              {(uploadedFiles[reqId].size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setUploadedFiles(prev => {
                              const updated = { ...prev };
                              delete updated[reqId];
                              return updated;
                            });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          Click to upload new document
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, JPG, PNG up to 10MB
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleFileUpload(reqId, file);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleReapplySubmission}
                disabled={expiredRequirements.some(([reqId]) => !uploadedFiles[reqId])}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Resubmit Requirements
              </button>
            </div>
          </div>
        )}

        {/* Valid Requirements Section */}
        {validRequirements.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Valid Requirements</h3>
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {validRequirements.length} valid
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              These requirements are still valid and will be automatically included in your resubmission:
            </p>

            <div className="space-y-3">
              {validRequirements.map(([reqId, requirement]) => {
                const daysLeft = getDaysUntilExpiration(requirement.expiresAt);
                
                return (
                  <div key={reqId} className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {requirement.name || reqId.replace('_', ' ').toUpperCase()}
                          </h4>
                          <p className="text-sm text-green-600">
                            Valid until {formatExpirationDate(requirement.expiresAt)}
                            {daysLeft > 0 && ` (${daysLeft} days left)`}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        VALID
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reapply for Requirements</h2>
        <p className="text-gray-600">
          Resubmit expired requirements for your applications. Valid documents will be automatically preserved.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-600">
            You don't have any applications with requirements that need resubmission.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Applications</h3>
            <p className="text-sm text-gray-600">Click on an application to view and resubmit expired requirements</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {applications.map((application) => {
              const expiredRequirements = getExpiredRequirements(application);
              const validRequirements = getValidRequirements(application);
              const hasExpiredRequirements = expiredRequirements.length > 0;
              
              return (
                <div
                  key={application.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                    hasExpiredRequirements ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-green-500'
                  }`}
                  onClick={() => setSelectedApplication(application)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-lg font-medium text-gray-900">
                          {application.purpose}
                        </h4>
                        {hasExpiredRequirements && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            {expiredRequirements.length} EXPIRED
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Application ID: {application.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Submitted: {formatExpirationDate(application.submittedAt)}
                      </p>
                      
                      <div className="mt-3 flex items-center space-x-4">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-green-600">{validRequirements.length} valid</span>
                        </div>
                        {hasExpiredRequirements && (
                          <div className="flex items-center text-sm">
                            <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                            <span className="text-red-600">{expiredRequirements.length} expired</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        hasExpiredRequirements 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {hasExpiredRequirements ? 'Action Required' : 'All Valid'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReApply;
