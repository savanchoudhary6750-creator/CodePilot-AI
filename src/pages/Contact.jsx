import React, { useState } from 'react';
import PageLayout, { Section, Container, Hero } from '../layouts/PageLayout';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      value: 'hello@codepilot.ai',
      link: 'mailto:hello@codepilot.ai',
      gradient: 'from-blue-500 to-purple-500',
    },
    {
      icon: '📍',
      title: 'Location',
      value: 'San Francisco, CA',
      link: null,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: '🕐',
      title: 'Hours',
      value: 'Mon - Fri, 9am - 6pm PST',
      link: null,
      gradient: 'from-pink-500 to-red-500',
    },
  ];

  return (
    <PageLayout className="bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <Hero
        badge="Contact"
        title="Get in"
        gradientText="Touch"
        subtitle="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
      />

      <Section>
        <Container maxWidth="5xl">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8 backdrop-blur-sm">
              Contact Information
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              We'd love to hear from you. Reach out through any of these channels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-slate-900/70 backdrop-blur border border-slate-800 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 text-center"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${info.gradient} rounded-xl md:rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl mb-4 md:mb-6 mx-auto`}>
                  {info.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">{info.title}</h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-blue-400 hover:text-blue-300 transition-colors text-sm md:text-base"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-gray-400 text-sm md:text-base">{info.value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-200 placeholder-gray-500"
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-200 placeholder-gray-500"
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-200 placeholder-gray-500"
                  required
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-200 resize-none placeholder-gray-500"
                  required
                  placeholder="Tell us more about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl md:rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 text-sm md:text-base"
              >
                Send Message
              </button>
            </form>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
};

export default Contact;
