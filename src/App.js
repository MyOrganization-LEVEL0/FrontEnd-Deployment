// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navigation from './components/common/Navigation';
import Footer from './components/common/Footer';
import Landing from './pages/Landing/Landing';
import Categories from './pages/Categories/Categories';
import About from './pages/About/About';
import Recipes from './pages/Recipes/Recipes';
import RecipeDetail from './pages/RecipeDetail/RecipeDetail';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import SearchResults from './pages/SearchResults/SearchResults';
import SuperadminDashboard from './pages/SuperadminDashboard/SuperadminDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import Viewer1Dashboard from './pages/Viewer1Dashboard/Viewer1Dashboard';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ProtectedRoute from './auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Routes>
              <Route path="/login" element={
                <>
                  <Navigation />
                  <Login />
                  <Footer />
                </>
              } />
              <Route path="/signup" element={
                <>
                  <Navigation />
                  <SignUp />
                  <Footer />
                </>
              } />
              <Route path="/forgot-password" element={
                <>
                  <Navigation />
                  <ForgotPassword />
                  <Footer />
                </>
              } />
              <Route path="*" element={
                <>
                  <Navigation />
                  <main className="flex-grow">
                    <ErrorBoundary>
                      <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/recipes" element={<Recipes />} />
                        <Route path="/recipe/:id" element={<RecipeDetail />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/superadmin" element={
                          <ProtectedRoute requiredRole="superadmin">
                            <SuperadminDashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin" element={
                          <ProtectedRoute requiredRole="admin">
                            <AdminDashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/viewer1" element={
                          <ProtectedRoute>
                            <Viewer1Dashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="*" element={
                          <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                              <p className="text-gray-600 mb-6">Page not found</p>
                              <a href="/" className="text-pink-500 hover:text-pink-600">
                                Go back home
                              </a>
                            </div>
                          </div>
                        } />
                      </Routes>
                    </ErrorBoundary>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;