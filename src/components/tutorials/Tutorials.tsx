import React from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';

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
    title: 'Position Sizing Calculator',
    description: 'How to use the position sizing calculator effectively',
    duration: '3:50',
    category: 'Risk Management',
  },
  {
    id: 6,
    title: 'Chart Analysis Tools',
    description: 'Mastering the charting tools in TradeLocker',
    duration: '7:20',
    category: 'Technical Analysis',
  },
  {
    id: 7,
    title: 'Setting Up Alerts',
    description: 'How to set up price and indicator alerts',
    duration: '4:10',
    category: 'Tools',
  },
  {
    id: 8,
    title: 'Using Market Orders',
    description: 'When and how to use market orders effectively',
    duration: '5:15',
    category: 'Order Types',
  },
  {
    id: 9,
    title: 'Limit Orders Explained',
    description: 'Understanding and using limit orders',
    duration: '4:45',
    category: 'Order Types',
  },
  {
    id: 10,
    title: 'Trailing Stop Loss',
    description: 'How to set up and use trailing stop losses',
    duration: '5:30',
    category: 'Risk Management',
  },
  {
    id: 11,
    title: 'Trade Journal Setup',
    description: 'Setting up and maintaining a trade journal',
    duration: '6:15',
    category: 'Tools',
  },
  {
    id: 12,
    title: 'Risk Management Basics',
    description: 'Fundamental principles of risk management',
    duration: '7:45',
    category: 'Risk Management',
  },
  {
    id: 13,
    title: 'Technical Indicators',
    description: 'How to add and use technical indicators',
    duration: '8:20',
    category: 'Technical Analysis',
  },
  {
    id: 14,
    title: 'Multiple Timeframe Analysis',
    description: 'Using multiple timeframes for better analysis',
    duration: '6:50',
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
    title: 'Performance Analytics',
    description: 'Using TradeLocker\'s performance analytics tools',
    duration: '6:40',
    category: 'Tools',
  },
];

const Tutorials: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading tracking-tight mb-2">Trading Tutorials</h1>
        <p className="text-text-muted">Learn how to use TradeLocker effectively with our comprehensive video tutorials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tutorials.map((tutorial) => (
          <div key={tutorial.id} className="card group hover:border-primary/20">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tutorials; 