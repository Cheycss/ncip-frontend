import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CocFormPage1 from './CocFormPage1';
import CocFormPage2 from './CocFormPage2';
import CocFormPage3 from './CocFormPage3';
import CocFormPage4 from './CocFormPage4';
import CocFormPage5 from './CocFormPage5';
import CocFormPage6Review from './CocFormPage6';
import FormDataSummary from '../shared/FormDataSummary';
import { seedDemoData } from '../../utils/demoDataSeeder';

const CocForm = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // Start at 0 for purpose selection
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize purposes from localStorage or use defaults
  useEffect(() => {
    const seedPurposes = () => {
      const purposesKey = 'coc_purposes_v1';
      const existingPurposes = localStorage.getItem(purposesKey);
      
      if (!existingPurposes) {
        const defaultPurposes = [
          { key: 'scholarship', label: 'Scholarship' },
          { key: 'travelAbroad', label: 'Travel Abroad' },
          { key: 'civilService', label: 'Civil Service Requirement' },
          { key: 'ipIdentification', label: 'IP Identification' },
          { key: 'napolcom', label: 'NAPOLCOM' },
          { key: 'bjmp', label: 'BJMP' },
          { key: 'afp', label: 'AFP' },
          { key: 'bfp', label: 'BFP' },
          { key: 'employment', label: 'Employment' },
          { key: 'businessRegistration', label: 'Business Registration' }
        ];
        localStorage.setItem(purposesKey, JSON.stringify(defaultPurposes));
        console.log('Seeded default purposes to localStorage');
      }
    };
    
    seedPurposes();
    
    // Seed demo data for testing
    seedDemoData();
  }, []);

  // Get purposes from localStorage
  const getPurposes = () => {
    const purposesKey = 'coc_purposes_v1';
    const storedPurposes = localStorage.getItem(purposesKey);
    return storedPurposes ? JSON.parse(storedPurposes) : [];
  };

  const purposes = getPurposes();

  const updateFormData = (newData) => {
    console.log('Updating form data:', newData); // Debug log
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      console.log('Complete form data after update:', updated); // Debug log
      return updated;
    });
  };

  const handlePurposeSelection = (purpose) => {
    setSelectedPurpose(purpose.label);
    setFormData(prev => ({ ...prev, purpose: purpose.label }));
    setCurrentPage(1); // Move to first form page
    // Scroll to top when moving to form pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = (pageData) => {
    console.log(`Moving from page ${currentPage} to page ${currentPage + 1}`); // Debug log
    if (pageData) {
      console.log('Page data received:', pageData); // Debug log
      updateFormData(pageData);
    }
    setCurrentPage(prev => prev + 1);
    // Scroll to top when moving to next page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    console.log(`Moving back from page ${currentPage} to page ${currentPage - 1}`); // Debug log
    if (currentPage === 1) {
      // Go back to purpose selection
      setCurrentPage(0);
    } else {
      setCurrentPage(prev => prev - 1);
    }
    // Scroll to top when moving to previous page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToServices = () => {
    navigate('/user?section=services');
  };

  const handleSubmitApplication = async (finalData) => {
    try {
      setIsSubmitting(true);
      const completeFormData = { ...formData, ...finalData };
      
      // Comprehensive logging for debugging
      console.log('=== FINAL APPLICATION SUBMISSION ===');
      console.log('Selected Purpose:', selectedPurpose);
      console.log('Final Page Data:', finalData);
      console.log('Complete Form Data:', completeFormData);
      console.log('Current Page:', currentPage);
      console.log('=====================================');
      
      // Get current user info from auth context
      const currentUser = JSON.parse(localStorage.getItem('ncip_user') || '{}');
      const userId = currentUser.id || currentUser.email;
      
      // Generate expiration dates for requirements
      const generateExpirationDate = (daysFromNow) => {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toISOString();
      };
      
      // Process uploaded files with expiration dates
      const processedRequirements = {};
      if (finalData && finalData.uploadedFiles) {
        Object.keys(finalData.uploadedFiles).forEach(docId => {
          const file = finalData.uploadedFiles[docId];
          processedRequirements[docId] = {
            ...file,
            submittedAt: new Date().toISOString(),
            expiresAt: generateExpirationDate(365), // 1 year expiration
            status: 'valid'
          };
        });
      }
      
      // Save application to backend database
      const token = localStorage.getItem('ncip_token');
      const apiUrl = window.location.hostname.includes('vercel.app') 
        ? 'https://ncip-backend.onrender.com'
        : window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3001'
        : `http://${window.location.hostname}:3001`;
      
      const applicationId = `COC-${Date.now()}`;
      const newApplication = {
        application_number: applicationId,
        service_type: 'Certificate of Confirmation',
        purpose: selectedPurpose,
        status: 'submitted',
        form_data: completeFormData,
        requirements: processedRequirements
      };
      
      // Save to backend
      const response = await fetch(`${apiUrl}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newApplication)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit application');
      }
      
      const savedApplication = await response.json();
      const dbApplicationId = savedApplication.application?.application_id || applicationId;
      
      // Also save to localStorage for quick access (optional)
      const userApplicationsKey = `user_applications_${userId}`;
      const existingUserApplications = JSON.parse(localStorage.getItem(userApplicationsKey) || '[]');
      const localApplication = {
        id: dbApplicationId,
        userId: currentUser.id,
        userEmail: currentUser.email,
        type: 'Certificate of Confirmation',
        serviceType: 'Certificate of Confirmation',
        purpose: selectedPurpose,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: completeFormData,
        requirements: processedRequirements,
        pageStatuses: {
          page1: 'completed',
          page2: 'completed', 
          page3: 'completed',
          page4: 'completed',
          page5: 'completed',
          page6: 'completed',
          documents: 'completed'
        },
        comments: {},
        reviewProgress: 100
      };
      
      const updatedAdminApplications = [...existingAdminApplications, newAdminApplication];
      localStorage.setItem('applications', JSON.stringify(updatedAdminApplications));
      
      // Show success message and redirect
      alert(`Certificate of Confirmation application for ${selectedPurpose} submitted successfully!`);
      navigate('/user');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentPage = () => {
    // Unified props structure for all pages
    const commonProps = {
      formData,
      updateFormData,
      onNext: currentPage === 7 ? handleSubmitApplication : handleNextPage,
      onBack: handlePreviousPage,
      onPrevious: handlePreviousPage,
      onSubmit: handleSubmitApplication,
      selectedPurpose,
      currentPage,
      errors,
      setErrors
    };

    // Enhanced props for pages that need direct state access
    const enhancedProps = {
      ...commonProps,
      setFormData,
      initialFormData: formData
    };

    switch (currentPage) {
      case 0:
        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Purpose</h2>
                <p className="text-gray-600">Choose the purpose for your Certificate of Confirmation</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {purposes.map((purpose) => (
                  <button
                    key={purpose.key}
                    onClick={() => handlePurposeSelection(purpose)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium text-gray-900">{purpose.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleBackToServices}
                  className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Services</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 1:
        return <CocFormPage1 {...enhancedProps} />;
      case 2:
        return <CocFormPage2 {...enhancedProps} />;
      case 3:
        return <CocFormPage3 {...enhancedProps} />;
      case 4:
        return <CocFormPage4 {...enhancedProps} />;
      case 5:
        return <CocFormPage5 {...enhancedProps} />;
      case 6:
        return <CocFormPage6Review {...enhancedProps} />;
      case 7:
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl text-center border-4 border-green-500">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-green-900 mb-4">Application Submitted!</h1>
              <p className="text-xl text-green-700 mb-8">
                Your Certificate of Confirmation application has been successfully submitted.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Debug Panel - Only show in development */}
      {process.env.NODE_ENV === 'development' && currentPage > 0 && (
        <div className="bg-yellow-100 border-b border-yellow-200 p-2">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between text-xs">
              <div>
                <strong>Debug:</strong> Page {currentPage}/7 | Purpose: {selectedPurpose} | Data Keys: {Object.keys(formData).length}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => console.log('Current Form Data:', formData)}
                  className="bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                >
                  Log Data
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                  disabled={currentPage <= 1}
                >
                  Force Back
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(6, prev + 1))}
                  className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                  disabled={currentPage >= 6}
                >
                  Force Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator - Only show when in form pages */}
      {currentPage > 0 && (
        <div className="bg-blue-600 border-b border-blue-700 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-white">Certificate of Confirmation Application</h1>
                <p className="text-sm text-blue-100">Purpose: {selectedPurpose}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5, 6].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step === currentPage
                            ? 'bg-white text-blue-600'
                            : step < currentPage
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-blue-200'
                        }`}
                      >
                        {step < currentPage ? '✓' : step}
                      </div>
                      {step < 6 && (
                        <div
                          className={`w-12 h-1 mx-2 ${
                            step < currentPage ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-blue-100">
                  Page {currentPage} of 6
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Data Summary - Only show in development */}
      {process.env.NODE_ENV === 'development' && currentPage > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <FormDataSummary 
            formData={formData} 
            currentPage={currentPage} 
            selectedPurpose={selectedPurpose} 
          />
        </div>
      )}

      {/* Current Page Content */}
      {renderCurrentPage()}
    </div>
  );
};

export default CocForm;
