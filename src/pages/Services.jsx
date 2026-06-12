import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageLayout, { Container, Section } from '../layouts/PageLayout';
import { FiCheck, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Services() {
  const [annualBilling, setAnnualBilling] = useState(false);

  const tiers = [
    {
      name: 'Developer Free',
      description: 'Perfect for local development testing and student projects.',
      priceMonthly: 0,
      priceAnnual: 0,
      features: [
        'Standard AI Code Review',
        'Basic Chat Assistant features',
        'Fallback analysis tools',
        'Up to 10 reviews per day',
        'Community Forum Support'
      ],
      ctaText: 'Current Plan',
      isCurrent: true,
      popular: false,
      gradient: 'from-blue-500/5 to-indigo-500/10 border-slate-800'
    },
    {
      name: 'Developer Pro',
      description: 'Supercharge your daily coding workflow with advanced SaaS AI.',
      priceMonthly: 29,
      priceAnnual: 23,
      features: [
        'Deep Security & XSS Audits',
        'Premium gpt-4o-mini & custom models',
        'Unlimited review history logs',
        'Interactive Monaco Editor interface',
        'Prioritized response times',
        'Email Support'
      ],
      ctaText: 'Upgrade to Pro',
      isCurrent: false,
      popular: true,
      gradient: 'from-purple-500/10 via-indigo-500/10 to-pink-500/10 border-indigo-500/30 shadow-indigo-500/5 shadow-xl'
    },
    {
      name: 'Team Enterprise',
      description: 'Ideal for small agencies, teams, and collaborative environments.',
      priceMonthly: 79,
      priceAnnual: 63,
      features: [
        'Collaborative Team Dashboard',
        'Dedicated server processing context',
        'Inject custom system prompts',
        'Custom API key endpoints',
        'SLA Support Response in < 2 hours',
        '24/7 Phone & Slack Support'
      ],
      ctaText: 'Contact Sales',
      isCurrent: false,
      popular: false,
      gradient: 'from-pink-500/5 to-rose-500/10 border-slate-800'
    }
  ];

  const handlePurchase = (tierName) => {
    if (tierName === 'Developer Free') return;
    toast.success(`Redirecting to Stripe sandbox for ${tierName}...`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <PageLayout className="bg-[#0B1120] text-slate-100 min-h-[calc(100vh-4rem)] pb-12 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <Section className="text-center py-12 relative z-10">
        <Container maxWidth="6xl">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-6 backdrop-blur-sm"
          >
            Plans & Pricing
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
          >
            Flexible Plans for{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Every Developer
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8"
          >
            Upgrade your CodePilot AI account to unlock security audits, persistent sessions, and custom code explanation tools.
          </motion.p>

          {/* Billing Switcher */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-12"
          >
            <span className={`text-sm font-semibold ${!annualBilling ? 'text-white' : 'text-slate-400'}`}>Monthly Billing</span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className="w-12 h-6 rounded-full bg-slate-900 border border-slate-800 relative p-1 transition-colors duration-250 focus:outline-none"
            >
              <div className={`w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-transform duration-200 transform ${annualBilling ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-semibold ${annualBilling ? 'text-white' : 'text-slate-400'} flex items-center gap-1.5`}>
              Annual Billing
              <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-450 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </motion.div>

          {/* Pricing Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto text-left"
          >
            {tiers.map((tier, index) => (
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -6, borderColor: tier.popular ? "rgba(139, 92, 246, 0.4)" : "rgba(255, 255, 255, 0.1)" }}
                key={index}
                className={`bg-[#111827]/60 border rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 relative ${tier.gradient}`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-extrabold uppercase px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <FiStar className="fill-white" /> Recommended Plan
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">{tier.description}</p>

                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="text-4xl md:text-5xl font-extrabold text-white">
                      ${annualBilling ? tier.priceAnnual : tier.priceMonthly}
                    </span>
                    <span className="text-sm text-slate-500 font-medium">/month</span>
                  </div>

                  <hr className="border-slate-850 mb-6" />

                  <ul className="space-y-3.5 mb-8">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <FiCheck className="text-emerald-450 flex-shrink-0 mt-0.5 w-4 h-4" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: tier.isCurrent ? 1 : 1.02 }}
                  whileTap={{ scale: tier.isCurrent ? 1 : 0.98 }}
                  onClick={() => handlePurchase(tier.name)}
                  className={`w-full py-3.5 font-bold rounded-xl text-center text-sm transition-all duration-200 ${
                    tier.isCurrent
                      ? 'bg-slate-800/80 text-slate-500 cursor-default border border-slate-700/50'
                      : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg'
                  }`}
                >
                  {tier.ctaText}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>
    </PageLayout>
  );
}
