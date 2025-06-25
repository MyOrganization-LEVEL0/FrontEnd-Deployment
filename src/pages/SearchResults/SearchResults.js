// src/pages/SearchResults/SearchResults.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import RecipeCard from '../../components/cards/RecipeCard';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: '',
    time: '',
    sortBy: 'relevance'
  });

  // Mock search results - replace with API call
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: 'Classic Leche Flan',
          description: 'A creamy and smooth Filipino custard dessert made with eggs and milk.',
          category: 'Custard',
          difficulty: 'Medium',
          time: 80,
          rating: 4.8,
          author: 'Maria Santos',
          image: '/imgs/leche-flan.jpg'
        },
        {
          id: 2,
          title: 'Ube Halaya',
          description: 'Traditional Filipino purple yam dessert that\'s creamy and delicious.',
          category: 'Kakanin',
          difficulty: 'Easy',
          time: 45,
          rating: 4.9,
          author: 'Juan Dela Cruz',
          image: '/imgs/ube-halaya.jpg'
        },
        {
          id: 3,
          title: 'Biko',
          description: 'Sweet rice cake with coconut milk and brown sugar topping.',
          category: 'Kakanin',
          difficulty: 'Easy',
          time: 60,
          rating: 4.7,
          author: 'Ana Reyes',
          image: '/imgs/biko.jpg'
        }
      ];
      
      // Filter results based on query
      const filtered = mockResults.filter(recipe => 
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.description.toLowerCase().includes(query.toLowerCase()) ||
        recipe.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(filtered);
      setLoading(false);
    }, 1000);
  }, [query, category]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="search-results-container min-h-screen bg-gray-50">
      {/* Search Header */}
      <section className="search-header bg-white shadow-sm py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {query ? `Search Results for "${query}"` : 'All Recipes'}
            </h1>
            
            {/* Search Bar */}
            <form className="relative mb-4">
              <input
                type="text"
                defaultValue={query}
                placeholder="Search for recipes..."
                className="w-full px-5 py-3 pr-12 rounded-full border-2 border-pink-100 focus:outline-none focus:border-pink-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-400 text-white p-2 rounded-full hover:bg-pink-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            <p className="text-gray-600">
              {loading ? 'Searching...' : `Found ${results.length} recipe${results.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                
                {/* Difficulty Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Difficulty</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="difficulty"
                        value=""
                        checked={filters.difficulty === ''}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-600">All</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="difficulty"
                        value="easy"
                        checked={filters.difficulty === 'easy'}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-600">Easy</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="difficulty"
                        value="medium"
                        checked={filters.difficulty === 'medium'}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-600">Medium</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="difficulty"
                        value="hard"
                        checked={filters.difficulty === 'hard'}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-600">Hard</span>
                    </label>
                  </div>
                </div>

                {/* Time Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Cooking Time</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="time"
                        value=""
                        checked={filters.time === ''}
                        onChange={(e) => handleFilterChange('time', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-600">Any</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="time"
                        value="30"
                        checked={filters.time === '30'}
                        onChange={(e) => handleFilterChange('time', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-600">Under 30 min</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="time"
                        value="60"
                        checked={filters.time === '60'}
                        onChange={(e) => handleFilterChange('time', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-600">Under 1 hour</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="time"
                        value="120"
                        checked={filters.time === '120'}
                        onChange={(e) => handleFilterChange('time', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-600">Under 2 hours</span>
                    </label>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                  <div className="space-y-2">
                    {['Cakes', 'Cookies', 'Kakanin', 'Custard', 'Pies'].map(cat => (
                      <label key={cat} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                        />
                        <span className="text-gray-600">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                  Clear All Filters
                </button>
              </div>
            </aside>

            {/* Results Grid */}
            <div className="lg:w-3/4">
              {/* Sort Options */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {loading ? 'Loading...' : 'Results'}
                </h2>
                <select 
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="time">Quickest First</option>
                </select>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                      <div className="bg-white p-4 rounded-b-xl">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Results */}
              {!loading && results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map(recipe => (
                    <div key={recipe.id} className="recipe-result-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <Link to={`/recipe/${recipe.id}`}>
                        <div className="relative">
                          <img 
                            src={recipe.image} 
                            alt={recipe.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {e.target.src = '/imgs/default-recipe.png'}}
                          />
                          <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                            {recipe.difficulty}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 text-gray-800 hover:text-pink-600 transition-colors">
                            {recipe.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {recipe.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {recipe.time} min
                            </span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {recipe.rating}
                            </span>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm text-gray-500">
                              by <span className="text-pink-600 hover:underline">{recipe.author}</span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && results.length === 0 && (
                <div className="text-center py-16">
                  <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No recipes found</h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any recipes matching "{query}". Try adjusting your search or filters.
                  </p>
                  <div className="space-x-4">
                    <Link to="/recipes" className="inline-block px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                      Browse All Recipes
                    </Link>
                    <Link to="/categories" className="inline-block px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                      View Categories
                    </Link>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {!loading && results.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {[1, 2, 3, 4, 5].map(page => (
                      <button
                        key={page}
                        className={`px-4 py-2 rounded-lg ${
                          page === 1 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Searches */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Searches</h2>
          <div className="flex flex-wrap gap-3">
            {['Leche Flan', 'Ube Halaya', 'Bibingka', 'Maja Blanca', 'Biko', 'Taho', 'Suman', 'Kakanin'].map(term => (
              <Link
                key={term}
                to={`/search?q=${encodeURIComponent(term)}`}
                className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchResults;