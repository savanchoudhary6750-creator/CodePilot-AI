import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX, FiCode } from 'react-icons/fi';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Review', path: '/review' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleGetStarted = () => {
    navigate('/review');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-2xl'
          : 'bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <FiCode className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              CodePilot
              <span className="text-blue-400"> AI</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white hover:shadow-lg'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleGetStarted}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 hover:scale-105"
            >
              Analyze Code
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-3 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white hover:shadow-lg'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    handleGetStarted();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                >
                  Analyze Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
