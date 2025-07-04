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

  // Filter functions
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Bulk actions
  const handleBulkAction = (action) => {
    if (selectedItems.length === 0) {
      alert('Please select items first');
      return;
    }
    
    if (activeTab === 'recipes') {
      setRecipes(prev => prev.map(recipe => 
        selectedItems.includes(recipe.id) ? { ...recipe, status: action } : recipe
      ));
    } else if (activeTab === 'users') {
      setUsers(prev => prev.map(user => 
        selectedItems.includes(user.id) ? { ...user, status: action } : user
      ));
    }
    
    setSelectedItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              🛡️ Superadmin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search recipes or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex space-x-8 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'recipes', label: 'Recipe Management', icon: '🍰' },
            { id: 'users', label: 'User Management', icon: '👥' },
            { id: 'analytics', label: 'Analytics', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition">
                  <div className="text-2xl mb-2">🍰</div>
                  <p className="text-sm font-medium">Add Recipe</p>
                </button>
                <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition">
                  <div className="text-2xl mb-2">👤</div>
                  <p className="text-sm font-medium">Add User</p>
                </button>
                <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="text-sm font-medium">View Reports</p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">New recipe published: "Classic Leche Flan"</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">New user registered: maria.santos@email.com</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
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
              <div className="flex gap-3">
                <button
                  onClick={() => handleBulkAction('published')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Bulk Approve
                </button>
                <button
                  onClick={() => handleBulkAction('rejected')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Bulk Reject
                </button>
              </div>
            </div>

            {/* Recipe Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(recipes.map(r => r.id));
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </th>
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
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(recipe.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, recipe.id]);
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== recipe.id));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </td>
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
                          {recipe.featured && (
                            <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {recipe.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {recipe.rating || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            {recipe.status === 'pending' && (
                              <button
                                onClick={() => handleRecipeAction('published', recipe.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                            )}
                            {recipe.status === 'published' && (
                              <button
                                onClick={() => handleRecipeAction('pending', recipe.id)}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                Unpublish
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleFeatured(recipe.id)}
                              className="text-purple-600 hover:text-purple-900"
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
              <div className="flex gap-3">
                <button
                  onClick={() => handleBulkAction('active')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Bulk Activate
                </button>
                <button
                  onClick={() => handleBulkAction('suspended')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Bulk Suspend
                </button>
              </div>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(users.map(u => u.id));
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </th>
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
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, user.id]);
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== user.id));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Analytics & Reports</h2>
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipe Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Published</span>
                    <span className="text-sm font-semibold text-green-600">{stats.publishedRecipes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending Review</span>
                    <span className="text-sm font-semibold text-yellow-600">{stats.pendingRecipes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Views</span>
                    <span className="text-sm font-semibold text-blue-600">{stats.totalViews.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="text-sm font-semibold text-green-600">{stats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Suspended Users</span>
                    <span className="text-sm font-semibold text-red-600">{stats.suspendedUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New This Month</span>
                    <span className="text-sm font-semibold text-blue-600">12</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Quality</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Rating</span>
                    <span className="text-sm font-semibold text-yellow-600">{stats.averageRating.toFixed(1)}/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Featured Recipes</span>
                    <span className="text-sm font-semibold text-purple-600">{recipes.filter(r => r.featured).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Categories</span>
                    <span className="text-sm font-semibold text-blue-600">8</span>
                  </div>
                </div>
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
              <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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