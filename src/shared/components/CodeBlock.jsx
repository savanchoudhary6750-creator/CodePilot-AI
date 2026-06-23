import React, { useState } from 'react';
import { LuCopy, LuCheck, LuMaximize2, LuMinimize2 } from 'react-icons/lu';
import toast from 'react-hot-toast';

const CodeBlock = ({ 
  code = '', 
  language = 'javascript', 
  filename = 'source-code.js', 
  className = '', 
  allowFullScreen = true 
}) => {
  const [copied, setCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  const containerClasses = isFullScreen 
    ? 'fixed inset-4 z-50 bg-[#020617] border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl'
    : `bg-[#020617] border border-slate-800/80 rounded-2xl flex flex-col overflow-hidden shadow-xl ${className}`;

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-[#0F172A]/70 border-b border-slate-850/80 select-none">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="ml-3.5 text-[11px] font-mono text-slate-400 font-semibold">{filename} • {language}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
            title="Copy Code"
          >
            {copied ? <LuCheck className="w-4 h-4 text-emerald-400" /> : <LuCopy className="w-4 h-4" />}
          </button>
          {allowFullScreen && (
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg hover:bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
              title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
            >
              {isFullScreen ? <LuMinimize2 className="w-4 h-4" /> : <LuMaximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto flex text-xs md:text-sm font-mono leading-relaxed p-4 select-text max-h-[500px]">
        {/* Line Numbers */}
        <div className="text-right text-slate-600 select-none pr-4 border-r border-slate-850/60 font-medium w-8">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        
        {/* Code Content */}
        <pre className="pl-4 flex-1 text-emerald-400 overflow-x-auto whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
