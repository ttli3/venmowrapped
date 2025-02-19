'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const formatMoney = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const generateStories = (insights, storyUrl, isLoading, isSharing, setIsSharing) => {
  if (!insights) {
    console.error('No insights provided');
    return [];
  }
  const moneyPingpong = insights.money_pingpong?.[0] ?? null;
  const debtCycle = insights.eternal_debt_cycles?.[0] ?? null;

  // Validate required data
  if (!insights.spending_overview.total_spent || !insights.spending_overview.total_transactions) {
    console.error('Missing required insights data');
    return [];
  }

  const introSlides = [
    {
      title: "Your 2024 Venmo Wrapped is Here!",
      content: (
        <motion.div 
          className="h-full flex flex-col justify-center items-center text-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 animate-gradient" />
          </motion.div>

          <motion.div 
            className="relative z-10 p-8 backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 shadow-2xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <motion.div 
              className="text-8xl mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
              transition={{ 
                scale: { duration: 0.5 },
                rotate: { delay: 0.5, duration: 1.5, ease: "easeInOut" }
              }}
            >
              💸
            </motion.div>

            <motion.h1 
              className="text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              2024 Wrapped
            </motion.h1>

            <motion.p 
              className="text-xl text-white/90 font-light mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Your year of transactions, visualized
            </motion.p>

            {storyUrl && (
              <motion.div
                className="mt-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      ),
      color: "bg-[#0D1117]"
    },
    {
      title: "We Crunched the Numbers...",
      content: (
        <motion.div 
          className="h-full flex flex-col justify-center items-center text-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-teal-500/30 to-cyan-500/30 animate-gradient" />
          </motion.div>

          <motion.div 
            className="relative z-10 p-12 backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 shadow-2xl max-w-3xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <div className="relative mb-12">
              <motion.div 
                className="flex justify-center space-x-6"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {['💳', '💸', '💵'].map((emoji, i) => (
                  <motion.div
                    key={i}
                    className="text-5xl relative"
                    animate={{ 
                      y: [0, -15, 0],
                      rotate: [-8, 8, -8]
                    }}
                    transition={{ 
                      duration: 3,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <motion.div
                      className="absolute -inset-4 bg-white/10 rounded-full blur-md"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    {emoji}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div 
              className="space-y-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.p 
                className="text-3xl font-medium text-white/90"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                We analyzed
              </motion.p>

              <div className="relative py-6">
                <motion.div 
                  className="text-8xl font-black tracking-tight"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: 1,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                    {insights.spending_overview.total_transactions.toLocaleString()}
                  </span>
                </motion.div>

                <motion.div
                  className="absolute -inset-8 bg-emerald-500/20 rounded-full -z-10 blur-2xl"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                />
              </div>

              <motion.div
                className="flex items-center justify-center space-x-3 text-2xl font-light text-white/90"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <p>transactions</p>
                <motion.span
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 15, 0]
                  }}
                  transition={{ 
                    duration: 0.8,
                    delay: 1.6,
                    repeat: 2,
                    repeatType: "reverse"
                  }}
                >
                  👀
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
      color: "bg-[#0D1117]"
    },
    {
      title: "Your Venmo Story, Unlocked",
      content: (
        <motion.div 
          className="h-full flex flex-col justify-center items-center text-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-rose-500/30 animate-gradient" />
          </motion.div>

          <motion.div 
            className="relative z-10 p-12 backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 shadow-2xl max-w-2xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <motion.h2 
              className="text-5xl font-black mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your Story Awaits
            </motion.h2>

            <motion.div 
              className="grid gap-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { text: "Your biggest splurges", emoji: "💸", delay: 0 },
                { text: "Your Venmo BFF", emoji: "🥰", delay: 0.1 },
                { text: "Your late-night habits", emoji: "🌙", delay: 0.2 },
                { text: "And more surprises", emoji: "✨", delay: 0.3 }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative p-4 backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 flex items-center justify-start space-x-4 group hover:bg-white/10 transition-colors"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + item.delay }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl text-2xl"
                    whileHover={{ 
                      rotate: [0, -10, 10, -10, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    {item.emoji}
                  </motion.div>
                  <p className="text-xl font-medium text-white/90 text-left group-hover:text-white transition-colors">
                    {item.text}
                  </p>
                  <motion.div 
                    className="absolute right-4 text-white/40 group-hover:text-white/60 transition-colors"
                    whileHover={{ scale: 1.2 }}
                  >
                    →
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      ),
      color: "bg-[#0D1117]"
    }
  ];

  const FloatingEmoji = ({ emoji, delay = 0, x = 0, y = 0 }) => (
    <motion.div
      className="absolute text-3xl pointer-events-none select-none opacity-40"
      initial={{ opacity: 0, x, y }}
      animate={{
        opacity: [0, 1, 0],
        y: y - 100,
        x: x + (Math.random() * 50 - 25)
      }}
      transition={{
        duration: 2,
        delay,
        ease: "easeOut"
      }}
    >
      {emoji}
    </motion.div>
  );

  const buildUpSlide = (text, emoji, color) => ({
    title: " ",
    content: (
      <motion.div 
        className="relative h-full flex flex-col justify-center items-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-8xl opacity-10"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 0.5 }}
        >
          {emoji}
        </motion.div>
        <motion.p
          className="text-4xl font-bold text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {text}
        </motion.p>
      </motion.div>
    ),
    color: color
  });

  return [...introSlides,
    {
      title: "Where Did Your Money Go?!",
      content: (
        <motion.div 
          className="h-full flex flex-col justify-center items-center text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <motion.div 
              className="text-8xl mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3 
              }}
            >
              💰
            </motion.div>

            <motion.div 
              className="space-y-6"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-white/90">
                Let's break it down—category by category
              </h2>
            </motion.div>

            {/* Floating coins animation */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                initial={{ 
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                  opacity: 0
                }}
                animate={{
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.5],
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                💲
              </motion.div>
            ))}
          </div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-green-900 via-slate-900 to-black"
    },
    {
      title: "Your Money by Category",
      content: (
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Category icons floating */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              initial={{ 
                x: Math.random() * 800 - 400,
                y: Math.random() * 800 - 400,
                opacity: 0
              }}
              animate={{
                x: Math.random() * 800 - 400,
                y: Math.random() * 800 - 400,
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
                rotate: Math.random() * 360
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {["🍜", "🍺", "🏠", "🚗", "🛍️", "💊", "✈️", "🎮"][i]}
            </motion.div>
          ))}

          <motion.div 
            className="space-y-8 p-8 backdrop-blur-sm bg-black/30 rounded-2xl border border-white/10 shadow-xl relative z-10 max-w-xl w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div className="space-y-6">
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* Bar chart */}
                <div className="space-y-4">
                  {Object.entries(insights.transaction_categories.category_breakdown as Record<string, { total: number; count: number; percentage: number }>)
                    .filter(([category]) => category !== 'incoming')
                    .sort((a, b) => b[1].total - a[1].total)
                    .slice(0, 4)
                    .map(([category, data], index) => {
                      const maxTotal = Math.max(...Object.values(insights.transaction_categories.category_breakdown as Record<string, { total: number; count: number; percentage: number }>)
                        .map(d => d.total));
                      const width = `${(data.total / maxTotal) * 100}%`;
                      
                      return (
                        <motion.div
                          key={category}
                          className="space-y-2"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <div className="flex justify-between items-baseline">
                            <p className="text-lg font-medium capitalize">{category}</p>
                            <p className="text-lg font-bold text-indigo-300">
                              {formatMoney(data.total)}
                            </p>
                          </div>
                          <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-indigo-500/70 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width }}
                              transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-white/50">
                            <span>{data.count} payments</span>
                            <span>{data.percentage.toFixed(1)}%</span>
                          </div>
                        </motion.div>
                      );
                    })
                  }
                </div>

                {/* Stats */}
                <motion.div 
                  className="grid grid-cols-2 gap-4 mt-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                    <p className="text-sm text-white/75 mb-1">Most frequent</p>
                    <p className="text-xl font-bold capitalize">
                      {insights.transaction_categories.most_frequent_category.name}
                    </p>
                    <p className="text-sm text-white/50">
                      {insights.transaction_categories.most_frequent_category.count} times
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                    <p className="text-sm text-white/75 mb-1">Biggest splurge</p>
                    <p className="text-xl font-bold text-indigo-300">
                      {formatMoney(insights.transaction_categories.biggest_splurge.amount)}
                    </p>
                    <p className="text-sm text-white/50 truncate">
                      {insights.transaction_categories.biggest_splurge.note}
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.p 
                className="text-lg text-white/75 italic mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Living your best life, I see 👀
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-indigo-900 via-slate-900 to-black"
    },
    {
      title: "Holy Sh*t, You Spent How Much?! 💸",
      content: (
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Flying money background */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-30"
              initial={{ 
                x: -100 - Math.random() * 100,
                y: 100 + Math.random() * 200,
                opacity: 0
              }}
              animate={{
                y: -100 - Math.random() * 100,
                opacity: [0, 1, 1, 0],
                rotate: 180
              }}
              transition={{
                duration: 4,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {["💸", "💵", "💰"][Math.floor(Math.random() * 3)]}
            </motion.div>
          ))}

          <motion.div 
            className="space-y-8 p-8 backdrop-blur-sm bg-black/30 rounded-2xl border border-white/10 shadow-xl relative z-10"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.p 
              className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-green-300 to-yellow-300 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {formatMoney(insights.spending_overview.total_spent)}
            </motion.p>

            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-2xl font-medium text-white/90">
                went flying out of your wallet in 2024
              </p>

              <div className="pt-6 border-t border-white/10 space-y-3">
                <motion.p
                  className="text-3xl font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="text-green-300">{formatMoney(insights.spending_overview.total_received)}</span>
                  <span className="text-white/75"> came crawling back</span>
                </motion.p>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <p className="text-lg text-white/75">Net Balance</p>
                  <p className={`text-2xl font-bold ${insights.spending_overview.net_balance >= 0 ? 'text-green-300' : 'text-red-400'}`}>
                    {formatMoney(insights.spending_overview.net_balance)}
                  </p>
                  <p className="text-sm text-white/75 italic">
                    {insights.spending_overview.net_balance >= 0 
                      ? '🎉 Look at you, making money moves!' 
                      : '😅 Time to collect those IOUs...'}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-violet-900 via-slate-900 to-black"
    },
    {
      title: "When You Lost Your Damn Mind 🤯",
      content: (
        <motion.div 
          className="h-full flex flex-col justify-center items-center text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative space-y-8 max-w-2xl mx-auto">
            <motion.div 
              className="text-8xl"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
            >
              🗓️
            </motion.div>

            <motion.div 
              className="space-y-6"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-3xl font-bold text-white/90">
                In {monthNames[insights.spending_overview.most_expensive_month - 1]}
              </p>
              <p className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-300">
                {formatMoney(insights.spending_overview.most_expensive_month_amount)}
              </p>
              <motion.p 
                className="text-2xl text-white/75 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                What were you thinking?! 😱
              </motion.p>
            </motion.div>

            {/* Calendar animation in background */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl opacity-20"
                initial={{ 
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                  opacity: 0
                }}
                animate={{
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                  opacity: [0, 0.2, 0],
                  scale: [0.5, 1.2, 0.5],
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                📅
              </motion.div>
            ))}
          </div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-red-900 via-slate-900 to-black"
    },
    {
      title: "Biggest Splurge Alert! 🔥",
      content: (
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Fire effect */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{ 
                x: -100 + Math.random() * 800,
                y: 800,
                opacity: 0
              }}
              animate={{
                y: -200,
                opacity: [0, 1, 1, 0],
                rotate: 360
              }}
              transition={{
                duration: 2 + Math.random() * 1,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              🔥
            </motion.div>
          ))}

          <motion.div 
            className="space-y-8 p-8 backdrop-blur-sm bg-black/30 rounded-2xl border border-white/10 shadow-xl relative z-10 max-w-xl w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div className="space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  rotate: 360,
                  scale: 1
                }}
                transition={{ 
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 0.5,
                    ease: "easeOut"
                  }
                }}
                className="text-6xl mb-6"
              >
                🔥
              </motion.div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.p
                  className="text-xl font-medium text-white/90"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Your biggest splurge was the
                </motion.p>

                <motion.p 
                  className="text-5xl font-black bg-gradient-to-r from-orange-400 to-red-300 bg-clip-text text-transparent tracking-tight"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {formatMoney(insights.transaction_categories.biggest_splurge.amount)}
                </motion.p>

                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <p className="text-xl font-medium text-white/75">that went straight to</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-300 via-pink-300 to-red-300 bg-clip-text text-transparent">
                    {insights.transaction_categories.biggest_splurge.to}
                  </p>
                </motion.div>

                <motion.div
                  className="mt-6 relative"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <div className="absolute -left-2 -top-2 text-4xl">❝</div>
                  <div className="absolute -right-2 -bottom-2 text-4xl rotate-180">❝</div>
                  <p className="text-xl italic text-white/90 bg-black/40 p-6 rounded-xl border border-white/10">
                    {insights.transaction_categories.biggest_splurge.note}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-red-900 via-slate-900 to-black"
    },

    {
      title: "Now for the Money Circle 🍿",
      content: (
        <motion.div 
          className="h-full flex flex-col justify-center items-center text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative space-y-8 max-w-2xl mx-auto">
            <motion.div 
              className="text-8xl"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
            >
              🍿
            </motion.div>

            <motion.div 
              className="space-y-6"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-3xl font-bold text-white/90">
                From your Venmo soulmate to your sugar daddy/mommy,
              </p>
              <p className="text-2xl text-white/75">
                let's meet your money circle 💫
              </p>
            </motion.div>

            {/* Floating emojis */}
            {['👥', '💌', '💘', '🥰'].map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                initial={{ 
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                  opacity: 0
                }}
                animate={{
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.5],
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-purple-900 via-slate-900 to-black"
    },
    {
      title: "Your Social Network 🌐",
      content: (
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Network lines effect */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"
              style={{
                width: '100%',
                transform: `rotate(${i * 24}deg)`,
                top: '50%'
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}

          <motion.div 
            className="space-y-8 p-8 backdrop-blur-sm bg-black/30 rounded-2xl border border-white/10 shadow-xl relative z-10 max-w-xl w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div className="space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 15, -15, 0]
                }}
                transition={{ 
                  duration: 1,
                  delay: 0.3
                }}
                className="text-6xl mb-6"
              >
                🌐
              </motion.div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.p
                  className="text-xl font-medium text-white/90"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Your Venmo Social Score
                </motion.p>

                <motion.p 
                  className="text-6xl font-black bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent tracking-tight"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {insights.social_insights.social_score * 100}/100
                </motion.p>

                <motion.div 
                  className="grid grid-cols-2 gap-4 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 p-4 rounded-xl border border-white/10">
                    <p className="text-3xl font-bold text-teal-300">{insights.social_insights.total_unique_people}</p>
                    <p className="text-sm text-white/75 mt-1">Connections</p>
                  </div>
                  <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 p-4 rounded-xl border border-white/10">
                    <p className="text-3xl font-bold text-teal-300">{insights.social_insights.payment_network_size}</p>
                    <p className="text-sm text-white/75 mt-1">Active Friends</p>
                  </div>
                </motion.div>

                <motion.p 
                  className="text-lg text-white/75 italic mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  {insights.social_insights.most_active_month} was your most social month!
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-teal-900 via-slate-900 to-black"
    },

    {
      title: "Your Venmo Soulmate 💞",
      content: (
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Floating hearts */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{ 
                x: Math.random() * 800 - 400,
                y: Math.random() * 800 - 400,
                scale: 0,
                opacity: 0
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: Math.random() * 360
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {["💕", "💖", "💗"][Math.floor(Math.random() * 3)]}
            </motion.div>
          ))}

          <motion.div 
            className="space-y-8 p-8 backdrop-blur-sm bg-black/30 rounded-2xl border border-white/10 shadow-xl relative z-10 max-w-xl w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div className="space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.3
                }}
                className="text-6xl mb-6"
              >
                💞
              </motion.div>

              <motion.p 
                className="text-5xl font-black bg-gradient-to-r from-pink-300 via-red-300 to-pink-300 bg-clip-text text-transparent tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {insights.people_insights.venmo_soulmate.name}
              </motion.p>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.p
                  className="text-xl font-medium text-white/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  You exchanged
                </motion.p>

                <motion.p 
                  className="text-4xl font-bold text-pink-300"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [0.8, 1.2, 1],
                    opacity: 1
                  }}
                  transition={{ 
                    duration: 0.8,
                    delay: 1.1
                  }}
                >
                  {formatMoney(insights.people_insights.venmo_soulmate.total_amount)}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <p className="text-xl text-white/75">
                    over {insights.people_insights.venmo_soulmate.count} payments
                  </p>
                </motion.div>

                <motion.p 
                  className="text-2xl text-white/75 italic mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  Relationship goals! 😍
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-pink-900 via-slate-900 to-black"
    },
    {
      title: "Your Sugar Daddy/Mommy",
      content: (
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Money shower effect */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{ 
                x: Math.random() * 800 - 400,
                y: -100,
                opacity: 0
              }}
              animate={{
                y: 800,
                opacity: [0, 1, 1, 0],
                rotate: Math.random() * 360
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {["💰", "💸", "💵"][Math.floor(Math.random() * 3)]}
            </motion.div>
          ))}

          <motion.div 
            className="space-y-8 p-8 backdrop-blur-sm bg-black/30 rounded-2xl border border-white/10 shadow-xl relative z-10 max-w-xl w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div className="space-y-6 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3
                }}
                className="text-6xl mb-6"
              >
                💰
              </motion.div>

              <motion.p 
                className="text-5xl font-black bg-gradient-to-r from-green-300 via-emerald-300 to-green-300 bg-clip-text text-transparent tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {insights.people_insights.most_generous_friend.name}
              </motion.p>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.p
                  className="text-xl font-medium text-white/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  Blessed you with
                </motion.p>

                <motion.p 
                  className="text-4xl font-bold text-green-300"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [0.8, 1.2, 1],
                    opacity: 1
                  }}
                  transition={{ delay: 1.1 }}
                >
                  {formatMoney(insights.people_insights.most_generous_friend.amount)}
                </motion.p>

                <motion.div
                  className="flex items-center justify-center mt-4 space-x-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                >
                  <motion.div 
                    className="h-0.5 w-12 bg-gradient-to-r from-transparent via-green-300/50 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.5 }}
                  />
                  <p className="text-lg text-white/75">
                    the {insights.people_insights.most_generous_friend.count} times they came through
                  </p>
                  <motion.div 
                    className="h-0.5 w-12 bg-gradient-to-r from-transparent via-green-300/50 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.5 }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-emerald-900 via-slate-900 to-black"
    },
    {
      title: "Money O'Clock!",
      content: (
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Clock hands animation */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const radius = 150;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <motion.div
                key={i}
                className="absolute text-sm text-white/30"
                initial={{ 
                  x: 0,
                  y: 0,
                  opacity: 0
                }}
                animate={{
                  x,
                  y,
                  opacity: 1,
                }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                {(i === 0 ? 12 : i).toString().padStart(2, '0')}
              </motion.div>
            );
          })}

          <motion.div 
            className="space-y-8 p-8 backdrop-blur-sm bg-black/30 rounded-2xl border border-white/10 shadow-xl relative z-10 max-w-xl w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div className="space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  rotate: 360,
                  scale: 1
                }}
                transition={{ 
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 0.5,
                    ease: "easeOut"
                  }
                }}
                className="text-6xl mb-6"
              >
                ⏰
              </motion.div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.p
                  className="text-xl font-medium text-white/90"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  You love throwing money around on
                </motion.p>

                <motion.p 
                  className="text-5xl font-black bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-300 bg-clip-text text-transparent tracking-tight"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {insights.time_insights.most_active_day.day}s
                </motion.p>
              </motion.div>

              <motion.div 
                className="pt-6 border-t border-white/10 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <motion.p 
                  className="text-2xl font-bold text-blue-300"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                </motion.p>

                <motion.div
                  className="h-2 bg-gradient-to-r from-blue-500/20 via-blue-300/40 to-blue-500/20 rounded-full"
                  style={{
                    width: `${Math.round(insights.time_insights.weekend_vs_weekday.weekend_percentage)}%`
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.7, duration: 1 }}
                />
                <p className="text-lg text-white/75 mt-2">
                  {Math.round(insights.time_insights.weekend_vs_weekday.weekend_percentage)}% weekend warrior
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-blue-900 via-slate-900 to-black"
    },
    {
      title: "Your Emotional Support Emoji",
      content: (
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Emoji rain */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{ 
                x: Math.random() * 800 - 400,
                y: -100,
                rotate: Math.random() * 360,
                opacity: 0
              }}
              animate={{
                y: 800,
                rotate: Math.random() * 360,
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {insights.fun_insights.most_used_emoji.emoji}
            </motion.div>
          ))}

          <motion.div 
            className="space-y-8 p-8 backdrop-blur-sm bg-black/30 rounded-2xl border border-white/10 shadow-xl relative z-10 max-w-xl w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div className="space-y-6 text-center">
              <motion.p
                className="text-8xl"
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  y: [0, -20, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                {insights.fun_insights.most_used_emoji.emoji}
              </motion.p>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.p
                  className="text-xl font-medium text-white/90"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  You're obsessed with this one
                </motion.p>

                <motion.p 
                  className="text-4xl font-bold text-yellow-300"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [0.8, 1.2, 1],
                    opacity: 1
                  }}
                  transition={{ 
                    duration: 0.8,
                    delay: 0.9
                  }}
                >
                  {insights.fun_insights.most_used_emoji.count}
                </motion.p>

                <motion.p
                  className="text-2xl text-yellow-300/75"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  times
                </motion.p>

                <motion.p 
                  className="text-lg text-white/75 italic mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  Your friends want you to switch it up! 
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-yellow-900 via-slate-900 to-black"
    },
    buildUpSlide("Time for some fun facts!", "✨", "bg-gradient-to-br from-yellow-900 via-slate-900 to-black"),
    {
      title: "The Night Owl Award",
      content: (
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Stars background */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sm"
              initial={{ 
                x: Math.random() * 800 - 400,
                y: Math.random() * 800 - 400,
                scale: 0,
                opacity: 0
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ✨
            </motion.div>
          ))}

          <motion.div 
            className="space-y-8 p-8 backdrop-blur-sm bg-black/30 rounded-2xl border border-white/10 shadow-xl relative z-10 max-w-xl w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div className="space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                transition={{ 
                  duration: 1,
                  delay: 0.3
                }}
                className="text-6xl mb-6"
              >
                🦉
              </motion.div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.p
                  className="text-xl font-medium text-white/90"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  You made
                </motion.p>

                <motion.p 
                  className="text-5xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent tracking-tight"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {insights.time_insights.late_night.count}
                </motion.p>

                <motion.p 
                  className="text-xl text-white/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  late night payments
                </motion.p>

                <motion.p 
                  className="text-3xl font-bold text-purple-300 mt-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  {formatMoney(insights.time_insights.late_night.total_amount)}
                </motion.p>

                <motion.p 
                  className="text-lg text-white/75 italic mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  spent between 10 PM and 4 AM 😬. WYD at these hours!?
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-purple-900 via-slate-900 to-black"
    },
    {
      title: "Your Note Game",
      content: (
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="space-y-8 p-8 backdrop-blur-sm bg-black/30 rounded-2xl border border-white/10 shadow-xl relative z-10 max-w-xl w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div className="space-y-6">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xl font-medium text-white/90">Your favorite emoji combo</p>
                <p className="text-4xl font-bold">
                  {insights.fun_insights.favorite_emoji_combo.first}
                  {insights.fun_insights.favorite_emoji_combo.second}
                </p>
              </motion.div>

              <motion.div 
                className="pt-6 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-xl font-medium text-white/90 mb-4">Most repeated note</p>
                <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                  <p className="text-lg italic text-white/90">
                    "{insights.fun_insights.note_stats.most_repeated.note}"
                  </p>
                  <p className="text-sm text-white/75 mt-2">
                    {insights.fun_insights.note_stats.most_repeated.count} times
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="pt-6 border-t border-white/10 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-white/75">Emoji usage</span>
                  <span className="text-2xl font-bold text-yellow-300">
                    {Math.round(insights.fun_insights.note_stats.emoji_percentage)}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/75">Average payment</span>
                  <span className="text-2xl font-bold text-yellow-300">
                    {formatMoney(insights.spending_overview.avg_payment_size)}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-yellow-900 via-slate-900 to-black"
    },
    moneyPingpong && {
      title: "The Money Boomerang Award",
      content: (
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Ping pong effect */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{ 
                x: i % 2 === 0 ? -200 : 200,
                y: Math.random() * 400 - 200,
                opacity: 0
              }}
              animate={{
                x: i % 2 === 0 ? 200 : -200,
                opacity: [0, 1, 1, 0],
                rotate: i % 2 === 0 ? 360 : -360
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🏓
            </motion.div>
          ))}

          <motion.div 
            className="space-y-8 p-8 backdrop-blur-sm bg-black/30 rounded-2xl border border-white/10 shadow-xl relative z-10 max-w-xl w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div className="space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  rotate: 360,
                  scale: 1
                }}
                transition={{ 
                  rotate: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 0.5,
                    ease: "easeOut"
                  }
                }}
                className="text-6xl mb-6"
              >
                🏓
              </motion.div>

              <motion.p 
                className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {moneyPingpong.person}
              </motion.p>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.p
                  className="text-xl font-medium text-white/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  Y'all played hot potato with
                </motion.p>

                <motion.p 
                  className="text-4xl font-bold text-cyan-300"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [0.8, 1.2, 1],
                    opacity: 1
                  }}
                  transition={{ 
                    duration: 0.8,
                    delay: 1.1
                  }}
                >
                  {formatMoney(moneyPingpong.amount)}
                </motion.p>

                <motion.p 
                  className="text-lg text-white/75 italic mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                >
                  in just {moneyPingpong.time_diff} days 😱
                </motion.p>

                <motion.div 
                  className="space-y-2 bg-black/30 p-3 rounded-lg border border-white/10 mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  <motion.p 
                    className="text-sm italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.7 }}
                  >
                    &quot;{moneyPingpong.note1}&quot;
                  </motion.p>
                  <motion.p 
                    className="text-sm italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.9 }}
                  >
                    &quot;{moneyPingpong.note2}&quot;
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-cyan-900 via-slate-900 to-black"
    },
    {
      title: "",
      content: (
        <motion.div 
          className="h-full flex flex-col items-center text-center py-6 px-4 relative overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated background elements */}
          <motion.div 
            className="absolute inset-y-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          </motion.div>

          {/* Main content */}
          <motion.div 
            className="w-full space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-white">✨My 2024 Wrapped✨</h2>
              <p className="text-white/60 mt-1 text-lg">Find yours at venmowrapped.com :)</p>
            </div>

            <div id="share-content" className="grid grid-cols-2 gap-2 w-full max-w-md mx-auto">
              {/* Money Stats */}
              <motion.div 
                className="bg-gradient-to-br from-green-500/20 to-green-700/20 p-3 rounded-xl backdrop-blur-sm border border-green-500/30"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring" }}
              >
                <p className="text-lg font-bold text-white">Received 💰</p>
                <p className="text-sm font-bold text-green-300">{formatMoney(insights.spending_overview.total_received)}</p>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-red-500/20 to-red-700/20 p-3 rounded-xl backdrop-blur-sm border border-red-500/30"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring" }}
              >
                <p className="text-lg font-bold text-white">Spent 💳</p>
                <p className="text-sm font-bold text-red-300">{formatMoney(insights.spending_overview.total_spent)}</p>
              </motion.div>

              {/* Most Used Emoji */}
              <motion.div 
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-3 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring" }}
              >
                <p className="text-lg font-bold text-white">Fav Emoji</p>
                <p className="text-2xl mt-1">{insights.fun_insights.most_used_emoji.emoji}</p>
              </motion.div>

              {/* Most Active Time */}
              <motion.div 
                className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-3 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring" }}
              >
                <p className="text-lg font-bold text-white">Peak Day ⚡️</p>
                <p className="text-xs text-white/75">{insights.time_insights.most_active_day.day}</p>
              </motion.div>

              {/* Late Night */}
              <motion.div 
                className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-3 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring" }}
              >
                <p className="text-lg font-bold text-white">Late Night 🌙</p>
                <p className="text-xs text-white/75">{insights.time_insights.late_night.count} Transactions</p>
                <p className="text-sm font-bold text-purple-300 mt-1">{formatMoney(insights.time_insights.late_night.total_amount)}</p>
              </motion.div>

              {/* Weekend Activity */}
              <motion.div 
                className="bg-gradient-to-r from-blue-500/20 to-sky-500/20 p-3 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring" }}
              >
                <p className="text-lg font-bold text-white">Weekend 🎉</p>
                <p className="text-xs text-white/75">Percentage</p>
                <p className="text-sm font-bold text-sky-300 mt-1">{Math.round(insights.time_insights.weekend_vs_weekday.weekend_percentage)}%</p>
              </motion.div>

              {/* Biggest Splurge */}
              <motion.div 
                className="bg-gradient-to-r from-rose-500/20 to-pink-500/20 p-3 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring" }}
              >
                <p className="text-lg font-bold text-white">Biggest Txn 💸</p>
                <p className="text-xs text-white/75">{insights.transaction_categories.biggest_splurge.to}</p>
                <p className="text-sm font-bold text-rose-300 mt-1">{formatMoney(insights.transaction_categories.biggest_splurge.amount)}</p>
              </motion.div>

              {/* Venmo Bestie */}
              <motion.div 
                className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-3 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring" }}
              >
                <p className="text-lg font-bold text-white">Bestie 👯</p>
                <p className="text-xs text-white/75">{insights.people_insights.venmo_soulmate.name}</p>
                <p className="text-sm font-bold text-purple-300 mt-1">{insights.people_insights.venmo_soulmate.count}x</p>
              </motion.div>

              {/* Most Generous */}
              <motion.div 
                className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-3 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring" }}
              >
                <p className="text-lg font-bold text-white">Generous 🎁</p>
                <p className="text-xs text-white/75">{insights.people_insights.most_generous_friend.name}</p>
                <p className="text-sm font-bold text-emerald-300 mt-1">{formatMoney(insights.people_insights.most_generous_friend.amount)}</p>
              </motion.div>

              {/* Social Score */}
              <motion.div 
                className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 p-3 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring" }}
              >
                <p className="text-lg font-bold text-white">Social 🌟</p>
                <p className="text-xs text-white/75">{insights.social_insights.total_unique_people} Friends</p>
                <p className="text-sm font-bold text-amber-300 mt-1">{insights.social_insights.social_score * 100}/100</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Share section */}
          <motion.div
            className="w-full mt-4 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              data-share-button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                if (isSharing) return;
                
                try {
                  setIsSharing(true);
                  const element = document.getElementById('share-content');
                  if (!element) return;
                  
                  // Add temporary background for screenshot
                  const originalBg = element.style.background;
                  element.style.background = 'black';
                  element.style.padding = '20px';
                  element.style.borderRadius = '16px';
                  
                  const canvas = await html2canvas(element, {
                    backgroundColor: '#000000',
                    scale: 2,
                    logging: false,
                  });
                  
                  // Restore original styling
                  element.style.background = originalBg;
                  element.style.padding = '';
                  element.style.borderRadius = '';
                  
                  // Convert to blob
                  const blob = await new Promise<Blob>(resolve => {
                    canvas.toBlob(resolve, 'image/png', 1.0);
                  });
                  
                  if (!blob) throw new Error('Failed to create image');
                  
                  // Create object URL for sharing
                  const imageUrl = URL.createObjectURL(blob);
                  
                  try {
                    if (navigator.share) {
                      // Try sharing with URL first
                      try {
                        await navigator.share({
                          title: '2024 Venmo Wrapped ✨',
                          text: `Check out my Venmo Wrapped for 2024! ${insights.spending_overview.total_transactions} transactions this year!`,
                          url: imageUrl
                        });
                      } catch (shareError) {
                        // If URL sharing fails, download the image
                        const link = document.createElement('a');
                        link.href = imageUrl;
                        link.download = 'venmo-wrapped-2024.png';
                        link.click();
                        
                        // Then share just the text
                        await navigator.share({
                          title: '2024 Venmo Wrapped ✨',
                          text: `Check out my Venmo Wrapped for 2024! ${insights.spending_overview.total_transactions} transactions this year! Check yours → venmowrapped.com`
                        });
                      }
                    } else {
                      // Fallback to download only
                      const link = document.createElement('a');
                      link.href = imageUrl;
                      link.download = 'venmo-wrapped-2024.png';
                      link.click();
                    }
                  } finally {
                    // Clean up the URL after a delay
                    setTimeout(() => {
                      URL.revokeObjectURL(imageUrl);
                    }, 5000);
                  }
                } catch (error) {
                  if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                  }
                } finally {
                  setIsSharing(false);
                }
              }}
              className="absolute bottom-18 left-0 right-0 mx-auto w-fit px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold shadow-xl hover:shadow-2xl backdrop-blur-sm border border-white/10 z-50"
              disabled={isSharing}
            >
              <div className="flex items-center gap-2">
                {isSharing ? (
                  <motion.div
                    className="h-5 w-5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <svg className="animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2.5} />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </motion.div>
                ) : (
                  <span>Share Wrapped</span>
                )}
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      ),
      color: "bg-gradient-to-br from-blue-900 via-purple-900 to-black"
    }
  ].filter(Boolean);
};

