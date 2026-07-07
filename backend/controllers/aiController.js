import Conversation from '../models/Conversation.js';
import CodeReview from '../models/CodeReview.js';

const CODE_REVIEW_SYSTEM_PROMPT = `You are an expert code reviewer and debugging assistant with deep knowledge of JavaScript/TypeScript, React 19, and Tailwind CSS v4. You evaluate submitted code snippets using a strict, absolute, deterministic rule set rather than generic pattern matching.

### STRICT EVALUATION RULES

1. MEMORY LEAKS (React useEffect Cleanup)
   - RULE: Any React \`useEffect\` hook that instantiates a \`setInterval\`, \`setTimeout\`, or \`addEventListener\` MUST return a clean-up function (e.g., calling \`clearInterval\`, \`clearTimeout\`, or \`removeEventListener\`).
   - PENALTY: Flag under "performance" or "bugs" (Severity: High, Type: React/Memory) if missing. Reduce the Performance metric by 25 points and Maintainability by 15 points.

2. OBJECT HOISTING (In-render Objects)
   - RULE: Any static configuration objects, dictionaries, or style maps (e.g., Tailwind styling maps, color dictionaries, sizing class maps) declared inside a component's render body that DO NOT rely on component props or state MUST be hoisted outside the component's render function (into module scope) to prevent recreation on every render.
   - PENALTY: Flag under "performance" (Severity: Medium, Type: Rendering/Memory). Reduce the Performance metric by 15 points.

3. TECH STACK SPECIFICITY (React 19 & Tailwind CSS v4)
   - React 19 Standards: Encourage the use of React 19 patterns (e.g., native Actions, the new 'use' hook, or form transition states instead of old useEffect state syncs). Flag legacy React habits or un-memoized expensive calculations as maintainability/performance penalties.
   - Tailwind CSS v4: Enforce Tailwind v4 best practices. Flag ad-hoc style calculations inside inline templates that can be optimized or moved to standard class maps.
   - PENALTY: Flag under "suggestions" (Severity: Low|Medium, Type: Best Practice|Maintainability). Reduce the Maintainability metric by 10 points.

### FEW-SHOT ALIGNMENT: BEFORE vs. AFTER TRANSFORMATION

#### [BEFORE] (Inefficient & Memory-Leaky Component)
\`\`\`javascript
import React, { useEffect, useState } from 'react';

const MetricCard = ({ title, value, status }) => {
  // VIOLATION: Static style dictionaries recreated on every render
  const statusColors = {
    success: 'bg-emerald-500/10 text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-400',
    neutral: 'bg-slate-900/40 text-slate-300'
  };

  useEffect(() => {
    // VIOLATION: setInterval instantiated without returning a cleanup function
    setInterval(() => {
      console.log('Fetching live updates for:', title);
    }, 5000);
  }, []);

  return (
    <div className={\`p-4 rounded-xl \${statusColors[status]}\`}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};
\`\`\`

#### [AFTER] (Optimized, Secure & Leak-Free Component)
\`\`\`javascript
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// HOISTED: Static objects declared outside of the render function
const statusColors = {
  success: 'bg-emerald-500/10 text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-400',
  neutral: 'bg-slate-900/40 text-slate-300'
};

const MetricCard = ({ title, value, status }) => {
  useEffect(() => {
    // RESOLVED: Timer is stored and returned with a clear cleanup callback
    const timer = setInterval(() => {
      console.log('Fetching live updates for:', title);
    }, 5000);
    return () => clearInterval(timer);
  }, [title]);

  return (
    <div className={\`p-4 rounded-xl \${statusColors[status] || statusColors.neutral}\`}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  status: PropTypes.oneOf(['success', 'warning', 'neutral'])
};
\`\`\`

### JSON OUTPUT FORMAT
You must return your analysis in this exact JSON format:
{
  "summary": "Brief overview of code quality and main issues based on strict rules",
  "score": 0-100, // Calculated strictly: 100 - cumulative penalties
  "bugs": [
    {
      "severity": "High|Medium|Low",
      "type": "Syntax|Runtime|Logic|React",
      "message": "Clear description of the bug, referencing memory leaks or custom rules",
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
      "message": "Performance issue description (e.g. object hoisting failure, memory leak)",
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
  "fixedCode": "Complete corrected version of the entire code with all fixes applied (including all hoisted objects and proper useEffect cleanups)",
  "metrics": {
    "complexity": 1-100,
    "maintainability": 0-100, // Reduced by maintainability penalties
    "security": 0-100,
    "performance": 0-100 // Reduced by performance/leak penalties
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

import { analyzeCode as fallbackAnalyze } from '../utils/fallbackAnalyzer.js';

// @desc    Analyze code
// @route   POST /api/ai/analyze
// @access  Public (Optionally Authenticated)
export const analyzeCode = async (req, res) => {
  const { code, language = 'javascript' } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Code is required for analysis' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  let analysisResult;

  try {
    if (!apiKey) {
      console.warn('OpenAI API key not configured on backend. Falling back to local analysis.');
      analysisResult = fallbackAnalyze(code, language);
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
    try {
      const fallback = fallbackAnalyze(code, language);
      return res.status(200).json(fallback);
    } catch (fbErr) {
      return res.status(500).json({ message: 'Analysis failed', error: error.message });
    }
  }
};

// Helper to generate local developer assistance replies when API key is missing or fails
const generateLocalChatFallback = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.includes('loop') || msg.includes('for') || msg.includes('map') || msg.includes('foreach')) {
    return "When working with loops in JavaScript, prefer functional methods like `.map()`, `.filter()`, and `.reduce()` for cleaner and more readable code. If you are doing intense calculations, verify that the complexity does not exceed O(N log N) to keep the main thread responsive.";
  }
  if (msg.includes('react') || msg.includes('hook') || msg.includes('state') || msg.includes('useeffect')) {
    return "For React components, make sure hooks are called at the top level and not inside loops or conditionals. Additionally, always clean up side-effects (like event listeners or timers) inside a `useEffect` cleanup return function to avoid memory leaks.";
  }
  if (msg.includes('security') || msg.includes('vuln') || msg.includes('password') || msg.includes('sql') || msg.includes('token')) {
    return "To secure your application, make sure to sanitize user inputs, avoid dynamic query string concatenation to protect against injection, store tokens securely in HTTP-only cookies or authorization headers, and never hardcode api secrets.";
  }
  if (msg.includes('performance') || msg.includes('slow') || msg.includes('memory') || msg.includes('leak')) {
    return "For optimal performance, leverage caching layers where applicable, use code-splitting/lazy-loading for large bundles, make sure database indexes match your query filters, and clean up active listeners and timers when components unmount.";
  }
  if (msg.includes('auth') || msg.includes('login') || msg.includes('jwt')) {
    return "Ensure JWT tokens are signed using a strong private key (JWT_SECRET) with reasonable expiration times. Use middleware to verify signatures and populate route-handler request objects securely.";
  }
  
  const defaultResponses = [
    "I am here to help you debug and optimize your code! Feel free to paste a code snippet or ask about architecture patterns.",
    "Good design requires separation of concerns, writing clean unit tests, and structuring models to match logic specifications.",
    "Make sure code imports resolve properly, dependencies are up-to-date, and all error boundaries handle unexpected exceptions gracefully.",
    "Let me know what coding problem or logic structure you would like to refactor or design next."
  ];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
      aiReply = generateLocalChatFallback(message) + "\n\n(Note: Backend OPENAI_API_KEY is not configured; using local assistant logic)";
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
    try {
      aiReply = generateLocalChatFallback(message) + "\n\n(Note: OpenAI API failed or rate-limited; using local assistant fallback)";
      let finalId = conversationId;
      if (req.user && req.user.id) {
        let conversation;
        if (conversationId) {
          conversation = await Conversation.findOne({ _id: conversationId, userId: req.user.id });
        }
        if (!conversation) {
          conversation = await Conversation.create({
            userId: req.user.id,
            title: message.substring(0, 40) + (message.length > 40 ? '...' : ''),
            messages: []
          });
          finalId = conversation._id;
        }
        conversation.messages.push({ role: 'user', content: message });
        conversation.messages.push({ role: 'assistant', content: aiReply });
        await conversation.save();
      }
      return res.status(200).json({ reply: aiReply, conversationId: finalId });
    } catch (fallbackError) {
      return res.status(500).json({ message: 'Chat interaction failed', error: error.message });
    }
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
