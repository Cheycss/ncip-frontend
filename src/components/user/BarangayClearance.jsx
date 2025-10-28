import React, { useState } from 'react';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';

const BarangayClearance = ({ service, onBack, onNext, currentStep }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    purpose: '',
    dateIssued: '',
    barangayOfficial: ''
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
      latestApp.pageStatuses.barangay_clearance = 'completed';
      latestApp.pageStatuses.municipal_clearance = 'in_progress';
      latestApp.formData.barangayClearance = formData;
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
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
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
          <div className="flex-1 h-1 bg-white/30 mx-4"></div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
              <span className="text-green-600 font-bold text-sm">2</span>
            </div>
            <span className="text-sm font-semibold">Barangay Clearance</span>
          </div>
          <div className="flex-1 h-1 bg-white/30 mx-4"></div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-sm">3</span>
            </div>
            <span className="text-sm opacity-70">Municipal Clearance</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">BARANGAY CLEARANCE</h1>
            <p className="text-green-100 text-base font-medium">
              Step 2 of 4 - Certificate of Confirmation Application
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleNext} className="space-y-6">
          <div className="text-center border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900">BARANGAY CLEARANCE FORM</h3>
            <p className="text-gray-600 mt-2">Please fill out the required information</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Purpose of clearance"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barangay Official/Captain Name
              </label>
              <input
                type="text"
                name="barangayOfficial"
                value={formData.barangayOfficial}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Name of issuing barangay official"
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
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Next Step
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BarangayClearance;
