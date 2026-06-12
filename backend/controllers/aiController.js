import Conversation from '../models/Conversation.js';
import CodeReview from '../models/CodeReview.js';

const CODE_REVIEW_SYSTEM_PROMPT = `You are an expert code reviewer and debugging assistant with deep knowledge of:
- JavaScript/TypeScript best practices
- React patterns and common pitfalls
- Security vulnerabilities and mitigation
- Performance optimization techniques
- Clean code principles and maintainability

When analyzing code, you must:
1. Identify syntax errors and runtime bugs
2. Detect React-specific mistakes (hooks, state management, lifecycle)
3. Find security issues (XSS, injection, authentication flaws)
4. Spot performance problems (inefficient algorithms, memory leaks)
5. Note best-practice violations (naming, structure, patterns)
6. Provide specific, actionable fixes with corrected code

Return your analysis in this exact JSON format:
{
  "summary": "Brief overview of code quality and main issues",
  "score": 0-100,
  "bugs": [
    {
      "severity": "High|Medium|Low",
      "type": "Syntax|Runtime|Logic|React",
      "message": "Clear description of the bug",
      "line": number,
      "suggestion": "How to fix it",
      "code": "Corrected code snippet"
    }
  ],
  "security": [
    {
      "severity": "High|Medium|Low",
      "type": "XSS|Injection|Auth|Other",
      "message": "Security issue description",
      "line": number,
      "suggestion": "Security fix",
      "code": "Secure code snippet"
    }
  ],
  "performance": [
    {
      "severity": "High|Medium|Low",
      "type": "Algorithm|Memory|Rendering",
      "message": "Performance issue description",
      "line": number,
      "suggestion": "Optimization approach",
      "code": "Optimized code snippet"
    }
  ],
  "suggestions": [
    {
      "severity": "Low|Medium",
      "type": "Best Practice|Style|Maintainability",
      "message": "Improvement suggestion",
      "line": number,
      "suggestion": "How to improve",
      "code": "Improved code snippet"
    }
  ],
  "fixedCode": "Complete corrected version of the entire code with all fixes applied",
  "metrics": {
    "complexity": 1-100,
    "maintainability": 0-100,
    "security": 0-100,
    "performance": 0-100
  }
}

Important:
- Be specific about line numbers (1-indexed)
- Provide actual working code in "fixedCode"
- Score should reflect overall code quality
- Metrics should be realistic based on code analysis
- If code is perfect, still provide minor suggestions for improvement`;

const CHAT_SYSTEM_PROMPT = `You are an AI coding assistant helping developers with:
- Code debugging and error resolution
- Best practices and code improvement
- Architecture and design patterns
- Performance optimization
- Security considerations

Be concise, practical, and provide code examples when helpful. If the user shares code, analyze it thoroughly and suggest specific improvements.`;

