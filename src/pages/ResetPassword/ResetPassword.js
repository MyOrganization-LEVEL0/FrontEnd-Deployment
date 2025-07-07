// src/pages/ResetPassword/ResetPassword.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import useFormValidation from '../../hooks/useFormValidation';
import { FormInput, SubmitStatus, SubmitButton, validationRules } from '../../components/forms/FormComponents';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tokenValidating, setTokenValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const token = searchParams.get('token');

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
    { 
      password: '', 
      password_confirm: '' 
    },
    { 
      password: validationRules.password,
      password_confirm: [
        (value) => !value ? 'Please confirm your password' : '',
        (value, allValues) => value && value !== allValues.password ? 'Passwords do not match' : ''
      ]
    }
  );

  useEffect(() => {
    if (!token) {
      setTokenValidating(false);
      setTokenValid(false);
      return;
    }

    let isMounted = true; // Prevent state updates if component unmounts

    // Validate token with backend
    const validateToken = async () => {
      try {
        const response = await authService.validateResetToken(token);
        if (isMounted) {
          setTokenValid(true);
          setUserEmail(response.user_email);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        if (isMounted) {
          setTokenValid(false);
          setSubmitMessage('error', 'This password reset link is invalid or has expired.');
        }
      } finally {
        if (isMounted) {
          setTokenValidating(false);
        }
      }
    };

    validateToken();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [token]); // Removed setSubmitMessage from dependencies to prevent re-runs

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      setSubmitMessage('error', 'Please check your password requirements');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await authService.resetPassword({
        token,
        password: values.password,
        password_confirm: values.password_confirm
      });
      
      setSubmitMessage('success', 'Password reset successful! Redirecting to login...');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Password reset successful! You can now log in with your new password.' 
          }
        });
      }, 3000);
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Something went wrong. Please try again.';
      setSubmitMessage('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state while validating token
  if (tokenValidating) {
    return (
      <div className="pastel-gradient min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="login-card bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full">
            <div className="pastel-gradient h-3"></div>
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Validating Token</h2>
              <p className="text-gray-600">Please wait while we verify your reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid || !token) {
    return (
      <div className="pastel-gradient min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="login-card bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full">
            <div className="pastel-gradient h-3"></div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Reset Link</h2>
              <p className="text-gray-600 mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <div className="space-y-3">
                <Link 
                  to="/forgot-password" 
                  className="block w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Request New Reset Link
                </Link>
                <Link 
                  to="/login" 
                  className="block w-full text-purple-600 hover:text-purple-700 py-2"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Valid token - show reset form
  return (
    <div className="pastel-gradient min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="login-card bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full">
          <div className="pastel-gradient h-3"></div>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
              <p className="text-gray-600">
                Enter your new password for <strong>{userEmail}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <SubmitStatus status={submitStatus} />
              
              <FormInput
                label="New Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={values.password}
                error={errors.password}
                touched={touched.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
                required
                helpText="Password must be at least 8 characters long"
              />

              <FormInput
                label="Confirm New Password"
                name="password_confirm"
                type="password"
                placeholder="••••••••"
                value={values.password_confirm}
                error={errors.password_confirm}
                touched={touched.password_confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
                required
              />

              <SubmitButton isSubmitting={isSubmitting}>
                Reset Password
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

export default ResetPassword;