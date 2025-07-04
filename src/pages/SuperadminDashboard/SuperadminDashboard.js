// src/pages/SuperadminDashboard/SuperadminDashboard.js
import React, { useState, useEffect } from 'react';
import './SuperadminDashboard.css';

const SuperadminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Mock data - replace with API calls
  useEffect(() => {
    // Mock recipes data
    setRecipes([
      {
        id: 1,
        title: 'Classic Leche Flan',
        author: 'Maria Santos',
        authorId: 1,
        category: 'Custard',
        status: 'published',
        views: 2341,
        rating: 4.8,
        createdAt: '2024-01-15',
        image: '/imgs/leche-flan.jpg',
        featured: true
      },
      {
        id: 2,
        title: 'Ube Halaya',
        author: 'Juan Dela Cruz',
        authorId: 2,
        category: 'Kakanin',
        status: 'published',
        views: 1892,
        rating: 4.9,
        createdAt: '2024-01-20',
        image: '/imgs/ube-halaya.jpg',
        featured: false
      },
      {
        id: 3,
        title: 'Biko with Latik',
        author: 'Ana Reyes',
        authorId: 3,
        category: 'Kakanin',
        status: 'pending',
        views: 45,
        rating: 0,
        createdAt: '2024-02-01',
        image: '/imgs/biko.jpg',
        featured: false
      }
    ]);

    // Mock users data
    setUsers([
      {
        id: 1,
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        role: 'user',
        status: 'active',
        joinDate: '2024-01-10',
        recipesCount: 5,
        lastLogin: '2024-02-15'
      },
      {
        id: 2,
        name: 'Juan Dela Cruz',
        email: 'juan.delacruz@email.com',
        role: 'user',
        status: 'active',
        joinDate: '2024-01-12',
        recipesCount: 3,
        lastLogin: '2024-02-14'
      },
      {
        id: 3,
        name: 'Ana Reyes',
        email: 'ana.reyes@email.com',
        role: 'user',
        status: 'suspended',
        joinDate: '2024-01-18',
        recipesCount: 1,
        lastLogin: '2024-02-10'
      }
    ]);
  }, []);

  // Recipe management functions
  const handleRecipeAction = (action, recipeId) => {
    setLoading(true);
    setTimeout(() => {
      setRecipes(prev => prev.map(recipe => 
        recipe.id === recipeId ? { ...recipe, status: action } : recipe
      ));
      setLoading(false);
    }, 1000);
  };

  const handleDeleteRecipe = (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    }
  };

  const handleToggleFeatured = (recipeId) => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === recipeId ? { ...recipe, featured: !recipe.featured } : recipe
    ));
  };

  // User management functions
  const handleUserAction = (action, userId) => {
    setLoading(true);
    setTimeout(() => {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: action } : user
      ));
      setLoading(false);
    }, 1000);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user account?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  // Stats calculations
  const stats = {
    totalRecipes: recipes.length,
    publishedRecipes: recipes.filter(r => r.status === 'published').length,
    pendingRecipes: recipes.filter(r => r.status === 'pending').length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length,
    totalViews: recipes.reduce((sum, r) => sum + r.views, 0),
    averageRating: recipes.reduce((sum, r) => sum + r.rating, 0) / recipes.length || 0
  };

  // Filter functions
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              👑 Superadmin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                System Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex space-x-8 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 py-2 px-4 text-sm font-medium ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>📊</span>
            Overview
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex items-center gap-2 py-2 px-4 text-sm font-medium ${
              activeTab === 'recipes'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>🍰</span>
            Recipe Management
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 py-2 px-4 text-sm font-medium ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>👥</span>
            User Management
          </button>
        </nav>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalRecipes}</p>
                    <p className="text-sm text-gray-600">Total Recipes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
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

              <div className="bg-white p-6 rounded-lg shadow-sm">
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

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                    <p className="text-sm text-gray-600">Avg Rating</p>
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
            {/* Recipe Management Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recipe Management</h2>
            </div>

            {/* Recipe Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRecipes.map((recipe) => (
                      <tr key={recipe.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-10 w-10 rounded-lg object-cover" src={recipe.image} alt={recipe.title} />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{recipe.title}</div>
                              <div className="text-sm text-gray-500">{recipe.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {recipe.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            recipe.status === 'published' ? 'bg-green-100 text-green-800' :
                            recipe.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {recipe.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {recipe.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {recipe.rating > 0 ? `⭐ ${recipe.rating}` : 'No ratings'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleFeatured(recipe.id)}
                              className={`text-xs px-2 py-1 rounded ${
                                recipe.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {recipe.featured ? 'Unfeature' : 'Feature'}
                            </button>
                            <button
                              onClick={() => handleDeleteRecipe(recipe.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Management Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.recipesCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <div className="flex gap-2">
                            {user.status === 'active' ? (
                              <button
                                onClick={() => handleUserAction('suspended', user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserAction('active', user.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Activate
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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