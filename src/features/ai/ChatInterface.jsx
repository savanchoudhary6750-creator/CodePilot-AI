import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser, FiCpu, FiCopy, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ChatInterface = ({ onSendMessage, placeholder = "Ask me anything about your code...", initialMessages = [] }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await onSendMessage(input);
      const aiMessage = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: response || "I apologize, but I couldn't generate a response. Please try again." 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
      const errorMessage = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: "I encountered an error processing your request. Please try again." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <FiCpu className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Assistant</h3>
            <p className="text-gray-400 text-sm max-w-md">
              Ask me anything about your code, debugging, or best practices. I'm here to help!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <FiCpu className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-slate-800 text-gray-100 border border-slate-700'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                {message.role === 'assistant' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700">
                    <button
                      onClick={() => handleCopy(message.content)}
                      className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors text-gray-400 hover:text-white"
                      title="Copy"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors text-gray-400 hover:text-green-400"
                      title="Helpful"
                    >
                      <FiThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors text-gray-400 hover:text-red-400"
                      title="Not helpful"
                    >
                      <FiThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <FiCpu className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
