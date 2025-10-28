import React, { useState, useEffect } from 'react'
import { FileText, Users, Search, ArrowRight, CheckCircle, AlertCircle, Clock, Plus } from 'lucide-react'
import GenealogySearch from '../shared/GenealogySearch'
import GenealogyForm from '../shared/GenealogyForm'

const EnhancedApply = ({ onNext }) => {
  const [selectedPurpose, setSelectedPurpose] = useState('')
  const [requirements, setRequirements] = useState([])
  const [showGenealogySearch, setShowGenealogySearch] = useState(false)
  const [showGenealogyForm, setShowGenealogyForm] = useState(false)
  const [selectedGenealogyRecord, setSelectedGenealogyRecord] = useState(null)
  const [prefilledData, setPrefilledData] = useState({})

  const purposes = [
    {
      id: 'employment',
      title: 'Employment',
      description: 'For job applications and employment verification',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      id: 'education',
      title: 'Educational',
      description: 'For school enrollment and scholarship applications',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    {
      id: 'business',
      title: 'Business',
      description: 'For business permits and commercial purposes',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    },
    {
      id: 'legal',
      title: 'Legal Proceedings',
      description: 'For court cases and legal documentation',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-red-50 border-red-200 text-red-800'
    },
    {
      id: 'government',
      title: 'Government Services',
      description: 'For government benefits and services',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    },
    {
      id: 'personal',
      title: 'Personal Use',
      description: 'For personal records and documentation',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-gray-50 border-gray-200 text-gray-800'
    }
  ]

  useEffect(() => {
    if (selectedPurpose) {
      loadRequirements()
    }
  }, [selectedPurpose])

  const loadRequirements = () => {
    try {
      const savedRequirements = JSON.parse(localStorage.getItem('ncip_document_requirements') || '[]')
      const cocRequirements = savedRequirements.filter(req => 
        req.service_type === 'Certificate of Confirmation' && req.is_active
      )
      setRequirements(cocRequirements)
    } catch (error) {
      console.error('Error loading requirements:', error)
      setRequirements([])
    }
  }

  const handleGenealogyFound = (genealogyRecord) => {
    setSelectedGenealogyRecord(genealogyRecord)
    
    // Pre-fill form data from genealogy record
    const prefilled = {
      name: genealogyRecord.full_name,
      fullName: genealogyRecord.full_name,
      applicantName: genealogyRecord.full_name,
      birthDate: genealogyRecord.birth_date,
      birthPlace: genealogyRecord.birth_place,
      civilStatus: genealogyRecord.civil_status,
      address: genealogyRecord.current_address,
      province: genealogyRecord.province || 'SARANGANI',
      city: genealogyRecord.municipality,
      municipality: genealogyRecord.municipality,
      barangay: genealogyRecord.barangay,
      tribe: genealogyRecord.tribe_affiliation,
      tribalAffiliation: genealogyRecord.tribe_affiliation,
      
      // Parent information
      fatherName: genealogyRecord.father_name,
      fatherTribe: genealogyRecord.father_tribe,
      fatherBirthPlace: genealogyRecord.father_birth_place,
      motherName: genealogyRecord.mother_name,
      motherTribe: genealogyRecord.mother_tribe,
      motherBirthPlace: genealogyRecord.mother_birth_place,
      
      // Grandparent information
      paternalGrandfatherName: genealogyRecord.paternal_grandfather_name,
      paternalGrandfatherTribe: genealogyRecord.paternal_grandfather_tribe,
      paternalGrandmotherName: genealogyRecord.paternal_grandmother_name,
      paternalGrandmotherTribe: genealogyRecord.paternal_grandmother_tribe,
      maternalGrandfatherName: genealogyRecord.maternal_grandfather_name,
      maternalGrandfatherTribe: genealogyRecord.maternal_grandfather_tribe,
      maternalGrandmotherName: genealogyRecord.maternal_grandmother_name,
      maternalGrandmotherTribe: genealogyRecord.maternal_grandmother_tribe
    }
    
    setPrefilledData(prefilled)
    setShowGenealogySearch(false)
  }

  const handleCreateNewGenealogy = () => {
    setShowGenealogySearch(false)
    setShowGenealogyForm(true)
  }

  const handleGenealogyFormSave = (genealogyRecord) => {
    handleGenealogyFound(genealogyRecord)
    setShowGenealogyForm(false)
  }

  const handleGenealogyFormCancel = () => {
    setShowGenealogyForm(false)
    setShowGenealogySearch(true)
  }

  const handleContinue = () => {
    if (!selectedPurpose) {
      alert('Please select a purpose for your application')
      return
    }

    const applicationData = {
      purpose: selectedPurpose,
      serviceType: 'Certificate of Confirmation',
      requirements,
      genealogyRecord: selectedGenealogyRecord,
      prefilledData
    }

    onNext(applicationData)
  }

  const getRequirementStatusIcon = (requirement) => {
    // Check if user has valid documents for this requirement
    const hasValidDocument = false // This would be checked against user's documents
    
    if (hasValidDocument) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    } else if (requirement.is_mandatory) {
      return <AlertCircle className="w-5 h-5 text-red-500" />
    } else {
      return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for Certificate of Confirmation</h1>
        <p className="text-lg text-gray-600">
          Get started by selecting your purpose and using our genealogy search to auto-fill your information
        </p>
      </div>

      {/* Genealogy Search Section */}
      {!showGenealogyForm && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Speed Up Your Application</h2>
                <p className="text-gray-600">Search our genealogy database to auto-fill your family information</p>
              </div>
            </div>
            
            {selectedGenealogyRecord && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Record Found</span>
              </div>
            )}
          </div>

          {selectedGenealogyRecord ? (
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{selectedGenealogyRecord.full_name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedGenealogyRecord.municipality}, {selectedGenealogyRecord.province} • {selectedGenealogyRecord.tribe_affiliation}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Parents: {selectedGenealogyRecord.father_name} & {selectedGenealogyRecord.mother_name}
                  </p>
                </div>
                <button
                  onClick={() => setShowGenealogySearch(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Change Record
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowGenealogySearch(true)}
              className="w-full bg-white border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <Search className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-blue-700 font-medium">Search Genealogy Records</p>
              <p className="text-blue-600 text-sm">Find your family records to auto-fill your application</p>
            </button>
          )}
        </div>
      )}

      {/* Purpose Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Purpose</h2>
          <p className="text-gray-600">Choose the primary purpose for your Certificate of Confirmation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {purposes.map((purpose) => (
            <div
              key={purpose.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedPurpose === purpose.id
                  ? `${purpose.color} border-current`
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedPurpose(purpose.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${purpose.color.split(' ')[0]} ${purpose.color.split(' ')[2]}`}>
                  {purpose.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{purpose.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{purpose.description}</p>
                </div>
                {selectedPurpose === purpose.id && (
                  <CheckCircle className="w-5 h-5 text-current flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements Preview */}
      {selectedPurpose && requirements.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Required Documents</h2>
            <p className="text-gray-600">Review the documents you'll need to submit for your application</p>
          </div>

          <div className="space-y-3">
            {requirements.map((requirement) => (
              <div
                key={requirement.requirement_id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getRequirementStatusIcon(requirement)}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {requirement.requirement_name}
                      {requirement.is_mandatory && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                    <p className="text-sm text-gray-600">{requirement.description}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>Valid for {requirement.validity_period_days} days</span>
                      <span>Submit within {requirement.submission_deadline_days} days</span>
                      <span>Max {requirement.max_file_size_mb}MB</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {requirement.is_mandatory ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Required
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Optional
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• All documents must be clear and legible</li>
                  <li>• Expired documents will need to be renewed</li>
                  <li>• You'll receive notifications before documents expire</li>
                  <li>• Missing required documents may delay your application</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      {selectedPurpose && (
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-lg font-medium"
          >
            Continue with Application
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}

      {/* Genealogy Search Modal */}
      {showGenealogySearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <GenealogySearch
                onGenealogyFound={handleGenealogyFound}
                onCreateNew={handleCreateNewGenealogy}
                initialSearchTerm=""
              />
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowGenealogySearch(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Genealogy Form Modal */}
      {showGenealogyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <GenealogyForm
              onSave={handleGenealogyFormSave}
              onCancel={handleGenealogyFormCancel}
              initialData={null}
              isEditing={false}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedApply
