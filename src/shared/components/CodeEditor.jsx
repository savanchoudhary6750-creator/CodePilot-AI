import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code = '', language = 'javascript', readOnly = false, onChange }) => {
  const [editorCode, setEditorCode] = useState(code);

  useEffect(() => {
    setEditorCode(code);
  }, [code]);

  const handleEditorChange = (value) => {
    setEditorCode(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-lg">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-300 dark:border-gray-600">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {language === 'cpp' ? 'C++' : language.charAt(0).toUpperCase() + language.slice(1)}
        </span>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <Editor
        height="400px"
        language={language}
        value={editorCode}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  );
};

export default CodeEditor;
