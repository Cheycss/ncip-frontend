import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  FileText,
  Plus,
  Edit3,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  Verified,
  Flag
} from 'lucide-react'

const Genealogy = () => {
  const [applications, setApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showGenealogyModal, setShowGenealogyModal] = useState(false)
  const [genealogyData, setGenealogyData] = useState(null)
  const [verificationStatus, setVerificationStatus] = useState({})
  const [editingMember, setEditingMember] = useState(null)
  const [expandedGenerations, setExpandedGenerations] = useState({
    greatGrandparents: true,
    grandparents: true,
    parents: true
  })

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = () => {
    const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]')
    setApplications(storedApplications)
  }

  const openGenealogyViewer = (application) => {
    setSelectedApplication(application)
    
    // Extract genealogy data from form data
    const formData = application.formData || {}
    const genealogy = {
      applicant: {
        name: formData.name || `${application.firstName} ${application.lastName}`,
        iccs: formData.iccs || '',
        placeOfOrigin: formData.placeOfOrigin || '',
        verified: false
      },
      father: {
        name: formData.fatherName || '',
        iccs: formData.fatherIccs || '',
        placeOfOrigin: formData.fatherPlaceOfOrigin || '',
        verified: false
      },
      mother: {
        name: formData.motherName || '',
        iccs: formData.motherIccs || '',
        placeOfOrigin: formData.motherPlaceOfOrigin || '',
        verified: false
      },
      paternalGrandfather: {
        name: formData.paternalGrandfatherName || '',
        iccs: formData.paternalGrandfatherIccs || '',
        placeOfOrigin: formData.paternalGrandfatherPlaceOfOrigin || '',
        verified: false
      },
      paternalGrandmother: {
        name: formData.paternalGrandmotherName || '',
        iccs: formData.paternalGrandmotherIccs || '',
        placeOfOrigin: formData.paternalGrandmotherPlaceOfOrigin || '',
        verified: false
      },
      maternalGrandfather: {
        name: formData.maternalGrandfatherName || '',
        iccs: formData.maternalGrandfatherIccs || '',
        placeOfOrigin: formData.maternalGrandfatherPlaceOfOrigin || '',
        verified: false
      },
      maternalGrandmother: {
        name: formData.maternalGrandmotherName || '',
        iccs: formData.maternalGrandmotherIccs || '',
        placeOfOrigin: formData.maternalGrandmotherPlaceOfOrigin || '',
        verified: false
      }
    }
    
    setGenealogyData(genealogy)
    setShowGenealogyModal(true)
  }

  const toggleVerification = (memberKey) => {
    setVerificationStatus(prev => ({
      ...prev,
      [memberKey]: !prev[memberKey]
    }))
  }

  const getVerificationColor = (memberKey) => {
    const status = verificationStatus[memberKey]
    if (status === true) return 'text-green-600 bg-green-50 border-green-200'
    if (status === false) return 'text-red-600 bg-red-50 border-red-200'
    return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  }

  const getVerificationIcon = (memberKey) => {
    const status = verificationStatus[memberKey]
    if (status === true) return <CheckCircle className="w-4 h-4" />
    if (status === false) return <XCircle className="w-4 h-4" />
    return <AlertTriangle className="w-4 h-4" />
  }

  const FamilyMember = ({ member, memberKey, title, generation }) => {
    const isEditing = editingMember === memberKey
    
    return (
      <div className={`bg-white rounded-xl border-2 p-5 transition-all duration-200 shadow-sm hover:shadow-md ${
        member.name ? 'border-blue-200' : 'border-blue-100 border-dashed'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">{title}</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleVerification(memberKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all hover:scale-105 ${getVerificationColor(memberKey)}`}
            >
              <div className="flex items-center gap-1.5">
                {getVerificationIcon(memberKey)}
                <span>
                  {verificationStatus[memberKey] === true ? 'VERIFIED' : 
                   verificationStatus[memberKey] === false ? 'INVALID' : 'PENDING'}
                </span>
              </div>
            </button>
            <button
              onClick={() => setEditingMember(isEditing ? null : memberKey)}
              className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={member.name}
                onChange={(e) => setGenealogyData(prev => ({
                  ...prev,
                  [memberKey]: { ...prev[memberKey], name: e.target.value }
                }))}
                className="w-full px-3 py-2 text-sm border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            ) : (
              <p className="text-sm text-gray-900 font-semibold bg-blue-50 px-3 py-2 rounded-lg">{member.name || 'Not provided'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">ICC/IP Certificate</label>
            {isEditing ? (
              <input
                type="text"
                value={member.iccs}
                onChange={(e) => setGenealogyData(prev => ({
                  ...prev,
                  [memberKey]: { ...prev[memberKey], iccs: e.target.value }
                }))}
                className="w-full px-3 py-2 text-sm border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            ) : (
              <p className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg font-mono">{member.iccs || 'Not provided'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Place of Origin</label>
            {isEditing ? (
              <input
                type="text"
                value={member.placeOfOrigin}
                onChange={(e) => setGenealogyData(prev => ({
                  ...prev,
                  [memberKey]: { ...prev[memberKey], placeOfOrigin: e.target.value }
                }))}
                className="w-full px-3 py-2 text-sm border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{member.placeOfOrigin || 'Not provided'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const toggleGeneration = (generation) => {
    setExpandedGenerations(prev => ({
      ...prev,
      [generation]: !prev[generation]
    }))
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      (app.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header - Professional Blue Theme */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Genealogy Verification System</h1>
            <p className="text-blue-100 mt-1">Official verification of indigenous lineage and ancestry records</p>
          </div>
        </div>
      </div>

      {/* Search and Filters - Clean White Card */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applicant by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-700 bg-white transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List - Professional Table */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-500">No applications match your current search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Applicant Information</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Purpose</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Date Submitted</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-blue-50 transition-all duration-150">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-base">
                            {application.firstName} {application.lastName}
                          </div>
                          <div className="text-sm text-gray-500 mt-0.5">{application.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-gray-700">{application.purpose}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${
                        application.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                        'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {new Date(application.submittedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => openGenealogyViewer(application)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Genealogy Modal - Professional Formal Design */}
      {showGenealogyModal && genealogyData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-100">
            <div className="px-8 py-6 border-b-2 border-blue-100 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold">Official Genealogy Verification</h2>
                  </div>
                  <p className="text-blue-100 text-base ml-14">
                    Applicant: <span className="font-semibold">{selectedApplication?.firstName} {selectedApplication?.lastName}</span> | Purpose: <span className="font-semibold">{selectedApplication?.purpose}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowGenealogyModal(false)}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8 bg-gray-50">
              {/* Applicant (EGO) - Highlighted Section */}
              <div className="mb-10">
                <div className="text-center">
                  <div className="inline-block w-full max-w-2xl">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white uppercase tracking-wide">Primary Applicant (EGO)</h3>
                      </div>
                    </div>
                    <div className="bg-white border-2 border-blue-200 rounded-b-xl p-6 shadow-lg">
                      <FamilyMember 
                        member={genealogyData.applicant} 
                        memberKey="applicant" 
                        title="Representative" 
                        generation="current"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Parents Generation */}
              <div className="mb-10 bg-white rounded-xl border-2 border-blue-100 overflow-hidden shadow-md">
                <button
                  onClick={() => toggleGeneration('parents')}
                  className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {expandedGenerations.parents ? <ChevronDown className="w-6 h-6 text-blue-600" /> : <ChevronRight className="w-6 h-6 text-blue-600" />}
                    <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">First Generation - Parents</h3>
                  </div>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">2 Members</span>
                </button>
                
                {expandedGenerations.parents && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FamilyMember 
                        member={genealogyData.father} 
                        memberKey="father" 
                        title="Father (Paternal Line)" 
                        generation="parents"
                      />
                      <FamilyMember 
                        member={genealogyData.mother} 
                        memberKey="mother" 
                        title="Mother (Maternal Line)" 
                        generation="parents"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Grandparents Generation */}
              <div className="mb-10 bg-white rounded-xl border-2 border-blue-100 overflow-hidden shadow-md">
                <button
                  onClick={() => toggleGeneration('grandparents')}
                  className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {expandedGenerations.grandparents ? <ChevronDown className="w-6 h-6 text-blue-600" /> : <ChevronRight className="w-6 h-6 text-blue-600" />}
                    <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Second Generation - Grandparents</h3>
                  </div>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">4 Members</span>
                </button>
                
                {expandedGenerations.grandparents && (
                  <div className="p-6 space-y-8">
                    <div>
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-blue-100">
                        <div className="w-1 h-6 bg-blue-600 rounded"></div>
                        <h4 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Paternal Lineage</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FamilyMember 
                          member={genealogyData.paternalGrandfather} 
                          memberKey="paternalGrandfather" 
                          title="Paternal Grandfather" 
                          generation="grandparents"
                        />
                        <FamilyMember 
                          member={genealogyData.paternalGrandmother} 
                          memberKey="paternalGrandmother" 
                          title="Paternal Grandmother" 
                          generation="grandparents"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-blue-100">
                        <div className="w-1 h-6 bg-blue-600 rounded"></div>
                        <h4 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Maternal Lineage</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FamilyMember 
                          member={genealogyData.maternalGrandfather} 
                          memberKey="maternalGrandfather" 
                          title="Maternal Grandfather" 
                          generation="grandparents"
                        />
                        <FamilyMember 
                          member={genealogyData.maternalGrandmother} 
                          memberKey="maternalGrandmother" 
                          title="Maternal Grandmother" 
                          generation="grandparents"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Verification Summary - Professional Stats */}
              <div className="bg-white rounded-xl border-2 border-blue-100 overflow-hidden shadow-md">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Verification Summary</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 shadow-sm">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-4xl font-bold text-green-700 mb-1">
                        {Object.values(verificationStatus).filter(status => status === true).length}
                      </div>
                      <div className="text-sm font-bold text-green-600 uppercase tracking-wide">Verified</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200 shadow-sm">
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                        <XCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-4xl font-bold text-red-700 mb-1">
                        {Object.values(verificationStatus).filter(status => status === false).length}
                      </div>
                      <div className="text-sm font-bold text-red-600 uppercase tracking-wide">Invalid</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-sm">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                        <AlertTriangle className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-4xl font-bold text-blue-700 mb-1">
                        {Object.values(verificationStatus).filter(status => status === undefined).length}
                      </div>
                      <div className="text-sm font-bold text-blue-600 uppercase tracking-wide">Pending</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Professional Footer */}
            <div className="px-8 py-6 border-t-2 border-blue-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Note:</span> All verification changes will be recorded in the system audit log
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowGenealogyModal(false)}
                    className="px-8 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Save verification status
                      console.log('Saving verification status:', verificationStatus)
                      alert('Genealogy verification status saved successfully!')
                    }}
                    className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Verification</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Genealogy
