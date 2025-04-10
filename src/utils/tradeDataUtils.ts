import { TradeData } from '../data/tradeData';

export const getTimeRangeData = (data: TradeData[], days: number) => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);

  return data.filter(item => new Date(item.date) >= startDate);
};

export const calculateStats = (data: TradeData[]) => {
  const wins = data.filter(item => item.result === 'Win').length;
  const losses = data.filter(item => item.result === 'Loss').length;
  const totalTrades = wins + losses;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  
  const totalPnL = data.reduce((sum, item) => sum + item.pnl, 0);
  const startBalance = data[0]?.balance || 0;
  const endBalance = data[data.length - 1]?.balance || 0;
  const percentageGain = ((endBalance - startBalance) / startBalance) * 100;

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
  return data.map(item => ({
    date: item.date,
    balance: item.balance,
    pnl: item.pnl
  }));
}; 