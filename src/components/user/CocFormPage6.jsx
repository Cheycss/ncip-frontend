import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, CheckCircle2, User, MapPin, Users } from 'lucide-react';
import PDFDownloadButton from '../shared/PDFDownloadButton';

const CocFormPage6 = ({ formData = {}, onNext, onBack }) => {
  const [activeTab, setActiveTab] = useState('personal');

  const handleBackToApply = () => {
    console.log('Back to Apply clicked');
    if (onNext && typeof onNext === 'function') {
      onNext({ action: 'return_to_apply' });
    } else {
      window.location.reload();
    }
  };

  const handleBack = () => {
    if (onBack && typeof onBack === 'function') {
      onBack();
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'family', label: 'Family Info', icon: Users },
    { id: 'contact', label: 'Contact Info', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Review & Download
          </h1>
          <p className="text-gray-600">
            Certificate of Confirmation Application - Final Step
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
            <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Application Summary</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                Applicant Name
              </p>
              <p className="text-lg font-bold text-blue-900">
                {formData.fullName || formData.name || 'Not provided'}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                Location
              </p>
              <p className="text-lg font-bold text-blue-900">
                {formData.barangay || 'Not provided'}, {formData.city || 'Alabel'}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                Purpose
              </p>
              <p className="text-lg font-bold text-blue-900">
                {formData.purpose || 'COC'}
              </p>
            </div>
          </div>
        </div>

        {/* Review Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'personal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                  <p className="text-base font-bold text-gray-900">{formData.fullName || formData.name || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date of Birth</p>
                  <p className="text-base font-bold text-gray-900">{formData.birthDate || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Place of Birth</p>
                  <p className="text-base font-bold text-gray-900">{formData.birthPlace || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Sex</p>
                  <p className="text-base font-bold text-gray-900">{formData.sex || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Civil Status</p>
                  <p className="text-base font-bold text-gray-900">{formData.civilStatus || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tribe/Ethnicity</p>
                  <p className="text-base font-bold text-gray-900">{formData.tribe || formData.fatherTribe || '-'}</p>
                </div>
              </div>
            )}

            {activeTab === 'family' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Father's Name</p>
                  <p className="text-base font-bold text-gray-900">{formData.fatherName || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Father's Tribe</p>
                  <p className="text-base font-bold text-gray-900">{formData.fatherTribe || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Mother's Name</p>
                  <p className="text-base font-bold text-gray-900">{formData.motherName || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Mother's Tribe</p>
                  <p className="text-base font-bold text-gray-900">{formData.motherTribe || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Father's Birthplace</p>
                  <p className="text-base font-bold text-gray-900">{formData.fatherBirthplace || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Mother's Birthplace</p>
                  <p className="text-base font-bold text-gray-900">{formData.motherBirthplace || '-'}</p>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Barangay</p>
                  <p className="text-base font-bold text-gray-900">{formData.barangay || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Municipality/City</p>
                  <p className="text-base font-bold text-gray-900">{formData.city || 'Alabel'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Province</p>
                  <p className="text-base font-bold text-gray-900">{formData.province || 'Sarangani'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Purpose</p>
                  <p className="text-base font-bold text-gray-900">{formData.purpose || 'Certificate of Confirmation'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Download Your Application</h3>
            </div>
          </div>
          <PDFDownloadButton 
            formData={formData} 
            applicationId={`COC-${Date.now()}`}
          />
        </div>

        {/* Next Steps - 3 Column Grid */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Next Steps</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Download & Print</h4>
              <p className="text-sm text-gray-600">Print all 5 pages of the form</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Get Signatures</h4>
              <p className="text-sm text-gray-600 mb-2">Have the form signed by:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Barangay Captain</li>
                <li>• Tribal Chieftain</li>
                <li>• Two Witnesses</li>
                <li>• Notary Public</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Scan & Upload</h4>
              <p className="text-sm text-gray-600">Upload the signed PDF through this system for NCIP review</p>
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-center text-gray-600">
              <span className="font-semibold">💡 Note:</span> After getting all signatures, go to the Apply page where you can submit each form (Pages 1-5) one by one as PDF.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border-2 border-gray-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous Step
          </button>

          <button
            onClick={handleBackToApply}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <CheckCircle2 className="w-6 h-6 mr-2" />
            Back to Apply Page
          </button>
        </div>

      </div>
    </div>
  );
};

export default CocFormPage6;
