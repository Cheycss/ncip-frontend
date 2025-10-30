import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { getApiBaseUrl } from '../../config/api';
import purposeService from '../../services/purposeService'

const Services = () => {
  const [services, setServices] = useState([])
  const [purposes, setPurposes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedServiceId, setSelectedServiceId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAddPurposeForm, setShowAddPurposeForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [editingPurpose, setEditingPurpose] = useState(null)
  const [showEditOptions, setShowEditOptions] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [purposeSearchTerm, setPurposeSearchTerm] = useState('')
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    category: 'Certification',
    requirements: '',
    purposes: [],
    status: 'active'
  })
  const [purposeFormData, setPurposeFormData] = useState({
    name: '',
    code: '',
    description: '',
    requirements: []
  })

  // Dynamic API URL - works both locally and on network
  const API_BASE_URL = getApiBaseUrl()

  const getAuthHeaders = () => {
    const token = localStorage.getItem('ncip_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const mapService = (service) => ({
    id: service.service_id,
    code: service.code,
    title: service.name,
    description: service.description || '',
    status: service.status || 'active',
    createdAt: service.created_at,
    updatedAt: service.updated_at
  })

  const mapPurpose = (purpose) => ({
    id: purpose.purpose_id,
    serviceId: purpose.service_id,
    name: purpose.title,
    code: purpose.code,
    description: purpose.description || '',
    requirements: purpose.requirements || [],
    isDefault: purpose.is_default ? true : false
  })

  const dispatchPurposesChanged = (data) => {
    window.dispatchEvent(new CustomEvent('purposesChanged', {
      detail: { count: data.length, data, source: 'api' }
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([loadServices(), loadPurposes()])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const loadServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services`, {
        headers: getAuthHeaders()
      })

      const fetchedServices = response.data?.services?.map(mapService) || []
      setServices(fetchedServices)

      if (fetchedServices.length > 0) {
        setSelectedServiceId(prev =>
          prev && fetchedServices.some(service => service.id === prev)
            ? prev
            : fetchedServices[0].id
        )
      } else {
        setSelectedServiceId(null)
        setPurposes([])
        dispatchPurposesChanged([])
      }
    } catch (error) {
      console.error('Failed to load services:', error)
      setServices([])
    }
  }

  const loadPurposes = async () => {
    try {
      const data = await purposeService.getAllPurposes()
      const mappedPurposes = data.map(purpose => ({
        id: purpose.purpose_id ?? purpose.id,
        name: purpose.name,
        code: purpose.code || generatePurposeCode(purpose.name),
        description: purpose.description || '',
        requirements: Array.isArray(purpose.requirements) ? purpose.requirements : []
      }))

      setPurposes(mappedPurposes)
      dispatchPurposesChanged(mappedPurposes)
    } catch (error) {
      console.error('Failed to load purposes:', error)
      setPurposes([])
      dispatchPurposesChanged([])
    }
  }

  useEffect(() => {
    // Listen for sync updates from other devices
    const handleSyncUpdate = (event) => {
      const data = event.detail?.data
      if (Array.isArray(data)) {
        setPurposes(data)
      }
    }

    window.addEventListener('purposesChanged', handleSyncUpdate)
    
    return () => {
      window.removeEventListener('purposesChanged', handleSyncUpdate)
    }
  }, [])


  // Available requirements from COC form
  const availableRequirements = [
    'Birth Certificate',
    'Bio Data', 
    'Barangay Certificate',
    'School Records',
    'Passport',
    'Educational Records',
    'Land Documents',
    'Survey Plans',
    'NBI Clearance',
    'Medical Certificate',
    'Tax Declaration',
    'Joint Affidavit',
    '2x2 Picture',
    'Documentary Stamps',
    'Endorsement Letter'
  ]

  // Purpose form handlers
  const handlePurposeSubmit = async (e) => {
    e.preventDefault()

    // Convert requirements to proper object format
    const formattedRequirements = purposeFormData.requirements.map(req => {
      if (typeof req === 'string') {
        return {
          id: req.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, ''),
          name: req,
          required: true
        }
      }
      return req
    })

    const payload = {
      name: purposeFormData.name,
      code: purposeFormData.code,
      description: purposeFormData.description,
      requirements: formattedRequirements
    }

    try {
      if (editingPurpose) {
        await purposeService.updatePurpose(editingPurpose.id, payload)
        setEditingPurpose(null)
      } else {
        await purposeService.createPurpose(payload)
      }

      await loadPurposes()

      setPurposeFormData({
        name: '',
        code: '',
        description: '',
        requirements: []
      })
      setShowAddPurposeForm(false)
    } catch (error) {
      console.error('Failed to save purpose:', error)
    }
  }

  const handleEditPurpose = (purpose) => {
    setEditingPurpose(purpose)
    
    // Extract requirement names for editing
    const requirementNames = (purpose.requirements || []).map(req => 
      typeof req === 'string' ? req : req.name
    )
    
    setPurposeFormData({
      name: purpose.name,
      code: purpose.code,
      description: purpose.description,
      requirements: requirementNames
    })
    setShowAddPurposeForm(true)
  }

  const handleDeletePurpose = (id) => {
    if (window.confirm('Are you sure you want to delete this purpose?')) {
      purposeService.deletePurpose(id)
        .then(() => loadPurposes())
        .catch(error => console.error('Failed to delete purpose:', error))
    }
  }

  const generatePurposeCode = (name) => {
    if (!name) return ''
    const words = name.split(' ')
    if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase()
    } else {
      return words.map(word => word.charAt(0)).join('').toUpperCase()
    }
  }

  const initializeDefaultPurposes = async () => {
    const defaultPurposes = [
      {
        name: 'Employment',
        code: 'EMP',
        description: 'For employment purposes',
        requirements: ['Valid ID', 'Birth Certificate', 'Proof of Residency']
      },
      {
        name: 'Educational Assistance',
        code: 'EDU',
        description: 'For educational scholarship or assistance',
        requirements: ['School ID', 'Certificate of Enrollment', 'Birth Certificate']
      },
      {
        name: 'Business Permit',
        code: 'BUS',
        description: 'For business registration and permits',
        requirements: ['Valid ID', 'Business Plan', 'Proof of Address']
      },
      {
        name: 'Land Title',
        code: 'LND',
        description: 'For land ownership and title processing',
        requirements: ['Tax Declaration', 'Survey Plan', 'Birth Certificate']
      },
      {
        name: 'Housing Assistance',
        code: 'HSG',
        description: 'For housing programs and assistance',
        requirements: ['Valid ID', 'Proof of Income', 'Proof of Residency']
      },
      {
        name: 'Medical Assistance',
        code: 'MED',
        description: 'For medical and health-related assistance',
        requirements: ['Medical Certificate', 'Valid ID', 'Proof of Indigency']
      },
      {
        name: 'Legal Documentation',
        code: 'LEG',
        description: 'For legal documents and court proceedings',
        requirements: ['Valid ID', 'Birth Certificate', 'Marriage Certificate']
      },
      {
        name: 'Tribal Membership',
        code: 'TRB',
        description: 'For tribal membership verification',
        requirements: ['Birth Certificate', 'Parental Affidavit', 'Community Endorsement']
      },
      {
        name: 'Other',
        code: 'OTH',
        description: 'For other purposes not listed',
        requirements: ['Valid ID', 'Supporting Documents']
      }
    ]

    try {
      setLoading(true)
      const createdPurposes = []
      
      for (const purpose of defaultPurposes) {
        const response = await purposeService.createPurpose(purpose)
        if (response.success) {
          createdPurposes.push(response.purpose)
        }
      }
      
      await loadPurposes()
      alert(`Successfully created ${createdPurposes.length} default purposes!`)
    } catch (error) {
      console.error('Error initializing default purposes:', error)
      alert('Failed to initialize default purposes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredPurposes = purposes.filter(purpose =>
    purpose.name?.toLowerCase().includes(purposeSearchTerm.toLowerCase())
  )

  const addRequirement = (requirement) => {
    if (!purposeFormData.requirements.includes(requirement)) {
      setPurposeFormData({
        ...purposeFormData,
        requirements: [...purposeFormData.requirements, requirement]
      })
    }
  }

  const removeRequirement = (requirement) => {
    setPurposeFormData({
      ...purposeFormData,
      requirements: purposeFormData.requirements.filter(req => req !== requirement)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingService) {
      // Update existing service
      const updatedServices = services.map(service =>
        service.id === editingService.id
          ? { ...formData, id: editingService.id, updatedAt: new Date().toISOString() }
          : service
      )
      setServices(updatedServices)
      localStorage.setItem('ncip_services', JSON.stringify(updatedServices))
      setEditingService(null)
    } else {
      // Add new service
      const newService = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      }
      const updatedServices = [...services, newService]
      setServices(updatedServices)
      localStorage.setItem('ncip_services', JSON.stringify(updatedServices))
    }
    
    setFormData({
      title: '',
      description: '',
      category: 'Certification',
      requirements: '',
      purposes: [],
      status: 'active'
    })
    setShowAddForm(false)
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      requirements: service.requirements,
      purposes: service.purposes || [],
      status: service.status
    })
    setShowAddForm(true)
    setShowEditOptions(null)
  }

  const handleArchive = (id) => {
    const updatedServices = services.map(service =>
      service.id === id ? { ...service, status: 'archived' } : service
    )
    setServices(updatedServices)
    localStorage.setItem('ncip_services', JSON.stringify(updatedServices))
    setShowEditOptions(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this service?')) {
      const updatedServices = services.filter(service => service.id !== id)
      setServices(updatedServices)
      localStorage.setItem('ncip_services', JSON.stringify(updatedServices))
      setShowEditOptions(null)
    }
  }

  const handleActivate = (id) => {
    const updatedServices = services.map(service =>
      service.id === id ? { ...service, status: 'active' } : service
    )
    setServices(updatedServices)
    localStorage.setItem('ncip_services', JSON.stringify(updatedServices))
    setShowEditOptions(null)
  }

  const filteredPurposesForDisplay = purposes.filter(purpose =>
    purpose.name?.toLowerCase().includes(purposeSearchTerm.toLowerCase()) ||
    purpose.description?.toLowerCase().includes(purposeSearchTerm.toLowerCase()) ||
    purpose.code?.toLowerCase().includes(purposeSearchTerm.toLowerCase())
  )

  const categories = ['Certification', 'Legal']

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Purposes Management</h2>
            <p className="text-sm text-gray-600 mt-2 font-medium">Manage Certificate of Confirmation purposes and form fields</p>
          </div>
          <button
            onClick={() => setShowAddPurposeForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add New Purpose
            </span>
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search purposes by name..."
            className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium placeholder-gray-500"
            value={purposeSearchTerm}
            onChange={(e) => setPurposeSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Add/Edit Purpose Form Modal */}
      {showAddPurposeForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
          <div className="relative top-8 mx-auto p-0 border-0 w-full max-w-3xl shadow-2xl rounded-2xl bg-white my-8">
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {editingPurpose ? 'Edit Purpose' : 'Add New Purpose'}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  {editingPurpose ? 'Update purpose information and form fields' : 'Create a new purpose for Certificate of Confirmation'}
                </p>
              </div>
              <form onSubmit={handlePurposeSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Purpose Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      className="block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                      value={purposeFormData.name}
                      onChange={(e) => {
                        const name = e.target.value
                        setPurposeFormData({
                          ...purposeFormData, 
                          name,
                          code: generatePurposeCode(name)
                        })
                        setPurposeSearchTerm(name)
                        setShowPurposeDropdown(name.length > 0)
                      }}
                      onFocus={() => setShowPurposeDropdown(purposeFormData.name.length > 0)}
                      placeholder="Type purpose name (e.g., IP Identification)..."
                    />
                    {showPurposeDropdown && filteredPurposes.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                        {filteredPurposes.map((purpose) => (
                          <button
                            key={purpose.id}
                            type="button"
                            onClick={() => {
                              setPurposeFormData({
                                name: purpose.name,
                                code: purpose.code,
                                description: purpose.description,
                                requirements: purpose.requirements || []
                              })
                              setShowPurposeDropdown(false)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-sm"
                          >
                            <div className="font-medium">{purpose.name}</div>
                            <div className="text-xs text-gray-500">{purpose.code}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Purpose Code</label>
                  <input
                    type="text"
                    required
                    className="block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium bg-gray-50"
                    value={purposeFormData.code}
                    onChange={(e) => setPurposeFormData({...purposeFormData, code: e.target.value.toUpperCase()})}
                    placeholder="Auto-generated code..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Description</label>
                  <textarea
                    required
                    rows={3}
                    className="block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium resize-none"
                    value={purposeFormData.description}
                    onChange={(e) => setPurposeFormData({...purposeFormData, description: e.target.value})}
                    placeholder="Describe the purpose and its use..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Form Viewer</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <select
                        className="block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                        onChange={(e) => {
                          if (e.target.value) {
                            addRequirement(e.target.value)
                            e.target.value = ''
                          }
                        }}
                      >
                        <option value="">Select form field to add...</option>
                        {availableRequirements.map((req) => (
                          <option key={req} value={req} disabled={purposeFormData.requirements.includes(req)}>
                            {req}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {purposeFormData.requirements.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Selected Form Fields:</h4>
                        <div className="space-y-2">
                          {purposeFormData.requirements.map((req, index) => (
                            <div key={index} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border">
                              <span className="text-sm font-medium text-gray-700">• {req}</span>
                              <button
                                type="button"
                                onClick={() => removeRequirement(req)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddPurposeForm(false)
                      setEditingPurpose(null)
                      setPurposeFormData({
                        name: '',
                        code: '',
                        description: '',
                        requirements: []
                      })
                      setShowPurposeDropdown(false)
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {editingPurpose ? 'Update Purpose' : 'Create Purpose'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {/* Purposes Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Purposes Management</h3>
            <p className="text-sm text-gray-600 mt-1">Manage Certificate of Confirmation purposes and requirements</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPurposesForDisplay.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Purposes Found</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first purpose for Certificate of Confirmation.</p>
              <div className="space-x-4">
                <button
                  onClick={() => setShowAddPurposeForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Create First Purpose
                </button>
                <button
                  onClick={initializeDefaultPurposes}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Load 9 Default Purposes
                </button>
              </div>
            </div>
          ) : (
            filteredPurposesForDisplay.map((purpose) => (
            <div key={purpose.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{purpose.name}</h4>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mt-1">
                    {purpose.code}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPurpose(purpose)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit Purpose"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePurpose(purpose.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete Purpose"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{purpose.description}</p>
              
              <div>
                <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Form Viewer:</h5>
                <div className="space-y-1">
                  {(purpose.requirements || []).length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No form fields specified</p>
                  ) : (
                    purpose.requirements.map((req, index) => (
                      <div key={index} className="text-xs text-gray-600 flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {typeof req === 'string' ? req : req.name}
                        {typeof req === 'object' && req.required && (
                          <span className="ml-2 text-red-500">*</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Services
