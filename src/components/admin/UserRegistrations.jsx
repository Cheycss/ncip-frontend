import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, CheckCircle, XCircle, Clock, User, Mail, Phone, FileText, Calendar, MapPin, Users, Image as ImageIcon } from 'lucide-react';

const UserRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Dynamic API URL - works both locally and on network
  const getApiBaseUrl = () => {
    const currentHost = window.location.hostname;
    if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
      return `http://${currentHost}:3001/api`;
    }
    return 'http://localhost:3001/api';
  };

  const API_BASE_URL = getApiBaseUrl();

  // ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (showImageModal) {
          setShowImageModal(false);
          setZoomLevel(100);
        } else if (showModal) {
          setShowModal(false);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showImageModal, showModal]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('ncip_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/registrations/pending`, {
        headers: getAuthHeaders()
      });
      setRegistrations(response.data?.registrations || []);
    } catch (error) {
      console.error('Error loading registrations:', error);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (registrationId) => {
    try {
      await axios.post(`${API_BASE_URL}/registrations/${registrationId}/approve`, {}, {
        headers: getAuthHeaders()
      });
      await loadRegistrations();
      setShowModal(false);
      // Trigger real-time update event
      window.dispatchEvent(new Event('registrationsChanged'));
    } catch (error) {
      console.error('Error approving registration:', error);
      const message = error.response?.data?.message || 'Failed to approve registration.';
      alert(message);
    }
  };

  const handleReject = async (registrationId, reason = '') => {
    try {
      await axios.post(`${API_BASE_URL}/registrations/${registrationId}/reject`, { reason }, {
        headers: getAuthHeaders()
      });
      await loadRegistrations();
      setShowModal(false);
      // Trigger real-time update event
      window.dispatchEvent(new Event('registrationsChanged'));
    } catch (error) {
      console.error('Error rejecting registration:', error);
      const message = error.response?.data?.message || 'Failed to reject registration.';
      alert(message);
    }
  };

  const viewDocument = (registration) => {
    if (!registration.birth_certificate_data) return null;
    return registration.birth_certificate_data;
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || registration.registration_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      all: registrations.length,
      pending: registrations.filter(r => r.registration_status === 'pending').length,
      approved: registrations.filter(r => r.registration_status === 'approved').length,
      rejected: registrations.filter(r => r.registration_status === 'rejected').length
    };
  };

  const statusCounts = getStatusCounts();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'approved': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Registrations</h1>
        <p className="text-gray-600 mt-2">Review and approve new user registrations</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { key: 'all', label: 'All', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            { key: 'approved', label: 'Approved', count: statusCounts.approved },
            { key: 'rejected', label: 'Rejected', count: statusCounts.rejected }
          ].map(status => (
            <button
              key={status.key}
              onClick={() => setStatusFilter(status.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.label} ({status.count})
            </button>
          ))}
        </div>
      </div>

      {/* Registrations Grid - Card Layout */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {filteredRegistrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Registrations Found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No user registrations have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRegistrations.map((registration) => (
              <div key={registration.registration_id} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all flex flex-col">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b-2 border-blue-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {registration.first_name} {registration.last_name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Display: <span className="font-semibold">{registration.display_name}</span>
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 ${getStatusColor(registration.registration_status)}`}>
                      {getStatusIcon(registration.registration_status)}
                      <span className="ml-1 uppercase">{registration.registration_status}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{registration.ethnicity}</span>
                  </div>
                </div>

                {/* Card Body - Fixed Height */}
                <div className="p-4 bg-gray-50">
                  <div className="space-y-3 h-40 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 break-all line-clamp-1">{registration.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{registration.phone_number}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 line-clamp-2">{registration.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">
                          {new Date(registration.submitted_at || registration.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="mx-1">•</span>
                        <span>
                          {new Date(registration.submitted_at || registration.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer - Actions (Always at Bottom) */}
                <div className="p-4 bg-white border-t-2 border-gray-100 mt-auto">
                  <button
                    onClick={() => {
                      setSelectedRegistration(registration);
                      setShowModal(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md"
                  >
                    <Eye className="w-5 h-5" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registration Details Modal - Improved Layout */}
      {showModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full h-[85vh] flex flex-col" style={{ maxWidth: '1400px' }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex-shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Registration Review</h2>
                  <p className="text-blue-100 mt-1">{selectedRegistration.first_name} {selectedRegistration.last_name}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Left Column - User Information */}
              <div className="md:w-1/2 p-6 overflow-y-auto border-r border-gray-200 space-y-4">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">First Name</label>
                    <p className="text-base font-medium text-gray-900">{selectedRegistration.first_name}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Last Name</label>
                    <p className="text-base font-medium text-gray-900">{selectedRegistration.last_name}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Display Name</label>
                    <p className="text-base font-medium text-gray-900">{selectedRegistration.display_name}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ethnicity</label>
                    <p className="text-base font-medium text-gray-900">{selectedRegistration.ethnicity}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                    <p className="text-sm font-medium text-gray-900 break-all">{selectedRegistration.email}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone</label>
                    <p className="text-sm font-medium text-gray-900">{selectedRegistration.phone_number}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Address</label>
                    <p className="text-sm font-medium text-gray-900">{selectedRegistration.address}</p>
                  </div>
                </div>
              </div>

              {/* Registration Info */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  Registration Info
                </h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border-2 ${getStatusColor(selectedRegistration.registration_status)}`}>
                      {getStatusIcon(selectedRegistration.registration_status)}
                      <span className="ml-1 uppercase">{selectedRegistration.registration_status}</span>
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date & Time</label>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedRegistration.submitted_at || selectedRegistration.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              </div>

              {/* Right Column - Birth Certificate */}
              <div className="md:w-1/2 p-6 overflow-y-auto bg-gray-50">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center mb-3">
                    <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Birth Certificate
                  </h3>
                </div>
                {selectedRegistration.birth_certificate_data ? (
                  <div 
                    className="bg-white rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg hover:border-blue-500 transition-all cursor-pointer group relative"
                    onClick={() => setShowImageModal(true)}
                  >
                    <img 
                      src={selectedRegistration.birth_certificate_data} 
                      alt="Birth Certificate"
                      className="w-full h-auto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden flex-col items-center justify-center p-12 text-center">
                      <FileText className="w-16 h-16 text-gray-400 mb-3" />
                      <p className="text-gray-600 font-medium">Birth Certificate Uploaded</p>
                      <p className="text-sm text-gray-500 mt-1">Unable to preview</p>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center pointer-events-none">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                        <div className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2">
                          <Eye className="w-6 h-6" />
                          Click to View Full Size
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-12 text-center border-2 border-gray-300">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No birth certificate uploaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons Footer - Compact Professional Design */}
            {selectedRegistration.registration_status === 'pending' && (
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200 rounded-b-2xl flex-shrink-0">
                <div className="flex gap-3 max-w-2xl mx-auto">
                  {/* Reject Button */}
                  <button
                    onClick={() => {
                      const reason = prompt('Enter rejection reason (optional):');
                      if (reason !== null) {
                        handleReject(selectedRegistration.registration_id, reason);
                      }
                    }}
                    className="flex-1 group relative overflow-hidden bg-white border-2 border-red-200 text-red-600 rounded-lg px-4 py-3 hover:border-red-500 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-red-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      <div className="p-1.5 bg-red-100 rounded-md group-hover:bg-red-200 transition-colors">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm">Reject Registration</p>
                        <p className="text-xs text-red-500">Decline application</p>
                      </div>
                    </div>
                  </button>

                  {/* Approve Button */}
                  <button
                    onClick={() => handleApprove(selectedRegistration.registration_id)}
                    className="flex-1 group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg px-4 py-3 hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
                  >
                    <div className="relative flex items-center justify-center gap-2">
                      <div className="p-1.5 bg-white bg-opacity-20 rounded-md group-hover:bg-opacity-30 transition-all">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm">Approve Registration</p>
                        <p className="text-xs text-green-100">Grant system access</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Size Image Modal with Zoom */}
      {showImageModal && selectedRegistration?.birth_certificate_data && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 flex flex-col z-[60]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-900 bg-opacity-80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg px-4 py-2">
                <p className="text-sm font-bold text-gray-900">
                  {selectedRegistration.first_name} {selectedRegistration.last_name}
                </p>
                <p className="text-xs text-gray-600">Birth Certificate</p>
              </div>
              
              {/* Zoom Controls */}
              <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2">
                <button
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-900 font-bold transition-colors"
                  disabled={zoomLevel <= 50}
                >
                  −
                </button>
                <span className="text-sm font-semibold text-gray-900 min-w-[60px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-900 font-bold transition-colors"
                  disabled={zoomLevel >= 200}
                >
                  +
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setShowImageModal(false);
                setZoomLevel(100);
              }}
              className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-all"
              title="Close (ESC)"
            >
              <XCircle className="w-6 h-6 text-gray-900" />
            </button>
          </div>
            
          {/* Scrollable Image Container */}
          <div className="flex-1 overflow-auto p-8">
            <div className="flex items-start justify-center min-h-full">
              <img 
                src={selectedRegistration.birth_certificate_data} 
                alt="Birth Certificate - Zoomed"
                className="shadow-2xl rounded-lg"
                style={{ 
                  width: `${zoomLevel}%`,
                  maxWidth: 'none',
                  height: 'auto'
                }}
              />
            </div>
          </div>

          {/* Bottom Instructions */}
          <div className="px-6 py-3 bg-gray-900 bg-opacity-80 backdrop-blur-sm text-center">
            <p className="text-sm text-gray-300">
              Use zoom controls to adjust size • Scroll to view • Press <span className="font-bold text-white">ESC</span> to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRegistrations;
