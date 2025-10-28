import React from 'react';
import { ArrowLeft, FileText, Download, CheckCircle2 } from 'lucide-react';
import PDFDownloadButton from '../shared/PDFDownloadButton';

const CocFormPage6 = ({ formData = {}, onNext, onBack }) => {
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
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">
                Location
              </p>
              <p className="text-lg font-bold text-purple-900">
                {formData.barangay || 'Not provided'}, {formData.city || 'Alabel'}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                Purpose
              </p>
              <p className="text-lg font-bold text-emerald-900">
                {formData.purpose || 'COC'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          
          {/* Download PDF Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mb-4 shadow-lg">
                <Download className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Download Application
              </h3>
              <p className="text-sm text-gray-600">
                Get your filled COC form as PDF
              </p>
            </div>
            <PDFDownloadButton 
              formData={formData} 
              applicationId={`COC-${Date.now()}`}
            />
          </div>

          {/* Next Steps Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center mb-4">
              <CheckCircle2 className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-bold">Next Steps</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                <div>
                  <p className="font-semibold">Download & Print</p>
                  <p className="text-sm text-blue-100">Print your application form</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                <div>
                  <p className="font-semibold">Get Signatures</p>
                  <p className="text-sm text-blue-100">Barangay Captain, Tribal Chieftain, Witnesses, Notary</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                <div>
                  <p className="font-semibold">Scan & Upload</p>
                  <p className="text-sm text-blue-100">Submit signed PDF to system</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-blue-500">
              <p className="text-sm text-blue-100 text-center">
                💡 After getting signatures, upload the signed PDF through this system for NCIP review
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <button
            onClick={handleBackToApply}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Back to Apply
          </button>
        </div>

      </div>
    </div>
  );
};

export default CocFormPage6;
