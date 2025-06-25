// src/pages/Dashboard/Dashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('recipes');
  
  // Mock user data - replace with API call
  const user = {
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    avatar: '/imgs/avatar.jpg',
    joinDate: 'January 2024',
    bio: 'Passionate home baker specializing in traditional Filipino desserts. Love sharing family recipes passed down through generations.',
    stats: {
      recipes: 12,
      favorites: 45,
      reviews: 23,
      followers: 156
    }
  };

  // Mock recipes data
  const myRecipes = [
    {
      id: 1,
      title: 'Classic Leche Flan',
      image: '/imgs/leche-flan.jpg',
      category: 'Custard',
      rating: 4.8,
      views: 2341,
      status: 'published',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Ube Halaya',
      image: '/imgs/ube-halaya.jpg',
      category: 'Kakanin',
      rating: 4.9,
      views: 1892,
      status: 'published',
      createdAt: '2024-01-20'
    },
    {
      id: 3,
      title: 'Biko with Latik',
      image: '/imgs/biko.jpg',
      category: 'Kakanin',
      rating: 0,
      views: 0,
      status: 'draft',
      createdAt: '2024-02-01'
    }
  ];

  const favoriteRecipes = [
    {
      id: 4,
      title: 'Bibingka',
      image: '/imgs/bibingka.jpg',
      author: 'Juan Dela Cruz',
      rating: 4.7
    },
    {
      id: 5,
      title: 'Maja Blanca',
      image: '/imgs/maja-blanca.jpg',
      author: 'Ana Reyes',
      rating: 4.6
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'recipe',
      action: 'published',
      title: 'Classic Leche Flan',
      date: '2 days ago'
    },
    {
      id: 2,
      type: 'review',
      action: 'reviewed',
      title: 'Bibingka',
      rating: 5,
      date: '5 days ago'
    },
    {
      id: 3,
      type: 'favorite',
      action: 'favorited',
      title: 'Maja Blanca',
      date: '1 week ago'
    }
  ];

  const handleDeleteRecipe = (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      // TODO: API call to delete recipe
      console.log('Deleting recipe:', recipeId);
    }
  };

  return (
    <div className="dashboard-container min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <section className="dashboard-header bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* User Avatar */}
            <div className="avatar-container">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-pink-200"
                onError={(e) => {e.target.src = '/imgs/default-avatar.png'}}
              />
              <button className="mt-2 text-sm text-pink-500 hover:text-pink-600">
                Change Photo
              </button>
            </div>

            {/* User Info */}
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <p className="text-gray-700 mb-4 max-w-2xl">{user.bio}</p>
              <p className="text-sm text-gray-500 mb-4">Member since {user.joinDate}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="stat-card bg-pink-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-pink-600">{user.stats.recipes}</p>
                  <p className="text-sm text-gray-600">Recipes</p>
                </div>
                <div className="stat-card bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">{user.stats.favorites}</p>
                  <p className="text-sm text-gray-600">Favorites</p>
                </div>
                <div className="stat-card bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{user.stats.reviews}</p>
                  <p className="text-sm text-gray-600">Reviews</p>
                </div>
                <div className="stat-card bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{user.stats.followers}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link to="/recipe/new" className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                  <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Recipe
                </Link>
                <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                  <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="dashboard-content py-8">
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <div className="flex border-b mb-8 overflow-x-auto">
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'recipes' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('recipes')}
            >
              My Recipes
            </button>
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'favorites' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('favorites')}
            >
              Favorites
            </button>
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'activity' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('activity')}
            >
              Recent Activity
            </button>
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'settings' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* My Recipes Tab */}
            {activeTab === 'recipes' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">My Recipes ({myRecipes.length})</h2>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300">
                    <option>All Recipes</option>
                    <option>Published</option>
                    <option>Drafts</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRecipes.map(recipe => (
                    <div key={recipe.id} className="recipe-card bg-white rounded-xl overflow-hidden shadow-md">
                      <div className="relative">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {e.target.src = '/imgs/default-recipe.png'}}
                        />
                        <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${
                          recipe.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {recipe.status}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{recipe.category}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {recipe.views} views
                          </span>
                          {recipe.rating > 0 && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {recipe.rating}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Link to={`/recipe/${recipe.id}`} className="flex-1 py-2 bg-pink-500 text-white text-center rounded-lg hover:bg-pink-600 transition">
                            View
                          </Link>
                          <Link to={`/recipe/${recipe.id}/edit`} className="flex-1 py-2 bg-gray-200 text-gray-700 text-center rounded-lg hover:bg-gray-300 transition">
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDeleteRecipe(recipe.id)}
                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Favorites ({favoriteRecipes.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteRecipes.map(recipe => (
                    <div key={recipe.id} className="recipe-card bg-white rounded-xl overflow-hidden shadow-md">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {e.target.src = '/imgs/default-recipe.png'}}
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">by {recipe.author}</p>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-sm">
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {recipe.rating}
                          </span>
                          <Link to={`/recipe/${recipe.id}`} className="text-pink-500 hover:text-pink-600 font-medium">
                            View Recipe
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="activity-item bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
                      <div className={`activity-icon w-12 h-12 rounded-full flex items-center justify-center ${
                        activity.type === 'recipe' ? 'bg-pink-100 text-pink-600' :
                        activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {activity.type === 'recipe' && (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                        {activity.type === 'review' && (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        )}
                        {activity.type === 'favorite' && (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="text-gray-800">
                          You {activity.action} <span className="font-semibold">{activity.title}</span>
                          {activity.rating && (
                            <span className="ml-2">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`inline w-4 h-4 ${i < activity.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                
                {/* Profile Settings */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue={user.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        defaultValue={user.email}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea 
                        rows="4"
                        defaultValue={user.bio}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                      />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                      Save Changes
                    </button>
                  </form>
                </div>

                {/* Password Settings */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                      />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Notification Settings */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-3 h-4 w-4 text-pink-500" />
                      <span className="text-gray-700">Email me when someone reviews my recipe</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-3 h-4 w-4 text-pink-500" />
                      <span className="text-gray-700">Email me about new features</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3 h-4 w-4 text-pink-500" />
                      <span className="text-gray-700">Weekly recipe recommendations</span>
                    </label>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h3>
                  <p className="text-gray-700 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;