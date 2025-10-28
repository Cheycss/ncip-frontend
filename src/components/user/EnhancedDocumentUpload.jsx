import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, FileText, Users, Clock, CheckCircle2, Upload, Download, Eye } from 'lucide-react';
import { getRequirementsByPurpose, getPurposeById } from '../../utils/purposeRequirements';
import EnhancedFileUpload from '../shared/EnhancedFileUpload';

const EnhancedDocumentUpload = ({ application, onBack }) => {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState([]);
  const [purpose, setPurpose] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('draft');
  const [completionStats, setCompletionStats] = useState({
    cocPages: 0,
    requirements: 0,
    total: 0
  });

  // COC Pages that need to be uploaded
  const cocPages = [
    { id: 'coc_page_1', name: 'Page 1: Personal Information', required: true },
    { id: 'coc_page_2', name: 'Page 2: Barangay Certification', required: true },
    { id: 'coc_page_3', name: 'Page 3: Tribal Certification', required: true },
    { id: 'coc_page_4', name: 'Page 4: Joint Affidavit', required: true },
    { id: 'coc_page_5', name: 'Page 5: Genealogy Tree', required: true }
  ];

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
        calculateCompletionStats(result.data.documents || []);
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

  const calculateCompletionStats = (documents) => {
    const cocUploaded = cocPages.filter(page => 
      documents.some(doc => doc.document_type === page.id)
    ).length;
    
    const reqUploaded = requirements.filter(req => 
      documents.some(doc => doc.requirement_id === req.id)
    ).length;

    setCompletionStats({
      cocPages: cocUploaded,
      requirements: reqUploaded,
      total: cocUploaded + reqUploaded
    });
  };

  const handleUploadSuccess = (fileData) => {
    // Refresh documents list
    loadApplicationDocuments();
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    // Could show toast notification here
  };

  const getUploadedFile = (documentType, requirementId = null) => {
    return uploadedDocuments.find(doc => 
      doc.document_type === documentType && 
      (requirementId ? doc.requirement_id === requirementId : true)
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'documents_complete': return 'text-green-600 bg-green-50';
      case 'documents_partial': return 'text-yellow-600 bg-yellow-50';
      case 'under_review': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'documents_complete': return 'All Documents Uploaded';
      case 'documents_partial': return 'Partial Upload';
      case 'under_review': return 'Under Review';
      default: return 'Draft';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading documents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center justify-center gap-6">
              <img 
                src="/NCIPLogo.png" 
                alt="NCIP Logo" 
                className="w-20 h-20 bg-white rounded-full p-2 shadow-lg"
              />
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-1">Document Upload</h1>
                <p className="text-blue-100 text-sm">Upload your signed COC forms and required documents</p>
              </div>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="bg-blue-50 px-8 py-4 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(applicationStatus)}`}>
                  {getStatusText(applicationStatus)}
                </div>
                <div className="text-sm text-gray-600">
                  Application ID: <span className="font-mono font-semibold">{application.id}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {completionStats.total} / {cocPages.length + requirements.length} documents uploaded
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">COC Forms</p>
                <p className="text-2xl font-bold text-gray-900">{completionStats.cocPages}/{cocPages.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Upload className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Requirements</p>
                <p className="text-2xl font-bold text-gray-900">{completionStats.requirements}/{requirements.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((completionStats.total / (cocPages.length + requirements.length)) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COC Forms Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              COC Form Pages (Signed)
            </h3>
          </div>
          <div className="p-8">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Instructions:</strong> Upload the signed PDF pages of your COC form. Make sure all required signatures are obtained before uploading.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {cocPages.map((page) => (
                <EnhancedFileUpload
                  key={page.id}
                  applicationId={application.id}
                  documentType={page.id}
                  label={page.name}
                  description="Upload the signed PDF page"
                  required={page.required}
                  existingFile={getUploadedFile(page.id)}
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={handleUploadError}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Purpose-Specific Requirements */}
        {requirements.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Required Documents for {purpose?.name}
              </h3>
            </div>
            <div className="p-8">
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Purpose:</strong> {purpose?.description || purpose?.name}
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {requirements.map((requirement) => (
                  <EnhancedFileUpload
                    key={requirement.id}
                    applicationId={application.id}
                    documentType="requirement"
                    requirementId={requirement.id}
                    label={requirement.name}
                    description="Upload clear photo or scan of the document"
                    required={requirement.required}
                    existingFile={getUploadedFile('requirement', requirement.id)}
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <h3 className="text-lg font-bold text-white">What Happens Next?</h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  1
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Upload Complete</h4>
                <p className="text-sm text-gray-600">All required documents uploaded and validated</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  2
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Admin Review</h4>
                <p className="text-sm text-gray-600">NCIP staff will review your application and documents</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  3
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Certificate Issued</h4>
                <p className="text-sm text-gray-600">Receive your official Certificate of Confirmation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all shadow-md hover:shadow-lg font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Application</span>
          </button>
          
          {completionStats.total === (cocPages.length + requirements.length) && (
            <button
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Submit for Review</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDocumentUpload;
