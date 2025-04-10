import React from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const tutorials = [
  {
    id: 1,
    title: 'How to Take a Trade on TradeLocker',
    description: 'Learn the basics of placing trades on the TradeLocker platform',
    duration: '5:23',
    category: 'Basics',
  },
  {
    id: 2,
    title: 'Setting Stop Loss on TradeLocker',
    description: 'Step-by-step guide to setting stop losses for risk management',
    duration: '4:15',
    category: 'Risk Management',
  },
  {
    id: 3,
    title: 'Take Profit Strategies',
    description: 'Different methods to set and manage take profit levels',
    duration: '6:45',
    category: 'Strategy',
  },
  {
    id: 4,
    title: 'TradeLocker Interface Overview',
    description: 'Complete walkthrough of the TradeLocker trading interface',
    duration: '8:30',
    category: 'Basics',
  },
  {
    id: 5,
    title: 'Risk Management Fundamentals',
    description: 'Essential risk management techniques for traders',
    duration: '7:15',
    category: 'Risk Management',
  },
  {
    id: 6,
    title: 'Technical Analysis Basics',
    description: 'Introduction to technical analysis and chart patterns',
    duration: '9:20',
    category: 'Technical Analysis',
  },
  {
    id: 7,
    title: 'Fundamental Analysis',
    description: 'Understanding market fundamentals and news trading',
    duration: '8:45',
    category: 'Fundamental Analysis',
  },
  {
    id: 8,
    title: 'Trading Psychology',
    description: 'Managing emotions and maintaining discipline',
    duration: '6:30',
    category: 'Psychology',
  },
  {
    id: 9,
    title: 'Position Sizing',
    description: 'How to calculate proper position sizes',
    duration: '5:45',
    category: 'Risk Management',
  },
  {
    id: 10,
    title: 'Candlestick Patterns',
    description: 'Understanding and trading candlestick patterns',
    duration: '7:50',
    category: 'Technical Analysis',
  },
  {
    id: 11,
    title: 'Moving Averages',
    description: 'Using moving averages in your trading strategy',
    duration: '6:15',
    category: 'Technical Analysis',
  },
  {
    id: 12,
    title: 'Support and Resistance',
    description: 'Identifying and trading support and resistance levels',
    duration: '7:25',
    category: 'Technical Analysis',
  },
  {
    id: 13,
    title: 'Trading Journal',
    description: 'How to maintain an effective trading journal',
    duration: '5:10',
    category: 'Risk Management',
  },
  {
    id: 14,
    title: 'Fibonacci Trading',
    description: 'Using Fibonacci levels in your trading',
    duration: '8:15',
    category: 'Technical Analysis',
  },
  {
    id: 15,
    title: 'TradeLocker Mobile App',
    description: 'Using TradeLocker on mobile devices',
    duration: '5:40',
    category: 'Basics',
  },
  {
    id: 16,
    title: 'Backtesting Strategies',
    description: 'How to backtest your trading strategies',
    duration: '7:30',
    category: 'Strategy',
  },
  {
    id: 17,
    title: 'Custom Indicators',
    description: 'Creating and using custom indicators',
    duration: '6:25',
    category: 'Technical Analysis',
  },
  {
    id: 18,
    title: 'Trade Execution Tips',
    description: 'Best practices for trade execution',
    duration: '5:15',
    category: 'Strategy',
  },
  {
    id: 19,
    title: 'Account Management',
    description: 'Managing your trading account settings',
    duration: '4:50',
    category: 'Basics',
  },
  {
    id: 20,
    title: 'Market Analysis Tools',
    description: 'Using market analysis tools effectively',
    duration: '6:45',
    category: 'Technical Analysis',
  }
];

const Tutorials: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-heading tracking-tight mb-6">Trading Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tutorials.map((tutorial) => (
            <motion.div
              key={tutorial.id}
              whileHover={{ scale: 1.02 }}
              className="card group hover:border-primary/20"
            >
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-background-lighter">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <PlayIcon className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {tutorial.category}
                  </span>
                  <span className="text-sm text-text-muted">{tutorial.duration}</span>
                </div>
                <h3 className="text-lg font-medium text-text group-hover:text-primary transition-colors">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-text-muted line-clamp-2">
                  {tutorial.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tutorials; 