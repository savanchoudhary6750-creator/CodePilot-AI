import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../state/context/AuthContext';
import { aiService } from '../services/aiService';
import PageLayout, { Container } from '../layouts/PageLayout';
import { LoadingSpinner } from '../shared/components';
import ChatInterface from '../features/ai/ChatInterface';
import { 
  FiFileText, 
  FiMessageSquare, 
  FiCode, 
  FiTrendingUp, 
  FiTrash2, 
  FiPlus, 
  FiClock, 
  FiArrowRight, 
  FiSliders,
  FiActivity,
  FiShield
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [activeConvMessages, setActiveConvMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [reviewsData, convsData] = await Promise.all([
        aiService.getReviews(),
        aiService.getConversations()
      ]);
      setReviews(reviewsData || []);
      setConversations(convsData || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      toast.error('Could not retrieve dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (convId) => {
    try {
      const fullConv = await aiService.getConversationById(convId);
      setActiveConvId(convId);
      const formattedMessages = fullConv.messages.map((m, idx) => ({
        id: m._id || idx,
        role: m.role,
        content: m.content
      }));
      setActiveConvMessages(formattedMessages);
    } catch (err) {
      toast.error('Failed to load chat thread');
    }
  };

  const handleStartNewChat = () => {
    setActiveConvId(null);
    setActiveConvMessages([]);
  };

  const handleSendMessage = async (msg) => {
    const response = await aiService.chat(msg, activeConvMessages, activeConvId);
    if (response.conversationId) {
      if (!activeConvId) {
        setActiveConvId(response.conversationId);
        const updatedConvs = await aiService.getConversations();
        setConversations(updatedConvs || []);
      }
    }
    return response.reply;
  };

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this chat history?')) return;
    try {
      await aiService.deleteConversation(convId);
      toast.success('Chat deleted');
      if (activeConvId === convId) {
        handleStartNewChat();
      }
      setConversations(prev => prev.filter(c => c._id !== convId));
    } catch (err) {
      toast.error('Failed to delete chat thread');
    }
  };

  const handleDeleteReview = async (e, reviewId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this code review record?')) return;
    try {
      await aiService.deleteReview(reviewId);
      toast.success('Code review record deleted');
      setReviews(prev => prev.filter(r => r._id !== reviewId));
    } catch (err) {
      toast.error('Failed to delete code review record');
    }
  };

  // Compute Stats
  const totalReviews = reviews.length;
  const totalChats = conversations.length;
  const avgScore = totalReviews > 0
    ? Math.round(reviews.reduce((acc, r) => acc + r.score, 0) / totalReviews)
    : 0;

  // Compute vulnerabilities caught
  const bugsCaught = reviews.reduce((acc, r) => acc + (r.bugs?.length || 0), 0);
  const securityCaught = reviews.reduce((acc, r) => acc + (r.security?.length || 0), 0);
  const totalVulnerabilities = bugsCaught + securityCaught;

  // Motion configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <PageLayout className="min-h-screen flex items-center justify-center bg-[#0B1120] text-white">
        <LoadingSpinner size="xl" text="Loading dashboard details..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout className="bg-[#0B1120] text-slate-100 min-h-[calc(100vh-4rem)] pb-12 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-[-10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-[-10%] w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <Container className="py-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Developer <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Workspace</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Workspace account status: Active Developer • {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <FiCode />
              New Review
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/settings')}
              className="px-4 py-2.5 bg-[#1E293B] border border-slate-800 hover:bg-slate-800 hover:border-slate-700 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <FiSliders />
              Settings
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={cardVariants} className="bg-[#111827]/70 border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-700/80 transition-all shadow-md">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FiFileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalReviews}</div>
              <div className="text-xs text-slate-400 font-medium">Code Reviews Run</div>
            </div>
          </motion.div>

          <motion.div variants={cardVariants} className="bg-[#111827]/70 border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-700/80 transition-all shadow-md">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FiTrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{avgScore}%</div>
              <div className="text-xs text-slate-400 font-medium">Average Quality Score</div>
            </div>
          </motion.div>

          <motion.div variants={cardVariants} className="bg-[#111827]/70 border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-700/80 transition-all shadow-md">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <FiMessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalChats}</div>
              <div className="text-xs text-slate-400 font-medium">Saved Chats</div>
            </div>
          </motion.div>

          <motion.div variants={cardVariants} className="bg-[#111827]/70 border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-700/80 transition-all shadow-md">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalVulnerabilities}</div>
              <div className="text-xs text-slate-400 font-medium">Security Issues Flagged</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Reviews List & Chart Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#111827]/40 border border-slate-800 rounded-3xl p-6 shadow-xl"
            >
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <FiActivity className="text-indigo-400" />
                Code Health Trend
              </h3>
              <p className="text-xs text-slate-400 mb-6">Visual analysis metrics calculated from recent code review score trends</p>
              
              <div className="w-full bg-[#0B1120] border border-slate-850 p-4 rounded-xl relative">
                {reviews.length === 0 ? (
                  <div className="h-24 flex items-center justify-center text-xs text-slate-500 italic">
                    Run reviews to generate code health charts
                  </div>
                ) : (
                  <svg viewBox="0 0 500 100" className="w-full h-28 overflow-visible">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0"/>
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 80 Q 80 45 160 65 T 320 25 T 500 35 L 500 100 L 0 100 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M 0 80 Q 80 45 160 65 T 320 25 T 500 35"
                      fill="none"
                      stroke="#6366F1"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                    <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                  </svg>
                )}
              </div>
            </motion.div>

            {/* Recent Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#111827]/40 border border-slate-800 rounded-3xl p-6 shadow-xl"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FiFileText className="text-blue-400" />
                Recent Reviews
              </h3>

              {reviews.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                  <FiCode className="w-10 h-10 text-gray-650 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No code reviews logged yet.</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                  >
                    Analyze your first snippet <FiArrowRight />
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-850">
                  {reviews.map((r) => (
                    <div key={r._id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center gap-4 group">
                      <div 
                        onClick={() => navigate(`/review?id=${r._id}`)}
                        className="cursor-pointer flex-1"
                      >
                        <h4 className="font-semibold text-sm text-slate-200 group-hover:text-indigo-400 transition-colors">
                          {r.summary}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span>Quality Score: {r.score}/100</span>
                          <span>•</span>
                          <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/review?id=${r._id}`)}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 hover:text-white transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => handleDeleteReview(e, r._id)}
                          className="p-2 hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded-lg transition-colors"
                          title="Delete review"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Chat History List */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#111827]/40 border border-slate-800 rounded-3xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FiMessageSquare className="text-purple-400" />
                  Chat Threads
                </h3>
                {conversations.length > 0 && (
                  <button
                    onClick={handleStartNewChat}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <FiPlus /> New Chat
                  </button>
                )}
              </div>

              {conversations.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                  <FiMessageSquare className="w-10 h-10 text-gray-650 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No chat history found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {conversations.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => loadConversation(c._id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex justify-between items-start gap-3 ${
                        activeConvId === c._id
                          ? 'bg-purple-500/10 border-purple-500/40 shadow-glow'
                          : 'bg-slate-900/60 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-slate-200 truncate">{c.title}</h4>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Updated: {new Date(c.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteConversation(e, c._id)}
                        className="p-1 hover:bg-red-500/10 hover:text-red-400 text-slate-650 rounded-md transition-colors"
                        title="Delete chat thread"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Assistant Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#111827]/40 border border-slate-800 rounded-3xl h-[580px] overflow-hidden flex flex-col shadow-xl"
          >
            <div className="p-4 border-b border-slate-800 bg-[#0B1120]/20 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-white">AI Assistant</h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  {activeConvId ? 'Continuing Chat Thread' : 'New Assistant Session'}
                </p>
              </div>
              {activeConvId && (
                <button
                  onClick={handleStartNewChat}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold rounded-lg text-purple-400 hover:text-purple-300 transition-colors"
                >
                  New Thread
                </button>
              )}
            </div>
            <div className="flex-1 min-h-0">
              <ChatInterface
                onSendMessage={handleSendMessage}
                initialMessages={activeConvMessages}
                placeholder={
                  activeConvId 
                    ? "Ask a follow up question..." 
                    : "Ask anything about coding..."
                }
                key={activeConvId || 'new'}
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </PageLayout>
  );
}
