import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import {
  LuArrowLeft,
  LuTriangleAlert,
  LuCode,
  LuShield,
  LuZap,
  LuFileText,
  LuActivity,
  LuSearch,
  LuDownload,
  LuCopy,
  LuCheck,
  LuCircleCheck
} from "react-icons/lu";
import PageLayout, { Container } from '../layouts/PageLayout';
import { LoadingSpinner, Badge, Input, CodeEditor, ReviewCard, MetricCard, Button } from '../shared/components';
import { aiService } from '../services/aiService';
import toast from 'react-hot-toast';

export default function Review() {
  const params = new URLSearchParams(window.location.search);
  const reviewId = params.get('id');
  const [result, setResult] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('source'); // 'source' or 'optimized'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(() => localStorage.getItem("reviewCode") || "");
  const [score, setScore] = useState(94);
  const [metrics, setMetrics] = useState({
    complexity: 0,
    maintainability: 0,
    security: 0,
    performance: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (reviewId) {
      setInitialLoading(true);
      aiService.getReviewById(reviewId)
        .then((pastReview) => {
          setResult(pastReview);
          if (pastReview) {
            setScore(pastReview.score);
            setCode(pastReview.code || "");
            setMetrics(pastReview.metrics || { complexity: 0, maintainability: 0, security: 0, performance: 0 });
          }
        })
        .catch((error) => {
          console.error('Failed to load past review:', error);
          toast.error('Failed to load past review record');
          navigate('/dashboard');
        })
        .finally(() => {
          setInitialLoading(false);
        });
    }
  }, [reviewId, navigate]);

  useEffect(() => {
    if (reviewId || !code) return;

    setAnalyzing(true);
    const token = localStorage.getItem('token');

    // Configure default axios base URL dynamically matching environment configuration
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
      : 'http://localhost:5000';

    axios.post('/api/ai/analyze', { code }, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined
      }
    })
      .then((res) => {
        setResult(res.data);
        setScore(res.data.score);
        setMetrics(res.data.metrics || { complexity: 0, maintainability: 0, security: 0, performance: 0 });
      })
      .catch((error) => {
        console.error('Failed to analyze code:', error);
      })
      .finally(() => {
        setInitialLoading(false);
        setAnalyzing(false);
      });
  }, [code]);

  const handleBack = () => {
    navigate(localStorage.getItem('token') ? "/dashboard" : "/");
  };

  const handleCopy = () => {
    const codeToCopy = activeTab === 'source'
      ? (result?.code || localStorage.getItem("reviewCode") || '')
      : (result?.fixedCode || '');

    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      toast.success(`${activeTab === 'source' ? 'Source' : 'Optimized'} code copied!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const codeToDownload = activeTab === 'source'
      ? (result?.code || localStorage.getItem("reviewCode") || '')
      : (result?.fixedCode || '');

    if (codeToDownload) {
      const blob = new Blob([codeToDownload], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeTab === 'source' ? 'source-code.txt' : 'optimized-code.js';
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Downloading ${a.download}`);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Production Quality';
    if (score >= 60) return 'Warning Quality';
    if (score >= 40) return 'Fair Quality';
    return 'Unstable/Refactor Needed';
  };

  const getComplexityStatus = (val) => {
    if (val <= 20) return 'success';
    if (val <= 50) return 'warning';
    return 'danger';
  };

  const getPercentStatus = (val) => {
    if (val >= 80) return 'success';
    if (val >= 60) return 'warning';
    return 'danger';
  };

  const handleCodeChange = (newCode) => {
    if (activeTab !== 'source') return;
    setCode(newCode);
    localStorage.setItem("reviewCode", newCode);
  };

  // Combine issues into a single queryable list
  const getIssues = () => {
    if (!result) return [];

    const bugs = (result.bugs || []).map(b => ({ ...b, category: 'bug' }));
    const security = (result.security || []).map(s => ({ ...s, category: 'security' }));
    const performance = (result.performance || []).map(p => ({ ...p, category: 'performance' }));
    const suggestions = (result.suggestions || []).map(g => ({ ...g, category: 'suggestion' }));

    return [...bugs, ...security, ...performance, ...suggestions];
  };

  const allIssues = getIssues();

  // Filter issues based on search and selected severity dropdown
  const filteredIssues = allIssues.filter(issue => {
    const matchesSearch =
      issue.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.suggestion && issue.suggestion.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSeverity =
      filterSeverity === 'all' ||
      issue.severity.toLowerCase() === filterSeverity.toLowerCase();

    return matchesSearch && matchesSeverity;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <PageLayout className="bg-[#020617] text-slate-100 min-h-screen relative overflow-hidden pb-16">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <Container className="py-8 px-4 relative z-10 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Analysis <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Scorecard</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              {analyzing ? 'Reading structural elements of code...' : 'Review completed successfully'}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <LuArrowLeft className="w-4 h-4" />
            Back to Editor
          </Button>
        </motion.div>

        {initialLoading ? (
          /* Modern Loading Skeletons */
          <div className="space-y-8 animate-pulse">
            <div className="h-64 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex justify-between items-center">
              <div className="space-y-4 w-1/3">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-8 bg-slate-800 rounded w-1/2"></div>
                <div className="h-4 bg-slate-800 rounded w-2/3"></div>
              </div>
              <div className="h-32 w-32 bg-slate-800 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-slate-900/40 border border-slate-850 rounded-3xl"></div>
              <div className="h-96 bg-slate-900/40 border border-slate-850 rounded-3xl"></div>
            </div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Score Card Panel */}
            <motion.div
              variants={itemVariants}
              className="bg-[#111827]/40 backdrop-blur border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                    <LuActivity className="text-indigo-400" />
                    Overall Code Health
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">Score evaluated based on vulnerabilities, complexity metrics, and guidelines</p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                      {score !== null ? `${score}/100` : "Evaluating..."}
                    </div>
                    {analyzing && <LoadingSpinner size="sm" />}
                  </div>
                  <div className="mt-1">
                    {score !== null && (
                      <Badge severity={getScoreColor(score)}>
                        {getScoreLabel(score)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-850/60">
                <MetricCard
                  title="Complexity"
                  value={metrics?.complexity || 0}
                  icon={LuCode}
                  status={getComplexityStatus(metrics?.complexity || 0)}
                />
                <MetricCard
                  title="Maintainability"
                  value={`${metrics?.maintainability || 0}%`}
                  icon={LuFileText}
                  status={getPercentStatus(metrics?.maintainability || 0)}
                />
                <MetricCard
                  title="Security"
                  value={`${metrics?.security || 0}%`}
                  icon={LuShield}
                  status={getPercentStatus(metrics?.security || 0)}
                />
                <MetricCard
                  title="Performance"
                  value={`${metrics?.performance || 0}%`}
                  icon={LuZap}
                  status={getPercentStatus(metrics?.performance || 0)}
                />
              </div>
            </motion.div>

            {/* Split Screen Review Layout: Left Code, Right Issues */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

              {/* Left Column: Code Editor Container */}
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="bg-[#111827]/40 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    {/* View Tabs */}
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
                      <button
                        onClick={() => setActiveTab('source')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'source'
                            ? 'bg-[#1E293B] text-white'
                            : 'text-slate-400 hover:text-white'
                          }`}
                      >
                        Original Source
                      </button>
                      <button
                        onClick={() => setActiveTab('optimized')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'optimized'
                            ? 'bg-[#1E293B] text-white'
                            : 'text-slate-400 hover:text-white'
                          }`}
                      >
                        Optimized Code
                      </button>
                    </div>

                    {/* Editor actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="p-2 bg-slate-950 border border-slate-850 hover:border-slate-700 hover:bg-slate-900 rounded-xl transition-all text-slate-400 hover:text-white"
                        title="Copy Code"
                      >
                        {copied ? <LuCheck className="w-4 h-4 text-emerald-400" /> : <LuCopy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-2 bg-slate-950 border border-slate-850 hover:border-slate-700 hover:bg-slate-900 rounded-xl transition-all text-slate-400 hover:text-white"
                        title="Download file"
                      >
                        <LuDownload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* VS Code Inspired code editor container */}
                  <CodeEditor
                    code={
                      activeTab === 'source'
                        ? code
                        : (result?.fixedCode || '')
                    }
                    language={localStorage.getItem("reviewLanguage") || 'javascript'}
                    readOnly={activeTab === 'optimized' || !!reviewId}
                    onChange={handleCodeChange}
                  />
                </div>
              </motion.div>

              {/* Right Column: Search and Collapsible Issue Cards */}
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="bg-[#111827]/40 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
                  {/* Search and Filters Header */}
                  <div className="mb-6 space-y-4">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <LuTriangleAlert className="text-amber-500" />
                      Detected Issues ({filteredIssues.length})
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Search Input */}
                      <div className="flex-1">
                        <Input
                          placeholder="Search issues..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          icon={LuSearch}
                        />
                      </div>

                      {/* Dropdown Filters */}
                      <div>
                        <select
                          value={filterSeverity}
                          onChange={(e) => setFilterSeverity(e.target.value)}
                          className="w-full sm:w-auto px-4 py-2.5 bg-[#0F172A] border border-slate-800 text-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-bold"
                        >
                          <option value="all">All Severities</option>
                          <option value="critical">Critical</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Issue List */}
                  <div className="space-y-3.5 max-h-[550px] overflow-y-auto pr-1">
                    {filteredIssues.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-slate-850 rounded-2xl">
                        <LuCircleCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                        <p className="text-slate-400 text-xs font-semibold">No issues matching criteria</p>
                      </div>
                    ) : (
                      filteredIssues.map((issue, idx) => (
                        <ReviewCard
                          key={`${issue.category}-${idx}`}
                          severity={issue.severity}
                          type={issue.type}
                          line={issue.line}
                          message={issue.message}
                          suggestion={issue.suggestion}
                          codeSnippet={issue.code}
                        />
                      ))
                    )}
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </Container>
    </PageLayout>
  );
}