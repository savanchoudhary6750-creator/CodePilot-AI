import React, { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <FiAlertTriangle className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Something went wrong
              </h1>
              
              <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
                We encountered an unexpected error. Don't worry, your work is safe. Please try refreshing the page.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <div className="bg-black/50 rounded-xl p-4 mb-6 text-left overflow-auto max-h-48">
                  <p className="text-red-400 font-mono text-sm mb-2">
                    {this.state.error.toString()}
                  </p>
                  <p className="text-gray-500 font-mono text-xs">
                    {this.state.errorInfo?.componentStack}
                  </p>
                </div>
              )}

              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105"
              >
                <FiRefreshCw className="w-5 h-5" />
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
