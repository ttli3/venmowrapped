'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Privacy() {
  const sections = [
    {
      title: 'About/Privacy',
      items: [
        {
          q: 'What is Venmo Wrapped?',
          a: 'Venmo Wrapped is an independent, fan-made visualization tool that creates a year-in-review story of your Venmo transactions. It analyzes your payment patterns and presents them in an engaging, shareable format.'
        },
        {
          q: 'How does it work?',
          a: 'You upload your Venmo CSV statement directly in your browser. Our tool processes this data locally on your device to generate personalized stories and insights. No data ever leaves your browser - all analysis happens right on your computer.'
        }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          q: 'Is my data safe?',
          a: 'Absolutely. Your privacy is our top priority. We process everything locally in your browser and never transmit your transaction data anywhere. The code is open source and you can verify this yourself.'
        },
        {
          q: 'What data do you collect?',
          a: 'We collect zero data. Your CSV file is processed entirely in your browser and we don\'t use any analytics or tracking tools. We don\'t even have a server to send data to.'
        },
        {
          q: 'Can others see my data?',
          a: 'No. Your data stays private unless you explicitly choose to share a story. When you share, we generate a static image of just that story - no transaction data is included.'
        },
      ]
    },
    {
      title: 'Legal',
      items: [
        {
          q: 'Is this an official Venmo product?',
          a: 'No. This is an independent, open-source project not affiliated with Venmo or PayPal. We use Venmo\'s public CSV export feature to help users visualize their own data.'
        },
        {
          q: 'How do I get my data?',
          a: 'You can download your statement as a CSV file from your Venmo account settings. Look for the "Download Statement" option and select your date range.'
        },
        {
          q: 'Trademarks',
          a: 'Venmo® is a registered trademark of PayPal, Inc. This tool is provided "as is" without warranty. All analysis is done locally in your browser at your own risk.'
        }
      ]
    }
  ];

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white pt-32 pb-20">
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
      <div className="max-w-3xl mx-auto px-6">
        <Link 
          href="/"
          className="inline-flex items-center text-sm text-white/50 hover:text-white mb-12 relative z-10"
        >
          ← Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          {sections.map((section, i) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{section.title}</h2>
              <div className="space-y-8">
                {section.items.map((item, j) => (
                  <motion.div
                    key={item.q}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (i + j) }}
                    className="group"
                  >
                    <h3 className="text-lg font-medium mb-2 text-white/90">
                      {item.q}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {item.a}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>
      </div>
    </main>
  );
}