// src/pages/Viewer1Dashboard/Viewer1Dashboard.js
import React, { useState, useEffect } from 'react';
import './Viewer1Dashboard.css';
import EnhancedRecipeForm from './EnhancedRecipeForm';

const Viewer1Dashboard = () => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);

  // Mock user data
  const user = {
    id: 1,
    username: 'john123456',
    email: 'john123@gmail.com',
    firstName: 'john michael',
    lastName: 'villarosa',
    memberSince: '6/28/2025',
    stats: {
      recipes: recipes.length,
      reviews: 0,
      favorites: savedRecipes.length
    }
  };

  // Mock data initialization
  useEffect(() => {
    // User's recipes - matches your RecipeDetail.js structure exactly
    setRecipes([
      {
        id: 1,
        title: 'Classic Leche Flan',
        description: 'A creamy and smooth Filipino custard dessert made with eggs and milk.',
        ingredients: [
          '1 cup granulated sugar (for caramel)',
          '1/4 cup water',
          '10 large egg yolks',
          '1 can (14 oz) sweetened condensed milk',
          '1 can (12 oz) evaporated milk',
          '1 tsp vanilla extract (optional)'
        ],
        instructions: [
          'In a saucepan, combine 1 cup sugar and 1/4 cup water. Cook over medium heat without stirring until sugar dissolves and turns golden amber (about 10 minutes).',
          'Quickly pour the hot caramel into your llanera or baking dish, tilting to coat the bottom evenly. Set aside to cool and harden.',
          'In a large bowl, gently whisk egg yolks. Add condensed milk, evaporated milk, and vanilla. Mix until smooth but avoid creating bubbles.'
        ],
        category: 'leche-flan',
        difficulty: 'medium',
        prep_time: '30 minutes',
        cook_time: '50 minutes',
        servings: '8 servings',
        status: 'published',
        views: 156,
        rating: 4.5,
        createdAt: '2024-12-20',
        image: '/imgs/leche-flan.jpg'
      },
      {
        id: 2,
        title: 'Ube Halaya',
        description: 'Traditional Filipino purple yam dessert that\'s creamy and delicious.',
        ingredients: [
          '2 lbs fresh ube (purple yam)',
          '1 can (14 oz) sweetened condensed milk',
          '1 can (12 oz) evaporated milk',
          '1/2 cup sugar',
          '1/4 cup butter'
        ],
        instructions: [
          'Boil ube until tender, then peel and mash until smooth.',
          'In a pan, combine mashed ube, condensed milk, evaporated milk, and sugar.',
          'Cook over medium heat, stirring constantly until thick.'
        ],
        category: 'ube-desserts',
        difficulty: 'easy',
        prep_time: '45 minutes',
        cook_time: '30 minutes',
        servings: '6 servings',
        status: 'pending',
        views: 0,
        rating: 0,
        createdAt: '2024-12-25',
        image: '/imgs/ube-halaya.jpg'
      }
    ]);

    // Saved recipes - matches your RecipeDetail.js structure
    setSavedRecipes([
      {
        id: 3,
        title: 'Bibingka',
        description: 'Traditional Filipino rice cake cooked in clay pots.',
        ingredients: [
          '2 cups rice flour',
          '1 cup coconut milk',
          '2 eggs',
          'Cheese for topping',
          'Salted duck eggs'
        ],
        instructions: [
          'Mix rice flour and coconut milk in a bowl.',
          'Add eggs and mix well.',
          'Cook in clay pot and top with cheese.'
        ],
        category: 'bibingka',
        difficulty: 'medium',
        prep_time: '20 minutes',
        cook_time: '25 minutes',
        servings: '4 servings',
        author: 'Chef Maria',
        rating: 4.8,
        savedAt: '2024-12-15',
        image: '/imgs/bibingka.jpg'
      },
      {
        id: 4,
        title: 'Halo-Halo',
        description: 'Filipino shaved ice dessert with mixed ingredients.',
        ingredients: [
          '2 cups shaved ice',
          '1/2 cup sweetened beans',
          '1/2 cup ube halaya',
          '1/4 cup leche flan',
          'Ube ice cream'
        ],
        instructions: [
          'Layer ingredients in tall glass.',
          'Add shaved ice on top.',
          'Top with ice cream and serve.'
        ],
        category: 'frozen-treats',
        difficulty: 'easy',
        prep_time: '15 minutes',
        cook_time: '0 minutes',
        servings: '2 servings',
        author: 'Tita Rosa',
        rating: 4.6,
        savedAt: '2024-12-10',
        image: '/imgs/halo-halo.jpg'
      }
    ]);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      alert('Logging out...');
      // Add logout logic here
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setLoading(true);
      setTimeout(() => {
        alert('Account deletion process started. You will receive a confirmation email.');
        setLoading(false);
      }, 2000);
    }
  };

  const openAddRecipeModal = () => {
    setShowAddRecipeModal(true);
  };

  const closeAddRecipeModal = () => {
    setShowAddRecipeModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user.firstName}!
          </h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <nav className="flex space-x-8 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'recipes'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Recipes ({user.stats.recipes})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'saved'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Saved ({user.stats.favorites})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'profile'
                ? 'text-pink-600 border-b-2 border-pink-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile
          </button>
        </nav>

        {/* Tab Content */}
        <div className="max-w-2xl mx-auto">
          {/* My Recipes Tab */}
          {activeTab === 'recipes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">My Recipes</h2>
                <button 
                  onClick={openAddRecipeModal}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                >
                  + Add Recipe
                </button>
              </div>
              
              {recipes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍰</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes yet</h3>
                  <p className="text-gray-600 mb-4">Start sharing your favorite Filipino dessert recipes!</p>
                  <button 
                    onClick={openAddRecipeModal}
                    className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                  >
                    Submit Your First Recipe
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recipes.map((recipe) => (
                    <div key={recipe.id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{recipe.title}</h3>
                          <p className="text-sm text-gray-600">Created {recipe.createdAt}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              recipe.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {recipe.status}
                            </span>
                            <span>👁️ {recipe.views} views</span>
                            <span>⭐ {recipe.rating || 'Not rated'}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => window.location.href = `/recipe/${recipe.id}`}
                            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            View
                          </button>
                          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-sm text-red-600 hover:text-red-800">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Recipes Tab */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Saved Recipes</h2>
              
              {savedRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">❤️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved recipes</h3>
                  <p className="text-gray-600 mb-4">Save recipes you love to find them easily later!</p>
                  <button className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">
                    Browse Recipes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedRecipes.map((recipe) => (
                    <div key={recipe.id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{recipe.title}</h3>
                          <p className="text-sm text-gray-600">by {recipe.author}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>⭐ {recipe.rating}</span>
                            <span>Saved {recipe.savedAt}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => window.location.href = `/recipe/${recipe.id}`}
                            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            View
                          </button>
                          <button className="px-3 py-1 text-sm text-red-600 hover:text-red-800">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={user.username}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={user.firstName}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={user.lastName}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                    <input
                      type="text"
                      value={user.memberSince}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistics</h2>
                
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600 mb-2">{user.stats.recipes}</div>
                    <div className="text-sm text-gray-600">Recipes</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600 mb-2">{user.stats.reviews}</div>
                    <div className="text-sm text-gray-600">Reviews</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600 mb-2">{user.stats.favorites}</div>
                    <div className="text-sm text-gray-600">Favorites</div>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="space-y-4">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Log Out
                </button>
                
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Delete Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Recipe Modal */}
      {showAddRecipeModal && (
        <EnhancedRecipeForm
          onSubmit={(newRecipe) => {
            setRecipes(prev => [newRecipe, ...prev]);
            setShowAddRecipeModal(false);
            alert('Recipe created successfully!');
          }}
          onCancel={() => setShowAddRecipeModal(false)}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Viewer1Dashboard;