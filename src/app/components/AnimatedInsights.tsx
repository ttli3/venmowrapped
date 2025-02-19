'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const templates = {
  spending: [
    "💸 {category} is your money pit - ${amount} this year",
    "🎯 You dropped ${amount} on {category} alone",
  ],
  time: [
    "⏰ {hour}:00 is your power hour - {count} transactions",
    "📅 {day} is your money moves day",
  ],
  people: [
    "🤝 You and {name} are in a ${amount} relationship",
    "💫 {name} is your Venmo soulmate - {count} transactions",
  ],
  categories: [
    "🍔 Your food budget went {percentage}% over last month",
    "🚗 Transportation or vacation? ${amount} on rides",
  ],
  habits: [
    "🎯 Your average transaction: ${amount}",
    "📊 You initiate {percentage}% of splits",
  ],
  emojis: [
    "😂 Your most used emoji is {emoji} ({count} times)",
    "❤️ Love emojis in {percentage}% of your payments",
  ],
  notes: [
    "📝 '{note}' - your most creative payment note",
    "🎨 Your notes are {sentiment} {percentage}% of the time",
  ],
  pingpong: [
    "🏓 ${amount} bounced between you and {person} {count} times",
    "🔄 You and {person} can't decide who owes who",
  ]
};

function generateInsights() {
  return [
    ...Array(6).fill(0).map(() => templates.spending[Math.floor(Math.random() * templates.spending.length)]
      .replace('{category}', ['food', 'entertainment', 'shopping', 'travel', 'drinks'][Math.floor(Math.random() * 5)])
      .replace('{amount}', (Math.random() * 1000 + 100).toFixed(2))),
    
    ...Array(6).fill(0).map(() => templates.time[Math.floor(Math.random() * templates.time.length)]
      .replace('{hour}', Math.floor(Math.random() * 24).toString().padStart(2, '0'))
      .replace('{count}', Math.floor(Math.random() * 50 + 10).toString())
      .replace('{day}', ['Monday', 'Friday', 'Saturday'][Math.floor(Math.random() * 3)])),
    
    ...Array(6).fill(0).map(() => templates.people[Math.floor(Math.random() * templates.people.length)]
      .replace('{name}', ['Alex', 'Sam', 'Jordan', 'Taylor'][Math.floor(Math.random() * 4)])
      .replace('{amount}', (Math.random() * 1500 + 200).toFixed(2))
      .replace('{count}', Math.floor(Math.random() * 40 + 5).toString())),
    
    ...Array(6).fill(0).map(() => templates.categories[Math.floor(Math.random() * templates.categories.length)]
      .replace('{percentage}', Math.floor(Math.random() * 50 + 10).toString())
      .replace('{amount}', (Math.random() * 1200 + 300).toFixed(2))),
    
    ...Array(6).fill(0).map(() => templates.habits[Math.floor(Math.random() * templates.habits.length)]
      .replace('{amount}', (Math.random() * 100 + 20).toFixed(2))
      .replace('{percentage}', Math.floor(Math.random() * 70 + 30).toString())),
    
    ...Array(4).fill(0).map(() => templates.emojis[Math.floor(Math.random() * templates.emojis.length)]
      .replace('{emoji}', ['😂', '🙏', '❤️', '🎉', '🔥'][Math.floor(Math.random() * 5)])
      .replace('{count}', Math.floor(Math.random() * 100 + 20).toString())
      .replace('{percentage}', Math.floor(Math.random() * 40 + 10).toString())),
    
    ...Array(4).fill(0).map(() => templates.notes[Math.floor(Math.random() * templates.notes.length)]
      .replace('{note}', ['rent + utilities + existential crisis', 'sorry for the chaos', 'best night ever?', 'i promise this is the last time'][Math.floor(Math.random() * 4)])
      .replace('{sentiment}', ['happy', 'chaotic', 'mysterious'][Math.floor(Math.random() * 3)])
      .replace('{percentage}', Math.floor(Math.random() * 60 + 40).toString())),
    
    ...Array(4).fill(0).map(() => templates.pingpong[Math.floor(Math.random() * templates.pingpong.length)]
      .replace('{amount}', (Math.random() * 500 + 50).toFixed(2))
      .replace('{person}', ['roomie', 'bestie', 'sibling'][Math.floor(Math.random() * 3)])
      .replace('{count}', Math.floor(Math.random() * 12 + 3).toString()))
  ];
}

const InsightBubble = ({ text, index }: { text: string; index: number }) => {
  const randomAngle = Math.random() * 360;
  const distance = 200 + Math.random() * 110;
  const duration = 4.4 + Math.random() * 0.8;
  const size = 0.9 + Math.random() * 0.2;

  return (
    <motion.span
      initial={{ 
        opacity: 0,
        scale: 0,
        x: 0,
        y: 0
      }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        scale: [0, size, size, 0],
        x: [0, Math.cos(randomAngle) * distance, Math.cos(randomAngle) * distance * 1.2, Math.cos(randomAngle) * distance * 1.5],
        y: [0, Math.sin(randomAngle) * distance, Math.sin(randomAngle) * distance * 1.2, Math.sin(randomAngle) * distance * 1.5]
      }}
      transition={{
        duration: duration,
        delay: index * 0.15,
        repeat: Infinity,
        repeatDelay: Math.random() * 3
      }}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-lg whitespace-nowrap transform hover:scale-110 transition-transform cursor-default">
        <p className="text-sm font-medium">{text}</p>
      </div>
    </motion.span>
  );
};

export default function AnimatedInsights() {
  const [insights, setInsights] = useState<string[]>([]);
  
  useEffect(() => {
    setInsights(generateInsights());
  }, []);

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 rounded-3xl">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
      {insights.slice(0, insights.length / 2).map((text, index) => (
        <InsightBubble key={index} text={text} index={index} />
      ))}
    </div>
  );
}