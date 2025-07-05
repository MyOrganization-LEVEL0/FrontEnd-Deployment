// src/pages/ForgotPassword/ForgotPassword.js
import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import useFormValidation from '../../hooks/useFormValidation';
import { FormInput, SubmitStatus, SubmitButton, validationRules } from '../../components/forms/FormComponents';

const ForgotPassword = () => {
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
    setSubmitMessage
  } = useFormValidation(
    { email: '' },
    { email: validationRules.email }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      setSubmitMessage('error', 'Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await authService.forgotPassword(values.email);
      setSubmitMessage('success', 'Password reset instructions have been sent to your email!');
      
    } catch (error) {
      setSubmitMessage('error', error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pastel-gradient min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="login-card bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full">
          <div className="pastel-gradient h-3"></div>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
              <p className="text-gray-600">Enter your email and we'll send you reset instructions</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <SubmitStatus status={submitStatus} />
              
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

              <SubmitButton isSubmitting={isSubmitting}>
                Send Reset Instructions
              </SubmitButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="font-medium text-purple-500 hover:text-purple-600">
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;