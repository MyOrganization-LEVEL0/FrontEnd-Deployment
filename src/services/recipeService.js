// src/services/recipeService.js
import api from './api';

export const recipeService = {
  getAllRecipes: async (params = {}) => {
    const response = await api.get('/recipes/', { params });
    return response.data;
  },

  getRecipeById: async (id) => {
    const response = await api.get(`/recipes/${id}/`);
    return response.data;
  },

  createRecipe: async (recipeData) => {
    const response = await api.post('/recipes/', recipeData);
    return response.data;
  },

  updateRecipe: async (id, recipeData) => {
    const response = await api.put(`/recipes/${id}/`, recipeData);
    return response.data;
  },

  deleteRecipe: async (id) => {
    const response = await api.delete(`/recipes/${id}/`);
    return response.data;
  },

  // Enhanced search method with additional parameters
  searchRecipes: async (query, params = {}) => {
    const searchParams = { 
      q: query,
      ...params 
    };
    const response = await api.get('/recipes/search/', { 
      params: searchParams 
    });
    return response.data;
  },

  getRecipesByCategory: async (category) => {
    const response = await api.get('/recipes/', { 
      params: { category } 
    });
    return response.data;
  },

  addComment: async (recipeId, comment) => {
    const response = await api.post(`/recipes/${recipeId}/comments/`, comment);
    return response.data;
  },

  getComments: async (recipeId) => {
    const response = await api.get(`/recipes/${recipeId}/comments/`);
    return response.data;
  },

  // Report functionality
  submitReport: async (reportData) => {
    try {
      const response = await api.post('/recipes/report/', reportData);
      return response.data;
    } catch (error) {
      console.error('Error submitting report:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        // Check for duplicate report error
        if (error.response.data?.error?.includes('unique set') || 
            error.response.data?.non_field_errors?.some(err => err.includes('unique set'))) {
          throw new Error('You have already reported this content');
        }
        
        const errorMessage = error.response.data?.error || 
                           Object.values(error.response.data || {}).flat().join(', ') ||
                           'Invalid report data';
        throw new Error(errorMessage);
      } else if (error.response?.status === 401) {
        throw new Error('You must be logged in to submit reports');
      } else if (error.response?.status === 429) {
        throw new Error('Too many reports submitted. Please try again later.');
      } else {
        throw new Error('Failed to submit report. Please try again.');
      }
    }
  },

  // NEW: Favorites functionality
  addToFavorites: async (recipeId) => {
    try {
      const response = await api.post(`/recipes/${recipeId}/favorite/`);
      return response.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      if (error.response?.status === 401) {
        throw new Error('You must be logged in to add favorites');
      }
      throw new Error('Failed to add to favorites. Please try again.');
    }
  },

  removeFromFavorites: async (recipeId) => {
    try {
      const response = await api.delete(`/recipes/${recipeId}/favorite/`);
      return response.data;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      if (error.response?.status === 401) {
        throw new Error('You must be logged in to remove favorites');
      }
      throw new Error('Failed to remove from favorites. Please try again.');
    }
  },

  getUserFavorites: async () => {
    try {
      const response = await api.get('/recipes/', { 
        params: { favorited: 'true' } 
      });
      return response.data;
    } catch (error) {
      console.error('Error getting user favorites:', error);
      if (error.response?.status === 401) {
        throw new Error('You must be logged in to view favorites');
      }
      throw new Error('Failed to load favorites. Please try again.');
    }
  }
};