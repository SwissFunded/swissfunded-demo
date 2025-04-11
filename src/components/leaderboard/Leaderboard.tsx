import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { TrophyIcon } from '@heroicons/react/24/solid';

const Leaderboard: React.FC = () => {
  const { isDarkMode } = useTheme();

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
      name: 'James Anderson',
      profit: 95000,
      winRate: 77.8,
      profitFactor: 2.9,
      strategy: 'Scalping',
      favoritePairs: ['EUR/JPY', 'AUD/USD'],
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
      rank: 4
    },
    {
      id: 5,
      name: 'Sophia Martinez',
      profit: 88000,
      winRate: 76.5,
      profitFactor: 2.7,
      strategy: 'Swing Trading',
      favoritePairs: ['USD/CHF', 'GBP/CHF'],
      image: 'https://randomuser.me/api/portraits/women/33.jpg',
      rank: 5
    },
    {
      id: 6,
      name: 'David Kim',
      profit: 82000,
      winRate: 75.2,
      profitFactor: 2.6,
      strategy: 'Position Trading',
      favoritePairs: ['USD/JPY', 'EUR/CHF'],
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
      rank: 6
    },
    {
      id: 7,
      name: 'Olivia Chen',
      profit: 78000,
      winRate: 74.8,
      profitFactor: 2.5,
      strategy: 'Range Trading',
      favoritePairs: ['AUD/JPY', 'NZD/JPY'],
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      rank: 7
    }
  ];

  // Sort traders by profit in descending order
  const sortedTraders = [...successfulTraders].sort((a, b) => b.profit - a.profit);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>Top Traders</h2>
        
        {/* Top 3 Traders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {sortedTraders.slice(0, 3).map((trader, index) => (
            <motion.div
              key={trader.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className={`relative ${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} rounded-xl p-6 ${
                index === 1 ? 'md:order-1' : index === 0 ? 'md:order-2' : 'md:order-3'
              }`}
            >
              {/* Rank Badge */}
              <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center ${
                trader.rank === 1 ? 'bg-[#FFD700]' : trader.rank === 2 ? 'bg-[#C0C0C0]' : 'bg-[#CD7F32]'
              }`}>
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{trader.rank}</span>
              </div>

              <div className="flex flex-col items-center">
                <img
                  src={trader.image}
                  alt={trader.name}
                  className={`w-24 h-24 rounded-full object-cover border-4 ${isDarkMode ? 'border-background' : 'border-background-lightMode'} mb-4`}
                />
                <h3 className={`text-xl font-medium mb-1 ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{trader.name}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} mb-2`}>{trader.strategy}</p>
                <div className="flex items-center gap-2 mb-4">
                  <TrophyIcon className={`w-5 h-5 ${
                    trader.rank === 1 ? 'text-[#FFD700]' : trader.rank === 2 ? 'text-[#C0C0C0]' : 'text-[#CD7F32]'
                  }`} />
                  <span className="text-green-500 font-medium">${trader.profit.toLocaleString()}</span>
                </div>
                <div className="w-full space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>Win Rate</span>
                    <span className={`${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{trader.winRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>Profit Factor</span>
                    <span className={`${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{trader.profitFactor}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>Favorite Pairs</span>
                    <span className={`${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{trader.favoritePairs.join(', ')}</span>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className={`relative ${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} rounded-xl p-6`}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={trader.image}
                  alt={trader.name}
                  className={`w-12 h-12 rounded-full object-cover ${isDarkMode ? 'border-background' : 'border-background-lightMode'}`}
                />
                <div>
                  <h3 className={`text-lg font-medium ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{trader.name}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>{trader.strategy}</p>
                </div>
              </div>
              <div className={`space-y-3 p-4 rounded-lg ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'}`}>
                <div className="flex justify-between items-center">
                  <span className={`${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>Total Profit</span>
                  <span className="text-green-500 font-medium">${trader.profit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>Win Rate</span>
                  <span className={`${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{trader.winRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>Profit Factor</span>
                  <span className={`${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{trader.profitFactor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>Favorite Pairs</span>
                  <span className={`${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{trader.favoritePairs.join(', ')}</span>
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