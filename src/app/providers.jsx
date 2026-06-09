import React from 'react';
import { AuthProvider, ThemeProvider } from '../state';
import { ErrorBoundary } from '../core';

const Providers = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default Providers;
