import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [recipes, setRecipes] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Mock data - replace with API calls
  useEffect(() => {
    // Mock pending recipes for approval
    setRecipes([
      {
        id: 1,
        title: 'Traditional Bibingka',
        author: 'Maria Santos',
        authorId: 1,
        category: 'Kakanin',
        description: 'Authentic Filipino rice cake made with coconut milk and topped with cheese.',
        ingredients: ['2 cups rice flour', '1 cup coconut milk', '2 eggs', 'Cheese for topping'],
        instructions: ['Mix rice flour and coconut milk...', 'Add eggs and mix well...'],
        image: '/imgs/bibingka.jpg',
        submittedAt: '2024-02-15T10:30:00Z',
        status: 'pending',
        flagged: false,
        reportCount: 0
      },
      {
        id: 2,
        title: 'Instant Halo-Halo',
        author: 'Juan Dela Cruz',
        authorId: 2,
        category: 'Dessert',
        description: 'Quick and easy halo-halo recipe using store-bought ingredients.',
        ingredients: ['1 can condensed milk', '1 cup shaved ice', 'Mixed beans', 'Ube ice cream'],
        instructions: ['Layer ingredients in tall glass...', 'Top with ice cream...'],
        image: '/imgs/halo-halo.jpg',
        submittedAt: '2024-02-14T15:45:00Z',
        status: 'pending',
        flagged: true,
        reportCount: 2
      },
      {
        id: 3,
        title: 'Leche Flan Supreme',
        author: 'Ana Reyes',
        authorId: 3,
        category: 'Custard',
        description: 'Rich and creamy leche flan with caramel sauce.',
        ingredients: ['12 egg yolks', '1 can condensed milk', '1 can evaporated milk', '1 cup sugar'],
        instructions: ['Make caramel sauce...', 'Mix egg yolks with milk...'],
        image: '/imgs/leche-flan.jpg',
        submittedAt: '2024-02-13T09:20:00Z',
        status: 'pending',
        flagged: false,
        reportCount: 0
      }
    ]);

    // Mock user reports
    setUserReports([
      {
        id: 1,
        reportedUser: 'BadUser123',
        reportedUserId: 5,
        reportedBy: 'GoodUser456',
        reportedById: 8,
        reason: 'Inappropriate content',
        description: 'User posted offensive comments on my recipe and used inappropriate language.',
        reportedAt: '2024-02-15T14:30:00Z',
        status: 'pending',
        severity: 'high',
        evidence: 'Screenshot of offensive comments',
        relatedRecipe: 'Classic Leche Flan'
      },
      {
        id: 2,
        reportedUser: 'SpamBot999',
        reportedUserId: 12,
        reportedBy: 'ChefMaria',
        reportedById: 3,
        reason: 'Spam/Bot activity',
        description: 'This user keeps posting the same generic comments on all recipes.',
        reportedAt: '2024-02-14T11:15:00Z',
        status: 'pending',
        severity: 'medium',
        evidence: 'Multiple identical comments',
        relatedRecipe: 'Multiple recipes'
      },
      {
        id: 3,
        reportedUser: 'CopyPaste101',
        reportedUserId: 7,
        reportedBy: 'OriginalChef',
        reportedById: 15,
        reason: 'Recipe plagiarism',
        description: 'This user copied my entire recipe without permission and claimed it as their own.',
        reportedAt: '2024-02-13T16:45:00Z',
        status: 'investigating',
        severity: 'high',
        evidence: 'Original recipe links',
        relatedRecipe: 'Stolen Ube Cake Recipe'
      }
    ]);
  }, []);

  // Recipe moderation functions
  const handleRecipeAction = (action, recipeId, reason = '') => {
    setLoading(true);
    setTimeout(() => {
      setRecipes(prev => prev.map(recipe => 
        recipe.id === recipeId ? { ...recipe, status: action, moderationReason: reason } : recipe
      ));
      setLoading(false);
      
      // Show success message
      const actionText = action === 'approved' ? 'approved' : 'rejected';
      alert(`Recipe ${actionText} successfully!`);
    }, 1000);
  };

  const handleBulkRecipeAction = (action) => {
    if (selectedItems.length === 0) {
      alert('Please select recipes first');
      return;
    }
    
    const confirmMessage = `Are you sure you want to ${action} ${selectedItems.length} recipe(s)?`;
    if (window.confirm(confirmMessage)) {
      setLoading(true);
      setTimeout(() => {
        setRecipes(prev => prev.map(recipe => 
          selectedItems.includes(recipe.id) ? { ...recipe, status: action } : recipe
        ));
        setSelectedItems([]);
        setLoading(false);
      }, 1500);
    }
  };

  // User report functions
  const handleReportAction = (action, reportId) => {
    setLoading(true);
    setTimeout(() => {
      setUserReports(prev => prev.map(report => 
        report.id === reportId ? { ...report, status: action } : report
      ));
      setLoading(false);
      
      const actionText = action === 'resolved' ? 'resolved' : action === 'dismissed' ? 'dismissed' : 'investigating';
      alert(`Report ${actionText} successfully!`);
    }, 1000);
  };

  // Filter functions
  const pendingRecipes = recipes.filter(recipe => recipe.status === 'pending');
  const flaggedRecipes = recipes.filter(recipe => recipe.flagged || recipe.reportCount > 0);
  const pendingReports = userReports.filter(report => report.status === 'pending');
  const allReports = userReports;

  // Get time ago helper
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

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
                  {pendingRecipes.length} pending recipes, {pendingReports.length} reports
                </span>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                View Guidelines
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex space-x-8 border-b border-gray-200">
          {[
            { id: 'pending', label: 'Pending Recipes', icon: '📝', count: pendingRecipes.length },
            { id: 'flagged', label: 'Flagged Content', icon: '🚩', count: flaggedRecipes.length },
            { id: 'reports', label: 'User Reports', icon: '📋', count: pendingReports.length },
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
              <div className="flex gap-3">
                <button
                  onClick={() => handleBulkRecipeAction('approved')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Bulk Approve
                </button>
                <button
                  onClick={() => handleBulkRecipeAction('rejected')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Bulk Reject
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {pendingRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
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
                        className="mt-1 rounded border-gray-300"
                      />
                      
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{recipe.title}</h3>
                            <p className="text-sm text-gray-600">by {recipe.author} • {recipe.category}</p>
                            <p className="text-xs text-gray-500">{getTimeAgo(recipe.submittedAt)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {recipe.flagged && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                🚩 Flagged
                              </span>
                            )}
                            {recipe.reportCount > 0 && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                {recipe.reportCount} reports
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{recipe.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Ingredients:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                                <li key={idx}>• {ingredient}</li>
                              ))}
                              {recipe.ingredients.length > 3 && (
                                <li className="text-gray-500">...and {recipe.ingredients.length - 3} more</li>
                              )}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Instructions:</h4>
                            <ol className="text-sm text-gray-600 space-y-1">
                              {recipe.instructions.slice(0, 2).map((step, idx) => (
                                <li key={idx}>{idx + 1}. {step}</li>
                              ))}
                              {recipe.instructions.length > 2 && (
                                <li className="text-gray-500">...and {recipe.instructions.length - 2} more steps</li>
                              )}
                            </ol>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleRecipeAction('approved', recipe.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Reason for rejection (optional):');
                              handleRecipeAction('rejected', recipe.id, reason);
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            ❌ Reject
                          </button>
                          <button
                            onClick={() => {
                              alert('Opening full recipe preview...');
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            👁️ Full Preview
                          </button>
                          <button
                            onClick={() => {
                              alert('Contacting author for clarification...');
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                          >
                            💬 Contact Author
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flagged Content Tab */}
        {activeTab === 'flagged' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Flagged Content Review</h2>
            
            <div className="grid gap-4">
              {flaggedRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-sm border border-red-200">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{recipe.title}</h3>
                            <p className="text-sm text-gray-600">by {recipe.author}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {recipe.flagged && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                🚩 Auto-flagged
                              </span>
                            )}
                            {recipe.reportCount > 0 && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                {recipe.reportCount} user reports
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{recipe.description}</p>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleRecipeAction('approved', recipe.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          >
                            ✅ Approve (Safe)
                          </button>
                          <button
                            onClick={() => handleRecipeAction('rejected', recipe.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            ❌ Remove Content
                          </button>
                          <button
                            onClick={() => alert('Viewing detailed reports...')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            📋 View Reports
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">User Reports</h2>
            
            <div className="grid gap-4">
              {allReports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Report against: <span className="text-red-600">{report.reportedUser}</span>
                        </h3>
                        <p className="text-sm text-gray-600">
                          Reported by: {report.reportedBy} • {getTimeAgo(report.reportedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          report.severity === 'high' ? 'bg-red-100 text-red-800' :
                          report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {report.severity} priority
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Reason:</h4>
                        <p className="text-sm text-gray-700">{report.reason}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Related Content:</h4>
                        <p className="text-sm text-gray-700">{report.relatedRecipe}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">Description:</h4>
                      <p className="text-sm text-gray-700">{report.description}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">Evidence:</h4>
                      <p className="text-sm text-gray-700">{report.evidence}</p>
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleReportAction('investigating', report.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        🔍 Investigate
                      </button>
                      <button
                        onClick={() => handleReportAction('resolved', report.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        ✅ Resolve (Take Action)
                      </button>
                      <button
                        onClick={() => handleReportAction('dismissed', report.id)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                      >
                        ❌ Dismiss
                      </button>
                      <button
                        onClick={() => alert('Viewing user profile and history...')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        👤 View User Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Moderation History</h2>
            
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Moderation History</h3>
                  <p className="text-gray-600">
                    This section will show your past moderation actions, including approved/rejected recipes and resolved reports.
                  </p>
                  <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    View Full History
                  </button>
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