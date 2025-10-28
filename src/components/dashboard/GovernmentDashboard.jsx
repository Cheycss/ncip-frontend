import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download, 
  Plus, 
  Search,
  Filter,
  Calendar,
  User,
  Bell,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

const GovernmentDashboard = ({ user, applications = [], onNewApplication }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredApplications, setFilteredApplications] = useState(applications);

  // Filter applications based on search and status
  useEffect(() => {
    let filtered = applications;
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id?.toString().includes(searchTerm) ||
        app.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, filterStatus]);

  // Calculate statistics
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending' || app.status === 'submitted').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    certificates: applications.filter(app => app.status === 'certificate_issued').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
      case 'submitted':
        return 'gov-status-pending';
      case 'approved':
      case 'certificate_issued':
        return 'gov-status-approved';
      case 'rejected':
        return 'gov-status-rejected';
      default:
        return 'gov-status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
      case 'submitted':
        return <Clock className="w-4 h-4" />;
      case 'approved':
      case 'certificate_issued':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <main id="main-content" className="gov-container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="gov-h1">
                Welcome, {user?.first_name || user?.firstName || 'User'}
              </h1>
              <p className="gov-body text-gray-600">
                Manage your Certificate of Confirmation applications and track their progress.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="gov-btn gov-btn-secondary flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </button>
              <button 
                onClick={onNewApplication}
                className="gov-btn gov-btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Application
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="gov-grid gov-grid-4 mb-8">
          <div className="gov-card">
            <div className="gov-card-body text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-body text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</div>
              <div className="text-sm text-gray-600">Under Review</div>
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-body text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.approved}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-body text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.certificates}</div>
              <div className="text-sm text-gray-600">Certificates Issued</div>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Your Applications</h2>
                <p className="text-blue-100 text-sm">Track and manage your certificate applications</p>
              </div>
              
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/10 border border-blue-400/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 min-w-[200px]"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-4 h-4" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-white/10 border border-blue-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 appearance-none min-w-[120px]"
                  >
                    <option value="all" className="text-gray-900">All Status</option>
                    <option value="pending" className="text-gray-900">Pending</option>
                    <option value="approved" className="text-gray-900">Approved</option>
                    <option value="rejected" className="text-gray-900">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="gov-card-body">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterStatus !== 'all' ? 'No matching applications' : 'No applications yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first Certificate of Confirmation application.'
                  }
                </p>
                {(!searchTerm && filterStatus === 'all') && (
                  <button 
                    onClick={onNewApplication}
                    className="gov-btn gov-btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Application
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div 
                    key={application.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => window.location.href = `/application/${application.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            Application #{application.id}
                          </h3>
                          <div className={`gov-status ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span className="capitalize">
                              {application.status?.replace('_', ' ') || 'Pending'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Purpose: {application.purpose || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Submitted: {application.created_at 
                                ? new Date(application.created_at).toLocaleDateString()
                                : 'Unknown'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {application.status === 'certificate_issued' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle certificate download
                            }}
                            className="gov-btn gov-btn-success flex items-center gap-1 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        )}
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-800 text-sm mb-4">
                Get assistance with your applications or learn more about the Certificate of Confirmation process.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/help" className="gov-btn gov-btn-secondary text-sm">
                  View Help Guide
                </a>
                <a href="/contact" className="gov-btn gov-btn-secondary text-sm">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GovernmentDashboard;
