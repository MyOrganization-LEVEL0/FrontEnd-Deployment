// src/components/cards/CategoryCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cards.css';

const CategoryCard = ({ name, color, description, category }) => {
  const navigate = useNavigate();
  
  const colorClasses = {
    pink: 'bg-pink-200 text-pink-400',
    yellow: 'bg-yellow-100 text-yellow-600',
    amber: 'bg-amber-100 text-amber-500',
    red: 'bg-red-100 text-red-400',
    orange: 'bg-orange-100 text-orange-500',
    blue: 'bg-blue-100 text-blue-400',
    purple: 'bg-purple-100 text-purple-400',
    green: 'bg-green-100 text-green-500'
  };

  // Handle "View All" button click
  const handleViewAll = (e) => {
    e.stopPropagation(); // Prevent card click if you add whole card click later
    
    // Map category names to URL-friendly slugs that match your backend
    const categorySlugMap = {
      'Cakes': 'cakes',
      'Cookies': 'cookies', 
      'Pastries': 'pastries',
      'Candy': 'candy',
      'Custard': 'custard',
      'Fried Desserts': 'fried_desserts',
      'Frozen Desserts': 'frozen_desserts',
      'Gelatin Desserts': 'gelatin_desserts',
      'Fruit Desserts': 'fruit_desserts',
      'Pies': 'pies'
    };

    // Use the category prop if provided, otherwise derive from name
    const categorySlug = category || categorySlugMap[name] || name.toLowerCase().replace(/\s+/g, '_');
    
    // Navigate to search results with category filter
    navigate(`/search?category=${categorySlug}`);
  };

  // Handle whole card click (optional - navigates to same place)
  const handleCardClick = () => {
    const categorySlugMap = {
      'Cakes': 'cakes',
      'Cookies': 'cookies', 
      'Pastries': 'pastries',
      'Candy': 'candy',
      'Custard': 'custard',
      'Fried Desserts': 'fried_desserts',
      'Frozen Desserts': 'frozen_desserts',
      'Gelatin Desserts': 'gelatin_desserts',
      'Fruit Desserts': 'fruit_desserts',
      'Pies': 'pies'
    };

    const categorySlug = category || categorySlugMap[name] || name.toLowerCase().replace(/\s+/g, '_');
    navigate(`/search?category=${categorySlug}`);
  };

  return (
    <div 
      className="category-card rounded-xl overflow-hidden shadow-md bg-white cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleCardClick}
    >
      <div className="relative h-48">
        <div className={`category-image h-full w-full ${colorClasses[color].split(' ')[0]} flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-24 w-24 ${colorClasses[color].split(' ')[1]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
        <div className="category-overlay absolute inset-0 flex items-end">
          <div className="p-4 w-full">
            <h3 className="text-xl font-bold text-white">{name}</h3>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm">{description}</p>
        <div className="mt-3 flex justify-end">
          <button 
            onClick={handleViewAll}
            className={`${colorClasses[color].split(' ')[1]} hover:underline font-medium text-sm transition-colors duration-200`}
          >
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;