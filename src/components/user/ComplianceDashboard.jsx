import React from 'react';
import { CheckCircle, Clock, XCircle, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';

const ComplianceDashboard = ({ 
  compliance, 
  deadline, 
  daysRemaining 
}) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getDeadlineColor = (days) => {
    if (days > 14) return 'text-green-600 bg-green-50 border-green-200';
    if (days > 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (days > 0) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getDeadlineIcon = (days) => {
    if (days <= 0) return '🚨';
    if (days <= 7) return '⚠️';
    return '📅';
  };

  return (
    <div className="space-y-6">
      {/* Deadline Warning - Enhanced */}
      {daysRemaining !== null && daysRemaining !== undefined && (
        <div className={`rounded-2xl border-2 p-6 shadow-xl ${getDeadlineColor(daysRemaining)} relative overflow-hidden`}>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <Calendar className="w-full h-full" />
          </div>
          
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="text-6xl animate-pulse">{getDeadlineIcon(daysRemaining)}</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <h3 className="font-bold text-xl">
                  {daysRemaining > 0 ? (
                    <>Deadline: {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining</>
                  ) : daysRemaining === 0 ? (
                    <>⚠️ Deadline: Today!</>
                  ) : (
                    <>🚨 Deadline Passed</>
                  )}
                </h3>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 mb-3">
                <p className="text-sm font-medium">
                  {deadline ? (
                    <>📅 Submit all requirements by <span className="font-bold">{new Date(deadline).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span></>
                  ) : (
                    <>No deadline set</>
                  )}
                </p>
              </div>
              
              {daysRemaining <= 7 && daysRemaining > 0 && (
                <div className="bg-white/70 backdrop-blur-sm border-2 border-current rounded-lg p-3 animate-pulse">
                  <p className="text-sm font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Upload all missing documents now or your application will be automatically cancelled!
                  </p>
                </div>
              )}
              {daysRemaining <= 0 && (
                <div className="bg-white/70 backdrop-blur-sm border-2 border-current rounded-lg p-3">
                  <p className="text-sm font-bold flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Your application may be cancelled if requirements are not complete!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compliance Stats */}
      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-xl font-bold">Application Progress</h2>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-6 overflow-hidden mb-3">
            <div
              className={`h-full transition-all duration-500 flex items-center justify-center text-xs font-bold ${getProgressColor(compliance.percentage)}`}
              style={{ width: `${compliance.percentage}%` }}
            >
              {compliance.percentage > 10 && `${compliance.percentage}%`}
            </div>
          </div>
          <p className="text-right font-bold text-xl">{compliance.percentage}% Complete</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 p-6">
          {/* Total Requirements */}
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-900">Total</span>
            </div>
            <p className="text-3xl font-bold text-blue-900">{compliance.total}</p>
            <p className="text-xs text-blue-700 mt-1">Requirements</p>
          </div>

          {/* Approved */}
          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-green-900">Approved</span>
            </div>
            <p className="text-3xl font-bold text-green-900">{compliance.approved}</p>
            <p className="text-xs text-green-700 mt-1">Documents</p>
          </div>

          {/* Pending */}
          <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-yellow-600 p-2 rounded-lg">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-yellow-900">Pending</span>
            </div>
            <p className="text-3xl font-bold text-yellow-900">
              {compliance.submitted - compliance.approved}
            </p>
            <p className="text-xs text-yellow-700 mt-1">Review</p>
          </div>

          {/* Missing */}
          <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-red-600 p-2 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-red-900">Missing</span>
            </div>
            <p className="text-3xl font-bold text-red-900">{compliance.missing}</p>
            <p className="text-xs text-red-700 mt-1">Documents</p>
          </div>
        </div>

        {/* Status Message */}
        <div className="px-6 pb-6">
          {compliance.missing === 0 && compliance.approved === compliance.total ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-green-900">All Requirements Complete!</p>
                <p className="text-sm text-green-700">Your application is ready for final review.</p>
              </div>
            </div>
          ) : compliance.missing === 0 ? (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-center gap-3">
              <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-yellow-900">All Documents Submitted</p>
                <p className="text-sm text-yellow-700">
                  Waiting for admin review. {compliance.submitted - compliance.approved} document(s) pending.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-900">Action Required</p>
                <p className="text-sm text-red-700">
                  Please upload {compliance.missing} missing document{compliance.missing !== 1 ? 's' : ''} to complete your application.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Breakdown - Simplified */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          Summary
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <span className="text-green-800 font-medium">✓ Approved</span>
            <span className="font-bold text-green-900 text-lg">{compliance.approved} / {compliance.total}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
            <span className="text-yellow-800 font-medium">⏳ Pending</span>
            <span className="font-bold text-yellow-900 text-lg">{compliance.submitted - compliance.approved}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
            <span className="text-red-800 font-medium">✗ Missing</span>
            <span className="font-bold text-red-900 text-lg">{compliance.missing}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;
