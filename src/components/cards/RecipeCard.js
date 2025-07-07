// src/components/cards/RecipeCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cards.css';

const RecipeCard = ({ color, title, description, time, recipeId, image }) => {
  const navigate = useNavigate();
  
  const colorClasses = {
    pink: 'bg-pink-50',
    yellow: 'bg-yellow-50',
    green: 'bg-green-50'
  };

  const iconColorClasses = {
    pink: 'bg-pink-200 text-pink-400',
    yellow: 'bg-yellow-200 text-yellow-400',
    green: 'bg-green-200 text-green-400'
  };

  const textColorClasses = {
    pink: 'text-pink-500',
    yellow: 'text-yellow-500',
    green: 'text-green-500'
  };

  const handleViewRecipe = () => {
    if (recipeId) {
      // Navigate to actual recipe detail page
      navigate(`/recipe/${recipeId}`);
    } else {
      // For static/demo recipes, navigate to recipes page
      navigate('/recipes');
    }
  };

  return (
    <div className={`recipe-card ${colorClasses[color]} rounded-xl overflow-hidden shadow-md cursor-pointer h-96`} onClick={handleViewRecipe}>
      {/* Image or Icon Area */}
      <div className="h-48 relative overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // Fallback to icon if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback Icon (shows when no image or image fails) */}
        <div 
          className={`absolute inset-0 ${iconColorClasses[color]} flex items-center justify-center ${image ? 'hidden' : ''}`}
          style={image ? {display: 'none'} : {}}
        >
          <svg className={`h-24 w-24 ${iconColorClasses[color].split(' ')[1]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
          </svg>
        </div>
      </div>
      
      {/* Content Area - Increased height for better button visibility */}
      <div className="p-6 h-48 flex flex-col justify-between">
        <div className="flex-grow">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-1">{title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">{description}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${textColorClasses[color]} font-medium`}>{time}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when button is clicked
              handleViewRecipe();
            }}
            className={`${textColorClasses[color]} font-medium hover:underline transition-colors duration-200`}
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;