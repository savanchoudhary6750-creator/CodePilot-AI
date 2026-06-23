/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authService.getMe();
        if (response.success && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Session refresh failed:', err);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      if (response.user && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        toast.success('Login successful!');
        return { success: true, data: response };
      }
      throw new Error('Invalid response from server');
    } catch (err) {
      setError(err.message || 'Login failed');
      toast.error(err.message || 'Login failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setError(null);
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to logout');
    }
  };
  
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      if (response.user && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        toast.success('Registration successful!');
        return { success: true, data: response };
      }
      throw new Error('Invalid response from server');
    } catch (err) {
      setError(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.updateProfile(profileData);
      if (response.user) {
        setUser(response.user);
        toast.success('Profile updated successfully!');
        return { success: true, user: response.user };
      }
      throw new Error('Invalid response from server');
    } catch (err) {
      setError(err.message || 'Profile update failed');
      toast.error(err.message || 'Profile update failed.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile,
  };

  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
