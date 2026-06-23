import apiService from './apiService';

class AuthService {
  async login(credentials) {
    const response = await apiService.post('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }
  
  async register(userData) {
    const response = await apiService.post('/auth/register', userData);
    return response;
  }
  
  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  async getMe() {
    const response = await apiService.get('/auth/me');
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }

  async updateProfile(profileData) {
    const response = await apiService.put('/auth/profile', profileData);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }

  async updatePassword(passwordData) {
    return await apiService.put('/auth/password', passwordData);
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
