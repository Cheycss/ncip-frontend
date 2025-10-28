import React, { useState, useEffect } from 'react'
import { Save, X, Users, MapPin, Heart, User } from 'lucide-react'
import { saranganiData } from '../../utils/saranganiData'

const GenealogyForm = ({ onSave, onCancel, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    birth_place: '',
    civil_status: '',
    current_address: '',
    province: 'SARANGANI',
    municipality: '',
    barangay: '',
    tribe_affiliation: '',
    icc_group: '',
    father_name: '',
    father_tribe: '',
    father_birth_place: '',
    mother_name: '',
    mother_tribe: '',
    mother_birth_place: '',
    paternal_grandfather_name: '',
    paternal_grandfather_tribe: '',
    paternal_grandmother_name: '',
    paternal_grandmother_tribe: '',
    maternal_grandfather_name: '',
    maternal_grandfather_tribe: '',
    maternal_grandmother_name: '',
    maternal_grandmother_tribe: '',
    ...initialData
  })

  const [errors, setErrors] = useState({})
  const [availableBarangays, setAvailableBarangays] = useState([])

  useEffect(() => {
    if (formData.municipality) {
      const cityData = saranganiData.cities.find(city => city.name === formData.municipality)
      setAvailableBarangays(cityData ? cityData.barangays : [])
    }
  }, [formData.municipality])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
    const newErrors = {}
    
    // Required fields
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required'
    if (!formData.birth_date) newErrors.birth_date = 'Birth date is required'
    if (!formData.birth_place.trim()) newErrors.birth_place = 'Birth place is required'
    if (!formData.civil_status) newErrors.civil_status = 'Civil status is required'
    if (!formData.municipality) newErrors.municipality = 'Municipality is required'
    if (!formData.barangay) newErrors.barangay = 'Barangay is required'
    if (!formData.tribe_affiliation) newErrors.tribe_affiliation = 'Tribe affiliation is required'
    
    // At least one parent name required
    if (!formData.father_name.trim() && !formData.mother_name.trim()) {
      newErrors.parent_names = 'At least one parent name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Generate ID for new records
    const recordData = {
      ...formData,
      genealogy_id: initialData?.genealogy_id || Date.now(),
      is_verified: false,
      created_at: initialData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Save to localStorage (simulate database)
    const existingRecords = JSON.parse(localStorage.getItem('ncip_genealogy_records') || '[]')
    
    if (isEditing) {
      const updatedRecords = existingRecords.map(record => 
        record.genealogy_id === recordData.genealogy_id ? recordData : record
      )
      localStorage.setItem('ncip_genealogy_records', JSON.stringify(updatedRecords))
    } else {
      existingRecords.push(recordData)
      localStorage.setItem('ncip_genealogy_records', JSON.stringify(existingRecords))
    }

    onSave(recordData)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Edit Genealogy Record' : 'Create New Genealogy Record'}
              </h3>
              <p className="text-sm text-gray-600">Fill in the family information to create a genealogy record</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Personal Information */}
        <div>
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-gray-500 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">Personal Information</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.full_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date *
              </label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleInputChange('birth_date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.birth_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.birth_date && <p className="text-red-500 text-xs mt-1">{errors.birth_date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Place *
              </label>
              <input
                type="text"
                value={formData.birth_place}
                onChange={(e) => handleInputChange('birth_place', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.birth_place ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter birth place"
              />
              {errors.birth_place && <p className="text-red-500 text-xs mt-1">{errors.birth_place}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Civil Status *
              </label>
              <select
                value={formData.civil_status}
                onChange={(e) => handleInputChange('civil_status', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.civil_status ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select civil status</option>
                {saranganiData.civilStatus.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {errors.civil_status && <p className="text-red-500 text-xs mt-1">{errors.civil_status}</p>}
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div>
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">Location Information</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Address
              </label>
              <textarea
                value={formData.current_address}
                onChange={(e) => handleInputChange('current_address', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Province
              </label>
              <input
                type="text"
                value={formData.province}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Municipality *
              </label>
              <select
                value={formData.municipality}
                onChange={(e) => handleInputChange('municipality', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.municipality ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select municipality</option>
                {saranganiData.cities.map(city => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
              {errors.municipality && <p className="text-red-500 text-xs mt-1">{errors.municipality}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Barangay *
              </label>
              <select
                value={formData.barangay}
                onChange={(e) => handleInputChange('barangay', e.target.value)}
                disabled={!formData.municipality}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.barangay ? 'border-red-500' : 'border-gray-300'
                } ${!formData.municipality ? 'bg-gray-50' : ''}`}
              >
                <option value="">Select barangay</option>
                {availableBarangays.map(barangay => (
                  <option key={barangay} value={barangay}>{barangay}</option>
                ))}
              </select>
              {errors.barangay && <p className="text-red-500 text-xs mt-1">{errors.barangay}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tribe Affiliation *
              </label>
              <select
                value={formData.tribe_affiliation}
                onChange={(e) => handleInputChange('tribe_affiliation', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.tribe_affiliation ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select tribe</option>
                {saranganiData.tribes.map(tribe => (
                  <option key={tribe} value={tribe}>{tribe}</option>
                ))}
              </select>
              {errors.tribe_affiliation && <p className="text-red-500 text-xs mt-1">{errors.tribe_affiliation}</p>}
            </div>
          </div>
        </div>

        {/* Parent Information */}
        <div>
          <div className="flex items-center mb-4">
            <Heart className="w-5 h-5 text-gray-500 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">Parent Information</h4>
          </div>
          
          {errors.parent_names && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.parent_names}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Father Information */}
            <div className="space-y-4">
              <h5 className="font-medium text-gray-800">Father's Information</h5>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Name
                </label>
                <input
                  type="text"
                  value={formData.father_name}
                  onChange={(e) => handleInputChange('father_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter father's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Tribe
                </label>
                <select
                  value={formData.father_tribe}
                  onChange={(e) => handleInputChange('father_tribe', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select tribe</option>
                  {saranganiData.tribes.map(tribe => (
                    <option key={tribe} value={tribe}>{tribe}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Birth Place
                </label>
                <input
                  type="text"
                  value={formData.father_birth_place}
                  onChange={(e) => handleInputChange('father_birth_place', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter father's birth place"
                />
              </div>
            </div>

            {/* Mother Information */}
            <div className="space-y-4">
              <h5 className="font-medium text-gray-800">Mother's Information</h5>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mother's Name
                </label>
                <input
                  type="text"
                  value={formData.mother_name}
                  onChange={(e) => handleInputChange('mother_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter mother's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mother's Tribe
                </label>
                <select
                  value={formData.mother_tribe}
                  onChange={(e) => handleInputChange('mother_tribe', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select tribe</option>
                  {saranganiData.tribes.map(tribe => (
                    <option key={tribe} value={tribe}>{tribe}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mother's Birth Place
                </label>
                <input
                  type="text"
                  value={formData.mother_birth_place}
                  onChange={(e) => handleInputChange('mother_birth_place', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter mother's birth place"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grandparent Information */}
        <div>
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-gray-500 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">Grandparent Information (Optional)</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Paternal Grandparents */}
            <div className="space-y-4">
              <h5 className="font-medium text-gray-800">Paternal Grandparents</h5>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grandfather's Name
                </label>
                <input
                  type="text"
                  value={formData.paternal_grandfather_name}
                  onChange={(e) => handleInputChange('paternal_grandfather_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter paternal grandfather's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grandfather's Tribe
                </label>
                <select
                  value={formData.paternal_grandfather_tribe}
                  onChange={(e) => handleInputChange('paternal_grandfather_tribe', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select tribe</option>
                  {saranganiData.tribes.map(tribe => (
                    <option key={tribe} value={tribe}>{tribe}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grandmother's Name
                </label>
                <input
                  type="text"
                  value={formData.paternal_grandmother_name}
                  onChange={(e) => handleInputChange('paternal_grandmother_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter paternal grandmother's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grandmother's Tribe
                </label>
                <select
                  value={formData.paternal_grandmother_tribe}
                  onChange={(e) => handleInputChange('paternal_grandmother_tribe', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select tribe</option>
                  {saranganiData.tribes.map(tribe => (
                    <option key={tribe} value={tribe}>{tribe}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Maternal Grandparents */}
            <div className="space-y-4">
              <h5 className="font-medium text-gray-800">Maternal Grandparents</h5>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grandfather's Name
                </label>
                <input
                  type="text"
                  value={formData.maternal_grandfather_name}
                  onChange={(e) => handleInputChange('maternal_grandfather_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter maternal grandfather's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grandfather's Tribe
                </label>
                <select
                  value={formData.maternal_grandfather_tribe}
                  onChange={(e) => handleInputChange('maternal_grandfather_tribe', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select tribe</option>
                  {saranganiData.tribes.map(tribe => (
                    <option key={tribe} value={tribe}>{tribe}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grandmother's Name
                </label>
                <input
                  type="text"
                  value={formData.maternal_grandmother_name}
                  onChange={(e) => handleInputChange('maternal_grandmother_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter maternal grandmother's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grandmother's Tribe
                </label>
                <select
                  value={formData.maternal_grandmother_tribe}
                  onChange={(e) => handleInputChange('maternal_grandmother_tribe', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select tribe</option>
                  {saranganiData.tribes.map(tribe => (
                    <option key={tribe} value={tribe}>{tribe}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Record' : 'Save Record'}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default GenealogyForm
