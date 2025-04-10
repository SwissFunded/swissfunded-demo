import React from 'react';

interface Challenge {
  platform: string;
  accountId: string;
  type: string;
  trades: number;
  daysPassed: number;
  daysLeft: number;
  status: string;
  profitTarget: number;
  maxDrawdown: number;
  dailyLossLimit: number;
  currentProfit: number;
  currentDrawdown: number;
  dailyLossUsed: number;
  instruments: string[];
  averageTradeSize: number;
  winRate: string;
  profitFactor: number;
  bestDay: number;
  worstDay: number;
}

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-white font-montserrat">{challenge.platform} {challenge.accountId}</h3>
          <p className="text-[#cccccc] text-sm">{challenge.type}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          challenge.status === 'Active' ? 'bg-[#e74c3c]/10 text-[#e74c3c]' : 
          challenge.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 
          'bg-red-500/10 text-red-500'
        }`}>
          {challenge.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-[#cccccc] text-sm">Profit Target</p>
          <p className="text-white font-medium">{challenge.profitTarget}%</p>
        </div>
        <div>
          <p className="text-[#cccccc] text-sm">Max Drawdown</p>
          <p className="text-white font-medium">{challenge.maxDrawdown}%</p>
        </div>
        <div>
          <p className="text-[#cccccc] text-sm">Daily Loss Limit</p>
          <p className="text-white font-medium">{challenge.dailyLossLimit}%</p>
        </div>
        <div>
          <p className="text-[#cccccc] text-sm">Current Profit</p>
          <p className="text-[#e74c3c] font-medium">{challenge.currentProfit}%</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[#cccccc]">Win Rate</span>
          <span className="text-[#e74c3c] font-medium">{challenge.winRate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#cccccc]">Profit Factor</span>
          <span className="text-[#e74c3c] font-medium">{challenge.profitFactor}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#cccccc]">Average Trade Size</span>
          <span className="text-white font-medium">{challenge.averageTradeSize} lots</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#cccccc]">Current Drawdown</span>
          <span className="text-[#e74c3c] font-medium">{challenge.currentDrawdown}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#cccccc]">Daily Loss Used</span>
          <span className="text-[#e74c3c] font-medium">{challenge.dailyLossUsed}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#cccccc]">Instruments</span>
          <span className="text-white font-medium">{challenge.instruments.join(', ')}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#cccccc]">Best Day</span>
          <span className="text-[#e74c3c] font-medium">${challenge.bestDay}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#cccccc]">Worst Day</span>
          <span className="text-[#e74c3c] font-medium">${challenge.worstDay}</span>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard; 