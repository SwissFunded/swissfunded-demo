import { TradeDataPoint } from '../data/tradeData';

export const getTimeRangeData = (data: TradeDataPoint[], days: number) => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  return data.filter(item => {
    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0);
    return itemDate >= startDate;
  });
};

export const calculateStats = (data: TradeDataPoint[]) => {
  if (!data.length) {
    return {
      totalTrades: 0,
      winRate: 0,
      totalPnL: 0,
      startBalance: 0,
      endBalance: 0,
      percentageGain: 0
    };
  }

  // Calculate trades and win rate by looking at balance changes
  let wins = 0;
  let losses = 0;

  for (let i = 1; i < data.length; i++) {
    const pnl = data[i].balance - data[i-1].balance;
    if (pnl > 0) wins++;
    else if (pnl < 0) losses++;
  }

  const totalTrades = wins + losses;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  
  const startBalance = data[0].balance;
  const endBalance = data[data.length - 1].balance;
  const totalPnL = endBalance - startBalance;
  const percentageGain = ((endBalance - startBalance) / startBalance) * 100;

  return {
    totalTrades,
    winRate,
    totalPnL,
    startBalance,
    endBalance,
    percentageGain
  };
};

export const getChartData = (data: TradeDataPoint[]) => {
  if (!data.length) return [];
  
  return data.map(item => ({
    date: item.date,
    balance: item.balance
  }));
}; 