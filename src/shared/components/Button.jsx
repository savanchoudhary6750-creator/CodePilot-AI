import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', ...props }) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5',
    secondary: 'bg-[#1E293B] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white hover:-translate-y-0.5',
    danger: 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl hover:-translate-y-0.5',
    outline: 'border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/50 hover:-translate-y-0.5',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/40',
  };
  
  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
    xl: 'px-9 py-4 text-lg',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
