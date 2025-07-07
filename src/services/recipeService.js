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
  }
};