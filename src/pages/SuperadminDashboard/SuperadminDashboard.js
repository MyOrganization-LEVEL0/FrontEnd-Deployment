// src/pages/SuperadminDashboard/SuperadminDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { superadminService } from '../../services/superadminService';
import './SuperadminDashboard.css';

const SuperadminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    publishedRecipes: 0,
    pendingRecipes: 0,
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    totalViews: 0
  });

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'recipes') {
      loadRecipes();
    } else if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setDataLoading(true);
      setError(null);
      
      const dashboardStats = await superadminService.getDashboardStats();
      setStats(dashboardStats);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please check your backend connection.');
    } finally {
      setDataLoading(false);
    }
  };



  const loadRecipes = async () => {
    try {
      setDataLoading(true);
      setError(null);
      const response = await superadminService.getAllRecipes();
      const recipesData = response.results || response || [];
      
      // Transform recipes to match component format
      const transformedRecipes = recipesData.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        author: recipe.author?.full_name || recipe.author?.email || 'Unknown',
        authorId: recipe.author?.id,
        category: recipe.category,
        status: recipe.status,
        views: recipe.views_count || 0,
        createdAt: recipe.created_at,
        image: recipe.featured_image || '/imgs/default-recipe.jpg',
        featured: recipe.is_featured || false
      }));

      setRecipes(transformedRecipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
      setError('Failed to load recipes. Please check your backend connection.');
      setRecipes([]);
    } finally {
      setDataLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setDataLoading(true);
      setError(null);
      const response = await superadminService.getAllUsers();
      const usersData = response.results || response || [];
      
      // Transform users to match component format
      const transformedUsers = usersData.map(user => ({
        id: user.id,
        name: user.full_name || user.first_name + ' ' + user.last_name,
        email: user.email,
        role: user.role || 'user',
        status: user.is_active ? 'active' : 'suspended',
        joinDate: user.date_joined,
        recipesCount: user.recipes_count || 0,
        lastLogin: user.last_login
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users. Please check your backend connection.');
      setUsers([]);
    } finally {
      setDataLoading(false);
    }
  };

  // Recipe management functions
  const handleRecipeAction = async (action, recipeId) => {
    try {
      setLoading(true);
      setError(null);

      await superadminService.updateRecipeStatus(recipeId, action);
      
      // Update local state
      setRecipes(prev => prev.map(recipe => 
        recipe.id === recipeId ? { ...recipe, status: action } : recipe
      ));
      
      // Refresh stats
      await loadDashboardData();
      
    } catch (error) {
      console.error('Error performing recipe action:', error);
      setError(`Failed to ${action} recipe: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      try {
        setLoading(true);
        await superadminService.deleteRecipe(recipeId);
        
        setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
        await loadDashboardData();
        
      } catch (error) {
        console.error('Error deleting recipe:', error);
        setError(`Failed to delete recipe: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleFeatured = async (recipeId) => {
    try {
      setLoading(true);
      const recipe = recipes.find(r => r.id === recipeId);
      
      await superadminService.toggleRecipeFeatured(recipeId, !recipe.featured);
      
      setRecipes(prev => prev.map(recipe => 
        recipe.id === recipeId ? { ...recipe, featured: !recipe.featured } : recipe
      ));
      
    } catch (error) {
      console.error('Error toggling featured status:', error);
      setError(`Failed to update featured status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // User management functions
  const handleUserAction = async (action, userId) => {
    try {
      setLoading(true);
      setError(null);

      await superadminService.updateUserStatus(userId, action);
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: action } : user
      ));
      
      await loadDashboardData();
      
    } catch (error) {
      console.error('Error performing user action:', error);
      setError(`Failed to ${action} user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user account? This action cannot be undone and will remove all their data.')) {
      try {
        setLoading(true);
        await superadminService.deleteUser(userId);
        
        setUsers(prev => prev.filter(user => user.id !== userId));
        await loadDashboardData();
        
      } catch (error) {
        console.error('Error deleting user:', error);
        setError(`Failed to delete user: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Show all recipes and users (no filtering)
  const filteredRecipes = recipes;
  const filteredUsers = users;

  if (dataLoading && activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading superadmin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              👑 Superadmin Dashboard
            </h1>
          </div>
          {user && (
            <p className="text-sm text-gray-600 mt-2">
              Welcome, {user.full_name || user.email} | Role: {user.role}
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex space-x-8 border-b border-gray-200 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'recipes', label: 'Recipe Management', icon: '🍰' },
            { id: 'users', label: 'User Management', icon: '👥' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-4 text-sm font-medium ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm stats-card">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalRecipes}</p>
                    <p className="text-sm text-gray-600">Total Recipes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm stats-card">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-sm text-gray-600">Total Users</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm stats-card">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Views</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm stats-card">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{stats.pendingRecipes}</p>
                    <p className="text-sm text-gray-600">Pending Approval</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipe Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Published</span>
                    <span className="text-sm font-medium text-green-600">{stats.publishedRecipes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="text-sm font-medium text-yellow-600">{stats.pendingRecipes}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active</span>
                    <span className="text-sm font-medium text-green-600">{stats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Suspended</span>
                    <span className="text-sm font-medium text-red-600">{stats.suspendedUsers}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recipe Management Tab */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recipe Management</h2>
              <div className="text-sm text-gray-600">
                {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} total
              </div>
            </div>

            {dataLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading recipes...</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipe</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRecipes.map((recipe) => (
                        <tr key={recipe.id} className="table-row">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                className="h-10 w-10 rounded-lg object-cover" 
                                src={recipe.image} 
                                alt={recipe.title}
                                onError={(e) => {
                                  e.target.src = '/imgs/default-recipe.jpg';
                                }}
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{recipe.title}</div>
                                <div className="text-sm text-gray-500">
                                  {recipe.featured && <span className="text-yellow-600">⭐ Featured</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{recipe.author}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{recipe.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              recipe.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : recipe.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {recipe.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{recipe.views.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              {recipe.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleRecipeAction('published', recipe.id)}
                                    className="text-green-600 hover:text-green-900 action-button"
                                    disabled={loading}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRecipeAction('rejected', recipe.id)}
                                    className="text-red-600 hover:text-red-900 action-button"
                                    disabled={loading}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {recipe.status === 'rejected' && (
                                <button
                                  onClick={() => handleRecipeAction('published', recipe.id)}
                                  className="text-green-600 hover:text-green-900 action-button"
                                  disabled={loading}
                                >
                                  Publish
                                </button>
                              )}
                              {recipe.status === 'published' && (
                                <button
                                  onClick={() => handleRecipeAction('rejected', recipe.id)}
                                  className="text-orange-600 hover:text-orange-900 action-button"
                                  disabled={loading}
                                >
                                  Unpublish
                                </button>
                              )}
                              <button
                                onClick={() => handleToggleFeatured(recipe.id)}
                                className={`action-button ${
                                  recipe.featured 
                                    ? 'text-yellow-600 hover:text-yellow-900' 
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                                disabled={loading}
                              >
                                {recipe.featured ? 'Unfeature' : 'Feature'}
                              </button>
                              <button
                                onClick={() => handleDeleteRecipe(recipe.id)}
                                className="text-red-600 hover:text-red-900 action-button"
                                disabled={loading}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredRecipes.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No recipes found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <div className="text-sm text-gray-600">
                {users.length} user{users.length !== 1 ? 's' : ''} total
              </div>
            </div>

            {dataLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="table-row">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : user.role === 'superadmin'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.recipesCount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(user.joinDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              {user.status === 'active' ? (
                                <button
                                  onClick={() => handleUserAction('suspended', user.id)}
                                  className="text-red-600 hover:text-red-900 action-button"
                                  disabled={loading}
                                >
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUserAction('active', user.id)}
                                  className="text-green-600 hover:text-green-900 action-button"
                                  disabled={loading}
                                >
                                  Activate
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900 action-button"
                                disabled={loading}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No users found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 loading-overlay">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

export default SuperadminDashboard;