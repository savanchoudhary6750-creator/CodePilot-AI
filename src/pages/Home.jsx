import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCode,
  FiZap,
  FiArrowRight,
  FiPlay,
  FiShield,
  FiCpu,
  FiCheckCircle,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiChevronDown,
} from "react-icons/fi";
import PageLayout, { Section, Container, Hero } from "../layouts/PageLayout";
import { ChatInterface } from "../features";
import { aiService } from "../services/aiService";
import { CodeEditor } from "../shared/components";

// FAQ Item Component with Framer Motion Accordion
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-800 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-2 font-semibold text-white hover:text-indigo-400 transition-colors focus:outline-none group"
      >
        <span className="text-base md:text-lg">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-500 group-hover:text-indigo-400"
        >
          <FiChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden text-sm md:text-base text-gray-400 mt-2 leading-relaxed"
          >
            <div className="pb-3 pr-4">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [code, setCode] = useState(`function calculateSum(a, b) {
  var result = a + b;
  if (result == 0) {
    eval("console.log('Zero result')");
  }
  return result;
}`);
  const navigate = useNavigate();

  const handleReview = () => {
    if (!code.trim()) {
      toast.error("Please paste your code first!", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    localStorage.setItem("reviewCode", code);
    navigate("/review");
  };

  const handleTryDemo = () => {
    setCode(`function calculateSum(a, b) {
  var result = a + b;
  if (result == 0) {
    eval("console.log('Zero result')");
  }
  return result;
}`);
    toast.success("Demo code loaded into workspace!");
  };

  const features = [
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Security Analysis",
      description: "Detect vulnerabilities and security risks in your code before they become problems.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: <FiCpu className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description: "Get intelligent suggestions based on industry best practices and patterns.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Bug Detection",
      description: "Automatically identify and fix bugs with AI-generated solutions.",
      gradient: "from-pink-500 to-red-500",
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Performance Optimization",
      description: "Optimize your code for better performance and efficiency.",
      gradient: "from-red-500 to-orange-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Developer at TechCorp",
      avatar: "SC",
      content: "CodePilot AI has transformed our development workflow. The AI suggestions are incredibly accurate and have saved us countless hours of debugging.",
      rating: 5,
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      name: "Michael Rodriguez",
      role: "CTO at StartupXYZ",
      avatar: "MR",
      content: "The security analysis feature alone is worth it. We've caught vulnerabilities that would have been disastrous if deployed.",
      rating: 5,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Emily Johnson",
      role: "Lead Engineer at DevFlow",
      avatar: "EJ",
      content: "Best AI code review tool I've used. The interface is intuitive and the results are actionable immediately.",
      rating: 5,
      gradient: "from-pink-500 to-red-500",
    },
  ];

  const stats = [
    { value: "50K+", label: "Developers", icon: <FiUsers className="w-5 h-5" /> },
    { value: "1M+", label: "Lines Analyzed", icon: <FiCode className="w-5 h-5" /> },
    { value: "99.9%", label: "Accuracy", icon: <FiCheckCircle className="w-5 h-5" /> },
    { value: "24/7", label: "Availability", icon: <FiClock className="w-5 h-5" /> },
  ];

  const faqs = [
    {
      question: "How does CodePilot AI review my code?",
      answer: "CodePilot AI securely analyses the structural nodes of your code. It queries advanced, backend LLM models to find logic issues, security vulnerability traps (like XSS or remote execution risks), performance locks, and code styling mistakes.",
    },
    {
      question: "Do you save my source code on your servers?",
      answer: "If you run an analysis anonymously as a guest, your code is parsed in-memory and is not saved. If you are signed in, CodePilot AI saves your history details in a secure database so you can retrieve your reports anytime.",
    },
    {
      question: "Can I use my own OpenAI API key?",
      answer: "Yes, you can configure your own OpenAI API key in your Settings dashboard on Pro and Enterprise tiers, allowing you to use your own quota directly.",
    },
    {
      question: "What languages are currently supported?",
      answer: "We support JavaScript, TypeScript, Python, HTML/CSS, Go, Java, C++, and Ruby. The review engine automatically adjusts its validation patterns based on the language's best practices.",
    },
  ];

  // Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <PageLayout className="bg-[#0B1120] text-slate-100 min-h-screen relative overflow-hidden">
      {/* Premium Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Hero
          badge="AI Powered Code Review Platform"
          title="CodePilot"
          gradientText="AI"
          subtitle="Paste your code and instantly get bug detection, security analysis, optimization suggestions, and AI-generated fixes."
          buttons={
            <>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  document
                    .getElementById("code-editor-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-indigo-500/20"
              >
                <FiPlay className="w-5 h-5" />
                Get Started Free
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTryDemo}
                className="px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300"
              >
                <FiZap className="w-5 h-5 text-indigo-400" />
                Load Demo Code
              </motion.button>
            </>
          }
        />
      </motion.div>

      {/* Stats Section */}
      <Section className="bg-[#111827]/40 border-y border-slate-900 -mx-4 sm:-mx-6 lg:-mx-8 py-10">
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                variants={itemVariants}
                key={index}
                className="text-center group"
              >
                <div className="flex justify-center mb-3 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section>
        <Container>
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-6 backdrop-blur-sm">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              Review Faster.{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Ship Safer.
              </span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Automated audit structures built directly on advanced language modeling.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -6, borderColor: "rgba(99, 102, 241, 0.4)" }}
                key={index}
                className="bg-[#111827]/60 border border-slate-800 p-6 rounded-3xl transition-all duration-300 shadow-xl"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-white mb-4 shadow-md`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* Interactive Editor Workspace */}
      <Section id="code-editor-section" className="relative z-10">
        <Container maxWidth="6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Editor Console */}
            <div className="flex flex-col">
              <div className="text-center lg:text-left mb-6">
                <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  Interactive Workspace
                </h2>
                <p className="text-slate-400 text-sm">
                  Write or paste your code snippet here to initialize a review
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex-1 bg-[#111827]/70 border border-slate-850 p-6 rounded-3xl flex flex-col shadow-2xl relative"
              >
                <div className="flex justify-between items-center mb-4 text-sm text-slate-400">
                  <span className="font-mono text-slate-500 text-xs">workspace.js</span>
                  <button
                    onClick={handleTryDemo}
                    className="px-3.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:text-indigo-300 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <FiZap className="w-3.5 h-3.5" />
                    Reset Demo
                  </button>
                </div>

                <div className="flex-1 min-h-[380px] rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                  <CodeEditor
                    code={code}
                    onChange={(val) => setCode(val)}
                    language="javascript"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReview}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg"
                >
                  <FiCode className="w-5 h-5" />
                  Analyze Code Snippet
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </div>

            {/* Chat Assistant Panel */}
            <div className="flex flex-col">
              <div className="text-center lg:text-left mb-6">
                <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  AI Coding Assistant
                </h2>
                <p className="text-slate-400 text-sm">
                  Chat with CodePilot to generate, refactor, or debug code
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex-1 bg-[#111827]/70 border border-slate-850 p-6 rounded-3xl flex flex-col shadow-2xl"
              >
                <ChatInterface onSendMessage={async (msg) => {
                  const res = await aiService.chat(msg);
                  return res.reply;
                }} />
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section className="bg-[#111827]/30 border-y border-slate-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-6 backdrop-blur-sm">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
              Approved by{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                SaaS Engineers
              </span>
            </h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((test, index) => (
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4 }}
                key={index}
                className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(test.rating)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic mb-6">"{test.content}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${test.gradient} flex items-center justify-center font-bold text-white text-sm`}>
                    {test.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{test.name}</h4>
                    <p className="text-slate-500 text-xs">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* FAQ Accordion Section */}
      <Section className="py-16">
        <Container maxWidth="4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-sm mt-2">Have questions about CodePilot AI? We have answers.</p>
          </div>
          <div className="bg-[#111827]/40 border border-slate-850 p-6 md:p-8 rounded-3xl shadow-xl">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="pb-20">
        <Container maxWidth="4xl" className="text-center">
          <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-900 border border-indigo-500/20 rounded-3xl p-8 md:p-12 shadow-glow">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              Write Clean Code. Faster.
            </h2>
            <p className="text-slate-400 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Join thousands of developers using CodePilot AI to analyze logic issues, security leaks, and refactor code inside real-time sessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  document
                    .getElementById("code-editor-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg"
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/services")}
                className="px-8 py-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-semibold rounded-2xl transition-all"
              >
                View Plans & Pricing
              </motion.button>
            </div>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}