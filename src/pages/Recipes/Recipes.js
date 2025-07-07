// src/pages/Recipes/Recipes.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { recipeService } from '../../services/recipeService';
import './Recipes.css';

const Recipes = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedLetter, setSelectedLetter] = useState(searchParams.get('letter') || 'All');
  const [searchTerm, setSearchTerm] = useState(''); // Remove search from URL params since we redirect
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const letters = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // Fetch recipes from API
  const fetchRecipes = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: page,
        page_size: 50, // Get more recipes to filter properly
      };

      const response = await recipeService.getAllRecipes(params);
      
      // Filter out pending recipes - only show published recipes on public page
      let filteredRecipes = (response.results || []).filter(recipe => 
        recipe.status === 'published'
      );

      // Apply letter filter on frontend
      if (selectedLetter !== 'All') {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.title.toLowerCase().startsWith(selectedLetter.toLowerCase())
        );
      }

      // Transform API data to match component structure
      const transformedRecipes = filteredRecipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        category_display: recipe.category_display || recipe.category,
        image: recipe.featured_image || '/imgs/placeholder-recipe.jpg',
        author: recipe.author,
        prep_time: recipe.prep_time,
        cook_time: recipe.cook_time,
        servings: recipe.servings,
        average_rating: recipe.average_rating || 0,
        views_count: recipe.views_count || 0,
        created_at: recipe.created_at,
        slug: recipe.slug
      }));

      // Paginate the filtered results on frontend
      const startIndex = (page - 1) * 12;
      const endIndex = startIndex + 12;
      const paginatedRecipes = transformedRecipes.slice(startIndex, endIndex);

      setRecipes(paginatedRecipes);
      
      // Use the actual filtered results count
      const actualCount = transformedRecipes.length;
      setTotalPages(Math.ceil(actualCount / 12));
      setCurrentPage(page);

    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to load recipes. Please try again later.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLetter]); // Keep dependency so it refetches when letter changes

  // Initial load
  useEffect(() => {
    fetchRecipes(1);
  }, [fetchRecipes]);

  // Update URL params when filters change (but not search since it redirects)
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedLetter !== 'All') params.set('letter', selectedLetter);
    
    setSearchParams(params);
  }, [selectedLetter, setSearchParams]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to search results page with query
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Handle letter filter
  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    setCurrentPage(1); // Reset to first page when changing letter
  };

  // Get category background color
  const getCategoryBgColor = (category) => {
    const colorMap = {
      'cakes': 'bg-pink-200',
      'cookies': 'bg-yellow-200',
      'pastries': 'bg-amber-200',
      'candy': 'bg-red-200',
      'custard': 'bg-orange-200',
      'fried_desserts': 'bg-amber-200',
      'frozen_desserts': 'bg-blue-200',
      'gelatin_desserts': 'bg-purple-200',
      'fruit_desserts': 'bg-green-200',
      'pies': 'bg-yellow-200',
    };
    return colorMap[category] || 'bg-pink-200';
  };

  // Get category icon color
  const getCategoryIconColor = (category) => {
    const colorMap = {
      'cakes': 'text-pink-400',
      'cookies': 'text-yellow-400',
      'pastries': 'text-amber-400',
      'candy': 'text-red-400',
      'custard': 'text-orange-400',
      'fried_desserts': 'text-amber-400',
      'frozen_desserts': 'text-blue-400',
      'gelatin_desserts': 'text-purple-400',
      'fruit_desserts': 'text-green-400',
      'pies': 'text-yellow-400',
    };
    return colorMap[category] || 'text-pink-400';
  };

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
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search for recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input w-full px-5 py-3 rounded-full border-2 border-pink-100 focus:outline-none focus:border-pink-300 shadow-sm"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-400 text-white p-2 rounded-full hover:bg-pink-500 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
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
                onClick={() => handleLetterClick(letter)}
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
          {/* Results Info */}
          <div className="mb-8 text-center">
            {loading ? (
              <p className="text-gray-600">Loading recipes...</p>
            ) : error ? (
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => fetchRecipes(currentPage)}
                  className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition"
                >
                  Try Again
                </button>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton cards
              [...Array(8)].map((_, index) => (
                <div key={index} className="recipe-grid-card rounded-xl overflow-hidden shadow-md bg-white">
                  <div className="relative bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : recipes.length === 0 && !loading ? (
              // No results message
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No recipes found</h3>
                <p className="text-gray-600 mb-4">
                  {selectedLetter !== 'All'
                    ? `No recipes found starting with "${selectedLetter}"`
                    : 'No recipes available at the moment'}
                </p>
                {selectedLetter !== 'All' && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedLetter('All');
                    }}
                    className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition"
                  >
                    Show All Recipes
                  </button>
                )}
              </div>
            ) : (
              // Recipe cards
              recipes.map((recipe) => (
                <div 
                  key={recipe.id} 
                  className="recipe-grid-card rounded-xl overflow-hidden shadow-md bg-white cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  <div className="relative">
                    {recipe.image ? (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`category-image h-full w-full ${getCategoryBgColor(recipe.category)} flex items-center justify-center ${recipe.image ? 'hidden' : ''}`}
                      style={recipe.image ? {display: 'none'} : {}}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-24 w-24 ${getCategoryIconColor(recipe.category)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <div className="category-overlay absolute inset-0 flex items-end">
                      <div className="p-4 w-full">
                        <h3 className="text-xl font-bold text-white">{recipe.title}</h3>
                        {recipe.average_rating > 0 && (
                          <div className="flex items-center mt-1">
                            <div className="flex items-center text-yellow-300 text-sm">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {recipe.average_rating.toFixed(1)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm">{recipe.description || `Delicious ${recipe.category_display.toLowerCase()} recipe`}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {recipe.prep_time && `${recipe.prep_time} min`}
                        {recipe.prep_time && recipe.servings && ' • '}
                        {recipe.servings && `${recipe.servings} servings`}
                      </div>
                      <button className="text-pink-400 hover:underline font-medium text-sm">View Recipe</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && recipes.length > 0 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                    fetchRecipes(currentPage - 1);
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                    fetchRecipes(currentPage + 1);
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Recipes;