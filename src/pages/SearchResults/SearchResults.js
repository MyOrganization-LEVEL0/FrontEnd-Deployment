// src/pages/SearchResults/SearchResults.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import RecipeCard from '../../components/cards/RecipeCard';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  // Filipino dessert categories
  const categories = [
    { id: '', name: 'All Categories' },
    { id: 'kakanin', name: 'Kakanin' },
    { id: 'leche-flan', name: 'Leche Flan' },
    { id: 'ube-desserts', name: 'Ube Desserts' },
    { id: 'coconut-desserts', name: 'Coconut Desserts' },
    { id: 'rice-desserts', name: 'Rice Desserts' },
    { id: 'frozen-treats', name: 'Frozen Treats' },
    { id: 'traditional-sweets', name: 'Traditional Sweets' },
    { id: 'bibingka', name: 'Bibingka' },
  ];

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
          category: 'leche-flan',
          categoryName: 'Leche Flan',
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
          category: 'ube-desserts',
          categoryName: 'Ube Desserts',
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
          category: 'kakanin',
          categoryName: 'Kakanin',
          difficulty: 'Easy',
          time: 60,
          rating: 4.7,
          author: 'Ana Reyes',
          image: '/imgs/biko.jpg'
        },
        {
          id: 4,
          title: 'Bibingka',
          description: 'Traditional Filipino rice cake cooked in clay pots.',
          category: 'bibingka',
          categoryName: 'Bibingka',
          difficulty: 'Medium',
          time: 45,
          rating: 4.6,
          author: 'Carmen Lopez',
          image: '/imgs/bibingka.jpg'
        },
        {
          id: 5,
          title: 'Maja Blanca',
          description: 'Coconut pudding with corn kernels and cheese toppings.',
          category: 'coconut-desserts',
          categoryName: 'Coconut Desserts',
          difficulty: 'Easy',
          time: 35,
          rating: 4.5,
          author: 'Rosa Martinez',
          image: '/imgs/maja-blanca.jpg'
        },
        {
          id: 6,
          title: 'Suman',
          description: 'Glutinous rice cake wrapped in banana leaves.',
          category: 'kakanin',
          categoryName: 'Kakanin',
          difficulty: 'Medium',
          time: 90,
          rating: 4.4,
          author: 'Luis Garcia',
          image: '/imgs/suman.jpg'
        }
      ];
      
      // Filter results based on query and category
      let filtered = mockResults;
      
      // Filter by search query
      if (query) {
        filtered = filtered.filter(recipe => 
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.description.toLowerCase().includes(query.toLowerCase()) ||
          recipe.categoryName.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      // Filter by category
      if (selectedCategory) {
        filtered = filtered.filter(recipe => recipe.category === selectedCategory);
      }
      
      setResults(filtered);
      setLoading(false);
    }, 1000);
  }, [query, selectedCategory]);

  const handleCategoryChange = (categoryValue) => {
    setSelectedCategory(categoryValue);
    
    // Update URL parameters
    const newParams = new URLSearchParams(searchParams);
    if (categoryValue) {
      newParams.set('category', categoryValue);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newQuery = formData.get('search');
    
    const newParams = new URLSearchParams(searchParams);
    if (newQuery) {
      newParams.set('q', newQuery);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
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
                placeholder="Search for recipes..."
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
                {loading ? 'Searching...' : `${results.length} recipe${results.length !== 1 ? 's' : ''} found`}
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

            {/* Results Grid */}
            {!loading && results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(recipe => (
                  <div key={recipe.id} className="recipe-result-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <Link to={`/recipe/${recipe.id}`}>
                      <div className="relative overflow-hidden">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title}
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-pink-500 text-white text-xs font-medium rounded-full">
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
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">
                              {recipe.rating}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">{recipe.time} min</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-500">
                            by <span className="text-pink-600 font-medium">{recipe.author}</span>
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
                <div className="max-w-md mx-auto">
                  <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No recipes found</h3>
                  <p className="text-gray-600 mb-6">
                    {query 
                      ? `We couldn't find any recipes matching "${query}"${selectedCategory ? ` in the ${categories.find(c => c.id === selectedCategory)?.name} category` : ''}.`
                      : 'No recipes available in this category.'
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
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Searches */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Filipino Desserts</h2>
            <div className="flex flex-wrap gap-3">
              {[
                'Leche Flan', 'Ube Halaya', 'Bibingka', 'Maja Blanca', 
                'Biko', 'Taho', 'Suman', 'Kakanin', 'Coconut Desserts'
              ].map(term => (
                <Link
                  key={term}
                  to={`/search?q=${encodeURIComponent(term)}`}
                  className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors text-sm font-medium"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchResults;