// src/pages/AdminDashboard/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import SimpleModerationHistory from '../../components/SimpleModerationHistory';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [dashboardStats, setDashboardStats] = useState({
    pending_recipes: 0,
    pending_reports: 0,
    flagged_recipes: 0,
    total_recipes: 0,
    published_recipes: 0,
    rejected_recipes: 0
  });
  const [recipes, setRecipes] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'pending') {
      loadPendingRecipes();
    } else if (activeTab === 'flagged') {
      loadFlaggedRecipes();
    } else if (activeTab === 'reports') {
      loadReports();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setDataLoading(true);
      const stats = await adminService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setDataLoading(false);
    }
  };

  const loadPendingRecipes = async () => {
    try {
      setDataLoading(true);
      const data = await adminService.getPendingRecipes();
      setRecipes(data.results || []);
    } catch (error) {
      console.error('Error loading pending recipes:', error);
      setError('Failed to load pending recipes');
      setRecipes([]);
    } finally {
      setDataLoading(false);
    }
  };

  const loadFlaggedRecipes = async () => {
    try {
      setDataLoading(true);
      const data = await adminService.getFlaggedRecipes();
      setRecipes(data.results || []);
    } catch (error) {
      console.error('Error loading flagged recipes:', error);
      setError('Failed to load flagged recipes');
      setRecipes([]);
    } finally {
      setDataLoading(false);
    }
  };

  const loadReports = async () => {
    try {
      setDataLoading(true);
      const data = await adminService.getReports();
      setUserReports(data.results || []);
    } catch (error) {
      console.error('Error loading reports:', error);
      setError('Failed to load reports');
      setUserReports([]);
    } finally {
      setDataLoading(false);
    }
  };

  // Recipe management functions
  const handleRecipeAction = async (action, recipeId, reason = null) => {
    try {
      setLoading(true);
      setError(null);
      
      await adminService.handleRecipeAction(recipeId, action, reason);
      
      // Remove recipe from current list
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      
      // Refresh dashboard stats
      await loadDashboardData();
      
      const actionText = action === 'approve' ? 'approved' : 'rejected';
      alert(`Recipe ${actionText} successfully!`);
    } catch (error) {
      console.error('Error performing recipe action:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // User report functions
  const handleReportAction = async (action, reportId) => {
    try {
      setLoading(true);
      setError(null);
      
      let options = {};
      
      // Handle mute action
      if (action === 'mute') {
        const duration = prompt('Mute duration in hours (default: 24):', '24');
        if (duration === null) return; // User cancelled
        options.duration = parseInt(duration) || 24;
      }
      
      await adminService.handleReportAction(reportId, action, options);
      
      // Update report status in the list
      setUserReports(prev => prev.map(report => 
        report.id === reportId ? { ...report, status: 'resolved' } : report
      ));
      
      // Refresh dashboard stats
      await loadDashboardData();
      
      const actionText = action === 'mute' ? 'muted' : 'resolved';
      alert(`Report ${actionText} successfully!`);
    } catch (error) {
      console.error('Error performing report action:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter functions for display
  const pendingRecipes = recipes.filter(recipe => recipe.status === 'pending');
  const flaggedRecipes = recipes;
  const pendingReports = userReports.filter(report => report.status === 'pending');

  // Get time ago helper
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  // Format recipe data for display
  const formatRecipeForDisplay = (recipe) => {
    return {
      id: recipe.id,
      title: recipe.title,
      author: recipe.author?.username || recipe.author?.full_name || 'Unknown',
      authorId: recipe.author?.id,
      category: recipe.category,
      description: recipe.description,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
      image: recipe.featured_image || recipe.image_urls?.[0] || '/imgs/default-recipe.jpg',
      submittedAt: recipe.created_at,
      status: recipe.status,
      flagged: recipe.flagged || recipe.report_count > 0,
      reportCount: recipe.report_count || 0
    };
  };

  if (dataLoading && !recipes.length && !userReports.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              🛡️ Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  {dashboardStats.pending_recipes} pending recipes, {dashboardStats.pending_reports} reports
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex space-x-8 border-b border-gray-200">
          {[
            { id: 'pending', label: 'Pending Recipes', icon: '📝', count: dashboardStats.pending_recipes },
            { id: 'flagged', label: 'Flagged Content', icon: '🚩', count: dashboardStats.flagged_recipes },
            { id: 'reports', label: 'User Reports', icon: '📋', count: dashboardStats.pending_reports },
            { id: 'history', label: 'Moderation History', icon: '📚', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Pending Recipes Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Pending Recipe Approvals</h2>
            </div>

            {dataLoading ? (
              <div className="text-center py-8">
                <svg className="animate-spin h-6 w-6 text-blue-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading pending recipes...</p>
              </div>
            ) : pendingRecipes.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Recipes</h3>
                <p className="text-gray-600">All recipes have been reviewed!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {pendingRecipes.map((recipe) => {
                  const displayRecipe = formatRecipeForDisplay(recipe);
                  return (
                    <div key={displayRecipe.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={displayRecipe.image}
                            alt={displayRecipe.title}
                            className="w-24 h-24 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = '/imgs/default-recipe.jpg';
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{displayRecipe.title}</h3>
                                <p className="text-sm text-gray-600">by {displayRecipe.author}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {displayRecipe.flagged && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                    🚩 Auto-flagged
                                  </span>
                                )}
                                {displayRecipe.reportCount > 0 && (
                                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                    {displayRecipe.reportCount} user reports
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-3">{displayRecipe.description}</p>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-1">Ingredients:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {displayRecipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                                    <li key={idx}>• {typeof ingredient === 'string' ? ingredient : ingredient.text || ingredient.name || JSON.stringify(ingredient)}</li>
                                  ))}
                                  {displayRecipe.ingredients.length > 3 && (
                                    <li className="text-gray-500">...and {displayRecipe.ingredients.length - 3} more</li>
                                  )}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-1">Instructions:</h4>
                                <ol className="text-sm text-gray-600 space-y-1">
                                  {displayRecipe.instructions.slice(0, 2).map((step, idx) => (
                                    <li key={idx}>{idx + 1}. {typeof step === 'string' ? step : step.text || step.instruction || JSON.stringify(step)}</li>
                                  ))}
                                  {displayRecipe.instructions.length > 2 && (
                                    <li className="text-gray-500">...and {displayRecipe.instructions.length - 2} more steps</li>
                                  )}
                                </ol>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                              <button
                                onClick={() => handleRecipeAction('approve', displayRecipe.id)}
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                              >
                                ✅ Approve
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Reason for rejection (optional):');
                                  handleRecipeAction('reject', displayRecipe.id, reason);
                                }}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                              >
                                ❌ Reject
                              </button>
                              <button
                                onClick={() => {
                                  window.open(`/recipe/${displayRecipe.id}`, '_blank');
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                              >
                                👁️ Full Preview
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Flagged Content Tab */}
        {activeTab === 'flagged' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Flagged Content Review</h2>
            
            {dataLoading ? (
              <div className="text-center py-8">
                <svg className="animate-spin h-6 w-6 text-blue-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading flagged content...</p>
              </div>
            ) : flaggedRecipes.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Flagged Content</h3>
                <p className="text-gray-600">No content has been flagged for review!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {flaggedRecipes.map((recipe) => {
                  const displayRecipe = formatRecipeForDisplay(recipe);
                  return (
                    <div key={displayRecipe.id} className="bg-white rounded-lg shadow-sm border border-red-200">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={displayRecipe.image}
                            alt={displayRecipe.title}
                            className="w-24 h-24 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = '/imgs/default-recipe.jpg';
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{displayRecipe.title}</h3>
                                <p className="text-sm text-gray-600">by {displayRecipe.author}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {displayRecipe.flagged && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                    🚩 Flagged
                                  </span>
                                )}
                                {displayRecipe.reportCount > 0 && (
                                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                    {displayRecipe.reportCount} reports
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-3">{displayRecipe.description}</p>
                            
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleRecipeAction('approve', displayRecipe.id)}
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                              >
                                ✅ Approve (Safe)
                              </button>
                              <button
                                onClick={() => handleRecipeAction('reject', displayRecipe.id)}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                              >
                                ❌ Remove Content
                              </button>
                              <button
                                onClick={() => {
                                  window.open(`/recipe/${displayRecipe.id}`, '_blank');
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                              >
                                🔍 Detailed Review
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* User Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">User Reports</h2>
            
            {dataLoading ? (
              <div className="text-center py-8">
                <svg className="animate-spin h-6 w-6 text-blue-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading reports...</p>
              </div>
            ) : userReports.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports</h3>
                <p className="text-gray-600">No user reports have been submitted!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {userReports.map((report) => (
                  <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Report against: {report.reported_user || 'Unknown User'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Reported by: {report.reported_by?.username || report.reported_by?.full_name || 'Unknown'} • {getTimeAgo(report.created_at)}
                          </p>
                          {report.report_target && (
                            <p className="text-sm text-blue-600 mt-1">
                              📍 {report.report_target}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                            {report.report_type}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            report.status === 'dismissed' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
                        <p className="text-gray-700">{report.description || 'No description provided'}</p>
                      </div>
                      
                      {report.comment && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Reported Comment:</h4>
                          <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-red-400">
                            <p className="text-sm text-gray-700">"{report.comment.content}"</p>
                            <p className="text-xs text-gray-500 mt-1">
                              On recipe: "{report.comment.recipe_title}"
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {report.recipe && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Related Recipe:</h4>
                          <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
                            <p className="text-sm text-gray-700">"{report.recipe.title}" by {report.recipe.author}</p>
                          </div>
                        </div>
                      )}
                      
                      {report.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleReportAction('mute', report.id)}
                            disabled={loading}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition disabled:opacity-50"
                          >
                            🔇 Mute User
                          </button>
                          <button
                            onClick={() => handleReportAction('resolve', report.id)}
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                          >
                            ✅ Resolve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <SimpleModerationHistory />
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

export default AdminDashboard;