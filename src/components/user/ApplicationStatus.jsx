import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl } from '../../config/api';
import { FileText, Download, Eye, CheckCircle, Clock, XCircle, Image as ImageIcon, Upload } from 'lucide-react';

const ApplicationStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showFormsModal, setShowFormsModal] = useState(false);

  // Required forms/certificates with their images
  const requiredForms = [
    {
      id: 1,
      name: 'Certificate of Confirmation Application Form (Page 1)',
      image: '/form-png/Coc-Form_page-0001.jpg',
      description: 'Personal Information Section'
    },
    {
      id: 2,
      name: 'Certificate of Confirmation Application Form (Page 2)',
      image: '/form-png/Coc-Form_page-0002.jpg',
      description: 'Family Background Information'
    },
    {
      id: 3,
      name: 'Certificate of Confirmation Application Form (Page 3)',
      image: '/form-png/Coc-Form_page-0003.jpg',
      description: 'Educational Background'
    },
    {
      id: 4,
      name: 'Certificate of Confirmation Application Form (Page 4)',
      image: '/form-png/Coc-Form_page-0004.jpg',
      description: 'Employment History'
    },
    {
      id: 5,
      name: 'Certificate of Confirmation Application Form (Page 5)',
      image: '/form-png/Coc-Form_page-0005.jpg',
      description: 'Supporting Documents Checklist'
    },
    {
      id: 6,
      name: 'Certificate of Confirmation Application Form (Page 6)',
      image: '/form-png/Coc-Form_page-0006.jpg',
      description: 'Declaration and Signature'
    }
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('ncip_token');
      console.log('Fetching applications...');
      console.log('Token:', token ? 'exists' : 'missing');
      
      // Dynamic API URL helper
      // Using centralized API configuration

      const response = await fetch(`${getApiUrl()}/api/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success && data.applications) {
        console.log('Found applications:', data.applications.length);
        // Map the applications to the format expected by the UI
        const mappedApplications = data.applications.map(app => ({
          id: app.application_id,
          application_id: app.application_id,
          service: app.service_type || app.purpose || 'Certificate of Confirmation',
          status: formatStatus(app.application_status),
          dateSubmitted: new Date(app.submitted_at || app.created_at).toLocaleDateString(),
          dateUpdated: new Date(app.updated_at).toLocaleDateString()
        }));
        console.log('Mapped applications:', mappedApplications);
        setApplications(mappedApplications);
      } else {
        console.log('No applications found or invalid response');
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      'draft': 'Draft',
      'submitted': 'Pending Review',
      'under_review': 'Under Review',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Evaluation':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-2xl text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Application Status</h1>
              <p className="text-blue-100 text-lg">
                Track the status of your submitted applications
              </p>
            </div>
            <button
              onClick={() => setShowFormsModal(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 border border-white/30"
            >
              <FileText className="w-5 h-5" />
              View Required Forms
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900">Your Applications</h2>
            </div>
            <div className="p-6 space-y-4">
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Applications Yet</h3>
                  <p className="text-gray-500 mb-6">You haven't submitted any applications yet.</p>
                  <button
                    onClick={() => window.location.href = '/user?section=apply'}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-bold"
                  >
                    Submit Your First Application
                  </button>
                </div>
              ) : applications.map((application) => (
                <div key={application.id} className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-900">{application.service}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Submitted: {application.dateSubmitted}
                      </p>
                      <p className="text-sm text-gray-500">Last updated: {application.dateUpdated}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(application.status)} flex items-center gap-2`}>
                      {application.status === 'Approved' && <CheckCircle className="w-4 h-4" />}
                      {application.status === 'Pending Review' && <Clock className="w-4 h-4" />}
                      {application.status === 'Rejected' && <XCircle className="w-4 h-4" />}
                      {application.status}
                    </span>
                  </div>
                  
                  {/* Upload Documents Button */}
                  <button
                    onClick={() => navigate(`/application/${application.id}/documents`)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Required Documents
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Required Forms Modal - Simplified */}
        {showFormsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Required Forms</h2>
                    <p className="text-blue-100 text-sm">Certificate of Confirmation - {requiredForms.length} Pages</p>
                  </div>
                  <button
                    onClick={() => setShowFormsModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Forms Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {requiredForms.map((form, index) => (
                    <div key={form.id} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all">
                      {/* Form Header */}
                      <div className="bg-blue-50 p-4 border-b-2 border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <h3 className="font-bold text-gray-900 text-sm">{form.name}</h3>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{form.description}</p>
                      </div>
                      
                      {/* Form Preview */}
                      <div className="p-4 bg-gray-50">
                        <div className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden aspect-[8.5/11] mb-3">
                          <img 
                            src={form.image} 
                            alt={form.name}
                            className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setSelectedApp(form)}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden flex-col items-center justify-center h-full bg-gray-100">
                            <FileText className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500">Preview unavailable</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedApp(form)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold"
                        >
                          <Eye className="w-4 h-4" />
                          View Full Size
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-6 border-t-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">{requiredForms.length} pages</span> to complete
                  </p>
                  <button
                    onClick={() => setShowFormsModal(false)}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Size View Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[60]" onClick={() => setSelectedApp(null)}>
            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white rounded-t-2xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedApp.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedApp.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="bg-white p-4 max-h-[80vh] overflow-y-auto">
                <img 
                  src={selectedApp.image} 
                  alt={selectedApp.name}
                  className="w-full h-auto shadow-2xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatus;