// Code Review Fallback Generator
const getFallbackAnalysis = (code) => {
  const lines = code.split('\n');
  const issues = [];
  let score = 100;

  // React checks
  const reactHooks = ['useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 'useMemo', 'useRef'];
  const hasReactHooks = reactHooks.some(hook => code.includes(hook));
  const missingReactImport = hasReactHooks && !code.includes('import React') && !code.includes('from "react"');

  if (missingReactImport) {
    issues.push({
      severity: 'High',
      type: 'React',
      message: 'Missing React import when using React hooks in React 18 or older environments',
      line: Math.max(1, lines.findIndex(line => line.includes('useState') || line.includes('useEffect')) + 1),
      suggestion: 'Add React import at the top of the file',
      code: 'import React, { useState, useEffect } from "react";'
    });
    score -= 20;
  }

  // Immediate onClick check
  const onClickPattern = /onClick=\{[^}]*\([^)]*\)[^}]*\}/g;
  const onClickMatches = code.match(onClickPattern);
  if (onClickMatches) {
    onClickMatches.forEach((match) => {
      const lineIndex = lines.findIndex(line => line.includes(match));
      if (lineIndex !== -1) {
        issues.push({
          severity: 'High',
          type: 'React',
          message: 'Event handler executes function immediately instead of waiting for user click trigger',
          line: lineIndex + 1,
          suggestion: 'Wrap function call in an anonymous arrow function to defer execution',
          code: 'onClick={() => handleClick()}'
        });
        score -= 15;
      }
    });
  }

  // var keyword check
  if (code.includes('var ')) {
    issues.push({
      severity: 'Medium',
      type: 'Best Practice',
      message: 'Using var instead of let or const violates modern block-scoping standards',
      line: lines.findIndex(line => line.includes('var')) + 1,
      suggestion: 'Use let for variables that will be reassigned, or const for read-only constants',
      code: 'const count = 10;'
    });
    score -= 10;
  }

  // Loose equality check
  if (code.includes('==') || code.includes('!=')) {
    const idx = lines.findIndex(line => line.includes('==') || line.includes('!='));
    issues.push({
      severity: 'Medium',
      type: 'Best Practice',
      message: 'Using loose equality operators (== or !=) can lead to unexpected type coercion bugs',
      line: idx !== -1 ? idx + 1 : 1,
      suggestion: 'Use strict equality (=== or !==) to preserve type comparison safety',
      code: 'if (status === "active") {}'
    });
    score -= 10;
  }

  // eval check
  if (code.includes('eval(')) {
    issues.push({
      severity: 'High',
      type: 'Security',
      message: 'Calling the eval() function represents a severe security risk that allows remote code execution (RCE)',
      line: lines.findIndex(line => line.includes('eval')) + 1,
      suggestion: 'Avoid eval() entirely. Parse JSON via JSON.parse or rewrite the logic securely',
      code: '// Use JSON.parse(input) instead of eval(input)'
    });
    score -= 25;
  }

  // try-catch checking
  if (!code.includes('try') && !code.includes('catch') && code.length > 60) {
    issues.push({
      severity: 'Medium',
      type: 'Best Practice',
      message: 'Missing try-catch block for handling potential runtime or network exceptions',
      line: 1,
      suggestion: 'Wrap operations that can fail in standard try-catch error boundaries',
      code: `try {\n  // potentially throwing operation\n} catch (error) {\n  console.error("Operation failed:", error);\n}`
    });
    score -= 10;
  }

  if (issues.length === 0) {
    issues.push({
      severity: 'Low',
      type: 'Best Practice',
      message: 'Code quality looks clean. Add inline documentation to explain complex segments',
      line: 1,
      suggestion: 'Write clear JSDoc comments to document parameter types and logic return structures',
      code: '/**\n * Calculates values\n * @returns {number}\n */'
    });
    score -= 5;
  }

  let fixedCode = code;
  if (missingReactImport) {
    fixedCode = 'import React, { useState } from "react";\n\n' + fixedCode;
  }
  fixedCode = fixedCode.replace(/onClick=\{([^}]+)\(([^)]*)\)\}/g, 'onClick={() => $1($2)}');

  return {
    summary: issues.length > 0 
      ? `Detected ${issues.length} item(s) to resolve to align with production standards.`
      : 'Code has solid design, minor suggestions listed.',
    score: Math.max(20, score),
    bugs: issues.filter(i => ['Syntax', 'Runtime', 'Logic', 'React'].includes(i.type)),
    security: issues.filter(i => ['XSS', 'Injection', 'Auth', 'Security'].includes(i.type)),
    performance: issues.filter(i => ['Algorithm', 'Memory', 'Rendering', 'Performance'].includes(i.type)),
    suggestions: issues.filter(i => ['Best Practice', 'Style', 'Maintainability'].includes(i.type)),
    fixedCode: fixedCode,
    metrics: {
      complexity: Math.max(10, 100 - issues.length * 6),
      maintainability: Math.max(10, 100 - issues.length * 8),
      security: Math.max(10, 100 - issues.filter(i => i.type === 'Security').length * 30),
      performance: Math.max(10, 100 - issues.filter(i => i.type === 'Performance').length * 20),
    }
  };
};

