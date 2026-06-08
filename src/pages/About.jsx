import React from 'react';

import {
  FiTarget,
  FiEye,
  FiZap,
  FiUsers,
  FiTrendingUp,
  FiCode,
  FiClock,
  FiHeadphones,
  FiBriefcase,
  FiArrowRight
} from 'react-icons/fi';
import PageLayout, { Section, Container, Hero } from '../components/PageLayout';

const About = () => {

  const values = [
    {
      icon: <FiTarget className="w-7 h-7" />,
      title: 'Our Mission',
      description:
        'To empower developers with AI-driven tools that enhance productivity, code quality, and collaboration across teams of all sizes.',
      gradient: 'from-blue-500 to-purple-500',
    },
    {
      icon: <FiEye className="w-7 h-7" />,
      title: 'Our Vision',
      description:
        'A future where every developer has access to intelligent assistance that understands context and provides meaningful insights.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <FiZap className="w-7 h-7" />,
      title: 'Innovation First',
      description:
        "We push the boundaries of what's possible with AI, constantly exploring new ways to make development faster and more enjoyable.",
      gradient: 'from-pink-500 to-red-500',
    },
    {
      icon: <FiUsers className="w-7 h-7" />,
      title: 'Community Driven',
      description:
        'Built by developers, for developers. We listen to our community and evolve based on real needs and feedback.',
      gradient: 'from-red-500 to-orange-500',
    },
  ];

  const stats = [
    {
      value: '50K+',
      label: 'Active Developers',
      gradient: 'from-blue-400 to-purple-500',
      icon: <FiUsers className="w-6 h-6" />,
    },
    {
      value: '1M+',
      label: 'Lines of Code Analyzed',
      gradient: 'from-purple-400 to-pink-500',
      icon: <FiCode className="w-6 h-6" />,
    },
    {
      value: '99.9%',
      label: 'Uptime SLA',
      gradient: 'from-pink-400 to-red-500',
      icon: <FiClock className="w-6 h-6" />,
    },
    {
      value: '24/7',
      label: 'Support Available',
      gradient: 'from-red-400 to-orange-500',
      icon: <FiHeadphones className="w-6 h-6" />,
    },
  ];

  const team = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Co-Founder',
      avatar: 'AJ',
      quote: 'Building the future of development, one line of code at a time.',
      gradient: 'from-blue-500 to-purple-500',
    },
    {
      name: 'Sarah Chen',
      role: 'CTO & Co-Founder',
      avatar: 'SC',
      quote: 'AI should augment human creativity, not replace it.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Engineering',
      avatar: 'MR',
      quote: "Quality code is not an accident, it's a result of intelligent design.",
      gradient: 'from-pink-500 to-red-500',
    },
  ];

  return (
    <PageLayout className="bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <Hero
        badge="About Us"
        title="Building the"
        gradientText="Future of Development"
        subtitle="CodePilot AI is a cutting-edge development tool designed to revolutionize the way developers write, review, and maintain code."
        buttons={
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl font-semibold inline-flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105">
            <FiBriefcase className="w-5 h-5" />
            View Open Positions
            <FiArrowRight className="w-5 h-5" />
          </button>
        }
      />

      <Section>
        <Container className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-8 backdrop-blur-sm">
            Core Values
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            Our{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Core Values
            </span>
          </h2>
        </Container>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-slate-900/70 backdrop-blur border border-slate-800 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:-translate-y-1 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 text-center"
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${v.gradient} flex items-center justify-center rounded-xl md:rounded-2xl mb-4 md:mb-6 mx-auto`}
              >
                {v.icon}
              </div>

              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{v.title}</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 -mx-4 sm:-mx-6 lg:-mx-8">
        <Container className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Numbers That Matter
          </h2>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Our growth and impact in the developer community
          </p>
        </Container>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 text-center hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              <div className="flex justify-center mb-3">{s.icon}</div>

              <div
                className={`text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent mb-2`}
              >
                {s.value}
              </div>

              <div className="text-gray-400 text-xs sm:text-sm md:text-base">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Container className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Meet the Leadership
          </h2>
        </Container>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {team.map((t, i) => (
            <div
              key={i}
              className="bg-slate-900/70 backdrop-blur border border-slate-800 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 text-center"
            >
              <div
                className={`w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center font-bold text-lg md:text-xl`}
              >
                {t.avatar}
              </div>

              <p className="text-gray-400 italic mb-4 text-sm md:text-base">"{t.quote}"</p>

              <h4 className="font-bold text-base md:text-lg mb-1">{t.name}</h4>
              <p className="text-xs sm:text-sm text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="text-center">
        <button className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 rounded-2xl font-semibold inline-flex items-center gap-2 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105">
          <FiBriefcase className="w-5 h-5" />
          Join Us
          <FiArrowRight className="w-5 h-5" />
        </button>
      </Section>
    </PageLayout>
  );
};

export default About;