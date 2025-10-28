import React, { useState } from 'react'
import { Users, Check, User, X } from 'lucide-react'

const GenealogySearch = ({ onGenealogyFound }) => {
  // Common indigenous ethnicities in Sarangani Province
  const ethnicityOptions = [
    'Blaan',
    'Tboli',
    'Manobo',
    'Tagakaulo',
   
  ]

  const [manualFormData, setManualFormData] = useState({
    // Applicant (Generation 5 - Current)
    applicant_first_name: '',
    applicant_middle_name: '',
    applicant_last_name: '',
    applicant_ethnicity: '',
    
    // Parents (Generation 4)
    father_first_name: '',
    father_middle_name: '',
    father_last_name: '',
    father_ethnicity: '',
    mother_first_name: '',
    mother_middle_name: '',
    mother_last_name: '',
    mother_ethnicity: '',
    
    // Paternal Grandparents (Generation 3)
    paternal_grandfather_first_name: '',
    paternal_grandfather_last_name: '',
    paternal_grandfather_ethnicity: '',
    paternal_grandmother_first_name: '',
    paternal_grandmother_last_name: '',
    paternal_grandmother_ethnicity: '',
    
    // Maternal Grandparents (Generation 3)
    maternal_grandfather_first_name: '',
    maternal_grandfather_last_name: '',
    maternal_grandfather_ethnicity: '',
    maternal_grandmother_first_name: '',
    maternal_grandmother_last_name: '',
    maternal_grandmother_ethnicity: ''
  })

  const handleManualEntrySubmit = async () => {
    // Validate required fields
    if (!manualFormData.applicant_first_name || !manualFormData.applicant_last_name) {
      alert('Please fill in your name (First and Last name required)')
      return
    }

    try {
      // Create full names
      const applicantFullName = `${manualFormData.applicant_first_name} ${manualFormData.applicant_middle_name} ${manualFormData.applicant_last_name}`.trim()
      const fatherFullName = `${manualFormData.father_first_name} ${manualFormData.father_middle_name} ${manualFormData.father_last_name}`.trim()
      const motherFullName = `${manualFormData.mother_first_name} ${manualFormData.mother_middle_name} ${manualFormData.mother_last_name}`.trim()
      const paternalGFFullName = `${manualFormData.paternal_grandfather_first_name} ${manualFormData.paternal_grandfather_last_name}`.trim()
      const paternalGMFullName = `${manualFormData.paternal_grandmother_first_name} ${manualFormData.paternal_grandmother_last_name}`.trim()
      const maternalGFFullName = `${manualFormData.maternal_grandfather_first_name} ${manualFormData.maternal_grandfather_last_name}`.trim()
      const maternalGMFullName = `${manualFormData.maternal_grandmother_first_name} ${manualFormData.maternal_grandmother_last_name}`.trim()

      // Prepare genealogy data
      const genealogyData = {
        full_name: applicantFullName,
        first_name: manualFormData.applicant_first_name,
        middle_name: manualFormData.applicant_middle_name,
        last_name: manualFormData.applicant_last_name,
        ethnicity: manualFormData.applicant_ethnicity,
        generation_level: 5,
        
        // Parent names for display
        father_name: fatherFullName,
        mother_name: motherFullName,
        
        // Grandparent names for display
        paternal_grandfather_name: paternalGFFullName,
        paternal_grandmother_name: paternalGMFullName,
        maternal_grandfather_name: maternalGFFullName,
        maternal_grandmother_name: maternalGMFullName,
        
        // Mark as manually entered
        manually_entered: true
      }

      alert('Genealogy information saved!')
      onGenealogyFound(genealogyData)
      
    } catch (error) {
      console.error('Error saving manual entry:', error)
      alert('Failed to save genealogy information')
    }
  }

  return (
    <div className="space-y-6">
      {/* Modern Header Card */}
      <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-xl font-bold text-white">Genealogy Information</h3>
              <p className="text-sm text-blue-100">(3rd Generation - Manual Entry)</p>
            </div>
          </div>
        </div>

        {/* Instructions Box - Keep Green */}
        <div className="p-6">
          <div className="bg-green-50 border-l-4 border-green-600 rounded-lg p-4">
            <p className="text-sm text-green-900">
              <strong>Instructions:</strong> Fill in your complete name, your parents' names, and your grandparents' names (3rd Generation). This helps us verify your indigenous ancestry.
            </p>
          </div>
        </div>
      </div>

      {/* Manual Entry Form */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
        <div className="space-y-6">

        {/* Your Information (Generation 5) */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Your Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                value={manualFormData.applicant_first_name}
                onChange={(e) => setManualFormData({...manualFormData, applicant_first_name: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Juan"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
              <input
                type="text"
                value={manualFormData.applicant_middle_name}
                onChange={(e) => setManualFormData({...manualFormData, applicant_middle_name: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Santos"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                value={manualFormData.applicant_last_name}
                onChange={(e) => setManualFormData({...manualFormData, applicant_last_name: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dela Cruz"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ethnicity/Tribe</label>
              <input
                type="text"
                list="ethnicity-options"
                value={manualFormData.applicant_ethnicity}
                onChange={(e) => setManualFormData({...manualFormData, applicant_ethnicity: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Select or type ethnicity/tribe"
              />
              <datalist id="ethnicity-options">
                {ethnicityOptions.map((ethnicity) => (
                  <option key={ethnicity} value={ethnicity} />
                ))}
              </datalist>
            </div>
          </div>
        </div>

        {/* Parents (Generation 4) */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Your Parents
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Father */}
            <div className="space-y-3">
              <p className="font-semibold text-gray-700">Father</p>
              <input
                type="text"
                value={manualFormData.father_first_name}
                onChange={(e) => setManualFormData({...manualFormData, father_first_name: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="First Name"
              />
              <input
                type="text"
                value={manualFormData.father_middle_name}
                onChange={(e) => setManualFormData({...manualFormData, father_middle_name: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Middle Name"
              />
              <input
                type="text"
                value={manualFormData.father_last_name}
                onChange={(e) => setManualFormData({...manualFormData, father_last_name: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Last Name"
              />
              <input
                type="text"
                list="ethnicity-options"
                value={manualFormData.father_ethnicity}
                onChange={(e) => setManualFormData({...manualFormData, father_ethnicity: e.target.value})}
                className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                placeholder="Select or type ethnicity/tribe"
              />
            </div>

            {/* Mother */}
            <div className="space-y-3">
              <p className="font-semibold text-gray-700">Mother <span className="text-xs text-gray-500">(Maiden Name)</span></p>
              <input
                type="text"
                value={manualFormData.mother_first_name}
                onChange={(e) => setManualFormData({...manualFormData, mother_first_name: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="First Name"
              />
              <input
                type="text"
                value={manualFormData.mother_middle_name}
                onChange={(e) => setManualFormData({...manualFormData, mother_middle_name: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Middle Name"
              />
              <input
                type="text"
                value={manualFormData.mother_last_name}
                onChange={(e) => setManualFormData({...manualFormData, mother_last_name: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Maiden Last Name"
              />
              <input
                type="text"
                list="ethnicity-options"
                value={manualFormData.mother_ethnicity}
                onChange={(e) => setManualFormData({...manualFormData, mother_ethnicity: e.target.value})}
                className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                placeholder="Select or type ethnicity/tribe"
              />
            </div>
          </div>
        </div>

        {/* Grandparents (Generation 3) */}
        <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-5 border-2 border-blue-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Your Grandparents (3rd Generation)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Paternal Grandparents */}
            <div className="space-y-4">
              <p className="font-semibold text-gray-700 border-b pb-2">Paternal (Father's Side)</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Grandfather</label>
                  <input
                    type="text"
                    value={manualFormData.paternal_grandfather_first_name}
                    onChange={(e) => setManualFormData({...manualFormData, paternal_grandfather_first_name: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={manualFormData.paternal_grandfather_last_name}
                    onChange={(e) => setManualFormData({...manualFormData, paternal_grandfather_last_name: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mt-2"
                    placeholder="Last Name"
                  />
                  <input
                    type="text"
                    list="ethnicity-options"
                    value={manualFormData.paternal_grandfather_ethnicity}
                    onChange={(e) => setManualFormData({...manualFormData, paternal_grandfather_ethnicity: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mt-2 bg-blue-50"
                    placeholder="Select or type ethnicity/tribe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Grandmother</label>
                  <input
                    type="text"
                    value={manualFormData.paternal_grandmother_first_name}
                    onChange={(e) => setManualFormData({...manualFormData, paternal_grandmother_first_name: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={manualFormData.paternal_grandmother_last_name}
                    onChange={(e) => setManualFormData({...manualFormData, paternal_grandmother_last_name: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mt-2"
                    placeholder="Last Name"
                  />
                  <input
                    type="text"
                    list="ethnicity-options"
                    value={manualFormData.paternal_grandmother_ethnicity}
                    onChange={(e) => setManualFormData({...manualFormData, paternal_grandmother_ethnicity: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mt-2 bg-blue-50"
                    placeholder="Select or type ethnicity/tribe"
                  />
                </div>
              </div>
            </div>

            {/* Maternal Grandparents */}
            <div className="space-y-4">
              <p className="font-semibold text-gray-700 border-b pb-2">Maternal (Mother's Side) <span className="text-xs text-gray-500 font-normal">- Mother's Parents</span></p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Grandfather <span className="text-gray-400">(Mother's Father)</span></label>
                  <input
                    type="text"
                    value={manualFormData.maternal_grandfather_first_name}
                    onChange={(e) => setManualFormData({...manualFormData, maternal_grandfather_first_name: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={manualFormData.maternal_grandfather_last_name}
                    onChange={(e) => setManualFormData({...manualFormData, maternal_grandfather_last_name: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mt-2"
                    placeholder="Last Name"
                  />
                  <input
                    type="text"
                    list="ethnicity-options"
                    value={manualFormData.maternal_grandfather_ethnicity}
                    onChange={(e) => setManualFormData({...manualFormData, maternal_grandfather_ethnicity: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mt-2 bg-blue-50"
                    placeholder="Select or type ethnicity/tribe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Grandmother <span className="text-gray-400">(Mother's Mother - Maiden Name)</span></label>
                  <input
                    type="text"
                    value={manualFormData.maternal_grandmother_first_name}
                    onChange={(e) => setManualFormData({...manualFormData, maternal_grandmother_first_name: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={manualFormData.maternal_grandmother_last_name}
                    onChange={(e) => setManualFormData({...manualFormData, maternal_grandmother_last_name: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mt-2"
                    placeholder="Maiden Last Name"
                  />
                  <input
                    type="text"
                    list="ethnicity-options"
                    value={manualFormData.maternal_grandmother_ethnicity}
                    onChange={(e) => setManualFormData({...manualFormData, maternal_grandmother_ethnicity: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mt-2 bg-blue-50"
                    placeholder="Select or type ethnicity/tribe"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            onClick={handleManualEntrySubmit}
            disabled={!manualFormData.applicant_first_name || !manualFormData.applicant_last_name}
            className={`w-full py-4 px-6 rounded-xl transition-all font-bold text-lg shadow-lg ${
              manualFormData.applicant_first_name && manualFormData.applicant_last_name
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-6 h-6 inline mr-2" />
            Save Genealogy Information & Continue
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}

export default GenealogySearch
