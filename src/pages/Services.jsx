import React from 'react';
import PageLayout, { Section, Container, Hero } from '../components/PageLayout';

const Services = () => {
  const services = [
    {
      icon: '💻',
      title: 'Code Completion',
      description: 'Intelligent code suggestions based on context and best practices. Write code faster with AI-powered autocompletion that understands your intent.',
      gradient: 'from-blue-500 to-purple-500',
    },
    {
      icon: '🔍',
      title: 'Error Detection',
      description: 'Real-time error identification and suggested fixes. Catch bugs before they reach production with intelligent analysis.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: '🔄',
      title: 'Code Refactoring',
      description: 'Automated suggestions to improve code structure and readability. Transform messy code into clean, maintainable solutions.',
      gradient: 'from-pink-500 to-red-500',
    },
    {
      icon: '📝',
      title: 'Documentation',
      description: 'Auto-generated documentation and comments for your code. Keep your projects well-documented with minimal effort.',
      gradient: 'from-red-500 to-orange-500',
    },
    {
      icon: '🧪',
      title: 'Testing',
      description: 'AI-powered test generation and coverage analysis. Ensure code quality with comprehensive automated testing.',
      gradient: 'from-orange-500 to-yellow-500',
    },
    {
      icon: '⚡',
      title: 'Performance Optimization',
      description: 'Suggestions to improve code performance and efficiency. Optimize your applications with data-driven insights.',
      gradient: 'from-yellow-500 to-green-500',
    },
  ];

  const pricing = [
    {
      name: 'Starter',
      price: '$0',
      period: 'month',
      description: 'Perfect for individual developers',
      features: [
        'Basic code completion',
        'Error detection',
        '5 projects',
        'Community support',
        '1GB storage',
      ],
      cta: 'Get Started',
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'month',
      description: 'For professional developers',
      features: [
        'Advanced AI suggestions',
        'Code refactoring',
        'Unlimited projects',
        'Priority support',
        '10GB storage',
        'Team collaboration',
      ],
      highlighted: true,
      cta: 'Start Free Trial',
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'month',
      description: 'For teams and organizations',
      features: [
        'Custom AI models',
        'Advanced analytics',
        'Unlimited everything',
        'Dedicated support',
        'Unlimited storage',
        'SSO & security',
        'API access',
      ],
      cta: 'Contact Sales',
    },
    ];

  return (
    <PageLayout className="bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <Hero
        badge="Services"
        title="Powerful"
        gradientText="AI Services"
        subtitle="Comprehensive AI-powered development tools for modern software engineering. Our services are designed to streamline your workflow and boost productivity."
      />

      <Section>
        <Container className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Everything You Need to <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Build Faster</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            AI-powered tools designed for modern development workflows
          </p>
        </Container>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-slate-900/70 backdrop-blur border border-slate-800 p-6 md:p-8 rounded-2xl md:rounded-3xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 text-center"
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${service.gradient} rounded-xl md:rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{service.title}</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Container className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8 backdrop-blur-sm">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Simple, <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Transparent</span> Pricing
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees.
          </p>
        </Container>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {pricing.map((plan, index) => (
            <div
              key={index}
              className={`group bg-slate-900/70 backdrop-blur border rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center ${
                plan.highlighted
                  ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
                  : 'border-slate-800 hover:border-blue-500/30'
              }`}
            >
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-4 md:mb-6">
                <span className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{plan.price}</span>
                <span className="text-gray-400">/{plan.period}</span>
              </div>
              <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">{plan.description}</p>
              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8 text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300 text-sm md:text-base">
                    <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 px-4 md:px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm md:text-base ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white hover:shadow-lg hover:shadow-blue-500/25'
                    : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 hover:border-slate-600'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Container maxWidth="4xl" className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Ready to Supercharge Your <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Development</span>?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Start your free trial today and experience the future of AI-powered coding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl md:rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 text-sm md:text-base">
              Get Started Free
            </button>
            <button className="px-6 md:px-8 py-3 md:py-4 bg-slate-800/80 backdrop-blur text-white font-semibold rounded-xl md:rounded-2xl border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 text-sm md:text-base">
              View Documentation
            </button>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
};

export default Services;
