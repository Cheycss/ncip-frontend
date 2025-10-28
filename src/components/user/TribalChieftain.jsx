import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const TribalChieftain = ({ service, onBack, onNext, currentStep }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    applicantName: '',
    belongingTo: '',
    parents: '',
    andParents: '',
    beingMembersOf: '',
    andMembers: '',
    parentAscendants: '',
    certificationPurpose: '',
    issuedDay: '',
    issuedMonth: '',
    ipsHeadName: '',
    barangayIpmr: '',
    municipalTribalChieftain: ''
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
    // Save form data to localStorage
    const applications = JSON.parse(localStorage.getItem('ncip_applications') || '[]');
    const newApplication = {
      id: Date.now().toString(),
      userId: 'user', // This should come from auth context
      type: 'Certificate of Confirmation',
      purpose: service?.purpose || 'General',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      formData: formData,
      pageStatuses: {
        tribal_chieftain: 'completed',
        barangay_clearance: 'pending',
        municipal_clearance: 'pending',
        documents: 'pending'
      }
    };
    
    applications.push(newApplication);
    localStorage.setItem('ncip_applications', JSON.stringify(applications));
    
    // Call onNext to proceed to next step
    if (onNext) {
      onNext();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack(); // Use the onBack prop to return to Apply component
    } else {
      navigate('/dashboard?section=apply'); // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <button
          onClick={handleBack}
          className="inline-flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-lg mb-6 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg border border-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base">← Back to Apply</span>
        </button>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">OFFICE OF THE TRIBAL CHIEFTAIN</h1>
            <p className="text-blue-100 text-base font-medium">
              Certificate of Confirmation (COC) Application Form
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {/* Document Header */}
          <div className="text-center border-b border-gray-200 pb-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900">CERTIFICATION</h3>
          </div>

          {/* Form Content */}
          <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="text-gray-700 px-8 md:px-12 lg:px-16">
              <p className="mb-8 font-semibold text-lg">TO WHOM IT MAY CONCERN:</p>
              
              <div className="space-y-6 leading-loose text-base">
                <div className="flex flex-wrap items-center gap-4 py-2">
                  <span className="mr-3">THIS IS TO CERTIFY that</span>
                  <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleInputChange}
                    className="border-b-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 min-w-[220px] bg-transparent flex-grow font-medium mx-3"
                    placeholder="Full Name"
                    required
                  />
                  <span className="ml-3">of</span>
                  <input
                    type="text"
                    name="belongingTo"
                    value={formData.belongingTo}
                    onChange={handleInputChange}
                    className="border-b-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 min-w-[220px] bg-transparent flex-grow font-medium mx-3"
                    placeholder="Address/Location"
                    required
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 py-2">
                  <span className="mr-3">belonging to the</span>
                  <input
                    type="text"
                    name="indigenousGroup"
                    value={formData.indigenousGroup}
                    onChange={handleInputChange}
                    className="border-b-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 min-w-[180px] bg-transparent flex-grow font-medium mx-3"
                    placeholder="Indigenous Group"
                    required
                  />
                  <span className="ml-3">Indigenous Cultural Communities (ICCs). His/her</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 py-2">
                  <span className="mr-3">parents</span>
                  <input
                    type="text"
                    name="parents"
                    value={formData.parents}
                    onChange={handleInputChange}
                    className="border-b-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 min-w-[180px] bg-transparent flex-grow font-medium mx-3"
                    placeholder="Father's Name"
                    required
                  />
                  <span className="mx-4">and</span>
                  <input
                    type="text"
                    name="andParents"
                    value={formData.andParents}
                    onChange={handleInputChange}
                    className="border-b-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 min-w-[180px] bg-transparent flex-grow font-medium mx-3"
                    placeholder="Mother's Name"
                    required
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 py-2">
                  <span className="mr-3">being members of the</span>
                  <input
                    type="text"
                    name="beingMembersOf"
                    value={formData.beingMembersOf}
                    onChange={handleInputChange}
                    className="border-b-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 min-w-[180px] bg-transparent flex-grow font-medium mx-3"
                    placeholder="Tribe/Community Name"
                    required
                  />
                  <span className="mx-4">and</span>
                  <input
                    type="text"
                    name="andMembers"
                    value={formData.andMembers}
                    onChange={handleInputChange}
                    className="border-b-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 min-w-[180px] bg-transparent flex-grow font-medium mx-3"
                    placeholder="Additional Community"
                  />
                  <span className="ml-3">ICCs, respectively.</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 py-2">
                  <span className="mr-3">Certify further that the parent/s and or ascendants of</span>
                  <input
                    type="text"
                    name="parentAscendants"
                    value={formData.parentAscendants}
                    onChange={handleInputChange}
                    className="border-b-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 min-w-[220px] bg-transparent flex-grow font-medium mx-3"
                    placeholder="Applicant Name"
                    required
                  />
                  <span className="ml-3">are original residents of this place.</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 py-2">
                  <span className="mr-3">This certification is issued for</span>
                  <input
                    type="text"
                    name="certificationPurpose"
                    value={formData.certificationPurpose}
                    onChange={handleInputChange}
                    className="border-b-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 min-w-[220px] bg-transparent flex-grow font-medium mx-3"
                    placeholder="Purpose (e.g., scholarship, employment)"
                    required
                  />
                  <span className="ml-3">purpose.</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 py-3 mt-8">
                  <span className="mr-3">Issued this</span>
                  <input
                    type="text"
                    name="issuedDay"
                    value={formData.issuedDay}
                    onChange={handleInputChange}
                    className="border-b-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 w-20 bg-transparent text-center font-medium mx-3"
                    placeholder="Day"
                    required
                  />
                  <span className="mx-4">of</span>
                  <input
                    type="text"
                    name="issuedMonth"
                    value={formData.issuedMonth}
                    onChange={handleInputChange}
                    className="border-b-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 min-w-[140px] bg-transparent flex-grow font-medium mx-3"
                    placeholder="Month"
                    required
                  />
                  <span className="mx-4">2024.</span>
                </div>
              </div>

              {/* Signature Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-gray-200">
                <div className="text-center">
                  <input
                    type="text"
                    name="ipsHeadName"
                    value={formData.ipsHeadName}
                    onChange={handleInputChange}
                    className="w-full text-center border-b-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 bg-transparent font-medium mb-2"
                    placeholder="IPS Head/Tribal Chieftain Name"
                  />
                  <p className="text-sm text-gray-600 mt-3">IPS Head/Tribal Chieftain</p>
                </div>

                <div className="text-center">
                  <input
                    type="text"
                    name="barangayIpmr"
                    value={formData.barangayIpmr}
                    onChange={handleInputChange}
                    className="w-full text-center border-b-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 bg-transparent font-medium mb-2"
                    placeholder="Barangay IPMR Name"
                  />
                  <p className="text-sm text-gray-600 mt-3">Barangay IPMR</p>
                </div>

                <div className="text-center">
                  <input
                    type="text"
                    name="municipalTribalChieftain"
                    value={formData.municipalTribalChieftain}
                    onChange={handleInputChange}
                    className="w-full text-center border-b-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 bg-transparent font-medium mb-2"
                    placeholder="Municipal Tribal Chieftain Name"
                  />
                  <p className="text-sm text-gray-600 mt-3">Municipal Tribal Chieftain</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TribalChieftain;
