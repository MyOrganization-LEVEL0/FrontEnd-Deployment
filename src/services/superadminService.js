// src/services/superadminService.js
import api from './api';

export const superadminService = {
  // Dashboard overview stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/auth/superadmin/dashboard/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to load dashboard statistics');
    }
  },

  // Recipe management - Get ALL recipes (published, pending, rejected)
  getAllRecipes: async () => {
    try {
      // Get all recipes regardless of status for superadmin
      const response = await api.get('/recipes/?all_status=true');
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw new Error('Failed to load recipes');
    }
  },

  updateRecipeStatus: async (recipeId, action) => {
    try {
      const response = await api.post(`/recipes/${recipeId}/admin-action/`, { action });
      return response.data;
    } catch (error) {
      console.error('Error updating recipe status:', error);
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      throw new Error('Failed to update recipe status');
    }
  },

  deleteRecipe: async (recipeId) => {
    try {
      const response = await api.delete(`/recipes/${recipeId}/superadmin/delete/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to delete this recipe');
      }
      throw new Error('Failed to delete recipe');
    }
  },

  toggleRecipeFeatured: async (recipeId, isFeatured) => {
    try {
      const response = await api.patch(`/recipes/${recipeId}/superadmin/feature/`, { 
        is_featured: isFeatured 
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw new Error('Failed to update featured status');
    }
  },

  // User management
  getAllUsers: async () => {
    try {
      const response = await api.get('/auth/superadmin/users/');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to load users');
    }
  },

  updateUserStatus: async (userId, action) => {
    try {
      const response = await api.post(`/auth/superadmin/users/${userId}/action/`, { action });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
      throw new Error('Failed to update user status');
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/auth/superadmin/users/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      console.error('Response:', error.response?.data);
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to delete this user');
      }
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(`Failed to delete user: ${error.response?.data?.error || error.message}`);
    }
  }
};