import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
} from "react-icons/fi";
import PageLayout, { Section, Container, Hero } from "../layouts/PageLayout";
import { ChatInterface } from "../features";

export default function Home() {
  const [code, setCode] = useState("");
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
  return a + b;
}

console.log(calculateSum(5, 10));`);
  };

  const features = [
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Security Analysis",
      description: "Detect vulnerabilities and security risks in your code before they become problems.",
      gradient: "from-blue-500 to-purple-500",
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
      gradient: "from-blue-500 to-purple-500",
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

  return (
    <PageLayout className="bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <Hero
        badge="AI Powered Code Review Platform"
        title="CodePilot"
        gradientText="AI"
        subtitle="Paste your code and instantly get bug detection, security analysis, optimization suggestions, and AI-generated fixes."
        buttons={
          <>
            <button
              onClick={() =>
                document
                  .getElementById("code-editor")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105"
            >
              <FiPlay className="w-5 h-5" />
              Get Started
            </button>

            <button
              onClick={handleTryDemo}
              className="px-8 py-4 bg-slate-800/80 backdrop-blur border border-slate-700 hover:bg-slate-700 hover:border-slate-600 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
            >
              <FiZap className="w-5 h-5" />
              Try Demo
            </button>
          </>
        }
      />

      {/* Stats Section */}
      <Section className="bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 -mx-4 sm:-mx-6 lg:-mx-8">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="flex justify-center mb-3 text-blue-400 group-hover:text-blue-300 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section>
        <Container>
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8 backdrop-blur-sm">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Build Better
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Powerful AI-driven tools designed for modern development workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-slate-900/70 backdrop-blur border border-slate-800 p-6 md:p-8 rounded-2xl md:rounded-3xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Code Editor Section */}
      <Section id="code-editor">
        <Container maxWidth="6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Code Editor */}
            <div>
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Code Editor
                </h2>
                <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                  Paste your code below to analyze it with AI
                </p>
              </div>

              <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-blue-500/10">
                <div className="flex justify-between items-center mb-6 text-sm text-gray-400">
                  <span className="font-mono text-gray-500">code-editor.js</span>
                  <button
                    onClick={handleTryDemo}
                    className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm"
                  >
                    <FiZap className="w-4 h-4" />
                    Load Demo
                  </button>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Paste your code here..."
                  className="w-full h-96 bg-black/60 border border-slate-700 rounded-2xl p-6 text-green-400 font-mono text-sm sm:text-base outline-none resize-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />

                <button
                  onClick={handleReview}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105"
                >
                  <FiCode className="w-5 h-5" />
                  Analyze Code
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right: AI Chat */}
            <div>
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  AI Assistant
                </h2>
                <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                  Chat with AI to get instant help with your code
                </p>
              </div>

              <div className="h-[500px]">
                <ChatInterface
                  placeholder="Ask about your code..."
                  onSendMessage={async (message) => {
                    // Simulate AI response
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return `I analyzed your request: "${message}". Based on the code you've provided, I can help you with debugging, optimization, and best practices. What specific aspect would you like me to focus on?`;
                  }}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Testimonials Section */}
      <Section className="bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 -mx-4 sm:-mx-6 lg:-mx-8">
        <Container>
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-8 backdrop-blur-sm">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              Loved by{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Developers
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              See what developers are saying about CodePilot AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-900/70 backdrop-blur border border-slate-800 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center font-bold text-white`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm md:text-base">{testimonial.name}</h4>
                    <p className="text-gray-400 text-xs md:text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section>
        <Container maxWidth="4xl" className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Ready to Supercharge Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Development
            </span>
            ?
          </h2>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Start your free trial today and experience the future of AI-powered coding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() =>
                document
                  .getElementById("code-editor")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl md:rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 text-sm md:text-base"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/services")}
              className="px-6 md:px-8 py-3 md:py-4 bg-slate-800/80 backdrop-blur text-white font-semibold rounded-xl md:rounded-2xl border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 text-sm md:text-base"
            >
              View Pricing
            </button>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}