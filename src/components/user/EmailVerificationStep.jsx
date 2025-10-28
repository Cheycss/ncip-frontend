import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const EmailVerificationStep = ({
  formData,
  handleInputChange,
  verificationSent,
  emailVerified,
  verificationCode,
  setVerificationCode,
  sendVerificationCode,
  verifyEmailCode,
  resendCode,
  isLoading,
  errors,
  countdown,
  formatCountdown,
  canResend
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-600">We need to verify your email address before continuing</p>
        {!emailVerified && !verificationSent && formData.email && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Email verification required:</strong> Please verify your email address to continue.
            </p>
          </div>
        )}
      </div>
      
      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } ${emailVerified ? 'bg-green-50 border-green-300' : ''}`}
            placeholder="your.email@gmail.com"
            disabled={emailVerified}
          />
          {emailVerified && (
            <CheckCircle className="absolute right-3 top-3.5 h-5 w-5 text-green-500" />
          )}
        </div>
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      {/* Verify Button */}
      {!verificationSent && !emailVerified && (
        <button
          onClick={sendVerificationCode}
          disabled={isLoading || !formData.email}
          className="w-full bg-blue-100 text-blue-700 py-3 px-6 rounded-xl font-semibold hover:bg-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
          ) : (
            <>
              <Shield className="h-5 w-5" />
              <span>Send Verification Code</span>
            </>
          )}
        </button>
      )}

      {/* Verification Code Input */}
      {verificationSent && !emailVerified && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              We've sent a 6-digit verification code to <strong>{formData.email}</strong>
            </p>
            {countdown > 0 && (
              <div className="mt-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-blue-900">
                  Code expires in: <span className="font-mono text-lg">{formatCountdown(countdown)}</span>
                </p>
              </div>
            )}
            {countdown === 0 && verificationSent && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700 font-medium">
                  ⏰ Verification code expired. Please request a new one.
                </p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(value);
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl font-mono tracking-widest ${
                errors.verificationCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="000000"
              maxLength={6}
            />
            {errors.verificationCode && <p className="text-red-500 text-sm mt-1">{errors.verificationCode}</p>}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={resendCode}
              disabled={isLoading || !canResend}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                !canResend 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {!canResend && countdown > 0 ? `Resend in ${formatCountdown(countdown)}` : 'Resend Code'}
            </button>
            <button
              onClick={verifyEmailCode}
              disabled={isLoading || verificationCode.length !== 6 || countdown === 0}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
              ) : countdown === 0 ? (
                'Code Expired'
              ) : (
                'Verify'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success State */}
      {emailVerified && (
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Email verified successfully!</span>
          </div>
          <p className="text-sm text-green-600 mt-1">You can now proceed to the next step.</p>
        </div>
      )}
    </motion.div>
  );
};

export default EmailVerificationStep;
