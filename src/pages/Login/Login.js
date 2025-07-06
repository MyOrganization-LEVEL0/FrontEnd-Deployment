// src/pages/Login/Login.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useFormValidation from '../../hooks/useFormValidation';
import { FormInput, SubmitStatus, SubmitButton, validationRules } from '../../components/forms/FormComponents';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/';
  
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
    { email: '', password: '', rememberMe: false },
    { email: validationRules.email, password: validationRules.password }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      setSubmitMessage('error', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await login({
        email: values.email,
        password: values.password
      });
      
      setSubmitMessage('success', 'Login successful! Welcome to BASTA Desserts.');
      
      // Redirect to intended page or dashboard based on user role
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Login failed. Please check your credentials.';
      setSubmitMessage('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show helpful message if user was redirected due to 401
  const showRedirectMessage = location.state?.from && location.state.from.pathname !== '/';

  return (
    <div className="pastel-gradient min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="login-card bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full">
          <div className="pastel-gradient h-3"></div>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
              <p className="text-gray-600">Sign in to your BASTA Desserts account</p>
              
              {showRedirectMessage && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Please log in to continue to your requested page.
                  </p>
                </div>
              )}
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

              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={values.password}
                error={errors.password}
                touched={touched.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="current-password"
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={values.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 block text-sm text-gray-900">Remember me</span>
                </label>

                <Link 
                  to="/forgot-password" 
                  className="text-sm text-purple-500 hover:text-purple-600"
                >
                  Forgot password?
                </Link>
              </div>

              <SubmitButton isSubmitting={isSubmitting}>
                Sign In
              </SubmitButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-purple-500 hover:text-purple-600">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;