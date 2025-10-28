import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

const FormDataSummary = ({ formData, currentPage, selectedPurpose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);

  const sensitiveFields = ['applicantSignature', 'signature', 'password'];
  
  const formatValue = (key, value) => {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      return showSensitive ? value : '***HIDDEN***';
    }
    
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  };

  const dataEntries = Object.entries(formData).filter(([key, value]) => 
    value !== '' && value !== null && value !== undefined
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-gray-700">
            Form Data Summary ({dataEntries.length} fields)
          </h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Page {currentPage} | {selectedPurpose}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSensitive(!showSensitive)}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            {showSensitive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>{showSensitive ? 'Hide' : 'Show'} Sensitive</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-3 border-t border-gray-200 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {dataEntries.map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-medium text-gray-600 w-32 truncate">{key}:</span>
                <span className="text-gray-800 flex-1 break-all">
                  {formatValue(key, value)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => console.log('Complete Form Data:', formData)}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
            >
              Log to Console
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormDataSummary;
