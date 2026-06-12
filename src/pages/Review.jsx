import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiArrowLeft, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiXCircle, 
  FiCopy, 
  FiDownload, 
  FiCode, 
  FiShield, 
  FiZap, 
  FiFileText,
  FiActivity
} from "react-icons/fi";
import PageLayout, { Container } from '../layouts/PageLayout';
import { LoadingSpinner } from '../shared/components';
import { aiService } from '../services/aiService';
import toast from 'react-hot-toast';

export default function Review() {
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [analyzing, setAnalyzing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reviewId = params.get('id');

    const loadReviewData = async () => {
      if (reviewId) {
        setAnalyzing(true);
        try {
          const pastReview = await aiService.getReviewById(reviewId);
          setResult(pastReview);
        } catch (error) {
          console.error('Failed to load past review:', error);
          toast.error('Failed to load past review record');
          navigate('/dashboard');
        } finally {
          setAnalyzing(false);
        }
      } else {
        const code = localStorage.getItem("reviewCode");
        if (!code) {
          navigate("/");
          return;
        }

        setAnalyzing(true);
        try {
          const analysisResult = await aiService.analyzeCode(code);
          setResult(analysisResult);
        } catch (error) {
          console.error('Failed to analyze code:', error);
          toast.error('Failed to analyze code snippet');
        } finally {
          setAnalyzing(false);
        }
      }
    };

    loadReviewData();
  }, [navigate]);

  const handleBack = () => {
    navigate(localStorage.getItem('token') ? "/dashboard" : "/");
  };

  const handleCopy = () => {
    if (result?.fixedCode) {
      navigator.clipboard.writeText(result.fixedCode);
      setCopied(true);
      toast.success('Fixed code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (result?.fixedCode) {
      const blob = new Blob([result.fixedCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fixed-code.js';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Downloading fixed-code.js');
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'High':
        return <FiXCircle className="w-5 h-5 text-rose-400" />;
      case 'Medium':
        return <FiAlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'Low':
        return <FiCheckCircle className="w-5 h-5 text-emerald-400" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'border-rose-500/20 bg-rose-500/5 text-rose-200';
      case 'Medium':
        return 'border-amber-500/20 bg-amber-500/5 text-amber-200';
      case 'Low':
        return 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200';
      default:
        return 'border-slate-800 bg-slate-900/50 text-slate-300';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-400 to-teal-500';
    if (score >= 60) return 'from-amber-400 to-orange-500';
    return 'from-rose-400 to-red-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Production Quality';
    if (score >= 60) return 'Warning Quality';
    if (score >= 40) return 'Fair Quality';
    return 'Unstable/Refactor Needed';
  };

  const getScoreLabelColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-rose-400';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <PageLayout className="bg-[#0B1120] text-slate-100 min-h-screen relative overflow-hidden pb-16">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <Container className="py-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-1">
              Analysis <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Scorecard</span>
            </h1>
            <p className="text-slate-400 text-sm">
              {analyzing ? 'Reading structural elements of code...' : 'Review completed successfully'}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1E293B] border border-slate-800 hover:bg-slate-800 hover:border-slate-700 rounded-xl text-sm font-semibold transition-all"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Editor
          </motion.button>
        </motion.div>

        {analyzing ? (
          <div className="flex flex-col items-center justify-center py-24 animate-pulse">
            <LoadingSpinner size="xl" text="Reading structural elements of code..." />
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
              className="bg-[#111827]/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-200 mb-1 flex items-center gap-2">
                    <FiActivity className="text-indigo-400" />
                    Overall Code Health
                  </h2>
                  <p className="text-xs text-slate-400">Score evaluated based on code complexities, warning flags, and rules</p>
                </div>
                <div className="text-left sm:text-right">
                  <div className={`text-5xl font-extrabold bg-gradient-to-r ${getScoreColor(result?.score || 0)} bg-clip-text text-transparent`}>
                    {result?.score}/100
                  </div>
                  <div className={`${getScoreLabelColor(result?.score || 0)} font-bold text-sm mt-1`}>
                    {getScoreLabel(result?.score || 0)}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-850">
                <div className="bg-[#0B1120]/45 border border-slate-850 p-4 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <FiCode className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs text-slate-400 font-semibold">Complexity</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white">{result?.metrics?.complexity || 0}</div>
                </div>
                <div className="bg-[#0B1120]/45 border border-slate-850 p-4 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <FiFileText className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400 font-semibold">Maintainability</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white">{result?.metrics?.maintainability || 0}%</div>
                </div>
                <div className="bg-[#0B1120]/45 border border-slate-850 p-4 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <FiShield className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-400 font-semibold">Security</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white">{result?.metrics?.security || 0}%</div>
                </div>
                <div className="bg-[#0B1120]/45 border border-slate-850 p-4 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <FiZap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-400 font-semibold">Performance</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white">{result?.metrics?.performance || 0}%</div>
                </div>
              </div>
            </motion.div>

            {/* Layout Grid: Left (Issues), Right (Fixed Code) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Issues list */}
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="bg-[#111827]/40 border border-slate-800 rounded-3xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <FiAlertTriangle className="text-amber-500" />
                    Detected Issues ({
                      (result?.bugs?.length || 0) + 
                      (result?.security?.length || 0) + 
                      (result?.performance?.length || 0) + 
                      (result?.suggestions?.length || 0)
                    })
                  </h2>

                  {result?.summary && (
                    <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                      <p className="text-indigo-300 text-sm leading-relaxed">{result.summary}</p>
                    </div>
                  )}

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {/* Bugs */}
                    {result?.bugs?.map((issue, idx) => (
                      <div key={`bug-${idx}`} className={`p-4 rounded-2xl border ${getSeverityColor(issue.severity)}`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span className="font-bold text-xs uppercase tracking-wider">{issue.severity} Severity</span>
                              <span className="text-[10px] bg-slate-950/40 border border-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase font-semibold">{issue.type}</span>
                              <span className="text-[10px] bg-slate-950/40 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-semibold">Line {issue.line}</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-3">{issue.message}</p>
                            {issue.suggestion && (
                              <div className="bg-slate-950/50 border border-slate-850 p-3 rounded-xl">
                                <p className="text-xs text-slate-400 leading-relaxed mb-2">
                                  <span className="font-semibold text-slate-300">Fix Suggestion:</span> {issue.suggestion}
                                </p>
                                {issue.code && (
                                  <pre className="text-xs text-emerald-400 font-mono bg-slate-900 p-2.5 rounded-lg overflow-x-auto border border-slate-850">
                                    <code>{issue.code}</code>
                                  </pre>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Security */}
                    {result?.security?.map((issue, idx) => (
                      <div key={`sec-${idx}`} className={`p-4 rounded-2xl border ${getSeverityColor(issue.severity)}`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span className="font-bold text-xs uppercase tracking-wider">{issue.severity} Severity</span>
                              <span className="text-[10px] bg-slate-950/40 border border-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase font-semibold">{issue.type}</span>
                              <span className="text-[10px] bg-slate-950/40 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-semibold">Line {issue.line}</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-3">{issue.message}</p>
                            {issue.suggestion && (
                              <div className="bg-slate-950/50 border border-slate-850 p-3 rounded-xl">
                                <p className="text-xs text-slate-400 leading-relaxed mb-2">
                                  <span className="font-semibold text-slate-300">Fix Suggestion:</span> {issue.suggestion}
                                </p>
                                {issue.code && (
                                  <pre className="text-xs text-emerald-400 font-mono bg-slate-900 p-2.5 rounded-lg overflow-x-auto border border-slate-850">
                                    <code>{issue.code}</code>
                                  </pre>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Performance */}
                    {result?.performance?.map((issue, idx) => (
                      <div key={`perf-${idx}`} className={`p-4 rounded-2xl border ${getSeverityColor(issue.severity)}`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span className="font-bold text-xs uppercase tracking-wider">{issue.severity} Severity</span>
                              <span className="text-[10px] bg-slate-950/40 border border-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase font-semibold">{issue.type}</span>
                              <span className="text-[10px] bg-slate-950/40 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-semibold">Line {issue.line}</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-3">{issue.message}</p>
                            {issue.suggestion && (
                              <div className="bg-slate-950/50 border border-slate-850 p-3 rounded-xl">
                                <p className="text-xs text-slate-400 leading-relaxed mb-2">
                                  <span className="font-semibold text-slate-300">Fix Suggestion:</span> {issue.suggestion}
                                </p>
                                {issue.code && (
                                  <pre className="text-xs text-emerald-400 font-mono bg-slate-900 p-2.5 rounded-lg overflow-x-auto border border-slate-850">
                                    <code>{issue.code}</code>
                                  </pre>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Suggestions */}
                    {result?.suggestions?.map((issue, idx) => (
                      <div key={`sug-${idx}`} className={`p-4 rounded-2xl border ${getSeverityColor(issue.severity)}`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span className="font-bold text-xs uppercase tracking-wider">{issue.severity} Severity</span>
                              <span className="text-[10px] bg-slate-950/40 border border-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase font-semibold">{issue.type}</span>
                              <span className="text-[10px] bg-slate-950/40 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-semibold">Line {issue.line}</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-3">{issue.message}</p>
                            {issue.suggestion && (
                              <div className="bg-slate-950/50 border border-slate-850 p-3 rounded-xl">
                                <p className="text-xs text-slate-400 leading-relaxed mb-2">
                                  <span className="font-semibold text-slate-300">Improvement:</span> {issue.suggestion}
                                </p>
                                {issue.code && (
                                  <pre className="text-xs text-emerald-400 font-mono bg-slate-900 p-2.5 rounded-lg overflow-x-auto border border-slate-850">
                                    <code>{issue.code}</code>
                                  </pre>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Fixed Code Blocks */}
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="bg-[#111827]/40 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
                  <div className="flex justify-between items-center mb-4 gap-4">
                    <h2 className="text-lg font-bold text-slate-200">
                      Optimized Code
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all text-xs font-semibold text-slate-300"
                      >
                        <FiCopy className="w-3.5 h-3.5" />
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl transition-all text-xs font-semibold text-white shadow"
                      >
                        <FiDownload className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden shadow-inner">
                    <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 border-b border-slate-850">
                      <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                      <span className="ml-3 text-[10px] text-slate-500 font-mono">optimized-code.js</span>
                    </div>
                    <pre className="p-4 text-emerald-400 font-mono text-xs md:text-sm overflow-x-auto text-left leading-relaxed">
                      <code>{result?.fixedCode}</code>
                    </pre>
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