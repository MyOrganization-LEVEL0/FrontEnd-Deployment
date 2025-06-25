// src/components/cards/CategoryCard.js
import React from 'react';
import './Cards.css';

const CategoryCard = ({ name, color, description }) => {
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

  return (
    <div className="category-card rounded-xl overflow-hidden shadow-md bg-white cursor-pointer">
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
          <button className={`${colorClasses[color].split(' ')[1]} hover:underline font-medium text-sm`}>
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;