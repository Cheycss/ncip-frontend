import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock, User, Mail, Phone, MapPin, FileText, AlertCircle, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import axios from 'axios';
import { getApiUrl } from '../../config/api';

const PendingRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [rejectionComment, setRejectionComment] = useState('');
  const [processing, setProcessing] = useState(false);
  const [documentZoom, setDocumentZoom] = useState(75); // Start at 75%
  const [showFullImage, setShowFullImage] = useState(false);
  const [documentRotation, setDocumentRotation] = useState(0);

  useEffect(() => {
    fetchPendingRegistrations();
  }, []);

  // Using centralized API configuration

  const fetchPendingRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${getApiUrl()}/api/pending-registrations/pending`);
      if (response.data.success) {
        setRegistrations(response.data.registrations);
      }
    } catch (error) {
      console.error('Error fetching pending registrations:', error);
      alert('Failed to fetch pending registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowModal(true);
    setActionType('view');
    setRejectionComment('');
    setDocumentZoom(75); // Reset to 75% zoom
    setDocumentRotation(0); // Reset rotation
    setShowFullImage(false); // Reset full image view
  };

  const confirmApproval = async () => {
    if (!selectedRegistration) return;

    try {
      setProcessing(true);
      const response = await axios.post(`${getApiUrl()}/api/pending-registrations/approve/${selectedRegistration.id}`);
      
      if (response.data.success) {
        alert('Registration approved successfully! User account has been created.');
        await fetchPendingRegistrations(); // Refresh the list
        setShowModal(false);
        setSelectedRegistration(null);
      } else {
        const errorMessage = response.data.message || 'Failed to approve registration. Please try again.';
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error approving registration:', error);
      const errorMessage = error.response?.data?.message || 'Failed to approve registration. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  const confirmRejection = async () => {
    if (!selectedRegistration || !rejectionComment.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessing(true);
      const response = await axios.post(`${getApiUrl()}/api/pending-registrations/reject/${selectedRegistration.id}`, {
        comment: rejectionComment.trim()
      });
      
      if (response.data.success) {
        alert('Registration rejected successfully! User has been notified via email.');
        await fetchPendingRegistrations(); // Refresh the list
        setShowModal(false);
        setSelectedRegistration(null);
        setRejectionComment('');
      } else {
        alert(response.data.message || 'Failed to reject registration');
      }
    } catch (error) {
      console.error('Error rejecting registration:', error);
      alert('Failed to reject registration');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const renderModal = () => {
    if (!showModal || !selectedRegistration) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center">
              <User className="mr-2 h-5 w-5" />
              {actionType === 'approve' && 'Approve Registration'}
              {actionType === 'reject' && 'Reject Registration'}
              {actionType === 'view' && 'Registration Review'}
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-white hover:text-gray-200 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

          {/* Modal Content - Split Layout */}
          <div className="flex h-[80vh]">
            {/* Left Side - Document Preview */}
            <div className="w-1/2 flex flex-col bg-gray-50 border-r">
              {/* Document Header - Simple */}
              <div className="p-4 bg-white border-b">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Birth Certificate</h3>
                </div>
              </div>
              
              {/* Document Viewer - Simple Scrollable */}
              <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
                {selectedRegistration.birth_certificate_data ? (
                  <div className="bg-white rounded-lg shadow-lg border cursor-pointer transition-all hover:shadow-xl" onClick={() => setShowFullImage(true)}>
                    <img 
                      src={selectedRegistration.birth_certificate_data} 
                      alt="Birth Certificate" 
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No Document Uploaded</p>
                      <p className="text-sm">The applicant did not provide a birth certificate</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Document Info Footer */}
              {selectedRegistration.birth_certificate_data && (
                <div className="p-3 bg-white border-t">
                  <p className="text-xs text-gray-500 text-center">
                    💡 Click image to open detailed view with zoom controls
                  </p>
                </div>
              )}
            </div>

            {/* Right Side - Registration Details */}
            <div className="w-1/2 flex flex-col">
              {/* Details Header */}
              <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  Registration Details
                </h3>
                <p className="text-xs text-gray-500 mt-1">Review the information provided by the applicant</p>
              </div>
              
              {/* Scrollable Details */}
              <div className="flex-1 p-5 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 200px)' }}>
                <div className="space-y-4">

                  {/* Personal Information */}
                  <div className="space-y-3">
                    <h4 className="text-base font-semibold text-gray-800 flex items-center pb-2 border-b border-gray-200">
                      <User className="h-4 w-4 text-blue-600 mr-2" />
                      Personal Information
                    </h4>
                  
                    <div className="space-y-3">
                      {/* Full Name - Highlighted */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Full Name</span>
                          </div>
                        </div>
                        <p className="font-bold text-lg text-gray-900 mt-1">
                          {selectedRegistration.first_name} {selectedRegistration.last_name}
                        </p>
                      </div>

                      {/* Other Information - Compact Grid */}
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <User className="h-3 w-3 text-gray-500 mr-2" />
                            <span className="text-xs font-medium text-gray-600">Display Name</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{selectedRegistration.display_name}</span>
                        </div>

                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 text-gray-500 mr-2" />
                            <span className="text-xs font-medium text-gray-600">Email</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]" title={selectedRegistration.email}>
                            {selectedRegistration.email}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 text-gray-500 mr-2" />
                            <span className="text-xs font-medium text-gray-600">Phone</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{selectedRegistration.phone_number || 'Not provided'}</span>
                        </div>

                        <div className="flex items-start justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 text-gray-500 mr-2 mt-0.5" />
                            <span className="text-xs font-medium text-gray-600">Address</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 text-right max-w-[200px] leading-tight">
                            {selectedRegistration.address}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <User className="h-3 w-3 text-gray-500 mr-2" />
                            <span className="text-xs font-medium text-gray-600">Ethnicity</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{selectedRegistration.ethnicity}</span>
                        </div>

                        <div className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 text-green-600 mr-2" />
                            <span className="text-xs font-medium text-green-700">Submitted</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{formatDate(selectedRegistration.submitted_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              
              {/* Fixed Action Buttons */}
              <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-t">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                  Review Actions
                </h4>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setActionType('approve');
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold flex items-center justify-center transition-all shadow-md hover:shadow-lg text-sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Registration
                  </button>
                  
                  <button
                    onClick={() => {
                      setActionType('reject');
                      setRejectionComment('');
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 font-semibold flex items-center justify-center transition-all shadow-md hover:shadow-lg text-sm"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Registration
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Overlays */}
          {actionType === 'approve' && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
              <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Approve Registration</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    This will create a user account for <strong>{selectedRegistration.first_name} {selectedRegistration.last_name}</strong> and send them an approval email.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActionType('view')}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmApproval}
                    disabled={processing}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold transition-all shadow-md"
                  >
                    {processing ? 'Approving...' : 'Confirm Approval'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {actionType === 'reject' && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
              <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Reject Registration</h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Please provide a reason for rejecting <strong>{selectedRegistration.first_name} {selectedRegistration.last_name}</strong>'s registration.
                  </p>
                </div>
                <textarea
                  value={rejectionComment}
                  onChange={(e) => setRejectionComment(e.target.value)}
                  placeholder="Enter rejection reason (required)..."
                  className="w-full p-4 border-2 border-gray-300 rounded-lg mb-6 h-32 resize-none focus:border-blue-500 focus:outline-none transition-colors"
                />
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActionType('view')}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRejection}
                    disabled={processing || !rejectionComment.trim()}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold transition-all shadow-md"
                  >
                    {processing ? 'Rejecting...' : 'Confirm Rejection'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Full Image Modal with Zoom Controls */}
        {showFullImage && selectedRegistration.birth_certificate_data && (
          <div className="fixed inset-0 bg-black bg-opacity-95 flex flex-col z-50">
            {/* Top Controls Bar */}
            <div className="flex items-center justify-between p-4 bg-black bg-opacity-50">
              <div className="flex items-center space-x-4">
                <h3 className="text-white font-semibold">Birth Certificate - Detailed View</h3>
                
                {/* Zoom Controls */}
                <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-3 py-2">
                  <button
                    onClick={() => setDocumentZoom(Math.max(25, documentZoom - 25))}
                    className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  
                  <span className="text-white text-sm font-medium min-w-[50px] text-center">
                    {documentZoom}%
                  </span>
                  
                  <button
                    onClick={() => setDocumentZoom(Math.min(300, documentZoom + 25))}
                    className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  
                  <div className="w-px h-4 bg-white bg-opacity-30 mx-2"></div>
                  
                  <button
                    onClick={() => setDocumentRotation((documentRotation + 90) % 360)}
                    className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    title="Rotate"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => {
                      setDocumentZoom(100);
                      setDocumentRotation(0);
                    }}
                    className="px-2 py-1 text-xs text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setShowFullImage(false)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
            
            {/* Image Container */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-4">
              <div 
                className="transition-transform"
                style={{
                  transform: `scale(${documentZoom / 100}) rotate(${documentRotation}deg)`,
                  transformOrigin: 'center center'
                }}
              >
                <img
                  src={selectedRegistration.birth_certificate_data}
                  alt="Birth Certificate - Full View"
                  className="max-w-none h-auto rounded-lg shadow-2xl"
                  style={{ maxHeight: 'none' }}
                />
              </div>
            </div>
            
            {/* Bottom Info */}
            <div className="p-3 bg-black bg-opacity-50 text-center">
              <p className="text-white text-sm opacity-75">
                Use mouse wheel to zoom • Drag to pan • Use controls above for precise adjustments
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Compact Professional Header */}
      <div className="mb-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  {registrations.length > 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{registrations.length}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Registrations</h1>
                  <p className="text-gray-600 text-sm">Review and manage pending registration requests</p>
                </div>
              </div>
              
              {/* Status Summary */}
              <div className="flex items-center gap-3">
                {registrations.length > 0 ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-yellow-800">
                        {registrations.length} Pending
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Ready to Review</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">All Clear</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registrations List */}
      {registrations.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No pending registration requests to review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {registrations.map((registration) => (
            <div key={registration.id} className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {registration.first_name} {registration.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">{registration.display_name}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-md font-medium">
                    Pending
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{registration.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{registration.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{formatDate(registration.submitted_at)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(registration)}
                  className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Review Registration
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default PendingRegistrations;
