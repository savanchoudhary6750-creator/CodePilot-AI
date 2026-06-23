import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuCode,
  LuZap,
  LuArrowRight,
  LuPlay,
  LuShield,
  LuCpu,
  LuCircleCheck,
  LuStar,
  LuTrendingUp,
  LuUsers,
  LuClock,
  LuChevronDown,
} from "react-icons/lu";
import PageLayout, { Section, Container, Hero } from "../layouts/PageLayout";
import { ChatInterface } from "../features";
import { aiService } from "../services/aiService";
import { CodeEditor, Card, Button } from "../shared/components";

// FAQ Item Component with Accordion
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-850 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-2 font-bold text-white hover:text-indigo-400 transition-colors focus:outline-none group text-sm md:text-base"
      >
        <span>{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-500 group-hover:text-indigo-400"
        >
          <LuChevronDown className="w-5 h-5" />
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
            className="overflow-hidden text-xs md:text-sm text-slate-400 mt-2 leading-relaxed"
          >
            <div className="pb-3 pr-4">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const BOILERPLATES = {
  javascript: `function calculateSum(a, b) {
  var result = a + b;
  if (result == 0) {
    eval("console.log('Zero result')");
  }
  return result;
}`,
  python: `def calculate_sum(a, b):
    result = a + b
    if result == 0:
        # Simulating eval security flaw
        eval("print('Zero result')")
    return result`,
  go: `package main

import "fmt"

func calculateSum(a int, b int) int {
    result := a + b
    if result == 0 {
        fmt.Println("Zero result")
    }
    return result
}`,
  java: `public class Main {
    public static int calculateSum(int a, int b) {
        int result = a + b;
        if (result == 0) {
            System.out.println("Zero result");
        }
        return result;
    }
}`,
  cpp: `#include <iostream>

int calculateSum(int a, int b) {
    int result = a + b;
    if (result == 0) {
        std::cout << "Zero result" << std::endl;
    }
    return result;
}`
};

export default function Home() {
  const [lang, setLang] = useState("javascript");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [code, setCode] = useState(BOILERPLATES.javascript);
  const navigate = useNavigate();

  const handleReview = () => {
    if (!code.trim()) {
      toast.error("Please paste your code first!");
      return;
    }

    localStorage.setItem("reviewCode", code);
    localStorage.setItem("reviewLanguage", lang);
    navigate("/review");
  };

  const handleTryDemo = () => {
    setCode(BOILERPLATES[lang]);
    toast.success(`Demo ${lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)} code loaded into workspace!`);
  };

  const features = [
    {
      icon: <LuShield className="w-5 h-5 text-indigo-400" />,
      title: "Security Analysis",
      description: "Detect vulnerabilities and security risks in your code before they reach production.",
      gradient: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 shadow-indigo-500/5",
    },
    {
      icon: <LuCpu className="w-5 h-5 text-purple-400" />,
      title: "AI-Powered Insights",
      description: "Get intelligent suggestions based on industry best practices and clean design rules.",
      gradient: "from-purple-500/10 to-purple-500/5 border-purple-500/20 shadow-purple-500/5",
    },
    {
      icon: <LuCircleCheck className="w-5 h-5 text-pink-400" />,
      title: "Bug Detection",
      description: "Automatically identify and fix logic bugs with clean, AI-generated corrections.",
      gradient: "from-pink-500/10 to-pink-500/5 border-pink-500/20 shadow-pink-500/5",
    },
    {
      icon: <LuTrendingUp className="w-5 h-5 text-emerald-400" />,
      title: "Performance tuning",
      description: "Optimize execution paths, algorithm logic, and structures for optimal speed.",
      gradient: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Developer at TechCorp",
      avatar: "SC",
      content: "CodePilot AI has transformed our development workflow. The suggestions are incredibly accurate and save us hours of manual bug hunting.",
      rating: 5,
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      name: "Michael Rodriguez",
      role: "CTO at StartupXYZ",
      avatar: "MR",
      content: "The security analysis features alone are worth the upgrade. We catch issues before they can ever make it past CI pipelines.",
      rating: 5,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      name: "Emily Johnson",
      role: "Lead Engineer at DevFlow",
      avatar: "EJ",
      content: "The absolute best code assistant platform I've used. Interactive, lightning fast, and has complete IDE integration.",
      rating: 5,
      gradient: "from-pink-500 to-rose-600",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Developers", icon: <LuUsers className="w-4.5 h-4.5" /> },
    { value: "1M+", label: "Files Audited", icon: <LuCode className="w-4.5 h-4.5" /> },
    { value: "99.9%", label: "System Accuracy", icon: <LuCircleCheck className="w-4.5 h-4.5" /> },
    { value: "24/7", label: "Availability SLA", icon: <LuClock className="w-4.5 h-4.5" /> },
  ];

  const faqs = [
    {
      question: "How does CodePilot AI audit my code?",
      answer: "CodePilot AI securely parses code blocks on submit, looking for vulnerabilities, memory leaks, performance traps, and lifecycle bugs. It leverages advanced models to structure optimized code versions for download.",
    },
    {
      question: "Is my source code saved or stored?",
      answer: "Anonymous user code blocks are analyzed in memory and discarded instantly. Authenticated dashboard code reviews are stored securely in your private database, compliant with data leakage protection standards.",
    },
    {
      question: "Can I use custom OpenAI API keys?",
      answer: "Yes. Pro and enterprise tier developers can supply their own keys in settings to leverage custom rate limits, tokens configurations, and analytics databases.",
    },
    {
      question: "What language structures are supported?",
      answer: "We support JavaScript, TypeScript, Python, HTML/CSS, Go, Java, C++, and Ruby. The compiler fallback engine runs customized syntax rules specifically modeled to each ecosystem.",
    },
  ];

  // Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <PageLayout className="bg-[#020617] text-slate-150 min-h-screen relative overflow-hidden pb-16">
      {/* Decorative Orbs */}
      <div className="absolute top-[-5%] left-[-5%] w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Hero Header */}
      <Hero
        badge="Enterprise AI Code Review System"
        title="Automate Code Quality with"
        gradientText="CodePilot AI"
        subtitle="Submit code blocks to get immediate security scanning, algorithmic complexity checks, bug detection, and complete, production-ready optimizations."
        buttons={
          <>
            <Button
              variant="primary"
              onClick={() =>
                document
                  .getElementById("sandbox-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center gap-2"
            >
              <LuPlay className="w-4 h-4" />
              Launch Code Sandbox
            </Button>

            <Button
              variant="secondary"
              onClick={handleTryDemo}
              className="flex items-center gap-2"
            >
              <LuZap className="w-4 h-4 text-indigo-400 animate-pulse" />
              Load Template Code
            </Button>
          </>
        }
      />

      {/* Stats Board */}
      <Section className="bg-[#0F172A]/35 border-y border-slate-900/60 py-10">
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat, idx) => (
              <motion.div
                variants={itemVariants}
                key={idx}
                className="text-center flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                  {stat.icon}
                </div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* Capabilities Section */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest mb-4">
              Core Capabilities
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Write Clean Code.{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Deploy Safely.
              </span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto font-medium">
              Detect complex algorithms bottlenecks, logical holes, and security leaks before they reach the main branch.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feat, idx) => (
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4, borderColor: 'rgba(99, 102, 241, 0.3)' }}
                key={idx}
                className={`group bg-[#111827]/40 border border-slate-850/80 p-6 rounded-3xl transition-all duration-300 shadow-xl`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">{feat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* Interactive Sandbox Workspace */}
      <Section id="sandbox-section" className="relative z-10">
        <Container maxWidth="7xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest mb-4">
              Interactive Workspace
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Test Drive CodePilot AI
            </h2>
            <p className="text-slate-400 text-xs mt-2 font-medium">
              Change language templates, type custom code, and test assistant capabilities inside the local sandbox.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left Column: Sandbox Editor */}
            <div className="flex flex-col">
              <Card className="flex-1 flex flex-col p-6 h-full bg-[#111827]/40 border border-slate-850 rounded-3xl shadow-xl">
                <div className="flex justify-between items-center mb-4 text-xs font-semibold relative z-30">
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="px-3.5 py-2 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 text-slate-200 rounded-xl transition-all flex items-center gap-1.5 font-bold"
                    >
                      <LuCode className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{lang === 'cpp' ? 'C++' : lang === 'go' ? 'Go' : lang === 'java' ? 'Java' : lang === 'python' ? 'Python' : 'JavaScript'}</span>
                      <LuChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                    
                    <AnimatePresence>
                      {dropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 mt-2 w-40 bg-[#0F172A] border border-slate-800 rounded-xl shadow-xl py-1.5 z-50 overflow-hidden"
                          >
                            {[
                              { id: 'javascript', name: 'JavaScript' },
                              { id: 'python', name: 'Python' },
                              { id: 'go', name: 'Go' },
                              { id: 'java', name: 'Java' },
                              { id: 'cpp', name: 'C++' }
                            ].map((l) => (
                              <button
                                key={l.id}
                                onClick={() => {
                                  if (code.trim() !== BOILERPLATES[lang].trim()) {
                                    if (!window.confirm("Changing the language template will overwrite your sandbox code. Continue?")) {
                                      setDropdownOpen(false);
                                      return;
                                    }
                                  }
                                  setLang(l.id);
                                  setCode(BOILERPLATES[l.id]);
                                  setDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${
                                  lang === l.id 
                                    ? 'bg-indigo-500/10 text-indigo-400' 
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                              >
                                {l.name}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTryDemo}
                    className="flex items-center gap-1.5"
                  >
                    <LuZap className="w-3.5 h-3.5" />
                    Reset Template
                  </Button>
                </div>

                <div className="flex-1 min-h-[380px] rounded-2xl overflow-hidden border border-slate-850 shadow-inner bg-[#020617]">
                  <CodeEditor
                    code={code}
                    onChange={(val) => setCode(val)}
                    language={lang}
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={handleReview}
                  className="w-full mt-6 py-3.5 font-bold flex items-center justify-center gap-2 hover:shadow-lg shadow-indigo-500/20"
                >
                  <LuCode className="w-4 h-4" />
                  Analyze Code Snippet
                  <LuArrowRight className="w-4 h-4 animate-float" />
                </Button>
              </Card>
            </div>

            {/* Right Column: AI Assistant */}
            <div className="flex flex-col">
              <Card className="flex-1 flex flex-col p-6 h-full bg-[#111827]/40 border border-slate-850 rounded-3xl shadow-xl overflow-hidden">
                <ChatInterface onSendMessage={async (msg) => {
                  const res = await aiService.chat(msg);
                  return res.reply;
                }} />
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Customer Testimonial Slider */}
      <Section className="bg-[#0F172A]/20 border-y border-slate-900/60 py-20">
        <Container>
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400 text-[10px] font-extrabold uppercase tracking-widest mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Developer Approved
            </h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((test, index) => (
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4 }}
                key={index}
                className="bg-[#0F172A]/40 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(test.rating)].map((_, i) => (
                      <LuStar key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed italic mb-6">"{test.content}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${test.gradient} flex items-center justify-center font-extrabold text-white text-xs`}>
                    {test.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{test.name}</h4>
                    <p className="text-slate-500 text-[10px] font-semibold">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* Accordion FAQ Section */}
      <Section className="py-20">
        <Container maxWidth="4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-xs mt-2 font-medium">Clear answers to common questions about CodePilot AI.</p>
          </div>
          <div className="bg-[#111827]/40 border border-slate-850 p-6 md:p-8 rounded-3xl shadow-xl">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Box */}
      <Section className="pb-12">
        <Container maxWidth="5xl" className="text-center">
          <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-950/40 border border-indigo-500/20 rounded-3xl p-8 md:p-14 shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 relative z-10">
              Audited Code. Faster Deployments.
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mb-10 max-w-xl mx-auto leading-relaxed font-semibold relative z-10">
              Audit syntax bugs, perform deep security analysis, check performance bottlenecks, and generate optimized files in a clean developer workspace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
              <Button
                variant="primary"
                onClick={() =>
                  document
                    .getElementById("sandbox-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 shadow-indigo-500/20"
              >
                Launch Sandbox Free
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/services")}
                className="px-8"
              >
                View Plans & Pricing
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}