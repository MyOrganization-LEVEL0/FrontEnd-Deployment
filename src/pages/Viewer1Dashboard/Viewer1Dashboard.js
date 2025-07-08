import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { recipeService } from '../../services/recipeService';
import './Viewer1Dashboard.css';
import EnhancedRecipeForm from './EnhancedRecipeForm';

const Viewer1Dashboard = () => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showEditRecipeModal, setShowEditRecipeModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  // Get real user data from authentication context
  const { user: authUser, logout } = useAuth();
  
  // Use real user data
  const user = {
    id: authUser?.id,
    username: authUser?.username,
    email: authUser?.email,
    firstName: authUser?.first_name || '',
    lastName: authUser?.last_name || '',
    memberSince: authUser?.date_joined ? new Date(authUser.date_joined).toLocaleDateString() : '',
    stats: {
      recipes: recipes.length,
      reviews: 0,
      favorites: savedRecipes.length
    }
  };

  // Load real user data from API
  const loadUserRecipes = useCallback(async () => {
    if (!authUser?.id) return;
    
    setLoading(true);
    try {
      // Get user's own recipes (both published and pending)
      const response = await recipeService.getAllRecipes();
      
      // Filter to only show current user's recipes
      const userRecipes = response.results?.filter(recipe => 
        recipe.author.id === authUser.id
      ) || [];
      
      // Transform API data to match existing component structure
      const transformedRecipes = userRecipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        category: recipe.category,
        prep_time: recipe.prep_time,
        cook_time: recipe.cook_time,
        servings: recipe.servings,
        status: recipe.status,
        views: recipe.views_count,
        rating: recipe.average_rating || 0,
        createdAt: new Date(recipe.created_at).toLocaleDateString(),
        image: recipe.featured_image || 'https://via.placeholder.com/300x200?text=No+Image'
      }));
      
      setRecipes(transformedRecipes);
      
    } catch (error) {
      console.error('Error loading user recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [authUser?.id]);

  // ADDED: Load user's favorited recipes
  const loadUserFavorites = useCallback(async () => {
    if (!authUser?.id) return;
    
    try {
      // Get user's favorited recipes
      const response = await recipeService.getUserFavorites();
      
      // Transform API data to match existing component structure
      const transformedFavorites = response.results?.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        author: recipe.author ? `${recipe.author.first_name} ${recipe.author.last_name}` : 'Unknown',
        rating: recipe.average_rating || 0,
        savedAt: new Date(recipe.created_at).toLocaleDateString(), // When recipe was created
        image: recipe.featured_image || 'https://via.placeholder.com/300x200?text=No+Image',
        description: recipe.description
      })) || [];
      
      setSavedRecipes(transformedFavorites);
      
    } catch (error) {
      console.error('Error loading user favorites:', error);
      setSavedRecipes([]);
    }
  }, [authUser?.id]);

  useEffect(() => {
    loadUserRecipes();
    loadUserFavorites(); // ADDED: Load favorites too
  }, [loadUserRecipes, loadUserFavorites]);

  // Handle editing a recipe
  const handleEditRecipe = async (recipe) => {
    try {
      setLoading(true);
      
      // Fetch the complete recipe details from the API
      const fullRecipe = await recipeService.getRecipeById(recipe.id);
      
      setEditingRecipe(fullRecipe);
      setShowEditRecipeModal(true);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      alert('Failed to load recipe details for editing.');
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a recipe
  const handleDeleteRecipe = async (recipeId, recipeTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${recipeTitle}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      await recipeService.deleteRecipe(recipeId);
      
      // Remove recipe from local state
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      
      alert('Recipe deleted successfully!');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ADDED: Handle removing from favorites
  const handleRemoveFromFavorites = async (recipeId, recipeTitle) => {
    if (!window.confirm(`Remove "${recipeTitle}" from your saved recipes?`)) {
      return;
    }

    try {
      await recipeService.removeFromFavorites(recipeId);
      
      // Remove from local state
      setSavedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      
      alert('Recipe removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('Failed to remove from favorites. Please try again.');
    }
  };

  // Handle recipe update
  const handleUpdateRecipe = async (updatedRecipeData) => {
    if (!editingRecipe) return;

    setLoading(true);
    try {
      const response = await recipeService.updateRecipe(editingRecipe.id, updatedRecipeData);
      
      // Update recipe in local state
      setRecipes(prev => prev.map(recipe => 
        recipe.id === editingRecipe.id 
          ? {
              ...recipe,
              ...updatedRecipeData,
              status: response.recipe?.status || 'pending' // Updated recipes may need re-approval
            }
          : recipe
      ));
      
      setShowEditRecipeModal(false);
      setEditingRecipe(null);
      alert('Recipe updated successfully!');
      
      // Refresh data from server
      loadUserRecipes();
      
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Failed to update recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
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
                            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleEditRecipe(recipe)}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteRecipe(recipe.id, recipe.title)}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                          >
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
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                  >
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
                          {/* UPDATED: Real remove functionality */}
                          <button 
                            onClick={() => handleRemoveFromFavorites(recipe.id, recipe.title)}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                          >
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
                      value={user.username || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={user.firstName || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={user.lastName || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                    <input
                      type="text"
                      value={user.memberSince || ''}
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
            
            // Refresh the recipe list to get updated data from server
            loadUserRecipes();
          }}
          onCancel={() => setShowAddRecipeModal(false)}
        />
      )}

      {/* Edit Recipe Modal */}
      {showEditRecipeModal && editingRecipe && (
        <EnhancedRecipeForm
          recipe={editingRecipe}
          isEditing={true}
          onSubmit={handleUpdateRecipe}
          onCancel={() => {
            setShowEditRecipeModal(false);
            setEditingRecipe(null);
          }}
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