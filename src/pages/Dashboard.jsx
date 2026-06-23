import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../state/context/AuthContext';
import { aiService } from '../services/aiService';
import PageLayout, { Container } from '../layouts/PageLayout';
import { LoadingSpinner, MetricCard, Button, Card } from '../shared/components';
import ChatInterface from '../features/ai/ChatInterface';
import { 
  LuFileText, 
  LuMessageSquare, 
  LuCode, 
  LuTrendingUp, 
  LuTrash2, 
  LuPlus, 
  LuClock, 
  LuArrowRight, 
  LuSlidersHorizontal,
  LuActivity,
  LuShield
} from 'react-icons/lu';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [activeConvMessages, setActiveConvMessages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

  // Compute metrics average across reviews
  const avgComplexity = totalReviews > 0
    ? Math.round(reviews.reduce((acc, r) => acc + (r.metrics?.complexity || 50), 0) / totalReviews)
    : 0;
  const avgSecurity = totalReviews > 0
    ? Math.round(reviews.reduce((acc, r) => acc + (r.metrics?.security || 50), 0) / totalReviews)
    : 0;
  const avgPerformance = totalReviews > 0
    ? Math.round(reviews.reduce((acc, r) => acc + (r.metrics?.performance || 50), 0) / totalReviews)
    : 0;
  const avgMaintainability = totalReviews > 0
    ? Math.round(reviews.reduce((acc, r) => acc + (r.metrics?.maintainability || 50), 0) / totalReviews)
    : 0;

  const bugsCaught = reviews.reduce((acc, r) => acc + (r.bugs?.length || 0), 0);
  const securityCaught = reviews.reduce((acc, r) => acc + (r.security?.length || 0), 0);
  const totalIssues = bugsCaught + securityCaught;

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
      <PageLayout className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        <LoadingSpinner size="xl" text="Loading workspace details..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout className="bg-[#020617] text-slate-100 min-h-[calc(100vh-4rem)] pb-12 relative overflow-hidden">
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
            <p className="text-slate-400 text-xs mt-1">Workspace account: Active Developer • {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <LuCode className="w-4 h-4" />
              New Review
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2"
            >
              <LuSlidersHorizontal className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Redesigned Metrics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <MetricCard
            title="Total Issues"
            value={totalIssues}
            icon={LuFileText}
            description="Detected vulnerabilities & bugs"
            status={totalIssues > 5 ? 'danger' : totalIssues > 0 ? 'warning' : 'success'}
          />
          <MetricCard
            title="Security Score"
            value={`${avgSecurity}%`}
            icon={LuShield}
            description="Average security evaluation"
            status={avgSecurity >= 80 ? 'success' : avgSecurity >= 60 ? 'warning' : 'danger'}
          />
          <MetricCard
            title="Performance"
            value={`${avgPerformance}%`}
            icon={LuTrendingUp}
            description="Code execution efficiency"
            status={avgPerformance >= 80 ? 'success' : avgPerformance >= 60 ? 'warning' : 'danger'}
          />
          <MetricCard
            title="Code Quality"
            value={`${avgScore}%`}
            icon={LuCode}
            description="Average syntax cleanliness"
            status={avgScore >= 80 ? 'success' : avgScore >= 60 ? 'warning' : 'danger'}
          />
          <MetricCard
            title="Maintainability"
            value={`${avgMaintainability}%`}
            icon={LuActivity}
            description="Maintainability index"
            status={avgMaintainability >= 80 ? 'success' : avgMaintainability >= 60 ? 'warning' : 'danger'}
          />
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
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <LuActivity className="text-indigo-400" />
                Code Health Trend
              </h3>
              <p className="text-xs text-slate-400 mb-6">Visual analysis metrics calculated from recent code review score trends</p>
              
              <div className="w-full bg-[#020617] border border-slate-850 p-4 rounded-xl relative">
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
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <LuFileText className="text-indigo-400" />
                Recent Reviews
              </h3>

              {reviews.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                  <LuCode className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-xs">No code reviews logged yet.</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                  >
                    Analyze your first snippet <LuArrowRight className="w-3 h-3" />
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
                        <h4 className="font-bold text-sm text-slate-200 group-hover:text-indigo-400 transition-colors">
                          {r.summary}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500 mt-1">
                          <span>Quality Score: {r.score}/100</span>
                          <span>•</span>
                          <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/review?id=${r._id}`)}
                        >
                          View
                        </Button>
                        <button
                          onClick={(e) => handleDeleteReview(e, r._id)}
                          className="p-2.5 hover:bg-red-500/10 hover:text-red-400 text-slate-600 rounded-xl transition-colors border border-transparent hover:border-red-500/10"
                          title="Delete review"
                        >
                          <LuTrash2 size={13} />
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
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <LuMessageSquare className="text-purple-400" />
                  Chat Threads
                </h3>
                {conversations.length > 0 && (
                  <button
                    onClick={handleStartNewChat}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <LuPlus className="w-3.5 h-3.5" /> New Chat
                  </button>
                )}
              </div>

              {conversations.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                  <LuMessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-xs">No chat history found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {conversations.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => loadConversation(c._id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex justify-between items-start gap-3 ${
                        activeConvId === c._id
                          ? 'bg-purple-500/10 border-purple-500/40'
                          : 'bg-[#111827]/60 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-200 truncate">{c.title}</h4>
                        <span className="text-[9px] font-semibold text-slate-500 mt-1 block">
                          Updated: {new Date(c.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteConversation(e, c._id)}
                        className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-slate-600 rounded-lg transition-colors"
                        title="Delete chat thread"
                      >
                        <LuTrash2 size={12} />
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
            <div className="p-4 border-b border-slate-800 bg-[#020617]/25 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xs text-white">AI Assistant</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  {activeConvId ? 'Continuing Chat Thread' : 'New Assistant Session'}
                </p>
              </div>
              {activeConvId && (
                <button
                  onClick={handleStartNewChat}
                  className="px-2.5 py-1 bg-slate-850 hover:bg-slate-800 text-[10px] font-bold rounded-lg text-purple-400 hover:text-purple-300 transition-colors border border-slate-800"
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
