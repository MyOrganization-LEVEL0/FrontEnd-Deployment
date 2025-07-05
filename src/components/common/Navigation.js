// src/components/common/Navigation.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  
  // Helper function to check if link is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="logo-text text-3xl font-bold">
            BASTA Desserts
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-6">
          <Link 
            to="/" 
            className={`nav-button px-3 py-2 font-medium ${
              isActive('/') 
                ? 'text-pink-600 border-b-2 border-pink-400' 
                : 'text-pink-400 hover:text-pink-500'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/recipes" 
            className={`nav-button px-3 py-2 font-medium ${
              isActive('/recipes') 
                ? 'text-yellow-600 border-b-2 border-yellow-400' 
                : 'text-yellow-400 hover:text-yellow-500'
            }`}
          >
            Recipes
          </Link>
          <Link 
            to="/categories" 
            className={`nav-button px-3 py-2 font-medium ${
              isActive('/categories') 
                ? 'text-green-600 border-b-2 border-green-400' 
                : 'text-green-400 hover:text-green-500'
            }`}
          >
            Category
          </Link>
          <Link 
            to="/about" 
            className={`nav-button px-3 py-2 font-medium ${
              isActive('/about') 
                ? 'text-blue-600 border-b-2 border-blue-400' 
                : 'text-blue-400 hover:text-blue-500'
            }`}
          >
            About Us
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              {user?.role === 'superadmin' && (
                <Link 
                  to="/superadmin" 
                  className="nav-button px-3 py-2 bg-red-200 text-red-600 rounded-full font-medium hover:bg-red-300 transition"
                >
                  Super Admin
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="nav-button px-3 py-2 bg-orange-200 text-orange-600 rounded-full font-medium hover:bg-orange-300 transition"
                >
                  Admin
                </Link>
              )}
              {(user?.role === 'viewer1' || !user?.role) && (
                <Link 
                  to="/viewer1" 
                  className="nav-button px-3 py-2 bg-blue-200 text-blue-600 rounded-full font-medium hover:bg-blue-300 transition"
                >
                  Dashboard
                </Link>
              )}
              <span className="text-sm text-gray-600">Welcome, {user?.full_name || user?.email}</span>
              <button 
                onClick={handleLogout}
                className="nav-button px-4 py-2 bg-gray-200 text-gray-600 rounded-full font-medium hover:bg-gray-300 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="nav-button px-4 py-2 bg-purple-200 text-purple-600 rounded-full font-medium hover:bg-purple-300 transition"
            >
              Login/Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;