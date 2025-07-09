// src/services/adminService.js
import api from './api';

export const adminService = {
  // Dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/recipes/admin/dashboard/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to load dashboard statistics');
    }
  },

  // Pending recipes
  getPendingRecipes: async () => {
    try {
      const response = await api.get('/recipes/admin/pending/');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending recipes:', error);
      throw new Error('Failed to load pending recipes');
    }
  },

  // Flagged recipes
  getFlaggedRecipes: async () => {
    try {
      const response = await api.get('/recipes/admin/flagged/');
      return response.data;
    } catch (error) {
      console.error('Error fetching flagged recipes:', error);
      throw new Error('Failed to load flagged recipes');
    }
  },

  // User reports
  getReports: async () => {
    try {
      const response = await api.get('/recipes/admin/reports/');
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to load reports');
    }
  },

  // Recipe actions (approve/reject)
  handleRecipeAction: async (recipeId, action, reason = null) => {
    try {
      const data = { action };
      if (reason) {
        data.reason = reason;
      }
      
      const response = await api.post(`/recipes/${recipeId}/admin-action/`, data);
      return response.data;
    } catch (error) {
      console.error('Error performing recipe action:', error);
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      throw new Error('Failed to perform recipe action');
    }
  },

  // Report actions (mute/resolve only)
  handleReportAction: async (reportId, action, options = {}) => {
    try {
      const data = { action };
      
      // Add optional parameters
      if (options.duration) {
        data.duration = options.duration; // For mute action
      }
      
      const response = await api.post(`/recipes/admin/reports/${reportId}/action/`, data);
      return response.data;
    } catch (error) {
      console.error('Error performing report action:', error);
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      throw new Error('Failed to perform report action');
    }
  }
};