// @desc    Analyze code
// @route   POST /api/ai/analyze
// @access  Public (Optionally Authenticated)
export const analyzeCode = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Code is required for analysis' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  let analysisResult;

  try {
    if (!apiKey) {
      console.warn('OpenAI API key not configured on backend. Falling back to local analysis.');
      analysisResult = getFallbackAnalysis(code);
    } else {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: CODE_REVIEW_SYSTEM_PROMPT },
            { role: 'user', content: `Analyze this code:\n\n${code}` }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API responded with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Empty content in OpenAI API response');
      }

      analysisResult = JSON.parse(content);
    }

    // Save to Database if user is authenticated
    if (req.user && req.user.id) {
      await CodeReview.create({
        userId: req.user.id,
        code,
        summary: analysisResult.summary || 'AI Code Review',
        score: analysisResult.score || 85,
        bugs: analysisResult.bugs || [],
        security: analysisResult.security || [],
        performance: analysisResult.performance || [],
        suggestions: analysisResult.suggestions || [],
        fixedCode: analysisResult.fixedCode || code,
        metrics: analysisResult.metrics || { complexity: 50, maintainability: 50, security: 50, performance: 50 }
      });
    }

    return res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Code analysis failed:', error);
    // If external call failed, try to fallback safely rather than crashing
    try {
      const fallback = getFallbackAnalysis(code);
      return res.status(200).json(fallback);
    } catch (fbErr) {
      return res.status(500).json({ message: 'Analysis failed', error: error.message });
    }
  }
};

// @desc    AI Assistant chat
// @route   POST /api/ai/chat
// @access  Public (Optionally Authenticated)
export const chat = async (req, res) => {
  const { message, history = [], conversationId } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  let aiReply = '';

  try {
    if (!apiKey) {
      // Simple mock chat responses for developer convenience
      const responses = [
        "In modern JavaScript, it is recommended to use array methods like .map() or .filter() over traditional for loops to improve readability.",
        "To handle asynchronous tasks gracefully, use async/await within try-catch blocks to capture exceptions.",
        "React 19 doesn't require importing React at the top of component files due to the auto runtime, but hooks must still follow the rules of hooks.",
        "To optimize database performance, verify that fields utilized in MongoDB query filters are indexed properly."
      ];
      aiReply = responses[Math.floor(Math.random() * responses.length)] + "\n\n(Note: Set backend OPENAI_API_KEY for real responses)";
    } else {
      const messages = [
        { role: 'system', content: CHAT_SYSTEM_PROMPT },
        ...history.slice(-10).map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: message }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API responded with status ${response.status}`);
      }

      const data = await response.json();
      aiReply = data.choices?.[0]?.message?.content || 'No response received from assistant';
    }

    // Persist conversation if authenticated
    let finalId = conversationId;
    if (req.user && req.user.id) {
      let conversation;

      if (conversationId) {
        conversation = await Conversation.findOne({ _id: conversationId, userId: req.user.id });
      }

      if (!conversation) {
        // Create new conversation
        conversation = await Conversation.create({
          userId: req.user.id,
          title: message.substring(0, 40) + (message.length > 40 ? '...' : ''),
          messages: []
        });
        finalId = conversation._id;
      }

      // Append messages
      conversation.messages.push({ role: 'user', content: message });
      conversation.messages.push({ role: 'assistant', content: aiReply });
      await conversation.save();
    }

    return res.status(200).json({ reply: aiReply, conversationId: finalId });
  } catch (error) {
    console.error('AI chat failed:', error);
    return res.status(500).json({ message: 'Chat interaction failed', error: error.message });
  }
};

// @desc    Get user conversations
// @route   GET /api/ai/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });
    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get user conversation details
// @route   GET /api/ai/conversations/:id
// @access  Private
export const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.id });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user conversation
// @route   DELETE /api/ai/conversations/:id
// @access  Private
export const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    return res.status(200).json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get user reviews
// @route   GET /api/ai/reviews
// @access  Private
export const getReviews = async (req, res) => {
  try {
    const reviews = await CodeReview.find({ userId: req.user.id })
      .select('summary score metrics createdAt')
      .sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get user review details
// @route   GET /api/ai/reviews/:id
// @access  Private
export const getReviewById = async (req, res) => {
  try {
    const review = await CodeReview.findOne({ _id: req.params.id, userId: req.user.id });
    if (!review) {
      return res.status(404).json({ message: 'Code review record not found' });
    }
    return res.status(200).json(review);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user review
// @route   DELETE /api/ai/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await CodeReview.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!review) {
      return res.status(404).json({ message: 'Code review record not found' });
    }
    return res.status(200).json({ success: true, message: 'Code review record deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
