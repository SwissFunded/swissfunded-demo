import React from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon } from '@heroicons/react/24/solid';

const successfulTraders = [
  {
    id: 1,
    name: 'Michael Rodriguez',
    profit: 156000,
    winRate: 75.6,
    profitFactor: 3.5,
    strategy: 'Breakout Trading',
    favoritePairs: ['GBP/JPY', 'EUR/GBP'],
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    rank: 1
  },
  {
    id: 2,
    name: 'Alex Thompson',
    profit: 125000,
    winRate: 82.5,
    profitFactor: 3.2,
    strategy: 'Price Action',
    favoritePairs: ['EUR/USD', 'GBP/USD'],
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rank: 2
  },
  {
    id: 3,
    name: 'Emma Wilson',
    profit: 112000,
    winRate: 80.2,
    profitFactor: 3.0,
    strategy: 'Trend Following',
    favoritePairs: ['USD/CAD', 'NZD/USD'],
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    rank: 3
  },
  {
    id: 4,
    name: 'Sarah Chen',
    profit: 98000,
    winRate: 78.3,
    profitFactor: 2.8,
    strategy: 'Swing Trading',
    favoritePairs: ['USD/JPY', 'AUD/USD'],
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rank: 4
  }
];

const Leaderboard: React.FC = () => {
  // Sort traders by profit in descending order
  const sortedTraders = [...successfulTraders].sort((a, b) => b.profit - a.profit);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-heading tracking-tight mb-6">Top Traders</h2>
        
        {/* Top 3 Traders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {sortedTraders.slice(0, 3).map((trader, index) => (
            <motion.div
              key={trader.id}
              whileHover={{ scale: 1.02 }}
              className={`bg-background-light rounded-xl p-6 relative ${
                index === 1 ? 'md:order-1' : index === 0 ? 'md:order-2' : 'md:order-3'
              }`}
            >
              {/* Rank Badge */}
              <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center ${
                index === 1 ? 'bg-[#FFD700]' : index === 0 ? 'bg-[#C0C0C0]' : 'bg-[#CD7F32]'
              }`}>
                <span className="text-2xl font-bold text-background">{index + 1}</span>
              </div>

              <div className="flex flex-col items-center">
                <img
                  src={trader.image}
                  alt={trader.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-background mb-4"
                />
                <h3 className="text-xl font-medium mb-1">{trader.name}</h3>
                <p className="text-sm text-text-muted mb-2">{trader.strategy}</p>
                <div className="flex items-center gap-2 mb-4">
                  <TrophyIcon className={`w-5 h-5 ${
                    index === 1 ? 'text-[#FFD700]' : index === 0 ? 'text-[#C0C0C0]' : 'text-[#CD7F32]'
                  }`} />
                  <span className="text-green-500 font-medium">${trader.profit.toLocaleString()}</span>
                </div>
                <div className="w-full space-y-2">
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
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Traders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedTraders.slice(3).map((trader) => (
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