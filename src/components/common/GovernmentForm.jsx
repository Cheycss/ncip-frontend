import React from 'react';
import { AlertCircle, CheckCircle, Info, HelpCircle } from 'lucide-react';

// Form Container Component
export const GovernmentForm = ({ children, onSubmit, className = "" }) => {
  return (
    <form 
      onSubmit={onSubmit} 
      className={`gov-single-column space-y-6 ${className}`}
      noValidate
    >
      {children}
    </form>
  );
};

// Form Section Component
export const FormSection = ({ title, description, children, required = false }) => {
  return (
    <div className="gov-section">
      <div className="mb-6">
        <h2 className="gov-h2 flex items-center gap-2">
          {title}
          {required && <span className="text-red-500 text-lg">*</span>}
        </h2>
        {description && (
          <p className="gov-body text-gray-600">{description}</p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

// Form Field Component
export const FormField = ({ 
  label, 
  children, 
  error, 
  helpText, 
  required = false,
  id 
}) => {
  return (
    <div className="gov-form-group">
      <label 
        htmlFor={id}
        className={`gov-label ${required ? 'gov-label-required' : ''}`}
      >
        {label}
      </label>
      
      {children}
      
      {helpText && (
        <div className="gov-helper-text flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}
      
      {error && (
        <div className="gov-error-message">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

// Text Input Component
export const TextInput = ({ 
  id, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error = false,
  disabled = false,
  maxLength,
  pattern,
  autoComplete,
  'aria-describedby': ariaDescribedBy
}) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      maxLength={maxLength}
      pattern={pattern}
      autoComplete={autoComplete}
      aria-describedby={ariaDescribedBy}
      className={`gov-input ${error ? 'gov-input-error' : ''}`}
    />
  );
};

// Select Component
export const Select = ({ 
  id, 
  value, 
  onChange, 
  children, 
  required = false,
  error = false,
  disabled = false,
  'aria-describedby': ariaDescribedBy
}) => {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      aria-describedby={ariaDescribedBy}
      className={`gov-input ${error ? 'gov-input-error' : ''}`}
    >
      {children}
    </select>
  );
};

// Textarea Component
export const Textarea = ({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error = false,
  disabled = false,
  rows = 4,
  maxLength,
  'aria-describedby': ariaDescribedBy
}) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      rows={rows}
      maxLength={maxLength}
      aria-describedby={ariaDescribedBy}
      className={`gov-input resize-none ${error ? 'gov-input-error' : ''}`}
    />
  );
};

// Checkbox Component
export const Checkbox = ({ 
  id, 
  checked, 
  onChange, 
  label, 
  required = false,
  error = false,
  disabled = false
}) => {
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="mt-1 w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
      />
      <label 
        htmlFor={id}
        className={`text-sm text-gray-700 ${required ? 'font-medium' : ''} ${error ? 'text-red-600' : ''}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    </div>
  );
};

// Radio Group Component
export const RadioGroup = ({ 
  name, 
  value, 
  onChange, 
  options, 
  required = false,
  error = false,
  disabled = false
}) => {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div key={option.value} className="flex items-start gap-3">
          <input
            id={`${name}-${option.value}`}
            name={name}
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className="mt-1 w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <label 
            htmlFor={`${name}-${option.value}`}
            className={`text-sm text-gray-700 ${error ? 'text-red-600' : ''}`}
          >
            {option.label}
            {option.description && (
              <div className="text-xs text-gray-500 mt-1">{option.description}</div>
            )}
          </label>
        </div>
      ))}
    </div>
  );
};

// File Upload Component
export const FileUpload = ({ 
  id, 
  onChange, 
  accept, 
  multiple = false,
  required = false,
  error = false,
  disabled = false,
  maxSize = "5MB",
  allowedTypes = "PDF, PNG, JPG"
}) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onChange(files);
  };

  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          id={id}
          type="file"
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          required={required}
          disabled={disabled}
          className="hidden"
        />
        <label 
          htmlFor={id}
          className="cursor-pointer block"
        >
          <div className="space-y-2">
            <div className="text-gray-600">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-sm">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Click to upload
              </span>
              <span className="text-gray-500"> or drag and drop</span>
            </div>
            <div className="text-xs text-gray-500">
              {allowedTypes} up to {maxSize}
            </div>
          </div>
        </label>
      </div>
      
      <div className="text-xs text-gray-600 space-y-1">
        <p><strong>File Requirements:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Accepted formats: {allowedTypes}</li>
          <li>Maximum file size: {maxSize}</li>
          <li>Files must be clear and readable</li>
          <li>Ensure all text and details are visible</li>
        </ul>
      </div>
    </div>
  );
};

// Form Actions Component
export const FormActions = ({ 
  children, 
  primaryAction, 
  secondaryAction,
  isLoading = false,
  alignment = "right" // "left", "center", "right", "between"
}) => {
  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center", 
    right: "justify-end",
    between: "justify-between"
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 ${alignmentClasses[alignment]}`}>
      {secondaryAction && (
        <button
          type="button"
          onClick={secondaryAction.onClick}
          disabled={isLoading}
          className="gov-btn gov-btn-secondary"
        >
          {secondaryAction.label}
        </button>
      )}
      
      {primaryAction && (
        <button
          type="submit"
          disabled={isLoading || primaryAction.disabled}
          className="gov-btn gov-btn-primary"
        >
          {isLoading ? (
            <>
              <div className="gov-loading" />
              Processing...
            </>
          ) : (
            primaryAction.label
          )}
        </button>
      )}
      
      {children}
    </div>
  );
};

// Success Message Component
export const SuccessMessage = ({ title, message, actions }) => {
  return (
    <div className="gov-card">
      <div className="gov-card-body text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="gov-h2 text-green-800 mb-2">{title}</h2>
        <p className="gov-body text-gray-600 mb-6">{message}</p>
        {actions && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// Progress Indicator Component
export const ProgressIndicator = ({ steps, currentStep }) => {
  return (
    <div className="gov-progress mb-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className={`gov-progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isCompleted ? 'bg-green-600 text-white' :
                isActive ? 'bg-blue-600 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {isCompleted ? <CheckCircle className="w-4 h-4" /> : stepNumber}
              </div>
              <span className="ml-2">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-12 h-0.5 bg-gray-200 mx-4" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default {
  GovernmentForm,
  FormSection,
  FormField,
  TextInput,
  Select,
  Textarea,
  Checkbox,
  RadioGroup,
  FileUpload,
  FormActions,
  SuccessMessage,
  ProgressIndicator
};
