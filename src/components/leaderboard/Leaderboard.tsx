import React from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon } from '@heroicons/react/24/solid';

const successfulTraders = [
  {
    id: 1,
    name: 'Alex Thompson',
    profit: 125000,
    winRate: 82.5,
    profitFactor: 3.2,
    strategy: 'Price Action',
    favoritePairs: ['EUR/USD', 'GBP/USD'],
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rank: 1
  },
  {
    id: 2,
    name: 'Sarah Chen',
    profit: 98000,
    winRate: 78.3,
    profitFactor: 2.8,
    strategy: 'Swing Trading',
    favoritePairs: ['USD/JPY', 'AUD/USD'],
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rank: 2
  },
  {
    id: 3,
    name: 'Michael Rodriguez',
    profit: 156000,
    winRate: 75.6,
    profitFactor: 3.5,
    strategy: 'Breakout Trading',
    favoritePairs: ['GBP/JPY', 'EUR/GBP'],
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    rank: 3
  },
  {
    id: 4,
    name: 'Emma Wilson',
    profit: 112000,
    winRate: 80.2,
    profitFactor: 3.0,
    strategy: 'Trend Following',
    favoritePairs: ['USD/CAD', 'NZD/USD'],
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
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
        
        {/* Podium Section */}
        <div className="relative h-[500px] mb-12">
          {/* Podium Base */}
          <div className="absolute bottom-0 left-0 right-0 h-[200px] flex justify-center items-end gap-4 px-8">
            {/* Bronze (3rd place) */}
            <div className="w-[200px] h-[120px] bg-[#CD7F32] rounded-t-2xl shadow-lg relative">
              <div className="absolute -top-2 left-0 right-0 h-2 bg-[#CD7F32] rounded-t-2xl"></div>
              <div className="absolute -top-4 left-0 right-0 h-2 bg-[#CD7F32] rounded-t-2xl"></div>
            </div>
            
            {/* Gold (1st place) */}
            <div className="w-[240px] h-[160px] bg-[#FFD700] rounded-t-2xl shadow-lg relative">
              <div className="absolute -top-2 left-0 right-0 h-2 bg-[#FFD700] rounded-t-2xl"></div>
              <div className="absolute -top-4 left-0 right-0 h-2 bg-[#FFD700] rounded-t-2xl"></div>
              <div className="absolute -top-6 left-0 right-0 h-2 bg-[#FFD700] rounded-t-2xl"></div>
            </div>
            
            {/* Silver (2nd place) */}
            <div className="w-[200px] h-[140px] bg-[#C0C0C0] rounded-t-2xl shadow-lg relative">
              <div className="absolute -top-2 left-0 right-0 h-2 bg-[#C0C0C0] rounded-t-2xl"></div>
              <div className="absolute -top-4 left-0 right-0 h-2 bg-[#C0C0C0] rounded-t-2xl"></div>
            </div>
          </div>

          {/* Traders on Podium */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end gap-8 px-8">
            {sortedTraders.slice(0, 3).map((trader, index) => (
              <motion.div
                key={trader.id}
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center ${
                  index === 1 ? 'mb-[180px]' : index === 0 ? 'mb-[140px]' : 'mb-[160px]'
                }`}
              >
                <div className="relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    {index === 1 && (
                      <div className="bg-[#FFD700] rounded-full p-2 shadow-lg">
                        <TrophyIcon className="w-8 h-8 text-background" />
                      </div>
                    )}
                    {index === 0 && (
                      <div className="bg-[#C0C0C0] rounded-full p-2 shadow-lg">
                        <TrophyIcon className="w-8 h-8 text-background" />
                      </div>
                    )}
                    {index === 2 && (
                      <div className="bg-[#CD7F32] rounded-full p-2 shadow-lg">
                        <TrophyIcon className="w-8 h-8 text-background" />
                      </div>
                    )}
                  </div>
                  <img
                    src={trader.image}
                    alt={trader.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-background-light shadow-lg"
                  />
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-lg font-medium">{trader.name}</h3>
                  <p className="text-sm text-text-muted">{trader.strategy}</p>
                  <p className="text-green-500 font-medium mt-1">${trader.profit.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
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