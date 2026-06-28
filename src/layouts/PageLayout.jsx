import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const sizeClasses = {
  default: 'py-16 md:py-24',
  large: 'py-24 md:py-32',
  small: 'py-10 md:py-16',
};

const maxWidthClasses = {
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

const PageLayout = ({ children, className = '' }) => {
  return (
    <div className={`w-full bg-[#020617] text-slate-100 ${className}`}>
      {children}
    </div>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const Section = ({ children, className = '', size = 'default', id }) => {
  return (
    <section
      id={id}
      className={`relative z-10 px-4 sm:px-6 lg:px-8 ${sizeClasses[size] || sizeClasses.default} ${className}`}
    >
      {children}
    </section>
  );
};

Section.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['default', 'large', 'small']),
  id: PropTypes.string,
};

export const Container = ({ children, className = '', maxWidth = '7xl' }) => {
  return (
    <div className={`mx-auto w-full ${maxWidthClasses[maxWidth] || maxWidthClasses['7xl']} ${className}`}>
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  maxWidth: PropTypes.oneOf(['4xl', '5xl', '6xl', '7xl']),
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
    <Section size="large" className={`overflow-hidden ${className}`}>
      {/* Decorative dynamic orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <Container maxWidth="6xl" className="text-center relative z-10">
        {badge && (
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
            {badge}
          </motion.span>
        )}
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6"
        >
          {title}{' '}
          {gradientText && (
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {gradientText}
            </span>
          )}
        </motion.h1>
        
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-medium"
          >
            {subtitle}
          </motion.p>
        )}
        
        {buttons && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {buttons}
          </motion.div>
        )}
      </Container>
    </Section>
  );
};

Hero.propTypes = {
  badge: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  gradientText: PropTypes.string,
  buttons: PropTypes.node,
  className: PropTypes.string,
};

export default PageLayout;
