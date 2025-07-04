// src/pages/Login/Login.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFormValidation from '../../hooks/useFormValidation';
import { FormInput, SubmitStatus, SubmitButton, validationRules } from '../../components/forms/FormComponents';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Replace this with your actual API call
      console.log('Login data:', { email: values.email, password: values.password });
      
      setSubmitMessage('success', 'Login successful! Welcome to BASTA Desserts.');
      setTimeout(() => navigate('/'), 2000);
      
    } catch (error) {
      setSubmitMessage('error', 'Login failed. Please check your credentials.');
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access your favorite recipes</p>
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
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={values.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-500 focus:ring-purple-400 border-gray-300 rounded"
                  />
                  <span className="ml-2 block text-sm text-gray-700">Remember me</span>
                </label>
                
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-500 hover:text-purple-600 font-medium transition"
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
                  Sign up now
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