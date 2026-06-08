import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsAuthenticated(authService.isAuthenticated());
    setLoading(false);
  }, []);
  
  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
    setIsAuthenticated(true);
    return response;
  };
  
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };
  
  const register = async (userData) => {
    const response = await authService.register(userData);
    return response;
  };
  
  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
  };
};

export default useAuth;
