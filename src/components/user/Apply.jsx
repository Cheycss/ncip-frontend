import React, { useState, useEffect } from 'react'
import { FileText, ChevronDown, CheckCircle, ArrowRight, Info, Shield, Briefcase, GraduationCap, Home, Download, Edit, Upload, User, Users, Eye } from 'lucide-react'
import { getPurposes, getRequirementsByPurpose } from '../../utils/purposeRequirements'

const Apply = ({ onSelectService }) => {
  const [selectedPurpose, setSelectedPurpose] = useState(null)
  const [showRequirements, setShowRequirements] = useState(false)
  const [purposes, setPurposes] = useState([])
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [showFormsModal, setShowFormsModal] = useState(false)
  const [selectedFormImage, setSelectedFormImage] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(50)
  const [uploadedFiles, setUploadedFiles] = useState({
    page1: null, // Verification
    page2: null, // Certificate of Confirmation (COC Form I)
    page3: null, // Certification from Punong Barangay
    page4: null, // Certification from Tribal Chieftain
    page5: null, // Joint Affidavit
    page6: null  // Genealogical Chart
  })
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)

  useEffect(() => {
    // Load purposes from DATABASE (admin-managed)
    loadPurposes();
    
    // Listen for changes when admin updates purposes
    const handlePurposesChange = () => {
      loadPurposes();
    };
    
    window.addEventListener('purposesChanged', handlePurposesChange);
    
    return () => {
      window.removeEventListener('purposesChanged', handlePurposesChange);
    };
  }, []);

  // ESC key to close modals
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        if (selectedFormImage) {
          setSelectedFormImage(null);
          setZoomLevel(50); // Reset zoom
        } else if (showFormsModal) {
          setShowFormsModal(false);
        } else if (showUploadForm) {
          setShowUploadForm(false);
        } else if (showRequirements) {
          setShowRequirements(false);
        }
      }
    };

    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [selectedFormImage, showFormsModal, showUploadForm, showRequirements]);

  // Reset zoom when closing enlarged view
  useEffect(() => {
    if (!selectedFormImage) {
      setZoomLevel(50);
    }
  }, [selectedFormImage]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(50);
  };

  const loadPurposes = async () => {
    try {
      const allPurposes = await getPurposes();
      setPurposes(allPurposes);
    } catch (error) {
      console.error('Error loading purposes:', error);
      setPurposes([]);
    }
  };

  const handleDownloadPDF = async () => {
    if (isDownloadingPDF) return;
    
    setIsDownloadingPDF(true);
    
    try {
      console.log('Starting PDF download...');
      
      // Dynamic API URL helper
      const getApiUrl = () => {
        const currentHost = window.location.hostname;
        if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
          return `http://${currentHost}:3001`;
        }
        return 'http://localhost:3001';
      };

      // Download the COC form PDF from backend
      const response = await fetch(`${getApiUrl()}/api/pdf/coc-form`);
      
      console.log('PDF response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('PDF download error:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
      
      // Get the blob
      const blob = await response.blob();
      console.log('PDF blob size:', blob.size);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'NCIP_Certificate_of_Confirmation_Form.pdf';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert(`Failed to download PDF. Please make sure the backend server is running.\n\nError: ${error.message}`);
    } finally {
      setIsDownloadingPDF(false);
    }
  }

  const handleFileUpload = (pageKey, event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [pageKey]: file
      }))
    }
  }

  const handleSubmitUpload = () => {
    // Check if all files are uploaded
    const missingFiles = Object.entries(uploadedFiles)
      .filter(([key, file]) => !file)
      .map(([key]) => key)
    
    if (missingFiles.length > 0) {
      alert(`Please upload all required pages. Missing: ${missingFiles.length} file(s)`)
      return
    }
    
    // TODO: Implement file upload to server
    const fileNames = Object.values(uploadedFiles).map(f => f.name).join(', ')
    alert(`All 6 pages will be submitted for processing:\n${fileNames}`)
    setShowUploadForm(false)
    setShowRequirements(false)
  }

  const getPurposeIcon = (purposeName) => {
    const name = purposeName.toLowerCase()
    if (name.includes('employment') || name.includes('work')) return <Briefcase className="w-6 h-6" />
    if (name.includes('education') || name.includes('school')) return <GraduationCap className="w-6 h-6" />
    if (name.includes('housing') || name.includes('land')) return <Home className="w-6 h-6" />
    if (name.includes('legal') || name.includes('tribal')) return <Shield className="w-6 h-6" />
    return <FileText className="w-6 h-6" />
  }

  // Upload Form Modal
  if (showUploadForm && selectedPurpose) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => setShowUploadForm(false)}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors group"
          >
            <ChevronDown className="h-5 w-5 rotate-90 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Methods
          </button>

          {/* Upload Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
              <div className="flex items-center mb-3">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold">Upload Filled Form</h2>
              </div>
              <p className="text-blue-100">
                Upload your completed PDF application form for {selectedPurpose.name}
              </p>
            </div>

            <div className="p-8 space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-5">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900 text-sm mb-2">Upload All 6 Pages:</h3>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Each page must be uploaded separately</li>
                      <li>• Ensure all fields are filled out completely</li>
                      <li>• Sign and date the forms</li>
                      <li>• Files must be in PDF or image format</li>
                      <li>• Maximum file size per page: 5MB</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 6 Upload Fields */}
              <div className="space-y-4">
                {[
                  { key: 'page1', title: 'Page 1: Verification', description: 'Verification document' },
                  { key: 'page2', title: 'Page 2: Certificate of Confirmation (COC Form I)', description: 'Information Index' },
                  { key: 'page3', title: 'Page 3: Certification from Punong Barangay', description: 'Office of the Punong Barangay' },
                  { key: 'page4', title: 'Page 4: Certification from Tribal Chieftain', description: 'Office of the Tribal Chieftain' },
                  { key: 'page5', title: 'Page 5: Joint Affidavit', description: 'Joint Affidavit of Two-Disinterested Persons' },
                  { key: 'page6', title: 'Page 6: Genealogical Chart', description: 'Genealogical Chart / Diagram' }
                ].map((page) => (
                  <div key={page.key} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">{page.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{page.description}</p>
                      </div>
                      {uploadedFiles[page.key] && (
                        <CheckCircle className="w-6 h-6 text-green-600 ml-3" />
                      )}
                    </div>
                    
                    {uploadedFiles[page.key] ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-green-600 mr-2" />
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{uploadedFiles[page.key].name}</p>
                              <p className="text-xs text-gray-600">
                                {(uploadedFiles[page.key].size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setUploadedFiles(prev => ({ ...prev, [page.key]: null }))}
                            className="text-red-600 hover:text-red-800 font-medium text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          id={`file-${page.key}`}
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(page.key, e)}
                          className="hidden"
                        />
                        <label
                          htmlFor={`file-${page.key}`}
                          className="cursor-pointer block"
                        >
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-all text-center">
                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-700">Click to upload</p>
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Progress Indicator */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Upload Progress</span>
                  <span className="text-sm font-bold text-blue-600">
                    {Object.values(uploadedFiles).filter(f => f).length} / 6 pages
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(Object.values(uploadedFiles).filter(f => f).length / 6) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmitUpload}
                  disabled={Object.values(uploadedFiles).filter(f => f).length < 6}
                  className={`flex-1 font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                    Object.values(uploadedFiles).filter(f => f).length === 6
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 to-blue-800 text-white transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  Submit All Pages
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showRequirements && selectedPurpose) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => setShowRequirements(false)}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors group"
          >
            <ChevronDown className="h-5 w-5 rotate-90 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Purpose Selection
          </button>

          {/* Purpose Header Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    {getPurposeIcon(selectedPurpose.name)}
                  </div>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                    {selectedPurpose.code}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">{selectedPurpose.name}</h2>
                <p className="text-blue-100 text-base md:text-lg leading-relaxed max-w-2xl">
                  {selectedPurpose.description}
                </p>
              </div>
            </div>
          </div>

          {/* Requirements Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Required Documents</h3>
                  <p className="text-gray-600 text-sm mt-1">Please prepare the following {selectedPurpose.requirements.length} documents before proceeding</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPurpose.requirements.map((req, index) => (
                  <div 
                    key={index} 
                    className="flex items-start p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                      <span className="text-white font-bold text-base">{index + 1}</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <span className="text-gray-900 font-semibold text-base leading-relaxed">
                        {typeof req === 'string' ? req : req.name}
                      </span>
                      {typeof req === 'object' && req.required && (
                        <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-5">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-amber-900 text-sm mb-1">Important Reminder</h3>
                <p className="text-amber-800 text-sm">
                  Make sure all documents are clear, legible, and up-to-date. Incomplete or unclear documents may delay your application processing.
                </p>
              </div>
            </div>
          </div>

          {/* Application Method Selection */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Choose Application Method</h3>
              <p className="text-gray-600 text-sm mt-1">Select how you want to submit your application</p>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Download PDF Option */}
                <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={handleDownloadPDF}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:bg-blue-600 transition-colors">
                      <Download className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-2">Download PDF</h4>
                    <p className="text-gray-600 text-xs mb-3">
                      Download form and fill manually
                    </p>
                    <div className="space-y-1.5 text-xs text-gray-500 mb-3">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 mr-1.5 text-blue-500" />
                        Fill offline
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 mr-1.5 text-blue-500" />
                        Print & sign
                      </div>
                    </div>
                    <button 
                      disabled={isDownloadingPDF}
                      className={`w-full font-bold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm ${
                        isDownloadingPDF 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isDownloadingPDF ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Upload Filled Form Option */}
                <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setShowUploadForm(true)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:bg-blue-600 transition-colors">
                      <Upload className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-2">Upload Form</h4>
                    <p className="text-gray-600 text-xs mb-3">
                      Upload your filled PDF form
                    </p>
                    <div className="space-y-1.5 text-xs text-gray-500 mb-3">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 mr-1.5 text-blue-500" />
                        Upload PDF
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 mr-1.5 text-blue-500" />
                        Quick submit
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>
                </div>

                {/* Digital Fill-out Option */}
                <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    console.log('Digital Form clicked - Starting application');
                    onSelectService({
                      id: selectedPurpose.purpose_id || selectedPurpose.id,
                      name: `Certificate of Confirmation - ${selectedPurpose.name}`,
                      purpose: selectedPurpose.name,
                      requirements: selectedPurpose.requirements || []
                    });
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:bg-blue-600 transition-colors">
                      <Edit className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-2">Digital Form</h4>
                    <p className="text-gray-600 text-xs mb-3">
                      Fill out form online
                    </p>
                    <div className="space-y-1.5 text-xs text-gray-500 mb-3">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 mr-1.5 text-blue-500" />
                        Fill online
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 mr-1.5 text-blue-500" />
                        Fast process
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
                      <Edit className="w-4 h-4" />
                      Fill Online
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowRequirements(false)}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              ← Change Purpose
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section - Improved */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-2xl text-white overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Apply for Certificate</h1>
                <p className="text-blue-100 text-sm mt-1">Certificate of Confirmation - IP Identity</p>
              </div>
            </div>
            
            <p className="text-blue-50 text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
              The Certificate of Confirmation serves as official recognition of your Indigenous Peoples (IP) identity. 
              This document is essential for accessing various government services and benefits.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Briefcase className="w-5 h-5 mb-2 text-blue-200" />
                <h3 className="font-semibold text-sm mb-1">Employment</h3>
                <p className="text-blue-100 text-xs">Government & civil service applications</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <GraduationCap className="w-5 h-5 mb-2 text-blue-200" />
                <h3 className="font-semibold text-sm mb-1">Education</h3>
                <p className="text-blue-100 text-xs">Scholarships & educational programs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Home className="w-5 h-5 mb-2 text-blue-200" />
                <h3 className="font-semibold text-sm mb-1">Land & Housing</h3>
                <p className="text-blue-100 text-xs">Ancestral domain & property matters</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 text-sm">How to Apply</h3>
              <p className="text-blue-800 text-sm mt-1">
                Review required forms → Select your purpose → Fill out application → Submit for approval
              </p>
            </div>
          </div>
        </div>

        {/* Required Forms Button */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Required Forms</h2>
              <p className="text-gray-600">View all 6 pages that need to be completed for your COC application</p>
            </div>
            <button
              onClick={() => setShowFormsModal(true)}
              className="ml-4 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <FileText className="w-5 h-5" />
              View Forms
            </button>
          </div>
        </div>

        {/* Required Forms Modal - Exact copy from ApplicationStatus */}
        {showFormsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Required Forms</h2>
                    <p className="text-blue-100 text-sm">Certificate of Confirmation - 5 Pages</p>
                  </div>
                  <button
                    onClick={() => setShowFormsModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Download Info */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex items-start gap-2">
                    <Download className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">Want to download the PDF?</p>
                      <p className="text-xs text-blue-100 leading-relaxed">
                        Select your purpose below → Fill out all forms online → Download complete PDF from the review page
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forms Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { id: 2, name: 'Page 1: Personal Index', description: 'Personal information, education, and parental background' },
                    { id: 3, name: 'Page 2: Barangay Certification', description: 'Certification from Office of Punong Barangay' },
                    { id: 4, name: 'Page 3: Tribal Chieftain Cert', description: 'Certification from Office of Tribal Chieftain' },
                    { id: 5, name: 'Page 4: Joint Affidavit', description: 'Affidavit of two disinterested persons' },
                    { id: 6, name: 'Page 5: Genealogy Tree', description: '3rd generation genealogical information' }
                  ].map((form, index) => (
                    <div key={form.id} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all">
                      {/* Form Header */}
                      <div className="bg-blue-50 p-4 border-b-2 border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <h3 className="font-bold text-gray-900 text-sm">{form.name}</h3>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{form.description}</p>
                      </div>
                      
                      {/* Form Preview */}
                      <div className="p-4 bg-gray-50">
                        <div className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden aspect-[8.5/11] mb-3">
                          <img 
                            src={`/form-png/Coc-Form_page-000${form.id}.jpg`}
                            alt={form.name}
                            className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setSelectedFormImage(form)}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden flex-col items-center justify-center h-full bg-gray-100">
                            <FileText className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500">Preview unavailable</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedFormImage(form)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold"
                        >
                          <Eye className="w-4 h-4" />
                          View Full Size
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-6 border-t-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">5 pages</span> to complete
                  </p>
                  <button
                    onClick={() => setShowFormsModal(false)}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Size View Modal with Zoom */}
        {selectedFormImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[60]" onClick={() => { setSelectedFormImage(null); setZoomLevel(50); }}>
            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white rounded-t-2xl p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{selectedFormImage.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedFormImage.description}</p>
                  </div>
                  
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-2 mx-4">
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 50}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Zoom Out"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={handleResetZoom}
                      className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors font-semibold text-sm min-w-[60px]"
                      title="Reset to 50%"
                    >
                      {zoomLevel}%
                    </button>
                    
                    <button
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 200}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Zoom In"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={() => { setSelectedFormImage(null); setZoomLevel(50); }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="bg-white p-4 max-h-[80vh] overflow-auto">
                <img 
                  src={`/form-png/Coc-Form_page-000${selectedFormImage.id}.jpg`}
                  alt={selectedFormImage.name}
                  className="shadow-2xl transition-transform duration-200"
                  style={{ 
                    width: `${zoomLevel}%`,
                    maxWidth: 'none',
                    margin: '0 auto',
                    display: 'block'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Purpose Selection - Improved */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Select Your Purpose</h2>
            <p className="text-gray-600">Choose the specific purpose for your certificate application</p>
          </div>
          
          <div className="p-6 md:p-8">
            {purposes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {purposes.map((purpose) => (
                  <div 
                    key={purpose.id} 
                    className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => {
                      setSelectedPurpose(purpose)
                      setShowRequirements(true)
                    }}
                  >
                    {/* Icon Badge */}
                    <div className="absolute top-4 right-4 bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {getPurposeIcon(purpose.name)}
                    </div>
                    
                    <div className="mb-4 pr-12">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {purpose.name}
                      </h3>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                        {purpose.code}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                      {purpose.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center text-xs text-gray-500">
                        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                        {purpose.requirements.length} requirements
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Purposes Available</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Application purposes are being set up. Please contact the administrator or check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Apply
