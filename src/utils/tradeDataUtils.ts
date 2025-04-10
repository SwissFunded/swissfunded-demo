import { TradeData } from '../data/tradeData';

export const getTimeRangeData = (data: TradeData[], days: number) => {
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

export const calculateStats = (data: TradeData[]) => {
  if (!data.length) {
    return {
      wins: 0,
      losses: 0,
      totalTrades: 0,
      winRate: 0,
      totalPnL: 0,
      startBalance: 0,
      endBalance: 0,
      percentageGain: 0
    };
  }

  const wins = data.filter(item => item.result === 'Win').length;
  const losses = data.filter(item => item.result === 'Loss').length;
  const totalTrades = wins + losses;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  
  const totalPnL = data.reduce((sum, item) => sum + item.pnl, 0);
  const startBalance = data[0].balance - data[0].pnl; // Adjust for the first trade's PnL
  const endBalance = data[data.length - 1].balance;
  const percentageGain = startBalance > 0 ? ((endBalance - startBalance) / startBalance) * 100 : 0;

  return {
    wins,
    losses,
    totalTrades,
    winRate,
    totalPnL,
    startBalance,
    endBalance,
    percentageGain
  };
};

export const getChartData = (data: TradeData[]) => {
  if (!data.length) return [];
  
  return data.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    balance: item.balance,
    pnl: item.pnl
  }));
}; 