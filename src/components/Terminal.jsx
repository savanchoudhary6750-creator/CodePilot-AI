import React, { useState, useEffect, useRef } from 'react';
import { FiTerminal, FiCopy, FiCheck } from 'react-icons/fi';

const Terminal = ({ output = [], title = 'Terminal' }) => {
  const [copied, setCopied] = useState(false);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleCopy = () => {
    const text = output.map(line => line.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <FiTerminal className="text-green-400" size={16} />
          <span className="text-sm font-medium text-gray-300">{title}</span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded hover:bg-gray-700 transition-colors"
          title="Copy output"
        >
          {copied ? <FiCheck className="text-green-400" size={14} /> : <FiCopy className="text-gray-400" size={14} />}
        </button>
      </div>
      <div
        ref={terminalRef}
        className="p-4 h-48 overflow-y-auto font-mono text-sm space-y-1"
      >
        {output.length === 0 ? (
          <p className="text-gray-500 italic">No output yet...</p>
        ) : (
          output.map((line, index) => (
            <div
              key={index}
              className={`${
                line.type === 'error'
                  ? 'text-red-400'
                  : line.type === 'warning'
                  ? 'text-yellow-400'
                  : line.type === 'success'
                  ? 'text-green-400'
                  : line.type === 'info'
                  ? 'text-blue-400'
                  : 'text-gray-300'
              }`}
            >
              <span className="text-gray-500 mr-2">{line.timestamp}</span>
              {line.prefix && <span className="text-purple-400 mr-2">{line.prefix}</span>}
              {line.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Terminal;
