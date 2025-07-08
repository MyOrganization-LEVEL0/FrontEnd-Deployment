// src/services/contactService.js
import api from './api';

export const contactService = {
  async submitMessage(contactData) {
    try {
      const response = await api.post('/contact/submit/', contactData);
      return response.data;
    } catch (error) {
      console.error('Contact submission error:', error);
      throw error;
    }
  }
};