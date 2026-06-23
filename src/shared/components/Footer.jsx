import React from 'react';
import { LuTwitter, LuGithub, LuLinkedin, LuMail, LuMapPin, LuClock, LuArrowUp } from 'react-icons/lu';

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
    { name: 'Twitter', href: '#twitter', icon: <LuTwitter className="w-4.5 h-4.5" /> },
    { name: 'GitHub', href: '#github', icon: <LuGithub className="w-4.5 h-4.5" /> },
    { name: 'LinkedIn', href: '#linkedin', icon: <LuLinkedin className="w-4.5 h-4.5" /> },
    { name: 'Email', href: 'mailto:hello@codepilot.ai', icon: <LuMail className="w-4.5 h-4.5" /> },
  ];

  const contactInfo = [
    { icon: <LuMail className="w-4 h-4" />, text: 'hello@codepilot.ai' },
    { icon: <LuMapPin className="w-4 h-4" />, text: 'San Francisco, CA' },
    { icon: <LuClock className="w-4 h-4" />, text: '24/7 Support' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#020617] border-t border-slate-850/80 text-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              CodePilot AI
            </h3>
            <p className="text-slate-400 text-sm mb-6 max-w-sm leading-relaxed">
              Transform your coding experience with AI-powered suggestions, real-time analysis, and intelligent refactoring.
            </p>
            <div className="space-y-3 mb-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-3 text-slate-400 text-xs font-semibold">
                  <span className="text-indigo-400">{info.icon}</span>
                  <span>{info.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 rounded-xl bg-slate-950/65 border border-slate-800 flex items-center justify-center text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400 transition-all duration-200 hover:scale-105"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white text-xs font-semibold transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white text-xs font-semibold transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white text-xs font-semibold transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-850/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs font-semibold">
            © {currentYear} CodePilot AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-400 font-bold uppercase tracking-wider">
              v2.0.0
            </span>
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-xl bg-slate-950/65 border border-slate-800 flex items-center justify-center text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400 transition-all duration-200 hover:scale-105"
              aria-label="Scroll to top"
            >
              <LuArrowUp className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
