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
    default: 'section',
    large: 'section-lg',
    small: 'section-sm',
  };

  return (
    <section
      id={id}
      className={`${sizeClasses[size]} ${className}`}
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
    <div className={`container ${maxWidthClasses[maxWidth]} ${className}`}>
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
      <Container maxWidth="6xl" className="text-center">
        {badge && (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8 backdrop-blur-sm fade-in-up">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            {badge}
          </span>
        )}
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 fade-in-up stagger-1">
          {title}{' '}
          {gradientText && (
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent gradient-animate">
              {gradientText}
            </span>
          )}
        </h1>
        
        {subtitle && (
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed fade-in-up stagger-2">
            {subtitle}
          </p>
        )}
        
        {buttons && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up stagger-3">
            {buttons}
          </div>
        )}
      </Container>
    </Section>
  );
};

export default PageLayout;
