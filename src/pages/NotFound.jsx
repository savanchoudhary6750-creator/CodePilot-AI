import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout, { Container } from '../layouts/PageLayout';

const NotFound = () => {
  return (
    <PageLayout className="bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white min-h-screen">
      <Container className="flex flex-col items-center justify-center py-20 md:py-32">
        <div className="text-center">
          <div className="relative inline-block mb-8 md:mb-12">
            <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
              404
            </h1>
            <div className="absolute -top-4 -right-4 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-md mx-auto mb-8 md:mb-12 leading-relaxed">
            The page you're looking for doesn't exist or has been moved to a new location.
          </p>

          <Link to="/">
            <button className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl md:rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 text-sm md:text-base">
              Go Home
            </button>
          </Link>
        </div>
      </Container>
    </PageLayout>
  );
};

export default NotFound;
