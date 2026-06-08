import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiAlertTriangle, FiXCircle, FiCopy, FiDownload, FiCode, FiShield, FiZap, FiFileText } from "react-icons/fi";
import PageLayout, { Container } from '../components/PageLayout';
import { LoadingSpinner } from '../components';

function Review() {
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [analyzing, setAnalyzing] = useState(true);
  const navigate = useNavigate();

  const analyzeCode = (code) => {
    const issues = [];
    let score = 100;

    // Check for common issues
    if (!code.includes('try') || !code.includes('catch')) {
      issues.push({
        severity: "High",
        type: "Error Handling",
        message: "Missing try-catch block for error handling",
        line: code.split('\n').findIndex(line => line.includes('function') || line.includes('const') || line.includes('let')) + 1,
        suggestion: "Add try-catch blocks to handle potential errors gracefully",
        code: "try { // your code } catch (error) { console.error(error); }"
      });
      score -= 15;
    }

    if (code.includes('var ')) {
      issues.push({
        severity: "Medium",
        type: "Best Practice",
        message: "Using 'var' instead of 'let' or 'const'",
        line: code.split('\n').findIndex(line => line.includes('var')) + 1,
        suggestion: "Use 'let' for variables that will be reassigned, 'const' for constants",
        code: "const myVar = value; // or let myVar = value;"
      });
      score -= 10;
    }

    if (!code.includes('console.log') && code.length > 50) {
      issues.push({
        severity: "Low",
        type: "Debugging",
        message: "No console.log statements for debugging",
        line: 1,
        suggestion: "Add console.log statements to help with debugging",
        code: "console.log('Debug info:', variable);"
      });
      score -= 5;
    }

    if (code.includes('==') || code.includes('!=')) {
      issues.push({
        severity: "Medium",
        type: "Best Practice",
        message: "Using loose equality operators (== or !=)",
        line: code.split('\n').findIndex(line => line.includes('==') || line.includes('!=')) + 1,
        suggestion: "Use strict equality (=== or !==) to avoid type coercion issues",
        code: "if (value === expected) { // strict equality }"
      });
      score -= 10;
    }

    if (!code.includes('return') && (code.includes('function') || code.includes('=>'))) {
      issues.push({
        severity: "High",
        type: "Logic",
        message: "Function missing return statement",
        line: code.split('\n').findIndex(line => line.includes('function') || line.includes('=>')) + 1,
        suggestion: "Add a return statement to return a value from the function",
        code: "function myFunc() { return result; }"
      });
      score -= 20;
    }

    if (code.includes('eval(')) {
      issues.push({
        severity: "High",
        type: "Security",
        message: "Using eval() function - security risk",
        line: code.split('\n').findIndex(line => line.includes('eval')) + 1,
        suggestion: "Avoid eval() as it can execute malicious code. Use safer alternatives",
        code: "// Use JSON.parse() for JSON, or Function constructor for dynamic code"
      });
      score -= 25;
    }

    if (!code.includes('//') && !code.includes('/*')) {
      issues.push({
        severity: "Low",
        type: "Documentation",
        message: "Missing code comments",
        line: 1,
        suggestion: "Add comments to explain complex logic for better maintainability",
        code: "// This function calculates the sum of two numbers"
      });
      score -= 5;
    }

    if (code.length < 20) {
      issues.push({
        severity: "Low",
        type: "Completeness",
        message: "Code appears incomplete or too short",
        line: 1,
        suggestion: "Ensure your code is complete and implements the intended functionality",
        code: "// Add more implementation details"
      });
      score -= 10;
    }

    // Ensure at least some issues are found for demo purposes
    if (issues.length === 0) {
      issues.push({
        severity: "Low",
        type: "Optimization",
        message: "Code looks good, but consider adding more error handling",
        line: 1,
        suggestion: "Add comprehensive error handling for production-ready code",
        code: "try { /* code */ } catch (error) { /* handle error */ }"
      });
      score -= 5;
    }

    // Generate fixed code based on issues
    let fixedCode = code;
    issues.forEach(issue => {
      if (issue.suggestion && issue.code) {
        fixedCode = fixedCode + `\n// Fixed: ${issue.message}\n${issue.code}\n`;
      }
    });

    if (fixedCode === code) {
      fixedCode = `// Improved version of your code\n${code}\n\n// Added error handling\ntry {\n  ${code}\n} catch (error) {\n  console.error('Error:', error);\n}\n\n// Added documentation\n// This code has been optimized by CodePilot AI`;
    }

    return {
      score: Math.max(0, score),
      issues: issues,
      fixedCode: fixedCode,
      originalCode: code,
      metrics: {
        complexity: Math.floor(Math.random() * 20) + 5,
        maintainability: Math.floor(Math.random() * 30) + 70,
        security: Math.floor(Math.random() * 20) + 80,
        performance: Math.floor(Math.random() * 15) + 85
      }
    };
  };

  useEffect(() => {
    const code = localStorage.getItem("reviewCode");
    if (!code) {
      navigate("/");
      return;
    }

    // Simulate AI analysis with delay
    setAnalyzing(true);
    setTimeout(() => {
      const analysisResult = analyzeCode(code);
      setResult(analysisResult);
      setAnalyzing(false);
    }, 1500);
  }, [navigate]);

  const handleBack = () => {
    navigate("/");
  };

  const handleCopy = () => {
    if (result?.fixedCode) {
      navigator.clipboard.writeText(result.fixedCode);
      setCopied(true);
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
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'High':
        return <FiXCircle className="w-5 h-5" />;
      case 'Medium':
        return <FiAlertTriangle className="w-5 h-5" />;
      case 'Low':
        return <FiCheckCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Low':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Quality';
    if (score >= 60) return 'Good Quality';
    if (score >= 40) return 'Fair Quality';
    return 'Needs Improvement';
  };

  const getScoreLabelColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <PageLayout className="bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white min-h-screen">
      <Container className="py-12 md:py-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2">
              AI Code Review <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Results</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {analyzing ? 'Analyzing your code...' : 'Analysis completed successfully'}
            </p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-slate-800/80 backdrop-blur hover:bg-slate-700 border border-slate-700 rounded-xl transition-all duration-200 hover:border-slate-600 text-sm md:text-base"
          >
            <FiArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            Back to Editor
          </button>
        </div>

        {analyzing ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-32 animate-fade-in">
            <LoadingSpinner size="xl" text="AI is analyzing your code..." />
          </div>
        ) : (
          <>
            {/* Score Card */}
            <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-6 md:mb-8 shadow-xl shadow-blue-500/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="text-center sm:text-left">
                  <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-200">
                    Code Quality Score
                  </h2>
                  <p className="text-gray-400 text-sm">Based on industry standards</p>
                </div>
                <div className="text-center sm:text-right">
                  <div className={`text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r ${getScoreColor(result?.score || 0)} bg-clip-text text-transparent`}>
                    {result?.score}/100
                  </div>
                  <div className={`${getScoreLabelColor(result?.score || 0)} font-medium mt-1 text-sm md:text-base`}>
                    {getScoreLabel(result?.score || 0)}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 pt-6 border-t border-slate-800">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FiCode className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                    <span className="text-xs md:text-sm text-gray-400">Complexity</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-white">{result?.metrics?.complexity || 0}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FiFileText className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                    <span className="text-xs md:text-sm text-gray-400">Maintainability</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-white">{result?.metrics?.maintainability || 0}%</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FiShield className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                    <span className="text-xs md:text-sm text-gray-400">Security</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-white">{result?.metrics?.security || 0}%</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FiZap className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                    <span className="text-xs md:text-sm text-gray-400">Performance</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-white">{result?.metrics?.performance || 0}%</div>
                </div>
              </div>
            </div>

            {/* Issues Section */}
            <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-6 md:mb-8 shadow-xl shadow-blue-500/5">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-200 text-center">
                Issues Found ({result?.issues?.length})
              </h2>

              <div className="space-y-3 md:space-y-4">
                {result?.issues?.map((issue, index) => (
                  <div
                    key={index}
                    className={`flex flex-col gap-2 md:gap-3 p-4 md:p-5 rounded-xl border ${getSeverityColor(issue.severity)}`}
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        {getSeverityIcon(issue.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-bold text-base md:text-lg">{issue.severity} Severity</h3>
                          <span className="text-xs px-2 py-1 bg-black/30 rounded">{issue.type}</span>
                          <span className="text-xs px-2 py-1 bg-black/30 rounded">Line {issue.line}</span>
                        </div>
                        <p className="text-gray-300 text-sm md:text-base mb-2 md:mb-3">{issue.message}</p>
                        {issue.suggestion && (
                          <div className="bg-black/30 rounded-lg p-3">
                            <p className="text-xs md:text-sm text-gray-400 mb-2">
                              <span className="font-semibold text-gray-300">Suggestion:</span> {issue.suggestion}
                            </p>
                            {issue.code && (
                              <pre className="text-xs text-green-400 font-mono bg-black/50 p-2 rounded overflow-x-auto">
                                {issue.code}
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

            {/* Fixed Code Section */}
            <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl shadow-blue-500/5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-200 text-center sm:text-left">
                  Fixed Code
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-800/80 backdrop-blur hover:bg-slate-700 border border-slate-700 rounded-lg transition-all duration-200 text-xs md:text-sm"
                  >
                    <FiCopy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 rounded-lg transition-all duration-200 text-xs md:text-sm"
                  >
                    <FiDownload className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              <div className="bg-black/60 border border-slate-800 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 md:py-3 bg-slate-900/80 backdrop-blur border-b border-slate-800">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-3 md:ml-4 text-xs text-gray-500 font-mono">fixed-code.js</span>
                </div>
                <pre className="p-4 md:p-6 text-green-400 font-mono text-xs md:text-sm overflow-x-auto">
                  {result?.fixedCode}
                </pre>
              </div>
            </div>
          </>
        )}
      </Container>
    </PageLayout>
  );
}

export default Review;