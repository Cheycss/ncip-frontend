import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, User, GraduationCap } from 'lucide-react';
import { saranganiCities, saranganiBarangays, getIndigenousTribes, addNewTribe, civilStatusOptions, educationalAttainmentOptions, getCommonDegrees, addNewDegree, getPhilippinesProvinces, addNewProvince } from '../../utils/saranganiData';
import EditableDropdown from '../shared/EditableDropdown';
import DatePicker from '../shared/DatePicker';

const CocFormPage1 = ({ formData: initialFormData, onNext, onBack, selectedPurpose }) => {
  const [errors, setErrors] = useState({});
  const [tribes, setTribes] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [formData, setFormData] = useState({
    // Personal Index
    firstName: '',
    middleName: '',
    lastName: '',
    name: '', // Full name (auto-generated)
    city: '',
    barangay: '',
    placeOfOrigin: '',
    placeOfBirth: '',
    dateOfBirth: '',
    civilStatus: '',
    iccs: '',
    spouseName: '',
    
    // Educational Background
    highestEducation: '',
    degreeObtained: '',
    
    // Parental Background - Father
    fatherName: '',
    fatherAddress: '',
    fatherTribe: '',
    fatherGrandfather: '',
    fatherGrandmother: '',
    fatherTribeGrandparents: '',
    
    // Parental Background - Mother
    motherName: '',
    motherAddress: '',
    motherTribe: '',
    motherGrandfather: '',
    motherGrandmother: '',
    motherTribeGrandparents: '',
    
    // Land Matter Section (only if Land Matter is selected)
    homesteadNo: '',
    lotNo: '',
    dateOfIssuance: '',
    area: '',
    location: '',
    
    // Signature
    applicantSignature: '',
    ...initialFormData
  });

  useEffect(() => {
    setTribes(getIndigenousTribes());
    setDegrees(getCommonDegrees());
    setProvinces(getPhilippinesProvinces());
  }, []);

  // Auto-generate full name from first, middle, last
  useEffect(() => {
    const fullName = [formData.firstName, formData.middleName, formData.lastName]
      .filter(Boolean)
      .join(' ');
    if (fullName && fullName !== formData.name) {
      setFormData(prev => ({ ...prev, name: fullName }));
    }
  }, [formData.firstName, formData.middleName, formData.lastName]);

  const handleAddNewTribe = (tribeName) => {
    addNewTribe(tribeName);
    setTribes(getIndigenousTribes());
  };

  const handleAddNewDegree = (degreeName) => {
    addNewDegree(degreeName);
    setDegrees(getCommonDegrees());
  };

  const handleAddNewProvince = (provinceName) => {
    addNewProvince(provinceName);
    setProvinces(getPhilippinesProvinces());
  };

  const handleAddNewCity = (cityName) => {
    // For place of birth, we can add cities to localStorage for future use
    const existingCities = JSON.parse(localStorage.getItem('ncip_birth_cities') || '[]');
    if (!existingCities.includes(cityName)) {
      existingCities.push(cityName);
      localStorage.setItem('ncip_birth_cities', JSON.stringify(existingCities));
    }
  };

  const validateForm = () => {
    // Demo mode: Skip all validation for easier demo
    console.log('Demo mode: Skipping CocFormPage1 validation for easier demo');
    setErrors({});
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Page 1 - Form submitted:', formData);
    console.log('Page 1 - Calling onNext...');
    
    // Skip validation for now - always proceed
    if (onNext && typeof onNext === 'function') {
      onNext(formData);
    } else {
      console.error('onNext is not a function:', onNext);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If changing educational attainment, auto-clear degree if not applicable
    if (name === 'highestEducation') {
      const noDegreeEducation = [
        'Elementary Graduate',
        'Elementary Undergraduate',
        'High School Graduate',
        'High School Undergraduate',
        'Senior High School Graduate',
        'Senior High School Undergraduate',
        'No Formal Education'
      ];
      
      if (noDegreeEducation.includes(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          degreeObtained: 'N/A' // Auto-set to N/A
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          degreeObtained: '' // Clear for college/vocational/masters/doctorate
        }));
      }
    } 
    // If changing civil status, auto-clear spouse name if not married
    else if (name === 'civilStatus') {
      if (value !== 'Married') {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          spouseName: '' // Clear spouse name if not married
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } 
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
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
                <h1 className="text-2xl font-bold mb-1">Certificate of Confirmation</h1>
                <p className="text-blue-100 text-sm">Personal Information Form</p>
              </div>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="bg-blue-50 px-8 py-4 border-b border-blue-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                <span className="font-semibold text-gray-900">Personal Details</span>
              </div>
              <span className="text-gray-500">Step 1 of 5</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-visible">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-sm text-gray-600 mb-4 italic">Please print all entries legibly</p>
              <div className="space-y-4">
                {/* Name Fields - First, Middle, Last */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 ${errors.firstName ? 'border-red-500' : ''}`}
                      placeholder="Juan"
                    />
                    {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2"
                      placeholder="Santos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 ${errors.lastName ? 'border-red-500' : ''}`}
                      placeholder="Dela Cruz"
                    />
                    {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Full Name Display (Read-only) */}
                {formData.name && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                    <p className="text-sm text-gray-600">Complete Name:</p>
                    <p className="text-lg font-bold text-blue-900">{formData.name}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">City/Municipality</label>
                    <EditableDropdown
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      options={saranganiCities}
                      onAddNew={(newCity) => {
                        // Allow custom city entry
                        handleInputChange({ target: { name: 'city', value: newCity } });
                      }}
                      placeholder="Select or type city/municipality..."
                      error={!!errors.city}
                    />
                    {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Barangay</label>
                    <EditableDropdown
                      name="barangay"
                      value={formData.barangay}
                      onChange={handleInputChange}
                      options={formData.city ? saranganiBarangays[formData.city] || [] : []}
                      onAddNew={(newBarangay) => {
                        // Allow custom barangay entry
                        handleInputChange({ target: { name: 'barangay', value: newBarangay } });
                      }}
                      placeholder={!formData.city ? 'Select City/Municipality first' : 'Enter your barangay'}
                      error={!!errors.barangay}
                      disabled={!formData.city}
                    />
                    {errors.barangay && <p className="text-sm text-red-500 mt-1">{errors.barangay}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Place of Origin</label>
                  <EditableDropdown
                    name="placeOfOrigin"
                    value={formData.placeOfOrigin}
                    onChange={handleInputChange}
                    options={[...saranganiCities, 'General Santos City (GenSan)', 'Koronadal City', 'Tacurong City', 'Kidapawan City']}
                    onAddNew={handleAddNewCity}
                    placeholder="Select or type place of origin..."
                    error={!!errors.placeOfOrigin}
                  />
                  {errors.placeOfOrigin && <p className="text-sm text-red-500 mt-1">{errors.placeOfOrigin}</p>}
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Place of Birth</label>
                  <EditableDropdown
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleInputChange}
                    options={[...saranganiCities, 'General Santos City (GenSan)', 'Koronadal City', 'Tacurong City', 'Kidapawan City']}
                    onAddNew={handleAddNewCity}
                    placeholder="Select or type place of birth..."
                    error={!!errors.placeOfBirth}
                  />
                  {errors.placeOfBirth && <p className="text-sm text-red-500 mt-1">{errors.placeOfBirth}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <DatePicker
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      label="Date of Birth"
                      required
                      error={!!errors.dateOfBirth}
                      maxDate={new Date().toISOString().split('T')[0]}
                    />
                    {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Civil Status *</label>
                    <select
                      name="civilStatus"
                      value={formData.civilStatus}
                      onChange={handleInputChange}
                      className={`w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none py-3 px-4 bg-white hover:border-blue-400 transition-all cursor-pointer font-medium ${errors.civilStatus ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select Civil Status</option>
                      {civilStatusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    {errors.civilStatus && <p className="text-sm text-red-500 mt-1">{errors.civilStatus}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-1">ICCs/Tribe</label>
                  <EditableDropdown
                    name="iccs"
                    value={formData.iccs}
                    onChange={handleInputChange}
                    options={tribes}
                    onAddNew={handleAddNewTribe}
                    placeholder="Select or type tribe..."
                    error={!!errors.iccs}
                  />
                  {errors.iccs && <p className="text-sm text-red-500 mt-1">{errors.iccs}</p>}
                </div>
                
                {formData.civilStatus === 'Married' && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Spouse Name</label>
                    <input
                      type="text"
                      name="spouseName"
                      value={formData.spouseName}
                      onChange={handleInputChange}
                      className={`w-full border-b border-gray-300 focus:border-blue-500 outline-none py-2 ${errors.spouseName ? 'border-red-500' : ''}`}
                    />
                    {errors.spouseName && <p className="text-sm text-red-500 mt-1">{errors.spouseName}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Educational Background Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-visible">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Educational Background
              </h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Highest Educational Attainment *</label>
                  <select
                    name="highestEducation"
                    value={formData.highestEducation}
                    onChange={handleInputChange}
                    className={`w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none py-3 px-4 bg-white hover:border-blue-400 transition-all cursor-pointer font-medium ${errors.highestEducation ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select Educational Attainment</option>
                    {educationalAttainmentOptions.map(education => (
                      <option key={education} value={education}>{education}</option>
                    ))}
                  </select>
                  {errors.highestEducation && <p className="text-sm text-red-500 mt-1">{errors.highestEducation}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Degree Obtained</label>
                  <EditableDropdown
                    name="degreeObtained"
                    value={formData.degreeObtained}
                    onChange={handleInputChange}
                    options={degrees}
                    placeholder={
                      formData.degreeObtained === 'N/A' 
                        ? "N/A - No degree for this education level" 
                        : "Select or type degree obtained..."
                    }
                    disabled={formData.degreeObtained === 'N/A'}
                  />
                  {formData.degreeObtained === 'N/A' && (
                    <p className="text-xs text-gray-500 mt-1 italic">No degree applicable for this education level</p>
                  )}
                </div>
              </div>
            </div>
          </div>

            {/* Land Matter Section */}
            {selectedPurpose === 'landMatter' && (
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-6 pb-2 border-b-2 border-blue-200">IV. LAND MATTER INFORMATION</h3>
                <p className="text-sm text-gray-600 mb-4 italic">Fill up the following if purpose of certification is land matter</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Homestead/Free Patent No.</label>
                      <input
                        type="text"
                        name="homesteadNo"
                        value={formData.homesteadNo}
                        onChange={handleInputChange}
                        className={`w-full border-b border-gray-300 focus:border-blue-500 outline-none py-2 ${errors.homesteadNo ? 'border-red-500' : ''}`}
                      />
                      {errors.homesteadNo && <p className="text-sm text-red-500 mt-1">{errors.homesteadNo}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Lot No.</label>
                      <input
                        type="text"
                        name="lotNo"
                        value={formData.lotNo}
                        onChange={handleInputChange}
                        className={`w-full border-b border-gray-300 focus:border-blue-500 outline-none py-2 ${errors.lotNo ? 'border-red-500' : ''}`}
                      />
                      {errors.lotNo && <p className="text-sm text-red-500 mt-1">{errors.lotNo}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Date of Issuance</label>
                      <input
                        type="text"
                        name="dateOfIssuance"
                        value={formData.dateOfIssuance}
                        onChange={handleInputChange}
                        className={`w-full border-b border-gray-300 focus:border-blue-500 outline-none py-2 ${errors.dateOfIssuance ? 'border-red-500' : ''}`}
                      />
                      {errors.dateOfIssuance && <p className="text-sm text-red-500 mt-1">{errors.dateOfIssuance}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Area</label>
                      <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        className={`w-full border-b border-gray-300 focus:border-blue-500 outline-none py-2 ${errors.area ? 'border-red-500' : ''}`}
                      />
                      {errors.area && <p className="text-sm text-red-500 mt-1">{errors.area}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full border-b border-gray-300 focus:border-blue-500 outline-none py-2 ${errors.location ? 'border-red-500' : ''}`}
                    />
                    {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Declaration and Signature */}
            <div className="space-y-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                I declare under the penalties of perjury that the answers given are true and correct to the best of my 
                knowledge and belief, without prejudice to the right of the NCIP to revoke/cancel the issuance of this 
                certification.
              </p>
              
              <div className="text-center">
                <input
                  type="text"
                  name="applicantSignature"
                  value={formData.applicantSignature}
                  onChange={handleInputChange}
                  className={`w-80 mx-auto border-b border-gray-400 focus:border-blue-500 outline-none py-2 text-center bg-transparent ${errors.applicantSignature ? 'border-red-500' : ''}`}
                  placeholder="Signature"
                />
                {errors.applicantSignature && <p className="text-sm text-red-500 mt-1">{errors.applicantSignature}</p>}
                <p className="text-sm text-gray-600 mt-2">(Printed Name/Signature of Applicant)</p>
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
              <span>Back to Apply</span>
            </button>
            
            <button
              type="submit"
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <span>Next: Certifications</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CocFormPage1;
