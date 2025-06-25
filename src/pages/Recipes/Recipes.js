// src/pages/Recipes/Recipes.js
import React, { useState } from 'react';
import './Recipes.css';

const Recipes = () => {
  const [selectedLetter, setSelectedLetter] = useState('All');
  const letters = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  return (
    <>
      {/* Hero Section */}
      <section className="pastel-gradient py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">All Recipes</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Browse our complete collection of delicious dessert recipes
            </p>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search for recipes..."
                className="search-input w-full px-5 py-3 rounded-full border-2 border-pink-100 focus:outline-none focus:border-pink-300 shadow-sm"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-400 text-white p-2 rounded-full hover:bg-pink-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Letter Navigation */}
      <section className="py-6 bg-white shadow-sm sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-1 md:gap-2">
            {letters.map(letter => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`letter-nav w-8 h-8 rounded-full flex items-center justify-center text-gray-600 ${
                  selectedLetter === letter ? 'active' : ''
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Sample recipe card - In a real app, this would be mapped from data */}
            <div className="category-card rounded-xl overflow-hidden shadow-md bg-white cursor-pointer">
              <div className="relative h-48">
                <div className="category-image h-full w-full bg-pink-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div className="category-overlay absolute inset-0 flex items-end">
                  <div className="p-4 w-full">
                    <h3 className="text-xl font-bold text-white">Cakes</h3>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm">From classic chocolate to creative layered cakes for any occasion</p>
                <div className="mt-3 flex justify-end">
                  <button className="text-pink-400 hover:underline font-medium text-sm">View All</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Recipes;