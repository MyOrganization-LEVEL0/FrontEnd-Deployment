// src/components/forms/ContactForm.js
import React from 'react';
import { contactService } from '../../services/contactService';
import useFormValidation from '../../hooks/useFormValidation';
import { FormInput, SubmitStatus, SubmitButton, validationRules } from './FormComponents';
import './Forms.css';

const ContactForm = () => {
  const {
    values,
    errors,
    touched,
    submitStatus,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    validateAll,
    setSubmitMessage,
    resetForm
  } = useFormValidation(
    {
      name: '',
      email: '',
      phone: '',
      subject: 'general',
      priority: 'medium',
      message: ''
    },
    {
      name: validationRules.name,
      email: validationRules.email,
      phone: validationRules.phone,
      message: validationRules.message
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      setSubmitMessage('error', 'Please complete all required fields correctly.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await contactService.submitMessage(values);
      setSubmitMessage('success', response.message);
      resetForm();
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.details) {
        const details = error.response.data.details;
        const firstError = Object.values(details)[0];
        if (Array.isArray(firstError)) {
          errorMessage = firstError[0];
        }
      }
      
      setSubmitMessage('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjectOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'recipe', label: 'Recipe Question' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'business', label: 'Business Inquiry' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SubmitStatus status={submitStatus} />
      
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Name"
          name="name"
          type="text"
          placeholder="Your full name"
          value={values.name}
          error={errors.name}
          touched={touched.name}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="name"
          required
        />
        
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={values.email}
          error={errors.email}
          touched={touched.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          required
        />
      </div>

      {/* Phone and Subject Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="+1 (555) 123-4567 (optional)"
          value={values.phone}
          error={errors.phone}
          touched={touched.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="tel"
        />
        
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            value={values.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
          >
            {subjectOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Priority */}
      <div className="mb-4">
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={values.priority}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
        >
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Tell us how we can help you..."
          className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 resize-y ${
            touched.message && errors.message
              ? 'border-red-500 bg-red-50 focus:ring-red-300'
              : 'border-gray-300 focus:ring-purple-300'
          }`}
        />
        <div className="mt-1 flex justify-between items-center">
          {touched.message && errors.message && (
            <div className="flex items-center text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.message}
            </div>
          )}
          <span className={`text-xs ${values.message.length > 1800 ? 'text-red-500' : 'text-gray-500'}`}>
            {values.message.length}/2000
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <SubmitButton isSubmitting={isSubmitting}>
          {isSubmitting ? 'Sending Message...' : 'Send Message'}
        </SubmitButton>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          We typically respond within 24-48 hours. For urgent matters, please mark your message as high priority.
        </p>
      </div>
    </form>
  );
};

export default ContactForm;