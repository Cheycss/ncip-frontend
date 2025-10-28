import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, X, FileText, Image, Loader, Download, Eye } from 'lucide-react';

const EnhancedFileUpload = ({ 
  applicationId, 
  documentType, 
  requirementId, 
  label, 
  description,
  required = false,
  existingFile = null,
  onUploadSuccess,
  onUploadError,
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(existingFile);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // File validation
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, and PDF files are allowed';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      if (onUploadError) onUploadError(validationError);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('applicationId', applicationId);
      formData.append('documentType', documentType);
      if (requirementId) formData.append('requirementId', requirementId);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch('/api/uploads/document', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (result.success) {
        const fileData = {
          id: result.data.documentId,
          name: result.data.originalName,
          filename: result.data.filename,
          size: result.data.size,
          uploadedAt: result.data.uploadedAt,
          documentType: result.data.documentType,
          status: 'uploaded'
        };

        setUploadedFile(fileData);
        if (onUploadSuccess) onUploadSuccess(fileData);
        
        // Reset progress after success animation
        setTimeout(() => setUploadProgress(0), 2000);
      } else {
        throw new Error(result.message || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message);
      if (onUploadError) onUploadError(error.message);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // Handle file removal
  const handleRemoveFile = async () => {
    if (!uploadedFile?.id) return;

    try {
      const response = await fetch(`/api/uploads/document/${uploadedFile.id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setUploadedFile(null);
        setError(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.message);
    }
  };

  // Handle file download/view
  const handleViewFile = () => {
    if (uploadedFile?.id) {
      window.open(`/api/uploads/document/${uploadedFile.id}`, '_blank');
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon
  const getFileIcon = (filename) => {
    const extension = filename?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(extension)) {
      return <Image className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {uploadedFile && (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Uploaded</span>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {/* Upload Area */}
      {!uploadedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer hover:bg-blue-50 ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : error 
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-blue-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />

          <div className="text-center">
            {uploading ? (
              <div className="space-y-3">
                <Loader className="w-8 h-8 text-blue-600 mx-auto animate-spin" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Uploading...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{uploadProgress}%</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className={`w-8 h-8 mx-auto ${error ? 'text-red-500' : 'text-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Drop your file here or <span className="text-blue-600">browse</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, PDF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Uploaded File Display */
        <div className="border border-gray-200 rounded-xl p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                {getFileIcon(uploadedFile.name)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(uploadedFile.size)} • Uploaded {new Date(uploadedFile.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleViewFile}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="View file"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Remove file"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedFileUpload;
