'use client';

import { useState } from 'react';
import Image from 'next/image';
import OnboardingModal from './components/OnboardingModal';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedInsights from './components/AnimatedInsights';
import OsSupportNotice from './components/OsSupportNotice';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black text-white">
      {/* Nav */}
      <header className="fixed w-full z-50 backdrop-blur-md bg-black/10">
        <nav className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8">
                <Image 
                  src="/venmo.png" 
                  alt="Venmo" 
                  width={28} 
                  height={20} 
                  priority 
                  className="object-contain" 
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Venmo Wrapped
              </span>
            </div>

            <div className="flex items-center space-x-6">

              <OsSupportNotice />
              <a 
                href="mailto:venmowrapped@gmail.com"
                className="text-white/70 hover:text-white transition-colors"
              >
                Contact
              </a>
              <Link 
                href="/privacy" 
                className="text-white/70 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <a 
                href="https://github.com/ttli3/venmowrapped" 
                target="_blank"
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.362.31.683.92.683 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.578.688.48C19.138 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <div className="pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <span className="inline-block text-blue-300 font-medium bg-blue-500/10 px-4 py-2 rounded-full border border-blue-400/20">
                ✨ Your 2024 Venmo Story
              </span>
              <h1 className="text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Unwrap Your Year in Payments
              </h1>
            </div>
            
            <p className="text-xl text-white/70 leading-relaxed max-w-xl">
              Discover your spending story through stunning visualizations. See who your Venmo soulmate is, relive your most memorable transactions, and uncover hidden patterns in your payment history.
            </p>

            <div className="flex items-center gap-6">
              <button
                className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:opacity-90 active:opacity-100"
                onClick={() => setIsModalOpen(true)}
              >
                Get Your Wrapped
              </button>
              <a
                href="/privacy"
                className="text-white/70 hover:text-white transition-colors font-medium flex items-center gap-2"
              >
                Learn more
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          <div
            className="relative h-[600px]"
          >
            <AnimatedInsights />
          </div>
        </div>
      </div>

      <OnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Features */}
      <div className="py-32 bg-gradient-to-b from-black to-blue-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold mb-6 text-white"
            >
              Your Venmo Story, <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Reimagined</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Discover patterns, relive memories, and understand your spending like never before
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-10"
          >
            {[
              {
                title: 'Privacy Guaranteed',
                description: 'Your data stays on your device. No servers, no tracking, just insights.',
                icon: '🔒',
                gradient: 'from-blue-500/20 to-blue-500/5'
              },
              {
                title: 'Beautiful Insights',
                description: 'Interactive charts and visualizations that bring your transactions to life.',
                icon: '✨',
                gradient: 'from-purple-500/20 to-purple-500/5'
              },
              {
                title: 'Share Your Story',
                description: 'Generate beautiful cards to share your year in Venmo with friends.',
                icon: '👥',
                gradient: 'from-pink-500/20 to-pink-500/5'
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`relative p-10 rounded-3xl bg-gradient-to-b ${feature.gradient} backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors duration-300 group`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-8 text-3xl group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="relative pb-32 bg-gradient-to-b from-blue-950 to-black">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="relative max-w-xl mx-auto text-center px-6"
        >
          <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ready to See Your Story?
          </h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-10 py-5 rounded-2xl text-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:scale-105 active:scale-100"
          >
            Get Your Venmo Wrapped
            <span className="ml-2 text-2xl">→</span>
          </button>
        </motion.div>
      </div>
    </main>
  );
}