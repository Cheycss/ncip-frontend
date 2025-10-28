import React, { useState } from 'react';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';

const MunicipalClearance = ({ service, onBack, onNext, currentStep }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    purpose: '',
    dateIssued: '',
    municipalOfficial: '',
    businessPermit: '',
    taxClearance: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    // Update application in localStorage
    const applications = JSON.parse(localStorage.getItem('ncip_applications') || '[]');
    const latestApp = applications[applications.length - 1];
    if (latestApp) {
      latestApp.pageStatuses.municipal_clearance = 'completed';
      latestApp.pageStatuses.documents = 'in_progress';
      latestApp.formData.municipalClearance = formData;
      localStorage.setItem('ncip_applications', JSON.stringify(applications));
    }
    
    if (onNext) {
      onNext();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
        <button
          onClick={handleBack}
          className="inline-flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-lg mb-6 transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base">← Back</span>
        </button>
        
        {/* Progress Indicator */}
        <div className="flex items-center mb-6">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-white mr-2" />
            <span className="text-sm">Tribal Chieftain</span>
          </div>
          <div className="flex-1 h-1 bg-white mx-4"></div>
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-white mr-2" />
            <span className="text-sm">Barangay Clearance</span>
          </div>
          <div className="flex-1 h-1 bg-white mx-4"></div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
              <span className="text-purple-600 font-bold text-sm">3</span>
            </div>
            <span className="text-sm font-semibold">Municipal Clearance</span>
          </div>
          <div className="flex-1 h-1 bg-white/30 mx-4"></div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-sm">4</span>
            </div>
            <span className="text-sm opacity-70">Final Documents</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">MUNICIPAL CLEARANCE</h1>
            <p className="text-purple-100 text-base font-medium">
              Step 3 of 4 - Certificate of Confirmation Application
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleNext} className="space-y-6">
          <div className="text-center border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900">MUNICIPAL CLEARANCE FORM</h3>
            <p className="text-gray-600 mt-2">Municipal government clearance requirements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your complete address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Purpose of municipal clearance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Issued
              </label>
              <input
                type="date"
                name="dateIssued"
                value={formData.dateIssued}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Municipal Official Name
              </label>
              <input
                type="text"
                name="municipalOfficial"
                value={formData.municipalOfficial}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Name of issuing municipal official"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Permit Number (if applicable)
              </label>
              <input
                type="text"
                name="businessPermit"
                value={formData.businessPermit}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Business permit number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Clearance Number (if applicable)
              </label>
              <input
                type="text"
                name="taxClearance"
                value={formData.taxClearance}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tax clearance number"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Previous
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Next Step
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MunicipalClearance;
