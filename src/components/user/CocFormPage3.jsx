import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

const CocFormPage3 = ({ formData: initialFormData, onNext, onBack, updateFormData, selectedPurpose }) => {
  const [errors, setErrors] = useState({});
  const [localFormData, setLocalFormData] = useState({
    province: 'SARANGANI',
    municipality: initialFormData.city || initialFormData.municipality || '',
    barangay: initialFormData.barangay || '',
    // Use applicantSignature (Printed Name/Signature of Applicant) as the primary source for applicant name
    applicantName: initialFormData.applicantSignature || initialFormData.name || initialFormData.fullName || initialFormData.applicantName || '',
    belongingLocation: `${initialFormData.barangay || ''}, ${initialFormData.city || initialFormData.municipality || ''}, Sarangani Province`,
    iccGroup: initialFormData.iccs || initialFormData.fatherTribe || '',
    parentNames: initialFormData.fatherName || '',
    parentNames2: initialFormData.motherName || '',
    iccGroup1: initialFormData.fatherTribe || initialFormData.iccs || '',
    iccGroup2: initialFormData.motherTribe || initialFormData.iccs || '',
    parentAscendantNames: `${initialFormData.fatherName || ''} and ${initialFormData.motherName || ''}`,
    purpose: initialFormData.purpose || selectedPurpose?.name || '',
    issuanceDay: new Date().getDate().toString(),
    issuanceMonth: new Date().toLocaleString('default', { month: 'long' }),
    issuanceYear: '2024',
    // Signature fields
    ipsHeadSignature: initialFormData.ipsHeadSignature || '',
    barangayIpmrSignature: initialFormData.barangayIpmrSignature || '',
    municipalTribalChieftainSignature: initialFormData.municipalTribalChieftainSignature || ''
  });

  // Update local form data when initial form data changes (for auto-fill)
  useEffect(() => {
    setLocalFormData(prev => {
      const updated = {
        ...prev,
        // Re-populate key fields when form data updates - prioritize applicantSignature
        applicantName: initialFormData.applicantSignature || initialFormData.name || initialFormData.fullName || initialFormData.applicantName || prev.applicantName || '',
        municipality: initialFormData.city || initialFormData.municipality || prev.municipality || '',
        barangay: initialFormData.barangay || prev.barangay || '',
        belongingLocation: `${initialFormData.barangay || prev.barangay || ''}, ${initialFormData.city || initialFormData.municipality || prev.municipality || ''}, Sarangani Province`,
        parentNames: initialFormData.fatherName || prev.parentNames || '',
        parentNames2: initialFormData.motherName || prev.parentNames2 || '',
        iccGroup: initialFormData.iccs || initialFormData.fatherTribe || prev.iccGroup || '',
        iccGroup1: initialFormData.fatherTribe || initialFormData.iccs || prev.iccGroup1 || '',
        iccGroup2: initialFormData.motherTribe || initialFormData.iccs || prev.iccGroup2 || '',
        parentAscendantNames: `${initialFormData.fatherName || ''} and ${initialFormData.motherName || ''}` || prev.parentAscendantNames || '',
        purpose: initialFormData.purpose || selectedPurpose?.name || prev.purpose || ''
      };
      
      return updated;
    });
  }, [initialFormData]);

  const validateForm = () => {
    // Remove all validation - let user proceed immediately
    setErrors({});
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Page 3 - Form submitted:', localFormData);
    console.log('Page 3 - Calling onNext...');
    
    // Skip all validation and proceed immediately
    if (onNext && typeof onNext === 'function') {
      onNext(localFormData);
    } else {
      console.error('onNext is not a function:', onNext);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update local form data
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update the parent form data
    if (updateFormData) {
      updateFormData({ [name]: value });
    }
    
    // Clear any validation errors for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
                <h1 className="text-2xl font-bold mb-1">Tribal Chieftain Certification</h1>
                <p className="text-blue-100 text-sm">Office of the Tribal Chieftain</p>
              </div>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="bg-blue-50 px-8 py-4 border-b border-blue-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
                <span className="font-semibold text-gray-900">Tribal Certification</span>
              </div>
              <span className="text-gray-500">Step 3 of 5</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-visible">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white">Certification Details</h3>
            </div>
            <div className="p-8 space-y-6">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold text-gray-900 tracking-wider">OFFICE OF THE TRIBAL CHIEFTAIN</h1>
              <h2 className="text-3xl font-bold text-blue-900 tracking-widest">CERTIFICATION</h2>
              <div className="border-t-2 border-blue-200 my-6"></div>
            </div>

            {/* Main Content */}
            <div className="space-y-8 mt-12">
              <h3 className="text-lg font-bold text-gray-900">TO WHOM IT MAY CONCERN:</h3>

              <div className="space-y-6 text-base leading-relaxed">
                
                <div className="flex flex-wrap items-center space-x-2">
                  <span className="text-gray-700">THIS IS TO CERTIFY that</span>
                  <span className="border-b border-gray-400 py-1 px-2 flex-1 min-w-80 font-semibold">{localFormData.applicantName}</span>
                  <input type="hidden" name="applicantName" value={localFormData.applicantName} />
                  <span className="text-gray-700">is a resident of</span>
                </div>

                <div className="flex flex-wrap items-center space-x-2">
                  <span className="border-b border-gray-400 py-1 px-2 flex-1 min-w-80 font-semibold">{localFormData.belongingLocation}</span>
                  <input type="hidden" name="belongingLocation" value={localFormData.belongingLocation} />
                  <span className="text-gray-700">belonging to the</span>
                  <span className="border-b border-gray-400 py-1 px-2 w-32 font-semibold">{localFormData.iccGroup}</span>
                  <input type="hidden" name="iccGroup" value={localFormData.iccGroup} />
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-gray-700">Indigenous</span>
                    <span className="text-gray-700">Cultural</span>
                    <span className="text-gray-700">Communities</span>
                    <span className="text-gray-700">(ICCs).</span>
                    <span className="text-gray-700">His/her</span>
                  </div>

                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-gray-700">parents</span>
                    <span className="border-b border-gray-400 py-1 px-2 flex-1 min-w-64 font-semibold">{localFormData.parentNames}</span>
                    <input type="hidden" name="parentNames" value={localFormData.parentNames} />
                    <span className="text-gray-700">and</span>
                    <span className="border-b border-gray-400 py-1 px-2 flex-1 min-w-64 font-semibold">{localFormData.parentNames2}</span>
                    <input type="hidden" name="parentNames2" value={localFormData.parentNames2} />
                  </div>

                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-gray-700">being members of the</span>
                    <span className="border-b border-gray-400 py-1 px-2 w-40 font-semibold">{localFormData.iccGroup1}</span>
                    <input type="hidden" name="iccGroup1" value={localFormData.iccGroup1} />
                    <span className="text-gray-700">and</span>
                    <span className="border-b border-gray-400 py-1 px-2 w-40 font-semibold">{localFormData.iccGroup2}</span>
                    <input type="hidden" name="iccGroup2" value={localFormData.iccGroup2} />
                    <span className="text-gray-700">ICCs,</span>
                  </div>

                  <p className="text-gray-700">respectively.</p>

                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-gray-700">Certify</span>
                    <span className="text-gray-700">further</span>
                    <span className="text-gray-700">that</span>
                    <span className="text-gray-700">the</span>
                    <span className="text-gray-700">parent/s</span>
                    <span className="text-gray-700">and</span>
                    <span className="text-gray-700">or</span>
                    <span className="text-gray-700">ascendants</span>
                  </div>

                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-gray-700">of</span>
                    <span className="border-b border-gray-400 py-1 px-2 flex-1 min-w-64 font-semibold">{localFormData.parentAscendantNames}</span>
                    <input type="hidden" name="parentAscendantNames" value={localFormData.parentAscendantNames} />
                    <span className="text-gray-700">belongs to</span>
                    <input 
                      type="text" 
                      name="belongsToTribe"
                      value={localFormData.iccGroup || localFormData.fatherTribe || 'Bisaya'}
                      onChange={handleInputChange}
                      className="border-b border-gray-400 py-1 px-2 w-32 font-semibold bg-transparent focus:outline-none focus:border-blue-500"
                      placeholder="Tribe"
                    />
                    <span className="text-gray-700">ICCs/IPs</span>
                  </div>

                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-gray-700">This certification is issued for</span>
                    <input 
                      type="text" 
                      name="purpose"
                      value={localFormData.purpose || initialFormData.purpose || ''}
                      onChange={handleInputChange}
                      className="border-b border-gray-400 py-1 px-2 flex-1 min-w-64 font-semibold bg-white focus:outline-none focus:border-blue-500"
                      placeholder={initialFormData.purpose ? initialFormData.purpose : "Purpose of certification"}
                      title={`Selected purpose: ${initialFormData.purpose || 'None selected'}`}
                    />
                    <span className="text-gray-700">purpose.</span>
                  </div>
                  

                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-gray-700">Issued this</span>
                    <input 
                      type="text" 
                      name="issuanceDay"
                      value={localFormData.issuanceDay}
                      onChange={handleInputChange}
                      className="border-b border-gray-400 py-1 px-2 w-16 font-semibold bg-transparent focus:outline-none focus:border-blue-500 text-center"
                      placeholder="Day"
                    />
                    <span className="text-gray-700">of</span>
                    <input 
                      type="text" 
                      name="issuanceMonth"
                      value={localFormData.issuanceMonth}
                      onChange={handleInputChange}
                      className="border-b border-gray-400 py-1 px-2 w-32 font-semibold bg-transparent focus:outline-none focus:border-blue-500 text-center"
                      placeholder="Month"
                    />
                    <span className="text-gray-700">2024.</span>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="space-y-8 mt-16">
                <div className="flex justify-end">
                  <div className="text-center">
                    <input
                      type="text"
                      name="ipsHeadSignature"
                      value={localFormData.ipsHeadSignature}
                      onChange={handleInputChange}
                      className="border-b border-gray-400 py-1 px-2 w-64 mb-2 text-center font-semibold bg-transparent focus:outline-none focus:border-blue-500"
                      placeholder="Signature"
                    />
                    <p className="text-sm text-gray-700 font-medium">IPS Head/Tribal Chieftain</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="text-center">
                    <input
                      type="text"
                      name="barangayIpmrSignature"
                      value={localFormData.barangayIpmrSignature}
                      onChange={handleInputChange}
                      className="border-b border-gray-400 py-1 px-2 w-64 mb-2 text-center font-semibold bg-transparent focus:outline-none focus:border-blue-500"
                      placeholder="Signature"
                    />
                    <p className="text-sm text-gray-700 font-medium">Barangay IPMR</p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="text-center">
                    <input
                      type="text"
                      name="municipalTribalChieftainSignature"
                      value={localFormData.municipalTribalChieftainSignature}
                      onChange={handleInputChange}
                      className="border-b border-gray-400 py-1 px-2 w-64 mb-2 text-center font-semibold bg-transparent focus:outline-none focus:border-blue-500"
                      placeholder="Signature"
                    />
                    <p className="text-sm text-gray-700 font-medium">Municipal Tribal Chieftain</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200 mt-16">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center space-x-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all shadow-md hover:shadow-lg font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </button>
              
              <button
                type="button"
                onClick={() => onNext(localFormData)}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                <span>Next: Joint Affidavit</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CocFormPage3;
