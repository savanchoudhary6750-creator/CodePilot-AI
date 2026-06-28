import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    cssMinify: true, // Explicit CSS compression
    sourcemap: false, // Turn off source maps for cleaner production bundle and faster builds
    chunkSizeWarningLimit: 600, // Adjust warning limit to 600kB
    rollupOptions: {
      output: {
        // Perform explicit code splitting to isolate heavy vendor assets
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group core React and router packages
            if (
              id.includes('react/') ||
              id.includes('react-dom/') ||
              id.includes('react-router/') ||
              id.includes('react-router-dom/')
            ) {
              return 'vendor-core';
            }
            // Monaco editor is heavy, isolate it to prevent rendering delay on landing pages
            if (id.includes('monaco-editor') || id.includes('@monaco-editor')) {
              return 'vendor-monaco';
            }
            // Framer motion is used for premium animations
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // React icons
            if (id.includes('react-icons')) {
              return 'vendor-icons';
            }
            // All other third party libraries
            return 'vendor-utils';
          }
        },
        // Organize output paths for javascript and assets
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      }
    }
  }
});
