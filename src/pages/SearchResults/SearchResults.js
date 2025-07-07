// src/pages/SearchResults/SearchResults.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { recipeService } from '../../services/recipeService';

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Categories from your backend
  const categories = [
    { id: '', name: 'All Categories' },
    { id: 'cakes', name: 'Cakes' },
    { id: 'cookies', name: 'Cookies' },
    { id: 'pastries', name: 'Pastries' },
    { id: 'candy', name: 'Candy' },
    { id: 'custard', name: 'Custard' },
    { id: 'fried_desserts', name: 'Fried Desserts' },
    { id: 'frozen_desserts', name: 'Frozen Desserts' },
    { id: 'gelatin_desserts', name: 'Gelatin Desserts' },
    { id: 'fruit_desserts', name: 'Fruit Desserts' },
    { id: 'pies', name: 'Pies' },
  ];

  // Fetch search results from API
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      
      try {
        let searchResults = [];
        
        if (query || selectedCategory) {
          // Use appropriate endpoint based on what we have
          if (query) {
            // Only search if query has 2+ characters
            if (query.trim().length >= 2) {
              const response = await recipeService.searchRecipes(query, {
                category: selectedCategory || undefined,
                page: currentPage,
                page_size: 50 // Get more results to filter properly
              });
              let allResults = response.results || [];
              
              // SMART SEARCH with PRIORITY FILTERING
              const queryLower = query.toLowerCase().trim();
              
              // Priority 1: Title contains search term
              const titleMatches = allResults.filter(recipe => 
                recipe.title.toLowerCase().includes(queryLower) &&
                recipe.status === 'published'
              );
              
              // Priority 2: Category name contains search term (if no title matches)
              const categoryMatches = titleMatches.length === 0 ? allResults.filter(recipe => 
                (recipe.category_display || recipe.category).toLowerCase().includes(queryLower) &&
                recipe.status === 'published'
              ) : [];
              
              // Priority 3: Description contains search term (if no title/category matches)
              const descriptionMatches = (titleMatches.length === 0 && categoryMatches.length === 0) ? allResults.filter(recipe => 
                recipe.description && recipe.description.toLowerCase().includes(queryLower) &&
                recipe.status === 'published'
              ) : [];
              
              // Combine results with priority order
              searchResults = [...titleMatches, ...categoryMatches, ...descriptionMatches];
              
            } else {
              // Query too short - show no results
              searchResults = [];
            }
            
          } else {
            // Category-only filter using getAllRecipes
            const response = await recipeService.getAllRecipes({
              category: selectedCategory,
              page: currentPage,
              page_size: 12
            });
            // Filter only published recipes
            searchResults = (response.results || []).filter(recipe => 
              recipe.status === 'published'
            );
          }
        } else {
          // No query and no category - show empty results
          searchResults = [];
        }

        // Paginate the filtered results on frontend
        const startIndex = (currentPage - 1) * 12;
        const endIndex = startIndex + 12;
        const paginatedResults = searchResults.slice(startIndex, endIndex);

        // Transform results for display
        const transformedResults = paginatedResults.map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          category: recipe.category,
          categoryName: recipe.category_display || recipe.category,
          time: recipe.prep_time || 30,
          rating: recipe.average_rating || 0,
          author: recipe.author ? `${recipe.author.first_name} ${recipe.author.last_name}` : 'Anonymous',
          image: recipe.featured_image || '/imgs/placeholder-recipe.jpg'
        }));

        setResults(transformedResults);
        setTotalResults(searchResults.length);
        setTotalPages(Math.ceil(searchResults.length / 12));
        
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, selectedCategory, currentPage]);

  const handleCategoryChange = (categoryValue) => {
    setSelectedCategory(categoryValue);
    setCurrentPage(1); // Reset to first page
    
    // Update URL parameters
    const newParams = new URLSearchParams(searchParams);
    if (categoryValue) {
      newParams.set('category', categoryValue);
    } else {
      newParams.delete('category');
    }
    newParams.delete('page'); // Reset page when changing category
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newQuery = formData.get('search').trim();
    
    const newParams = new URLSearchParams();
    if (newQuery) {
      newParams.set('q', newQuery);
    }
    if (selectedCategory) {
      newParams.set('category', selectedCategory);
    }
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'cakes': 'bg-pink-500',
      'cookies': 'bg-yellow-500',
      'pastries': 'bg-amber-500',
      'candy': 'bg-red-500',
      'custard': 'bg-orange-500',
      'fried_desserts': 'bg-amber-500',
      'frozen_desserts': 'bg-blue-500',
      'gelatin_desserts': 'bg-purple-500',
      'fruit_desserts': 'bg-green-500',
      'pies': 'bg-yellow-500',
    };
    return colorMap[category] || 'bg-gray-500';
  };

  return (
    <div className="search-results-container min-h-screen bg-gray-50">
      {/* Search Header */}
      <section className="search-header bg-white shadow-sm py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {query ? `Search Results for "${query}"` : 'Browse Recipes'}
            </h1>
            
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative mb-6">
              <input
                name="search"
                type="text"
                defaultValue={query}
                placeholder="Search recipes (minimum 2 characters)..."
                className="w-full px-5 py-3 pr-12 rounded-full border-2 border-pink-100 focus:outline-none focus:border-pink-300 text-gray-700"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-400 text-white p-2 rounded-full hover:bg-pink-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Category Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <label htmlFor="category-select" className="text-sm font-medium text-gray-700">
                  Category:
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 bg-white text-gray-700"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <p className="text-gray-600 text-sm">
                {loading ? 'Searching...' : `${totalResults} recipe${totalResults !== 1 ? 's' : ''} found`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                    <div className="bg-white p-4 rounded-b-xl shadow-sm">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && results.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No recipes found</h3>
                <p className="text-gray-600 mb-6">
                  {query 
                    ? query.length < 2 
                      ? 'Please enter at least 2 characters to search for recipes.'
                      : `We couldn't find any recipes matching "${query}"${selectedCategory ? ` in the ${categories.find(c => c.id === selectedCategory)?.name} category` : ''}.`
                    : selectedCategory 
                    ? `No recipes available in the ${categories.find(c => c.id === selectedCategory)?.name} category.`
                    : 'Please enter a search term or select a category to find recipes.'
                  }
                </p>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link 
                      to="/recipes" 
                      className="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      Browse All Recipes
                    </Link>
                    <Link 
                      to="/categories" 
                      className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      View Categories
                    </Link>
                  </div>
                  {(query || selectedCategory) && (
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        setSearchParams({});
                      }}
                      className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Results Grid */}
            {!loading && results.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map(recipe => (
                    <div 
                      key={recipe.id} 
                      className="recipe-result-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/recipe/${recipe.id}`)}
                    >
                      <div className="relative overflow-hidden">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title}
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            e.target.src = '/imgs/placeholder-recipe.jpg';
                          }}
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 ${getCategoryColor(recipe.category)} text-white text-xs font-medium rounded-full`}>
                            {recipe.categoryName}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {recipe.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {recipe.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {recipe.time} min
                            </span>
                            {recipe.rating > 0 && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {recipe.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">by {recipe.author}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Previous
                      </button>
                      
                      <span className="px-4 py-2 text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed transition"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchResults;