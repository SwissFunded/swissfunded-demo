import React from 'react';
import { motion } from 'framer-motion';

const successfulTraders = [
  {
    id: 1,
    name: 'Alex Thompson',
    profit: 125000,
    winRate: 82.5,
    profitFactor: 3.2,
    strategy: 'Price Action',
    favoritePairs: ['EUR/USD', 'GBP/USD'],
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 2,
    name: 'Sarah Chen',
    profit: 98000,
    winRate: 78.3,
    profitFactor: 2.8,
    strategy: 'Swing Trading',
    favoritePairs: ['USD/JPY', 'AUD/USD'],
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 3,
    name: 'Michael Rodriguez',
    profit: 156000,
    winRate: 75.6,
    profitFactor: 3.5,
    strategy: 'Breakout Trading',
    favoritePairs: ['GBP/JPY', 'EUR/GBP'],
    image: 'https://randomuser.me/api/portraits/men/67.jpg'
  },
  {
    id: 4,
    name: 'Emma Wilson',
    profit: 112000,
    winRate: 80.2,
    profitFactor: 3.0,
    strategy: 'Trend Following',
    favoritePairs: ['USD/CAD', 'NZD/USD'],
    image: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

const Leaderboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-heading tracking-tight mb-6">Top Traders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {successfulTraders.map((trader) => (
            <motion.div
              key={trader.id}
              whileHover={{ scale: 1.02 }}
              className="bg-background-light rounded-xl p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={trader.image}
                  alt={trader.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium">{trader.name}</h3>
                  <p className="text-sm text-text-muted">{trader.strategy}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Total Profit</span>
                  <span className="text-green-500 font-medium">${trader.profit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Win Rate</span>
                  <span className="text-green-500 font-medium">{trader.winRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Profit Factor</span>
                  <span className="text-green-500 font-medium">{trader.profitFactor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Favorite Pairs</span>
                  <span className="text-text-muted">{trader.favoritePairs.join(', ')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 