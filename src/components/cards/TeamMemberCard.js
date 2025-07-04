// src/components/cards/TeamMemberCard.js
import React from 'react';
import './Cards.css';

const TeamMemberCard = ({ name, role, description, color, image, portfolioUrl }) => {
  const colorClasses = {
    green: 'bg-green-200 text-green-500',
    blue: 'bg-blue-200 text-blue-500',
    purple: 'bg-purple-200 text-purple-500',
    yellow: 'bg-yellow-200 text-yellow-500',
    red: 'bg-red-200 text-red-500',
    pink: 'bg-pink-200 text-pink-500',
    orange: 'bg-orange-200 text-orange-500'
  };

  return (
    <div className="team-member bg-white rounded-xl overflow-hidden shadow-md">
      <div className={`member-image h-64 ${colorClasses[color].split(' ')[0]} flex items-center justify-center`}>
        {image ? (
          <img src={`/${image}`} alt={name} className="h-full object-contain" />
        ) : (
          <svg className="h-24 w-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-1 text-gray-800">{name}</h3>
        <p className={`${colorClasses[color].split(' ')[1]} font-medium mb-3`}>{role}</p>
        <p className="text-gray-600 mb-4">{description}</p>
        {portfolioUrl ? (
          <a 
            href={portfolioUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${colorClasses[color].split(' ')[1]} font-medium hover:underline`}
          >
            View Portfolio
          </a>
        ) : (
          <span className="text-gray-400 font-medium">
            Portfolio Coming Soon
          </span>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;