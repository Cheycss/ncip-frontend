import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import GenealogySearch from '../shared/GenealogySearch';

const CocFormPage5 = ({ formData: initialFormData, onNext, onBack }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    ...initialFormData,
    paternalGrandfather: '',
    paternalGrandmother: '',
    maternalGrandfather: '',
    maternalGrandmother: ''
  });

  const handleSubmit = () => {
    console.log('Page 5 - Form submitted:', formData);
    console.log('Page 5 - Calling onNext...');
    
    // Pass the form data to the next page
    if (onNext && typeof onNext === 'function') {
      onNext(formData);
    } else {
      console.error('onNext is not a function:', onNext);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Modern Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center justify-center gap-6">
              <img 
                src="/NCIPLogo.png" 
                alt="NCIP Logo" 
                className="w-20 h-20 bg-white rounded-full p-2 shadow-lg"
              />
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-1">Genealogy Information</h1>
                <p className="text-blue-100 text-sm">Family Tree & Ancestry Records</p>
              </div>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="bg-blue-50 px-8 py-4 border-b border-blue-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">5</div>
                <span className="font-semibold text-gray-900">Genealogy Search</span>
              </div>
              <span className="text-gray-500">Step 5 of 5</span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <h3 className="text-lg font-bold text-white">Search or Create Genealogy Record</h3>
          </div>
          
          <div className="p-8">
            {/* Use GenealogySearch Component */}
            <GenealogySearch
              onGenealogyFound={(record) => {
                // Auto-fill form data from selected genealogy record
                setFormData(prev => ({
                  ...prev,
                  paternalGrandfather: record.paternal_grandfather_name || '',
                  paternalGrandmother: record.paternal_grandmother_name || '',
                  maternalGrandfather: record.maternal_grandfather_name || '',
                  maternalGrandmother: record.maternal_grandmother_name || ''
                }))
                setSelectedRecord(record)
              }}
              onCreateNew={() => {
                // Manual entry not implemented yet
                alert('Manual entry coming soon! For now, please search for existing records.')
              }}
            />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-gray-200 mt-12">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center space-x-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all shadow-md hover:shadow-lg font-semibold"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Previous: Joint Affidavit</span>
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                <span>Complete & Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CocFormPage5;
