import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const statusColors = {
  success: 'from-emerald-500/10 to-teal-500/5 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5',
  warning: 'from-amber-500/10 to-orange-500/5 text-amber-400 border-amber-500/20 shadow-amber-500/5',
  danger: 'from-rose-500/10 to-red-500/5 text-rose-400 border-rose-500/20 shadow-rose-500/5',
  primary: 'from-indigo-500/10 to-purple-500/5 text-indigo-400 border-indigo-500/20 shadow-indigo-500/5',
  neutral: 'from-slate-900/40 to-slate-950/20 text-slate-300 border-slate-800 shadow-slate-950/5',
};

const glowColors = {
  success: 'group-hover:bg-emerald-500/10',
  warning: 'group-hover:bg-amber-500/10',
  danger: 'group-hover:bg-rose-500/10',
  primary: 'group-hover:bg-indigo-500/10',
  neutral: 'group-hover:bg-slate-800/20',
};

const textColors = {
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  danger: 'text-rose-400',
  primary: 'text-indigo-400',
  neutral: 'text-white',
};

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  status = 'neutral', 
  className = '' 
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-[#111827]/40 backdrop-blur-md border rounded-3xl p-6 overflow-hidden transition-all shadow-lg ${statusColors[status] || statusColors.neutral} ${className}`}
    >
      {/* Glow highlight */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] pointer-events-none transition-colors duration-500 -mr-8 -mt-8 ${glowColors[status] || glowColors.neutral}`} />

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
      </div>

      <div className={`text-3xl font-extrabold tracking-tight ${textColors[status] || textColors.neutral} mb-1.5`}>
        {value}
      </div>

      {description && (
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  description: PropTypes.string,
  status: PropTypes.oneOf(['success', 'warning', 'danger', 'primary', 'neutral']),
  className: PropTypes.string,
};

export default MetricCard;
