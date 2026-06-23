import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LuMenu, LuX, LuCode, LuUser, LuLogOut, LuSlidersHorizontal, LuActivity } from 'react-icons/lu';
import { useAuthContext } from '../../state/context/AuthContext';

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
          ? 'bg-[#020617]/80 backdrop-blur-md border-b border-slate-850 shadow-lg'
          : 'bg-[#020617]/40 backdrop-blur-sm border-b border-slate-900/50'
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <LuCode className="text-white text-lg" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              CodePilot
              <span className="text-indigo-400"> AI</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="relative ml-3">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700/80 transition-colors"
                >
                  <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-extrabold text-white uppercase">
                    {user?.name?.substring(0, 2) || 'US'}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{user?.name || 'Developer'}</span>
                </button>

                {isUserDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2.5 w-56 bg-[#0F172A] border border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-scale-in">
                      <div className="px-4 py-2.5 border-b border-slate-850 mb-2">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Signed In As</div>
                        <div className="text-xs text-slate-200 font-medium truncate mt-0.5">{user?.email}</div>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors font-medium"
                      >
                        <LuActivity className="w-4 h-4 text-indigo-400" />
                        Workspace
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors font-medium"
                      >
                        <LuSlidersHorizontal className="w-4 h-4 text-purple-400" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-slate-800/50 transition-colors border-t border-slate-850 mt-2.5 pt-2.5 text-left font-medium"
                      >
                        <LuLogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4.5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800/80 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <LuX size={18} /> : <LuMenu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#020617]/95 backdrop-blur-xl border-t border-slate-850">
          <div className="container mx-auto py-4 px-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-slate-800 text-indigo-400 border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="pt-4 border-t border-slate-850 flex flex-col gap-1.5">
                  <div className="px-4 py-2">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block tracking-wider">User Profile</span>
                    <span className="text-xs font-bold text-slate-300 block mt-0.5">{user?.name}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{user?.email}</span>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-xs text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors font-semibold"
                  >
                    <LuSlidersHorizontal className="w-4 h-4 text-purple-400" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-rose-400 hover:text-rose-300 hover:bg-slate-800/50 transition-colors text-left font-semibold"
                  >
                    <LuLogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-850 flex flex-col gap-2.5">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full px-4 py-3 text-center text-xs font-bold text-slate-300 hover:text-white rounded-xl border border-slate-800 hover:bg-slate-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full px-4 py-3 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all"
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
