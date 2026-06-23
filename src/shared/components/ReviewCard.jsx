import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuChevronDown, LuZap, LuFileText } from 'react-icons/lu';
import Badge from './Badge';

const ReviewCard = ({ 
  severity = 'low', 
  type = 'logic', 
  line, 
  message, 
  suggestion, 
  codeSnippet, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const severityColors = {
    critical: 'border-rose-500/20 bg-rose-500/5 text-rose-300 hover:border-rose-500/30',
    high: 'border-red-500/20 bg-red-500/5 text-red-300 hover:border-red-500/30',
    medium: 'border-amber-500/20 bg-amber-500/5 text-amber-300 hover:border-amber-500/30',
    low: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300 hover:border-emerald-500/30',
  };

  const borderClass = severityColors[severity.toLowerCase()] || 'border-slate-800 bg-slate-900/30';

  return (
    <div className={`border rounded-2xl transition-all duration-300 overflow-hidden ${borderClass} ${className}`}>
      {/* Header / Click trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-start p-4 cursor-pointer select-none gap-4 hover:bg-slate-950/20 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge severity={severity}>{severity} Severity</Badge>
            <span className="text-[10px] bg-slate-950/40 border border-slate-800 px-2.5 py-0.5 rounded-full text-slate-400 font-semibold uppercase">{type}</span>
            <span className="text-[10px] bg-slate-950/40 border border-slate-800 px-2.5 py-0.5 rounded-full text-slate-400 font-semibold">Line {line}</span>
          </div>
          <p className="text-slate-200 text-sm font-medium leading-relaxed truncate-2-lines group-hover:text-white">
            {message}
          </p>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-500 p-1 rounded-lg hover:bg-slate-900/50 hover:text-white mt-0.5"
        >
          <LuChevronDown className="w-4.5 h-4.5" />
        </motion.div>
      </div>

      {/* Collapsible Details */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-4 pb-4 pt-1 border-t border-slate-850/60 bg-slate-950/30">
              <div className="space-y-4">
                {suggestion && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                      <LuZap className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Fix Suggestion</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed pl-5">
                      {suggestion}
                    </p>
                  </div>
                )}

                {codeSnippet && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                      <LuFileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Corrected Code Code snippet</span>
                    </div>
                    <div className="pl-5">
                      <pre className="text-[11px] text-emerald-400 font-mono bg-[#020617] p-3 rounded-xl overflow-x-auto border border-slate-850 max-w-full text-left leading-relaxed">
                        <code>{codeSnippet}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewCard;
