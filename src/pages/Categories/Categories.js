// src/pages/Categories/Categories.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '../../components/cards/CategoryCard';
import { categories } from '../../data/categories';
import './Categories.css';

const Categories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Handle search - same as Recipes page
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to search results page with query
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="pastel-gradient py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Dessert Categories</h1>
          <p className="text-lg text-gray-700 mb-8">Explore our delicious dessert recipes by category</p>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input w-full px-5 py-3 rounded-full border-2 border-pink-100 focus:outline-none"
              placeholder="Search for recipes..."
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-400 text-white p-2 rounded-full hover:bg-pink-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <button className="px-4 py-2 rounded-full bg-pink-400 text-white font-medium">
            All Categories
          </button>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Categories;