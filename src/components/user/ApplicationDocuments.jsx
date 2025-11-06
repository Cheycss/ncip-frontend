import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, FileText } from 'lucide-react';
import RequirementsList from './RequirementsList';
import ComplianceDashboard from './ComplianceDashboard';
import axios from 'axios';
import { getApiUrl } from '../../config/api';

const ApplicationDocuments = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compliance, setCompliance] = useState({
    total: 0,
    submitted: 0,
    approved: 0,
    missing: 0,
    percentage: 0
  });

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      const token = localStorage.getItem('ncip_token');
      
      console.log('Loading application:', applicationId);
      console.log('Token:', token ? 'exists' : 'missing');
      
      // Using centralized API URL configuration

      const response = await axios.get(
        `${getApiUrl()}/api/applications/${applicationId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      console.log('API Response:', response.data);

      if (response.data.success && response.data.application) {
        setApplication(response.data.application);
      } else if (response.data.applications && response.data.applications.length > 0) {
        // Handle if it returns an array instead
        setApplication(response.data.applications[0]);
      } else {
        setError('Application not found');
      }
    } catch (err) {
      console.error('Error loading application:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleComplianceUpdate = (complianceData) => {
    setCompliance(complianceData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Application not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Extract purpose_id from application
  // Map purpose name to purpose_id
  const purposeMap = {
    'Employment': 1,
    'Educational Assistance': 2,
    'Business Permit': 3,
    'Land Title': 4,
    'Housing Assistance': 5,
    'Medical Assistance': 6,
    'Legal Documentation': 7,
    'Tribal Membership': 8,
    'Other': 9
  };
  
  const purposeId = application.purpose_id || purposeMap[application.purpose] || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-all duration-200 hover:gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-1 tracking-tight">Document Submission</h1>
                  <div className="flex items-center gap-2 text-blue-100">
                    <span className="text-sm">Application</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-mono font-bold">
                      #{application.application_number || application.application_id}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <p className="text-xs text-blue-100 mb-1">Purpose</p>
                  <p className="font-bold text-sm">
                    {application.purpose || 'Certificate of Confirmation'}
                  </p>
                </div>
                
                <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <p className="text-xs text-blue-100 mb-1">Submitted</p>
                  <p className="font-bold text-sm">
                    {application.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="bg-white/25 backdrop-blur-md px-6 py-4 rounded-2xl border-2 border-white/30 shadow-xl">
                <p className="text-xs text-blue-100 mb-2 uppercase tracking-wider">Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    application.application_status === 'approved' ? 'bg-green-400' :
                    application.application_status === 'rejected' ? 'bg-red-400' :
                    'bg-yellow-400'
                  }`}></div>
                  <p className="font-bold text-2xl capitalize">
                    {application.application_status || 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Requirements List (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Required Documents
              </h2>
              <p className="text-gray-600 mb-6">
                Upload all required documents to complete your application.
                Documents marked with <span className="text-red-500 font-bold">*</span> are mandatory.
              </p>
              
              <RequirementsList
                applicationId={parseInt(applicationId)}
                purposeId={purposeId}
                onComplianceUpdate={handleComplianceUpdate}
              />
            </div>
          </div>

          {/* Right: Compliance Dashboard (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ComplianceDashboard
                compliance={compliance}
                deadline={application.submission_deadline}
                daysRemaining={application.days_remaining}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDocuments;
