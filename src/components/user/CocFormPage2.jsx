import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

const CocFormPage2 = ({ formData: initialFormData, onNext, onBack }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    province: initialFormData.province || 'SARANGANI',
    municipality: initialFormData.city || '',
    barangay: initialFormData.barangay || '',
    // Use applicantSignature (Printed Name/Signature of Applicant) as primary source
    applicantName: initialFormData.applicantSignature || initialFormData.fullName || initialFormData.name || '',
    residenceLocation: `${initialFormData.barangay || ''}, ${initialFormData.city || ''}, Sarangani Province`,
    parentAscendantName: initialFormData.fatherName || '',
    iccGroup: initialFormData.fatherTribe || '',
    residenceYears: '',
    issuanceDay: new Date().getDate().toString(),
    issuanceMonth: new Date().toLocaleString('default', { month: 'long' }),
    issuanceYear: '2024',
    punongBarangaySignature: '',
    ...initialFormData
  });

  // Auto-update when initialFormData changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      province: initialFormData.province || prev.province || 'SARANGANI',
      municipality: initialFormData.city || prev.municipality || '',
      barangay: initialFormData.barangay || prev.barangay || '',
      applicantName: initialFormData.applicantSignature || initialFormData.fullName || initialFormData.name || prev.applicantName || '',
      residenceLocation: `${initialFormData.barangay || ''}, ${initialFormData.city || ''}, Sarangani Province`,
      parentAscendantName: initialFormData.fatherName || prev.parentAscendantName || '',
      iccGroup: initialFormData.fatherTribe || prev.iccGroup || ''
    }));
  }, [initialFormData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields - RELAXED for testing
    // Only check if absolutely required fields exist
    // if (!formData.applicantName?.trim()) newErrors.applicantName = 'Applicant name is required';
    // if (!formData.residenceLocation?.trim()) newErrors.residenceLocation = 'Residence location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Page 2 - Form submitted:', formData);
    console.log('Page 2 - Calling onNext...');
    
    // Always proceed to next page (validation disabled for testing)
    if (onNext && typeof onNext === 'function') {
      onNext(formData);
    } else {
      console.error('onNext is not a function:', onNext);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
                <h1 className="text-2xl font-bold mb-1">Barangay Certification</h1>
                <p className="text-blue-100 text-sm">Office of the Punong Barangay</p>
              </div>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="bg-blue-50 px-8 py-4 border-b border-blue-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
                <span className="font-semibold text-gray-900">Barangay Certification</span>
              </div>
              <span className="text-gray-500">Step 2 of 5</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Certification Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-visible">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white">Certification Details</h3>
            </div>
            <div className="p-8 space-y-6">
              {/* Hidden fields for PDF generation */}
              <input type="hidden" name="province" value={formData.province} />
              <input type="hidden" name="municipality" value={formData.municipality} />
              <input type="hidden" name="barangay" value={formData.barangay} />
              
              {/* Header Section */}
              <div className="text-center space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 tracking-wider">OFFICE OF THE PUNONG BARANGAY</h1>
                <h2 className="text-3xl font-bold text-blue-900 tracking-widest">CERTIFICATION</h2>
                <div className="border-t-2 border-blue-200 my-6"></div>
              </div>

            {/* Main Content */}
            <div className="space-y-8 mt-12">
              <h3 className="text-lg font-bold text-gray-900">TO WHOM IT MAY CONCERN:</h3>

              <div className="space-y-6 text-base leading-relaxed">
                <div className="flex flex-wrap items-center space-x-2">
                  <span className="text-gray-700">THIS IS TO CERTIFY that</span>
                  <span className="border-b border-gray-400 py-1 px-2 flex-1 min-w-64 font-semibold">{formData.applicantName}</span>
                  <input type="hidden" name="applicantName" value={formData.applicantName} />
                  <span className="text-gray-700">is a resident of</span>
                </div>

                <div className="flex flex-wrap items-center space-x-2">
                  <span className="border-b border-gray-400 py-1 px-2 flex-1 min-w-80 font-semibold">{formData.residenceLocation}</span>
                  <input type="hidden" name="residenceLocation" value={formData.residenceLocation} />
                  {errors.residenceLocation && <p className="text-red-500 text-sm">{errors.residenceLocation}</p>}
                  <span className="text-gray-700">, Philippines.</span>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-gray-700">Certify</span>
                    <span className="text-gray-700">further</span>
                    <span className="text-gray-700">that</span>
                    <span className="text-gray-700">the</span>
                    <span className="text-gray-700">parent/s</span>
                    <span className="text-gray-700">and/or</span>
                    <span className="text-gray-700">ascendants</span>
                    <span className="text-gray-700">of</span>
                  </div>

                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="border-b border-gray-400 py-1 px-2 flex-1 min-w-80 font-semibold">{formData.parentAscendantName}</span>
                    <input type="hidden" name="parentAscendantName" value={formData.parentAscendantName} />
                    {errors.parentAscendantName && <p className="text-red-500 text-sm">{errors.parentAscendantName}</p>}
                    <span className="text-gray-700">belongs to</span>
                    <span className="border-b border-gray-400 py-1 px-2 w-32 font-semibold">{formData.iccGroup}</span>
                    <input type="hidden" name="iccGroup" value={formData.iccGroup} />
                    {errors.iccGroup && <p className="text-red-500 text-sm">{errors.iccGroup}</p>}
                    <span className="text-gray-700">ICCs/IPs</span>
                  </div>

                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-gray-700">and a resident of this barangay for more than</span>
                    <input
                      type="text"
                      name="residenceYears"
                      value={formData.residenceYears}
                      onChange={handleInputChange}
                      className={`border-b border-gray-400 focus:border-blue-500 outline-none py-1 px-2 w-24 ${errors.residenceYears ? 'border-red-500' : ''}`}
                      placeholder="years"
                    />
                    {errors.residenceYears && <p className="text-red-500 text-sm">{errors.residenceYears}</p>}
                    <span className="text-gray-700">years.</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700">
                    This certification is issued upon his/her request to support his/her application for the 
                    Certificate of Confirmation of IP Membership.
                  </p>

                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-gray-700">Issued this</span>
                    <span className="border-b border-gray-400 py-1 px-2 w-16 font-semibold">{formData.issuanceDay}</span>
                    <input type="hidden" name="issuanceDay" value={formData.issuanceDay} />
                    {errors.issuanceDay && <p className="text-red-500 text-sm">{errors.issuanceDay}</p>}
                    <span className="text-gray-700">of</span>
                    <span className="border-b border-gray-400 py-1 px-2 w-32 font-semibold">{formData.issuanceMonth}</span>
                    <input type="hidden" name="issuanceMonth" value={formData.issuanceMonth} />
                    {errors.issuanceMonth && <p className="text-red-500 text-sm">{errors.issuanceMonth}</p>}
                    <span className="text-gray-700">2024.</span>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="flex justify-end mt-16">
                <div className="text-center">
                  <input
                    type="text"
                    name="punongBarangaySignature"
                    value={formData.punongBarangaySignature}
                    onChange={handleInputChange}
                    className={`border-b border-gray-400 focus:border-blue-500 outline-none w-64 mb-2 text-center bg-transparent py-1 ${errors.punongBarangaySignature ? 'border-red-500' : ''}`}
                    placeholder=""
                  />
                  {errors.punongBarangaySignature && <p className="text-red-500 text-sm">{errors.punongBarangaySignature}</p>}
                  <p className="text-sm text-gray-700 font-medium">Punong Barangay</p>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center space-x-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all shadow-md hover:shadow-lg font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous Page</span>
            </button>
            
            <button
              type="submit"
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <span>Next: Tribal Certification</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CocFormPage2;
