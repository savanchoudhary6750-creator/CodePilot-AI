/**
 * Static Code Analysis Fallback Engine
 * Analyzes source code blocks for bugs, performance leaks, and security flaws without external network dependencies.
 */
export const analyzeCode = (code, language = 'javascript') => {
  const lines = code.split('\n');
  const bugs = [];
  const security = [];
  const performance = [];
  const suggestions = [];
  
  let complexity = 15; // default base complexity
  let maintainability = 90;
  let securityScore = 100;
  let performanceScore = 100;

  // Scan lines sequentially for structural indicators
  for (let i = 0; i < lines.length; i++) {
    const lineContent = lines[i];
    const lineNumber = i + 1;

    // 1. Security Check: Hardcoded secrets or tokens
    const secretRegex = /(?:const|let|var|key|token|secret|password|auth|jwt|api_key)\s*=\s*['"`]([a-zA-Z0-9_\-.~+=]{8,})['"`]/i;
    const isExcludedValue = (val) => {
      const lower = val.toLowerCase();
      return lower === 'javascript' || lower === 'username' || lower === 'password' || lower === 'active' || lower === 'success';
    };
    const secretMatch = lineContent.match(secretRegex);
    if (secretMatch && !isExcludedValue(secretMatch[1])) {
      const val = secretMatch[1];
      // Match high-entropy or long strings that aren't variables
      if ((/[A-Z]/.test(val) && /[0-9]/.test(val)) || val.length > 15 || /secret|key|token|jwt/i.test(lineContent)) {
        security.push({
          severity: 'High',
          type: 'Security',
          message: 'Potential hardcoded credential or secret key detected. Storing keys directly in source code creates severe credentials leakage risks.',
          line: lineNumber,
          suggestion: 'Extract secrets to environment variables (e.g. process.env.API_KEY) and configure them in your server dashboard.',
          code: 'const API_KEY = process.env.API_KEY || "";'
        });
        securityScore -= 25;
        complexity += 5;
      }
    }

    // 2. Security Check: Direct SQL Concatenation (SQL-i risk)
    const sqlConcatRegex = /(?:select|insert|update|delete)\s+.*\s+(?:where|set|values)\s+.*(\+|=|\$\{).*(input|req\.|query|body|params|id|email|user)/i;
    if (sqlConcatRegex.test(lineContent)) {
      security.push({
        severity: 'High',
        type: 'Injection',
        message: 'Dynamic SQL query constructed using raw string concatenation or interpolation. This creates a SQL Injection vulnerability.',
        line: lineNumber,
        suggestion: 'Utilize parameterized queries or prepared statements rather than raw string queries.',
        code: 'db.query("SELECT * FROM users WHERE id = ?", [userId]);'
      });
      securityScore -= 30;
      complexity += 8;
    }

    // 3. Performance Check: Nested for/while loops
    const loopRegex = /\b(for|while)\s*\(.*\)\s*\{|\bfor\s+.*\s+(of|in)\s+/;
    if (loopRegex.test(lineContent)) {
      let braceCount = 0;
      let nestedLoopFound = false;
      let innerLineNumber = lineNumber;

      // Count braces to approximate loop scope limit
      for (let j = i; j < Math.min(lines.length, i + 25); j++) {
        const checkLine = lines[j];
        const openBraces = (checkLine.match(/\{/g) || []).length;
        const closeBraces = (checkLine.match(/\}/g) || []).length;
        
        if (j === i) {
          braceCount = openBraces - closeBraces;
        } else {
          if (braceCount > 0 && loopRegex.test(checkLine)) {
            nestedLoopFound = true;
            innerLineNumber = j + 1;
            break;
          }
          braceCount += openBraces - closeBraces;
          if (braceCount <= 0) break;
        }
      }

      if (nestedLoopFound) {
        performance.push({
          severity: 'High',
          type: 'Algorithm',
          message: 'Deeply nested loop structure detected. This pattern runs in O(N^2) or worse time complexity, risking thread blocking for large datasets.',
          line: innerLineNumber,
          suggestion: 'Flatten the nesting by utilizing hash maps or indexing array structures to perform lookups in O(1) or O(log N).',
          code: '// Use a Map to pre-index values and avoid inner loops'
        });
        performanceScore -= 20;
        complexity += 15;
      }
    }
  }

  // 4. React Bugs Check: useEffect with timers or listeners missing cleanups
  const useEffectIndex = code.indexOf('useEffect');
  if (useEffectIndex !== -1) {
    const hasListenerOrInterval = code.includes('addEventListener') || code.includes('setInterval');
    const hasCleanup = code.includes('return () =>') || code.includes('return function');
    
    if (hasListenerOrInterval && !hasCleanup) {
      let effectLine = 1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('useEffect')) {
          effectLine = i + 1;
          break;
        }
      }
      bugs.push({
        severity: 'Medium',
        type: 'React',
        message: 'Active listener or interval initiated inside useEffect hook without a corresponding cleanup function. This will lead to memory leaks and multiple handler registrations upon re-render.',
        line: effectLine,
        suggestion: 'Return a cleanup/reset function from the useEffect callback to discard event listeners or clear timers.',
        code: `useEffect(() => {\n  const handleResize = () => {};\n  window.addEventListener('resize', handleResize);\n  return () => window.removeEventListener('resize', handleResize);\n}, []);`
      });
      maintainability -= 15;
      complexity += 10;
    }
  }

  // Populate default styling improvements if everything else is clean
  if (bugs.length === 0 && security.length === 0 && performance.length === 0) {
    suggestions.push({
      severity: 'Low',
      type: 'Best Practice',
      message: 'Code structure looks clean and matches linting guidelines. Consider writing structured JSDoc comments to document types.',
      line: 1,
      suggestion: 'Add parameter and return types for methods.',
      code: '/**\n * Performs operations\n * @param {number} a\n * @returns {number}\n */'
    });
    complexity = Math.max(5, complexity - 5);
  }

  // Normalize scores
  securityScore = Math.max(15, securityScore);
  performanceScore = Math.max(15, performanceScore);
  maintainability = Math.max(20, maintainability);
  complexity = Math.min(95, complexity);

  const score = Math.round((securityScore + performanceScore + maintainability + (100 - complexity)) / 4);

  // Generate fixed version of code
  let fixedCode = code;
  fixedCode = fixedCode.replace(/== 0/g, '=== 0');
  fixedCode = fixedCode.replace(/!= 0/g, '!== 0');
  fixedCode = fixedCode.replace(/\bvar\s+(\w+)\b/g, 'const $1');

  if (useEffectIndex !== -1 && (code.includes('addEventListener') || code.includes('setInterval')) && !code.includes('return () =>')) {
    const linesOfCode = code.split('\n');
    const cleanups = [];
    for (const line of linesOfCode) {
      const listenerMatch = line.match(/(window|document|body|element|target)\.addEventListener\(\s*['"`]([^'"`]+)['"`]\s*,\s*(\w+)/);
      if (listenerMatch) {
        cleanups.push(`${listenerMatch[1]}.removeEventListener('${listenerMatch[2]}', ${listenerMatch[3]});`);
      }
      const intervalMatch = line.match(/(?:const|let|var)\s+(\w+)\s*=\s*setInterval/);
      if (intervalMatch) {
        cleanups.push(`clearInterval(${intervalMatch[1]});`);
      }
    }
    const cleanupBody = cleanups.length > 0
      ? cleanups.map(c => `    ${c}`).join('\n')
      : `    window.removeEventListener('resize', handleResize);`;

    fixedCode = fixedCode.replace(
      /useEffect\(\(\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*\[\]\)/,
      `useEffect(() => {
  $1
  return () => {
${cleanupBody}
  };
}, [])`
    );
  }

  return {
    summary: bugs.length > 0 || security.length > 0 || performance.length > 0
      ? `Found ${bugs.length + security.length + performance.length} issues in your ${language} code related to security, performance, or lifecycle rules.`
      : 'Code has solid design, minor suggestions listed.',
    score,
    bugs,
    security,
    performance,
    suggestions,
    fixedCode,
    metrics: {
      complexity,
      maintainability,
      security: securityScore,
      performance: performanceScore
    }
  };
};
