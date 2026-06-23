/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch (err) {
      return 'dark';
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(theme);
    } catch (err) {
      console.error('Theme save error:', err);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, loading, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useThemeContext must be used within ThemeProvider'
    );
  }

  return context;
};