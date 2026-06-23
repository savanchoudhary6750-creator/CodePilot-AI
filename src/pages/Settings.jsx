import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../state/context/AuthContext';
import { useThemeContext } from '../state/context/ThemeContext';
import PageLayout, { Container } from '../layouts/PageLayout';
import { FiUser, FiLock, FiCheck, FiMoon, FiSun, FiSettings } from 'react-icons/fi';
import authService from '../services/authService';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateProfile } = useAuthContext();
  const { theme, toggleTheme, isDark } = useThemeContext();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    await updateProfile({ name, email });
    setUpdatingProfile(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    setUpdatingPassword(true);
    try {
      const response = await authService.updatePassword({ currentPassword, newPassword });
      if (response.success) {
        toast.success(response.message || 'Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        toast.error(response.message || 'Failed to update password');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
  };


  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <PageLayout className="bg-[#0B1120] text-slate-100 min-h-[calc(100vh-4rem)] pb-12 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-[-10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-[-10%] w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <Container className="py-8 max-w-4xl relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold tracking-tight mb-8"
        >
          Workspace <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Settings</span>
        </motion.h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
        >
          {/* Side panel configs */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="bg-[#111827]/60 border border-slate-800 p-5 rounded-2xl">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Workspace Style</h3>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-sm font-semibold transition-all duration-200"
              >
                <span className="flex items-center gap-2">
                  {isDark ? <FiMoon className="text-purple-400" /> : <FiSun className="text-amber-400" />}
                  Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </span>
                <span className="text-[10px] uppercase bg-slate-900 px-2 py-1 rounded text-slate-400 font-bold">
                  Toggle
                </span>
              </button>
            </div>

            <div className="bg-[#111827]/60 border border-slate-800 p-5 rounded-2xl">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Subscription</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4 font-medium">You are currently on the Free Developer plan.</p>
              <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <FiCheck className="w-4 h-4 text-emerald-400" /> Active Status
              </div>
            </div>
          </motion.div>

          {/* Forms Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Information */}
            <motion.div variants={itemVariants} className="bg-[#111827]/40 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FiUser className="text-indigo-400" />
                Profile Information
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-850 border border-slate-750 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-850 border border-slate-750 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={updatingProfile}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  {updatingProfile ? 'Saving...' : 'Save Profile Details'}
                </motion.button>
              </form>
            </motion.div>

            {/* Password Management */}
            <motion.div variants={itemVariants} className="bg-[#111827]/40 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FiLock className="text-purple-400" />
                Security & Password
              </h3>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Current Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-850 border border-slate-750 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-850 border border-slate-750 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={updatingPassword}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  {updatingPassword ? 'Changing...' : 'Update Password'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </PageLayout>
  );
}
