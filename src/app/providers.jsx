import React from 'react';
import { AuthProvider, ThemeProvider } from '../state';
import { ErrorBoundary } from '../shared/components';

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
