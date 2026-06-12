import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiCode, FiUser, FiLogOut, FiSliders, FiActivity } from 'react-icons/fi';
import { useAuthContext } from '../../state/context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const guestNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const authNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Analyze', path: '/review' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Pricing', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const navItems = isAuthenticated ? authNavItems : guestNavItems;

  const isActive = (path) => location.pathname === path;

  const handleLogoutClick = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-2xl'
          : 'bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50'
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <FiCode className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              CodePilot
              <span className="text-blue-400"> AI</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-blue-400 border border-blue-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {user?.name?.substring(0, 2) || 'US'}
                  </div>
                  <span className="text-sm font-semibold text-gray-200">{user?.name || 'Developer'}</span>
                </button>

                {isUserDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-scale-in">
                      <div className="px-4 py-2 border-b border-slate-800 mb-2">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Signed In As</div>
                        <div className="text-sm text-gray-200 font-medium truncate mt-0.5">{user?.email}</div>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <FiActivity size={16} />
                        Workspace
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <FiSliders size={16} />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors border-t border-slate-800/80 mt-2 pt-2"
                      >
                        <FiLogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800/50 text-gray-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800">
          <div className="container mx-auto py-4 px-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-slate-800 text-blue-400 font-semibold border border-slate-700'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
                  <div className="px-4 py-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">User Profile</span>
                    <span className="text-sm font-semibold text-gray-300 block mt-0.5">{user?.name}</span>
                    <span className="text-xs text-gray-500 block">{user?.email}</span>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <FiSliders size={16} />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors text-left"
                  >
                    <FiLogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full px-4 py-3 text-center text-sm font-semibold text-gray-300 hover:text-white rounded-xl border border-slate-800 hover:bg-slate-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
