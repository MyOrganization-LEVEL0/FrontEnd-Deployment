import React, { useState, useEffect } from 'react';
import './Viewer1Dashboard.css';

const Viewer1Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock user data
  const user = {
    id: 1,
    username: 'john123456',
    email: 'john123@gmail.com',
    firstName: 'john michael',
    lastName: 'villarosa',
    memberSince: '6/28/2025',
    stats: {
      recipes: 0,
      reviews: 0,
      favorites: 0
    }
  };

  // Mock data initialization
  useEffect(() => {
    // User's recipes
    setRecipes([
      {
        id: 1,
        title: 'Classic Leche Flan',
        status: 'published',
        views: 156,
        rating: 4.5,
        createdAt: '2024-12-20',
        image: '/imgs/leche-flan.jpg'
      },
      {
        id: 2,
        title: 'Ube Halaya',
        status: 'pending',
        views: 0,
        rating: 0,
        createdAt: '2024-12-25',
        image: '/imgs/ube-halaya.jpg'
      }
    ]);

    // Saved recipes
    setSavedRecipes([
      {
        id: 3,
        title: 'Bibingka',
        author: 'Chef Maria',
        rating: 4.8,
        savedAt: '2024-12-15',
        image: '/imgs/bibingka.jpg'
      },
      {
        id: 4,
        title: 'Halo-Halo',
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
                <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">
                  + Add Recipe
                </button>
              </div>
              
              {recipes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍰</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes yet</h3>
                  <p className="text-gray-600 mb-4">Start sharing your favorite Filipino dessert recipes!</p>
                  <button className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">
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
                          <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
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
                          <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
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
            <div className="space-y-8">
              {/* Profile Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                    <p className="text-gray-900">{user.username}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                    <p className="text-gray-900">{user.firstName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                    <p className="text-gray-900">{user.lastName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Member Since</label>
                    <p className="text-gray-900">{user.memberSince}</p>
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