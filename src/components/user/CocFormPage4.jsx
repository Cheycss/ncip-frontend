import React, { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, FileText, Users } from 'lucide-react'
import EditableDropdown from '../shared/EditableDropdown'
import DatePicker from '../shared/DatePicker'
import { saranganiData } from '../../utils/saranganiData'

const CocFormPage4 = ({ formData: initialFormData, updateFormData, onNext, onBack }) => {
  const [localFormData, setLocalFormData] = useState({
    ...initialFormData,
    page4: {
      province: 'SARANGANI',
      municipality: initialFormData.city || '',
      affiant1Name: '',
      affiant2Name: '',
      affiantsAddress: `${initialFormData.barangay || ''}, ${initialFormData.city || ''}, Sarangani Province`,
      affiantsAddress2: `${initialFormData.barangay || ''}, ${initialFormData.city || ''}, Sarangani Province`,
      subjectName: initialFormData.applicantSignature || initialFormData.fullName || initialFormData.name || '',
      spouseName: initialFormData.spouseName || '',
      coupleAddress: `${initialFormData.barangay || ''}, ${initialFormData.city || ''}, Sarangani Province`,
      childName: '',
      childBirthDate: '',
      childOrder: '',
      ipMemberName: initialFormData.applicantSignature || initialFormData.fullName || initialFormData.name || '',
      ipGroup: initialFormData.iccs || initialFormData.fatherTribe || '',
      fatherName: initialFormData.fatherName || initialFormData.father || initialFormData.parentNames || '',
      motherName: initialFormData.motherName || initialFormData.mother || initialFormData.parentNames2 || '',
      parentsIpGroup1: initialFormData.fatherTribe || initialFormData.iccGroup1 || initialFormData.iccs || '',
      parentsIpGroup2: initialFormData.motherTribe || initialFormData.iccGroup2 || initialFormData.iccs || '',
      membershipSubject: initialFormData.applicantSignature || initialFormData.fullName || initialFormData.name || '',
      signatureDay: new Date().getDate().toString(),
      signatureMonth: new Date().toLocaleString('default', { month: 'long' }),
      signatureYear: '2024',
      affiant1TaxCert: '',
      affiant1IssuedOn: '',
      affiant1IssuedAt: '',
      affiant2TaxCert: '',
      affiant2IssuedOn: '',
      affiant2IssuedAt: '',
      notaryDay: '',
      notaryMonth: '',
      notaryYear: '',
      notaryLocation: '',
      ...initialFormData.page4
    }
  })
  const [errors, setErrors] = useState({})

  // Auto-update when initialFormData changes
  useEffect(() => {
    setLocalFormData(prev => ({
      ...prev,
      page4: {
        ...prev.page4,
        municipality: initialFormData.city || prev.page4.municipality || '',
        affiantsAddress: `${initialFormData.barangay || ''}, ${initialFormData.city || ''}, Sarangani Province`,
        affiantsAddress2: `${initialFormData.barangay || ''}, ${initialFormData.city || ''}, Sarangani Province`,
        subjectName: initialFormData.applicantSignature || initialFormData.fullName || initialFormData.name || prev.page4.subjectName || '',
        spouseName: initialFormData.spouseName || prev.page4.spouseName || '',
        coupleAddress: `${initialFormData.barangay || ''}, ${initialFormData.city || ''}, Sarangani Province`,
        ipMemberName: initialFormData.applicantSignature || initialFormData.fullName || initialFormData.name || prev.page4.ipMemberName || '',
        ipGroup: initialFormData.iccs || initialFormData.fatherTribe || prev.page4.ipGroup || '',
        fatherName: initialFormData.fatherName || initialFormData.father || initialFormData.parentNames || prev.page4.fatherName || '',
        motherName: initialFormData.motherName || initialFormData.mother || initialFormData.parentNames2 || prev.page4.motherName || '',
        parentsIpGroup1: initialFormData.fatherTribe || initialFormData.iccGroup1 || initialFormData.iccs || prev.page4.parentsIpGroup1 || '',
        parentsIpGroup2: initialFormData.motherTribe || initialFormData.iccGroup2 || initialFormData.iccs || prev.page4.parentsIpGroup2 || '',
        membershipSubject: initialFormData.applicantSignature || initialFormData.fullName || initialFormData.name || prev.page4.membershipSubject || ''
      }
    }));
  }, [initialFormData]);

  const handleInputChange = (field, value) => {
    setLocalFormData(prev => ({
      ...prev,
      page4: {
        ...prev.page4,
        [field]: value
      }
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    // For demo purposes, always return true (no validation required)
    console.log('Demo mode: Skipping Joint Affidavit validation for easier demo')
    setErrors({})
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Page 4 - Form submitted:', localFormData);
    console.log('Page 4 - Calling onNext...');
    
    // Skip validation - always proceed
    if (updateFormData && typeof updateFormData === 'function') {
      updateFormData(localFormData);
    }
    
    if (onNext && typeof onNext === 'function') {
      onNext(localFormData);
    } else {
      console.error('onNext is not a function:', onNext);
    }
  };

  const page4Data = localFormData.page4 || {}

  // Dropdown options for addresses and common fields
  const addressOptions = [
    `${initialFormData.barangay || 'Poblacion'}, ${initialFormData.city || 'Alabel'}, Sarangani Province`,
    'Poblacion, Alabel, Sarangani Province',
    'Bagacay, Alabel, Sarangani Province',
    'Alegria, Alabel, Sarangani Province',
    'Poblacion, Glan, Sarangani Province',
    'Poblacion, Kiamba, Sarangani Province',
    'Poblacion, Maasim, Sarangani Province',
    'Poblacion, Maitum, Sarangani Province',
    'Poblacion, Malapatan, Sarangani Province',
    'Poblacion, Malungon, Sarangani Province'
  ]

  const ipGroupOptions = [
    initialFormData.fatherTribe || 'Blaan',
    initialFormData.motherTribe || 'Blaan',
    'Blaan',
    'Tboli',
    'Tagakaulo',
    'Manobo',
    'Higaonon',
    'Bisaya'
  ]

  const childOrderOptions = [
    '1st',
    '2nd', 
    '3rd',
    '4th',
    '5th',
    'eldest',
    'youngest',
    'only'
  ]

  const handleDropdownChange = (field, value) => {
    handleInputChange(field, value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Hidden fields for PDF generation */}
        <input type="hidden" name="province" value={page4Data.province} />
        <input type="hidden" name="municipality" value={page4Data.municipality} />
        
        {/* Modern Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center justify-center gap-6">
              <img 
                src="/NCIPLogo.png" 
                alt="NCIP Logo" 
                className="w-20 h-20 bg-white rounded-full p-2 shadow-lg"
              />
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-1">Joint Affidavit</h1>
                <p className="text-blue-100 text-sm">Two Disinterested Persons</p>
              </div>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="bg-blue-50 px-8 py-4 border-b border-blue-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">4</div>
                <span className="font-semibold text-gray-900">Joint Affidavit</span>
              </div>
              <span className="text-gray-500">Step 4 of 5</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Affiants Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Affiants Information
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-sm text-gray-600 italic mb-4">
                Information about the two disinterested persons making this affidavit
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Affiant Name *</label>
                  <input
                    type="text"
                    value={page4Data.affiant1Name || ''}
                    onChange={(e) => handleInputChange('affiant1Name', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none py-3 px-4 font-medium"
                    placeholder="Enter first affiant name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Second Affiant Name *</label>
                  <input
                    type="text"
                    value={page4Data.affiant2Name || ''}
                    onChange={(e) => handleInputChange('affiant2Name', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none py-3 px-4 font-medium"
                    placeholder="Enter second affiant name"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Legal Declaration:</span> Both affiants are of legal age, Filipino citizens, and bonafide residents of their respective addresses.
                </p>
              </div>
            </div>
          </div>

          {/* Subject & Spouse Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Subject & Spouse Information
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Auto-filled:</span> Information below is automatically filled from your Page 1 data.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Name</label>
                  <div className="w-full border-2 border-gray-200 rounded-lg bg-gray-50 py-3 px-4 font-semibold text-blue-900">
                    {page4Data.subjectName || initialFormData.name || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Spouse Name</label>
                  <div className="w-full border-2 border-gray-200 rounded-lg bg-gray-50 py-3 px-4 font-semibold text-blue-900">
                    {page4Data.spouseName || initialFormData.spouseName || 'N/A'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Couple's Address</label>
                <div className="w-full border-2 border-gray-200 rounded-lg bg-gray-50 py-3 px-4 font-semibold text-blue-900">
                  {page4Data.coupleAddress || `${initialFormData.barangay}, ${initialFormData.city}, Sarangani Province` || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Child Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Child Information
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Child's Full Name</label>
                  <input
                    type="text"
                    value={page4Data.childName || ''}
                    onChange={(e) => handleInputChange('childName', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none py-3 px-4 font-medium"
                    placeholder="Enter child's full name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <DatePicker
                      name="childBirthDate"
                      value={page4Data.childBirthDate || ''}
                      onChange={(e) => handleInputChange('childBirthDate', e.target.value)}
                      label="Child's Birth Date"
                      placeholder="MM/DD/YYYY"
                      error={!!errors.childBirthDate}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Order</label>
                    <EditableDropdown
                      name="childOrder"
                      value={page4Data.childOrder || ''}
                      onChange={(e) => handleDropdownChange('childOrder', e.target.value)}
                      options={childOrderOptions}
                      placeholder="Select birth order (1st, 2nd, etc.)"
                      error={!!errors.childOrder}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* IP Membership Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Indigenous Peoples Membership
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Auto-filled:</span> IP membership details from Page 1.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">IP Member Name</label>
                  <div className="w-full border-2 border-gray-200 rounded-lg bg-gray-50 py-3 px-4 font-semibold text-blue-900">
                    {page4Data.ipMemberName || initialFormData.name || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">IP Group/Tribe</label>
                  <div className="w-full border-2 border-gray-200 rounded-lg bg-gray-50 py-3 px-4 font-semibold text-blue-900">
                    {page4Data.ipGroup || initialFormData.iccs || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Father's Name</label>
                  <div className="w-full border-2 border-gray-200 rounded-lg bg-gray-50 py-3 px-4 font-semibold text-blue-900">
                    {page4Data.fatherName || initialFormData.fatherName || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Father's Tribe</label>
                  <div className="w-full border-2 border-gray-200 rounded-lg bg-gray-50 py-3 px-4 font-semibold text-blue-900">
                    {page4Data.parentsIpGroup1 || initialFormData.fatherTribe || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mother's Name</label>
                  <div className="w-full border-2 border-gray-200 rounded-lg bg-gray-50 py-3 px-4 font-semibold text-blue-900">
                    {page4Data.motherName || initialFormData.motherName || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mother's Tribe</label>
                  <div className="w-full border-2 border-gray-200 rounded-lg bg-gray-50 py-3 px-4 font-semibold text-blue-900">
                    {page4Data.parentsIpGroup2 || initialFormData.motherTribe || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Declaration Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h3 className="text-lg font-bold text-white">Affidavit Declaration</h3>
            </div>
            <div className="p-8">
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                <p className="text-gray-800 leading-relaxed">
                  We are executing this Joint Affidavit to establish the fact and truth surrounding the Indigenous Peoples membership of <span className="font-bold text-blue-900">{page4Data.membershipSubject || initialFormData.name || '_______________'}</span>.
                </p>
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
              <span>Previous: Tribal Certification</span>
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <span>Next: Genealogy</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CocFormPage4
