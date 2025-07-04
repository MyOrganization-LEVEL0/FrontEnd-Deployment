// src/components/forms/FormComponents.js
import React from 'react';

// Validation rules
export const validationRules = {
  email: [
    (value) => !value ? 'Email is required' : '',
    (value) => value && !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email address' : ''
  ],
  password: [
    (value) => !value ? 'Password is required' : '',
    (value) => value && value.length < 6 ? 'Password must be at least 6 characters' : ''
  ],
  fullname: [
    (value) => !value ? 'Full name is required' : '',
    (value) => value && value.length < 2 ? 'Name must be at least 2 characters' : ''
  ],
  confirmPassword: [
    (value) => !value ? 'Please confirm your password' : '',
    (value, allValues) => value && value !== allValues.password ? 'Passwords do not match' : ''
  ]
};

// Form Input Component
export const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  value, 
  error, 
  touched, 
  onChange, 
  onBlur, 
  autoComplete,
  required = false 
}) => {
  const hasError = touched && error;
  
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
          hasError 
            ? 'border-red-500 bg-red-50 focus:ring-red-300' 
            : 'border-gray-300 focus:ring-purple-300'
        }`}
      />
      {hasError && (
        <div className="mt-1 flex items-center text-red-600 text-sm">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

// Submit Status Component
export const SubmitStatus = ({ status }) => {
  if (!status.message) return null;
  
  const isSuccess = status.type === 'success';
  
  return (
    <div className={`p-4 rounded-lg mb-4 flex items-center ${
      isSuccess 
        ? 'bg-green-50 text-green-800 border border-green-200' 
        : 'bg-red-50 text-red-800 border border-red-200'
    }`}>
      {isSuccess ? (
        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )}
      {status.message}
    </div>
  );
};

// Submit Button Component
export const SubmitButton = ({ isSubmitting, disabled, children, onClick }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting || disabled}
      onClick={onClick}
      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium transition-all duration-200 ${
        isSubmitting || disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-purple-500 hover:bg-purple-600 hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400'
      }`}
    >
      {isSubmitting ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};