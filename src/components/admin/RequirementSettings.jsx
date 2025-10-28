import React, { useState, useEffect } from 'react'
import { Save, Plus, Edit2, Trash2, Settings, Clock, Calendar, FileText } from 'lucide-react'

const RequirementSettings = () => {
  const [requirements, setRequirements] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRequirement, setEditingRequirement] = useState(null)
  const [formData, setFormData] = useState({
    service_type: 'Certificate of Confirmation',
    requirement_name: '',
    description: '',
    is_mandatory: true,
    validity_period_days: 365,
    submission_deadline_days: 30,
    file_types_allowed: ['pdf', 'jpg', 'png'],
    max_file_size_mb: 5,
    is_active: true
  })

  const serviceTypes = [
    'Certificate of Confirmation',
    'Barangay Clearance',
    'Municipal Clearance',
    'Tribal Chieftain Certificate'
  ]

  const fileTypes = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']

  useEffect(() => {
    loadRequirements()
  }, [])

  const loadRequirements = () => {
    try {
      const savedRequirements = JSON.parse(localStorage.getItem('ncip_document_requirements') || '[]')
      setRequirements(savedRequirements)
    } catch (error) {
      console.error('Error loading requirements:', error)
      setRequirements([])
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileTypesChange = (type, checked) => {
    setFormData(prev => ({
      ...prev,
      file_types_allowed: checked
        ? [...prev.file_types_allowed, type]
        : prev.file_types_allowed.filter(t => t !== type)
    }))
  }

  const validateForm = () => {
    if (!formData.requirement_name.trim()) {
      alert('Requirement name is required')
      return false
    }
    if (!formData.description.trim()) {
      alert('Description is required')
      return false
    }
    if (formData.validity_period_days < 1) {
      alert('Validity period must be at least 1 day')
      return false
    }
    if (formData.submission_deadline_days < 1) {
      alert('Submission deadline must be at least 1 day')
      return false
    }
    if (formData.file_types_allowed.length === 0) {
      alert('At least one file type must be allowed')
      return false
    }
    if (formData.max_file_size_mb < 1) {
      alert('Maximum file size must be at least 1 MB')
      return false
    }
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const savedRequirements = JSON.parse(localStorage.getItem('ncip_document_requirements') || '[]')
      
      if (editingRequirement) {
        // Update existing requirement
        const updatedRequirements = savedRequirements.map(req =>
          req.requirement_id === editingRequirement.requirement_id
            ? {
                ...req,
                ...formData,
                updated_at: new Date().toISOString()
              }
            : req
        )
        localStorage.setItem('ncip_document_requirements', JSON.stringify(updatedRequirements))
      } else {
        // Add new requirement
        const newRequirement = {
          requirement_id: Date.now(),
          ...formData,
          created_by: 1, // Admin user ID
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        savedRequirements.push(newRequirement)
        localStorage.setItem('ncip_document_requirements', JSON.stringify(savedRequirements))
      }

      loadRequirements()
      resetForm()
    } catch (error) {
      console.error('Error saving requirement:', error)
      alert('Error saving requirement. Please try again.')
    }
  }

  const handleEdit = (requirement) => {
    setEditingRequirement(requirement)
    setFormData({
      service_type: requirement.service_type,
      requirement_name: requirement.requirement_name,
      description: requirement.description,
      is_mandatory: requirement.is_mandatory,
      validity_period_days: requirement.validity_period_days,
      submission_deadline_days: requirement.submission_deadline_days,
      file_types_allowed: requirement.file_types_allowed || ['pdf', 'jpg', 'png'],
      max_file_size_mb: requirement.max_file_size_mb,
      is_active: requirement.is_active
    })
    setShowAddForm(true)
  }

  const handleDelete = (requirementId) => {
    if (window.confirm('Are you sure you want to delete this requirement?')) {
      try {
        const savedRequirements = JSON.parse(localStorage.getItem('ncip_document_requirements') || '[]')
        const updatedRequirements = savedRequirements.filter(req => req.requirement_id !== requirementId)
        localStorage.setItem('ncip_document_requirements', JSON.stringify(updatedRequirements))
        loadRequirements()
      } catch (error) {
        console.error('Error deleting requirement:', error)
        alert('Error deleting requirement. Please try again.')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      service_type: 'Certificate of Confirmation',
      requirement_name: '',
      description: '',
      is_mandatory: true,
      validity_period_days: 365,
      submission_deadline_days: 30,
      file_types_allowed: ['pdf', 'jpg', 'png'],
      max_file_size_mb: 5,
      is_active: true
    })
    setEditingRequirement(null)
    setShowAddForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Settings className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Document Requirements</h2>
            <p className="text-gray-600">Manage document requirements and deadlines for each service type</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Requirement
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingRequirement ? 'Edit Requirement' : 'Add New Requirement'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type *
                </label>
                <select
                  value={formData.service_type}
                  onChange={(e) => handleInputChange('service_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirement Name *
                </label>
                <input
                  type="text"
                  value={formData.requirement_name}
                  onChange={(e) => handleInputChange('requirement_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Birth Certificate"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what this requirement is for..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Validity Period (Days) *
                </label>
                <input
                  type="number"
                  value={formData.validity_period_days}
                  onChange={(e) => handleInputChange('validity_period_days', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">How long the document remains valid</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Submission Deadline (Days) *
                </label>
                <input
                  type="number"
                  value={formData.submission_deadline_days}
                  onChange={(e) => handleInputChange('submission_deadline_days', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Days to submit after application</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max File Size (MB) *
                </label>
                <input
                  type="number"
                  value={formData.max_file_size_mb}
                  onChange={(e) => handleInputChange('max_file_size_mb', parseInt(e.target.value))}
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed File Types *
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {fileTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.file_types_allowed.includes(type)}
                      onChange={(e) => handleFileTypesChange(type, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 uppercase">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_mandatory}
                  onChange={(e) => handleInputChange('is_mandatory', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Mandatory Requirement</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingRequirement ? 'Update Requirement' : 'Save Requirement'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requirements List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Requirements</h3>
          <p className="text-sm text-gray-600">Manage document requirements for each service type</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requirement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validity Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requirements.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No requirements configured yet</p>
                    <p className="text-sm">Add your first requirement to get started</p>
                  </td>
                </tr>
              ) : (
                requirements.map((requirement) => (
                  <tr key={requirement.requirement_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {requirement.service_type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {requirement.requirement_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {requirement.description}
                      </div>
                      <div className="flex items-center mt-1">
                        {requirement.is_mandatory && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                            Mandatory
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          Max: {requirement.max_file_size_mb}MB
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {requirement.validity_period_days} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {requirement.submission_deadline_days} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        requirement.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {requirement.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(requirement)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(requirement.requirement_id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RequirementSettings
