import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, File, Loader } from 'lucide-react';
import axios from 'axios';

const DocumentUpload = ({ 
  applicationId, 
  requirement, 
  onUploadSuccess, 
  existingDocument 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Dynamic API URL helper
  const getApiUrl = () => {
    const currentHost = window.location.hostname;
    if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
      return `http://${currentHost}:3001`;
    }
    return 'http://localhost:3001';
  };

  const allowedTypes = requirement.file_types_allowed 
    ? (typeof requirement.file_types_allowed === 'string' 
        ? requirement.file_types_allowed.split(',').map(t => t.trim())
        : Array.isArray(requirement.file_types_allowed)
        ? requirement.file_types_allowed
        : ['pdf', 'jpg', 'jpeg', 'png'])
    : ['pdf', 'jpg', 'jpeg', 'png'];
  
  const maxSize = (requirement.max_file_size_mb || 5) * 1024 * 1024; // Convert to bytes

  const validateFile = (file) => {
    // Check file type
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      return `Invalid file type. Allowed: ${allowedTypes.join(', ').toUpperCase()}`;
    }

    // Check file size
    if (file.size > maxSize) {
      return `File too large. Maximum size: ${requirement.max_file_size_mb || 5}MB`;
    }

    return null;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
      } else {
        setError('');
        setSelectedFile(file);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
      } else {
        setError('');
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('application_id', applicationId);
    formData.append('requirement_id', requirement.requirement_id);

    try {
      const token = localStorage.getItem('ncip_token');
      const response = await axios.post(
        `${getApiUrl()}/api/documents/upload`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setSelectedFile(null);
        if (onUploadSuccess) {
          onUploadSuccess(response.data);
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // If document already exists and is approved, show status
  if (existingDocument && existingDocument.document_status === 'approved') {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-green-900">Document Approved</p>
            <p className="text-sm text-green-700">{existingDocument.original_filename}</p>
            <p className="text-xs text-green-600 mt-1">
              Uploaded: {new Date(existingDocument.uploaded_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If document exists but pending or rejected, show status and allow reupload
  if (existingDocument) {
    return (
      <div className="space-y-3">
        <div className={`border-2 rounded-xl p-4 ${
          existingDocument.document_status === 'pending' 
            ? 'bg-yellow-50 border-yellow-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {existingDocument.document_status === 'pending' ? (
              <Loader className="w-6 h-6 text-yellow-600 flex-shrink-0 animate-spin" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={`font-bold ${
                existingDocument.document_status === 'pending' 
                  ? 'text-yellow-900' 
                  : 'text-red-900'
              }`}>
                {existingDocument.document_status === 'pending' 
                  ? 'Pending Review' 
                  : 'Document Rejected'}
              </p>
              <p className={`text-sm ${
                existingDocument.document_status === 'pending' 
                  ? 'text-yellow-700' 
                  : 'text-red-700'
              }`}>
                {existingDocument.original_filename}
              </p>
              {existingDocument.rejection_reason && (
                <p className="text-sm text-red-600 mt-2 bg-red-100 p-2 rounded">
                  <strong>Reason:</strong> {existingDocument.rejection_reason}
                </p>
              )}
              <p className="text-xs mt-1 opacity-75">
                Uploaded: {new Date(existingDocument.uploaded_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {existingDocument.document_status === 'rejected' && (
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Upload a new document:</p>
            {renderUploadArea()}
          </div>
        )}
      </div>
    );
  }

  const renderUploadArea = () => (
    <>
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={`file-upload-${requirement.requirement_id}`}
          className="hidden"
          onChange={handleFileSelect}
          accept={allowedTypes.map(ext => `.${ext}`).join(',')}
          disabled={uploading}
        />

        {!selectedFile ? (
          <label
            htmlFor={`file-upload-${requirement.requirement_id}`}
            className="cursor-pointer block"
          >
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-700 font-medium mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                {allowedTypes.map(ext => ext.toUpperCase()).join(', ')} (max {requirement.max_file_size_mb || 5}MB)
              </p>
            </div>
          </label>
        ) : (
          <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <File className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-red-600 hover:text-red-800 p-2"
              disabled={uploading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {selectedFile && !error && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
            uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {uploading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload Document
            </>
          )}
        </button>
      )}
    </>
  );

  return (
    <div className="space-y-3">
      {renderUploadArea()}
    </div>
  );
};

export default DocumentUpload;
