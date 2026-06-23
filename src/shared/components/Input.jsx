import React from 'react';

const Input = ({ 
  label, 
  icon: Icon, 
  error, 
  type = 'text', 
  className = '', 
  ...props 
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          className={`w-full px-4 py-2.5 bg-[#0F172A] border ${
            error ? 'border-red-500/50 focus:ring-red-500/25' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
          } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all text-sm ${
            Icon ? 'pl-10' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 font-medium mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
