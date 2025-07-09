// src/components/SimpleModerationHistory.js

import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const SimpleModerationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    action: '',
    page_size: 20
  });
  const [availableActions, setAvailableActions] = useState([]);

  useEffect(() => {
    loadModerationHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filters]);

  const loadModerationHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        ...filters
      };
      
      const response = await adminService.getModerationHistory(params);
      
      setHistory(response.results);
      setTotalPages(response.total_pages);
      setAvailableActions(response.available_actions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const getEventIcon = (eventType, action) => {
    const icons = {
      'content_submission': '📝',
      'content_modification': '✏️',
      'content_removal': '🗑️',
      'user_engagement': '💬',
      'user_access': '🔐',
      'other': '📋'
    };
    return icons[eventType] || '📋';
  };

  const getEventColor = (eventType) => {
    const colors = {
      'content_submission': 'text-blue-600',
      'content_modification': 'text-yellow-600',
      'content_removal': 'text-red-600',
      'user_engagement': 'text-green-600',
      'user_access': 'text-gray-600',
      'other': 'text-gray-600'
    };
    return colors[eventType] || 'text-gray-600';
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'superadmin': 'bg-red-100 text-red-800',
      'admin': 'bg-blue-100 text-blue-800',
      'viewer1': 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  if (loading && history.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading moderation history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Recent System Activity</h2>
        <div className="text-sm text-gray-500">
          Showing user activities and content changes
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action Type
            </label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Actions</option>
              {availableActions.map(action => (
                <option key={action} value={action}>
                  {action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Per Page
            </label>
            <select
              value={filters.page_size}
              onChange={(e) => handleFilterChange('page_size', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* History List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activity Found</h3>
            <p className="text-gray-600">
              No system activity found for the selected filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {history.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`text-2xl ${getEventColor(item.event_type)}`}>
                      {getEventIcon(item.event_type, item.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {item.user.full_name}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(item.user.role)}`}>
                          {item.user.role}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className={`font-medium ${getEventColor(item.event_type)}`}>
                          {item.action_display}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {item.description || `${item.action_display} activity`}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{formatTimeAgo(item.timestamp)}</span>
                        <span>•</span>
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                        {item.ip_address && (
                          <>
                            <span>•</span>
                            <span>IP: {item.ip_address}</span>
                          </>
                        )}
                        {item.recipe_id && (
                          <>
                            <span>•</span>
                            <span>Recipe: {item.recipe_id}</span>
                          </>
                        )}
                        {item.comment_id && (
                          <>
                            <span>•</span>
                            <span>Comment: {item.comment_id}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleModerationHistory;