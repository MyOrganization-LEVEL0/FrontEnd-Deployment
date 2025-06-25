// src/components/common/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <span className="footer-text text-2xl">BASTA Desserts</span>
        <p className="text-gray-400 text-sm mt-1">Delicious recipes for every sweet tooth</p>
        <p className="text-gray-400 text-xs mt-4">&copy; 2025 BASTA Desserts. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;