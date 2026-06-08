import React from 'react';

const PageLayout = ({ children, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
};

export const Section = ({ children, className = '', size = 'default', id }) => {
  const sizeClasses = {
    default: 'py-16 md:py-24',
    large: 'py-20 md:py-32',
    small: 'py-12 md:py-16',
  };

  return (
    <section
      id={id}
      className={`container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl ${sizeClasses[size]} ${className}`}
    >
      {children}
    </section>
  );
};

export const Container = ({ children, className = '', maxWidth = '7xl' }) => {
  const maxWidthClasses = {
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  };

  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};

export const Hero = ({ 
  badge, 
  title, 
  subtitle, 
  gradientText, 
  buttons, 
  className = '' 
}) => {
  return (
    <Section size="large" className={className}>
      <Container maxWidth="5xl" className="text-center">
        {badge && (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            {badge}
          </span>
        )}
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
          {title}{' '}
          {gradientText && (
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {gradientText}
            </span>
          )}
        </h1>
        
        {subtitle && (
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            {subtitle}
          </p>
        )}
        
        {buttons && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {buttons}
          </div>
        )}
      </Container>
    </Section>
  );
};

export default PageLayout;
