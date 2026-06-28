import apiService from './apiService';

class AuthService {
  // Helper to persist auth session
  setSession(token, user) {
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
  }

  // Helper to clear auth session
  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async login(credentials) {
    const response = await apiService.post('/auth/login', credentials);
    if (response.token) {
      this.setSession(response.token, response.user);
    }
    return response;
  }
  
  async register(userData) {
    const response = await apiService.post('/auth/register', userData);
    if (response.token) {
      this.setSession(response.token, response.user);
    }
    return response;
  }
  
  async logout() {
    this.clearSession();
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
    return !!this.getToken();
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Failed to parse persistent user state:', error);
      this.clearSession();
      return null;
    }
  }
  
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
