// src/pages/SignUp/SignUp.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useFormValidation from '../../hooks/useFormValidation';
import { FormInput, SubmitStatus, SubmitButton, validationRules } from '../../components/forms/FormComponents';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
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
    { fullname: '', email: '', password: '', confirmPassword: '' },
    { 
      fullname: validationRules.fullname,
      email: validationRules.email, 
      password: validationRules.password,
      confirmPassword: validationRules.confirmPassword
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      setSubmitMessage('error', 'Please complete all required fields to create your account.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await signup({
        full_name: values.fullname,
        email: values.email,
        password: values.password
      });
      
      setSubmitMessage('success', 'Account created successfully! Welcome to BASTA Desserts.');
      setTimeout(() => navigate('/'), 2000);
      
    } catch (error) {
      setSubmitMessage('error', error.response?.data?.message || 'Sign up failed. Please try again.');
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Join BASTA Desserts</h2>
              <p className="text-gray-600">Create your account to start sharing recipes</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <SubmitStatus status={submitStatus} />
              
              <FormInput
                label="Full Name"
                name="fullname"
                type="text"
                placeholder="John Doe"
                value={values.fullname}
                error={errors.fullname}
                touched={touched.fullname}
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
                autoComplete="new-password"
                required
              />

              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={values.confirmPassword}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
                required
              />

              <SubmitButton isSubmitting={isSubmitting}>
                Create Account
              </SubmitButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-purple-500 hover:text-purple-600">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;