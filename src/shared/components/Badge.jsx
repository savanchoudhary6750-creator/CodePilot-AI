import React from 'react';

const Badge = ({ children, severity = '', variant = 'neutral', className = '' }) => {
  const severities = {
    critical: 'bg-rose-500/10 text-rose-400 border border-rose-500/25',
    high: 'bg-red-500/10 text-red-400 border border-red-500/25',
    medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/25',
    low: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
  };

  const variants = {
    primary: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25',
    secondary: 'bg-purple-500/10 text-purple-400 border border-purple-500/25',
    neutral: 'bg-slate-800/60 text-slate-300 border border-slate-700/50',
    accent: 'bg-pink-500/10 text-pink-400 border border-pink-500/25',
  };

  const styleClass = severity ? severities[severity.toLowerCase()] : variants[variant];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styleClass} ${className}`}>
      {severity && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          severity.toLowerCase() === 'critical' ? 'bg-rose-400 animate-pulse' :
          severity.toLowerCase() === 'high' ? 'bg-red-400' :
          severity.toLowerCase() === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
        }`} />
      )}
      {children || severity}
    </span>
  );
};

export default Badge;
