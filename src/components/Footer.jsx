import React from 'react';
import { FiTwitter, FiGithub, FiLinkedin, FiMail, FiMapPin, FiClock, FiArrowUp } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Integrations', href: '#integrations' },
    { name: 'Changelog', href: '#changelog' },
    { name: 'Documentation', href: '#docs' },
  ];

  const companyLinks = [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '#blog' },
    { name: 'Careers', href: '#careers' },
    { name: 'Press', href: '#press' },
    { name: 'Contact', href: '/contact' },
  ];

  const legalLinks = [
    { name: 'Privacy', href: '#privacy' },
    { name: 'Terms', href: '#terms' },
    { name: 'Security', href: '#security' },
    { name: 'Cookies', href: '#cookies' },
  ];

  const socialLinks = [
    { name: 'Twitter', href: '#twitter', icon: <FiTwitter className="w-5 h-5" /> },
    { name: 'GitHub', href: '#github', icon: <FiGithub className="w-5 h-5" /> },
    { name: 'LinkedIn', href: '#linkedin', icon: <FiLinkedin className="w-5 h-5" /> },
    { name: 'Email', href: 'mailto:hello@codepilot.ai', icon: <FiMail className="w-5 h-5" /> },
  ];

  const contactInfo = [
    { icon: <FiMail className="w-4 h-4" />, text: 'hello@codepilot.ai' },
    { icon: <FiMapPin className="w-4 h-4" />, text: 'San Francisco, CA' },
    { icon: <FiClock className="w-4 h-4" />, text: '24/7 Support' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              CodePilot AI
            </h3>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
              Transform your coding experience with AI-powered suggestions, real-time analysis, and intelligent refactoring.
            </p>
            <div className="space-y-3 mb-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-400 text-sm">
                  <span className="text-blue-400">{info.icon}</span>
                  <span>{info.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-200 hover:scale-110"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} CodePilot AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-gray-400">
              v2.0.0
            </span>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-200 hover:scale-110"
              aria-label="Scroll to top"
            >
              <FiArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
