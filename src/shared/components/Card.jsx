import React from 'react';

const Card = ({ children, className = '', title, footer, ...props }) => {
  return (
    <div 
      className={`bg-[#111827]/40 backdrop-blur border border-slate-800 rounded-3xl hover:border-slate-700/80 transition-all duration-300 shadow-xl overflow-hidden ${className}`} 
      {...props}
    >
      {title && (
        <div className="px-6 py-5 border-b border-slate-850/60 bg-[#0B1120]/30">
          <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-[#0B1120]/20 border-t border-slate-850/60">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
