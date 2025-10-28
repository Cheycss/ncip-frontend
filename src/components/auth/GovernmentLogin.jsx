import React, { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle, Lock, Mail, Info } from 'lucide-react';
import { GovernmentForm, FormField, TextInput, FormActions } from '../common/GovernmentForm';

const GovernmentLogin = ({ onLogin, isLoading = false, error = null }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Official Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="gov-h1 text-center">Sign In</h1>
          <p className="gov-body text-center text-gray-600">
            Access your NCIP Certificate of Confirmation account
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">Official Government Service</p>
              <p className="text-blue-700">
                This is a secure government website. Your information is protected and will only be used 
                for official NCIP services.
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="gov-card">
          <div className="gov-card-body">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-red-800 mb-1">Sign In Failed</h3>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <GovernmentForm onSubmit={handleSubmit}>
              <FormField
                label="Email Address"
                required
                error={fieldErrors.email}
                helpText="Use the email address associated with your NCIP account"
                id="email"
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <TextInput
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    error={!!fieldErrors.email}
                    autoComplete="email"
                    className="pl-10"
                  />
                </div>
              </FormField>

              <FormField
                label="Password"
                required
                error={fieldErrors.password}
                id="password"
              >
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <TextInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    required
                    error={!!fieldErrors.password}
                    autoComplete="current-password"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </FormField>

              <FormActions
                primaryAction={{
                  label: "Sign In",
                  disabled: !formData.email || !formData.password
                }}
                isLoading={isLoading}
                alignment="center"
              />
            </GovernmentForm>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center space-y-4">
          <div className="space-y-2">
            <a 
              href="/forgot-password" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Forgot your password?
            </a>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-3">
              Don't have an account?
            </p>
            <a 
              href="/register" 
              className="gov-btn gov-btn-secondary w-full"
            >
              Create New Account
            </a>
          </div>
        </div>

        {/* Help Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>If you're having trouble signing in:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Check that your email and password are correct</li>
              <li>Make sure your account has been activated</li>
              <li>Try resetting your password if you've forgotten it</li>
            </ul>
            <div className="pt-2 border-t border-gray-200 mt-3">
              <p>
                For technical support, contact us at{' '}
                <a href="mailto:support@ncip.gov.ph" className="text-blue-600 hover:text-blue-800">
                  support@ncip.gov.ph
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Shield className="w-4 h-4" />
            <span>
              Secured by 256-bit SSL encryption • Official Government Website
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentLogin;
