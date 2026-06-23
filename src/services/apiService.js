import api from './api';

class ApiService {
  async get(endpoint, options = {}) {
    try {
      return await api.get(endpoint, options);
    } catch (error) {
      if (error.message && error.message.includes('Network Error')) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
      }
      throw error;
    }
  }
  
  async post(endpoint, data, options = {}) {
    try {
      return await api.post(endpoint, data, options);
    } catch (error) {
      if (error.message && error.message.includes('Network Error')) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
      }
      throw error;
    }
  }
  
  async put(endpoint, data, options = {}) {
    try {
      return await api.put(endpoint, data, options);
    } catch (error) {
      if (error.message && error.message.includes('Network Error')) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
      }
      throw error;
    }
  }
  
  async delete(endpoint, options = {}) {
    try {
      return await api.delete(endpoint, options);
    } catch (error) {
      if (error.message && error.message.includes('Network Error')) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
      }
      throw error;
    }
  }
}

export default new ApiService();

