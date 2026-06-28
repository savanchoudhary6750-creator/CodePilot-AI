/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (authService.isAuthenticated()) {
        const response = await authService.getMe();
        if (response.success && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          authService.clearSession();
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Session refresh failed:', err);
      setUser(null);
      setIsAuthenticated(false);
      authService.clearSession();
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      if (response.user && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return { success: true, data: response };
      }
      throw new Error('Invalid response from server');
    } catch (err) {
      const errMsg = err.message || 'Login failed';
      setError(errMsg);
      toast.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to logout');
    }
  }, []);
  
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      if (response.user && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success('Registration successful!');
        return { success: true, data: response };
      }
      throw new Error('Invalid response from server');
    } catch (err) {
      const errMsg = err.message || 'Registration failed';
      setError(errMsg);
      toast.error(errMsg);
      return { success: false, error: errMsg };
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
      const errMsg = err.message || 'Profile update failed';
      setError(errMsg);
      toast.error(errMsg);
      return { success: false, error: errMsg };
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
    checkAuth,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
