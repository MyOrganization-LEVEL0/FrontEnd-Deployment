// src/components/common/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="bg-white shadow-md px-4 py-3">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="logo-text text-3xl font-bold">
            BASTA Desserts
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-6">
          <Link to="/" className="nav-button px-3 py-2 text-pink-400 font-medium">
            Home
          </Link>
          <Link to="/recipes" className="nav-button px-3 py-2 text-yellow-400 font-medium">
            Recipes
          </Link>
          <Link to="/categories" className="nav-button px-3 py-2 text-green-400 font-medium">
            Category
          </Link>
          <Link to="/about" className="nav-button px-3 py-2 text-blue-400 font-medium">
            About Us
          </Link>
          <Link to="/login" className="nav-button px-4 py-2 bg-purple-200 text-purple-600 rounded-full font-medium hover:bg-purple-300 transition">
            Login/Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;