export default function VenmoStories({ insights }) {
  const router = useRouter();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const initialUrl = `http://${window.location.hostname}:${window.location.port}/stories/loading`;
  const [storyUrl, setStoryUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [showStories, setShowStories] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const stories = useMemo(() => 
    generateStories(
      insights, 
      storyUrl, 
      isLoading, 
      isSharing,
      setIsSharing
    ), [insights, storyUrl, isLoading, isSharing]);

  useEffect(() => {
    if (stories.length > 0) {
      setShowStories(true);
    }
  }, [stories]);


  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    if (currentStoryIndex + newDirection >= 0 && currentStoryIndex + newDirection < stories.length) {
      setDirection(newDirection);
      setShowHint(false);
      setProgress(0);
      setCurrentStoryIndex(prev => prev + newDirection);
    }
  };

  // Progress state
  const [progress, setProgress] = useState(0);
  const progressInterval = 5000; // 5 seconds per story

  useEffect(() => {
    let startTime;
    let animationFrame;
    let transitioning = false;

    const updateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min((elapsed / progressInterval) * 100, 100);
      
      setProgress(progress);
      
      if (progress === 100 && currentStoryIndex < stories.length - 1 && !transitioning) {
        transitioning = true;
        // Wait for progress bar to finish before transitioning
        setTimeout(() => {
          setCurrentStoryIndex(i => i + 1);
          setDirection(1);
          setShowHint(false);
          startTime = performance.now();
          transitioning = false;
        }, 50);
      }
      
      if (!isPaused && !transitioning) {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    if (!isPaused) {
      startTime = performance.now();
      animationFrame = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [currentStoryIndex, isPaused, stories.length]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1
    })
  };

  return (

    <div className="fixed inset-0 bg-black">
      {/* Close button */}
      <div className="fixed top-4 right-4 z-50 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPaused(!isPaused)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors duration-300 border border-white/20 shadow-xl group"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isPaused ? 0 : 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {isPaused ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" stroke="currentColor" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9v6m4-6v6" stroke="currentColor" />
              )}
            </svg>
          </motion.div>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors duration-300 border border-white/20 shadow-xl group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </div>
      <div className="relative h-full max-w-md mx-auto overflow-y-auto">
        {/* Touch zones with hints */}
        <div 
          className="absolute inset-y-0 left-0 w-1/3 z-20"
          onPointerDown={() => {
            setIsPaused(true);
            paginate(-1);
          }}
          onPointerUp={() => setIsPaused(false)}>
          {showHint && (
            <motion.div 
              className="absolute left-4 top-1/2 -translate-y-1/2"
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: [-10, 0, -10], opacity: [0, 1, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <div className="text-white/40 text-4xl">←</div>
            </motion.div>
          )}
        </div>
        <div 
          className="absolute inset-y-0 right-0 w-1/3 z-20"
          onPointerDown={() => {
            setIsPaused(true);
            paginate(1);
          }}
          onPointerUp={() => setIsPaused(false)}>
          {showHint && (
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2"
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: [10, 0, 10], opacity: [0, 1, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <div className="text-white/40 text-4xl">→</div>
            </motion.div>
          )}
        </div>

        {/* Progress bars */}
        <div className="absolute top-2 left-4 right-4 z-30 flex gap-1">
          {stories.map((_, index) => (
            <div key={index} className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{
                  width: index === currentStoryIndex ? `${progress}%` : 
                         index < currentStoryIndex ? '100%' : '0%'
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          ))}
        </div>

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentStoryIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.3 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragStart={() => setIsPaused(true)}
            onDragEnd={(e, { offset, velocity }) => {
              setIsPaused(false);
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className={`absolute inset-0 ${stories[currentStoryIndex].color || 'bg-gradient-to-br from-blue-900 via-purple-900 to-black'}`}
          >
            {/* Story content */}
            <div id="share-content" className="w-full h-full p-8 flex flex-col items-center justify-center text-white text-center relative overflow-hidden">
              <motion.h2
                key={`title-${currentStoryIndex}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold mb-8"
              >
                {stories[currentStoryIndex].title}
              </motion.h2>

              {stories[currentStoryIndex].content}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
