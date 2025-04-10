import React, { useState, useMemo } from 'react';
import {
  InformationCircleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { tradeData } from '../../data/tradeData';
import { getTimeRangeData, calculateStats } from '../../utils/tradeDataUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DetailedStats: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1d' | '1w' | '1m' | '3m' | '6m'>('1m');

  const daysMap = useMemo(() => ({
    '1d': 1,
    '1w': 7,
    '1m': 30,
    '3m': 90,
    '6m': 180
  }), []);

  const currentData = useMemo(() => {
    return getTimeRangeData(tradeData, daysMap[timeRange]);
  }, [timeRange, daysMap]);

  const stats = useMemo(() => {
    return calculateStats(currentData);
  }, [currentData]);

  const chartData = useMemo(() => {
    const isInProfit = currentData[currentData.length - 1].balance > currentData[0].balance;
    const isNoChange = currentData[currentData.length - 1].balance === currentData[0].balance;
    const chartColor = isNoChange ? '#ffffff' : (isInProfit ? '#22c55e' : '#ef4444'); // White for no change, green for profit, red for loss
    
    return {
      labels: currentData.map(d => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          label: 'Balance',
          data: currentData.map(d => d.balance),
          borderColor: chartColor,
          backgroundColor: isNoChange ? 'rgba(255, 255, 255, 0.1)' : (isInProfit ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'),
          pointBackgroundColor: chartColor,
          pointBorderColor: chartColor,
          pointBorderWidth: 2,
          pointRadius: (context: any) => {
            const index = context.dataIndex;
            if (index === 0) return 3; // Show first point
            if (index === currentData.length - 1) return 3; // Show last point
            
            // Calculate the balance change
            const balanceChange = Math.abs(currentData[index].balance - currentData[index - 1].balance);
            const maxChange = Math.max(...currentData.map((d, i) => 
              i > 0 ? Math.abs(d.balance - currentData[i - 1].balance) : 0
            ));
            
            // Only show points where balance changed (trade occurred)
            if (balanceChange === 0) return 0;
            
            // Scale point size based on the relative size of the change and timeframe
            let baseSize, maxSize;
            if (timeRange === '6m') {
              baseSize = 1;
              maxSize = 2;
            } else if (timeRange === '3m') {
              baseSize = 1.5;
              maxSize = 2.5;
            } else if (timeRange === '1m') {
              baseSize = 2;
              maxSize = 3;
            } else {
              baseSize = 2.5;
              maxSize = 3.5;
            }
            
            return baseSize + (balanceChange / maxChange) * (maxSize - baseSize);
          },
          pointHoverRadius: (context: any) => {
            const index = context.dataIndex;
            if (index === 0 || index === currentData.length - 1) return 4;
            
            const balanceChange = Math.abs(currentData[index].balance - currentData[index - 1].balance);
            const maxChange = Math.max(...currentData.map((d, i) => 
              i > 0 ? Math.abs(d.balance - currentData[i - 1].balance) : 0
            ));
            
            if (balanceChange === 0) return 0;
            
            // Scale hover size based on timeframe
            let baseSize, maxSize;
            if (timeRange === '6m') {
              baseSize = 1.5;
              maxSize = 2.5;
            } else if (timeRange === '3m') {
              baseSize = 2;
              maxSize = 3;
            } else if (timeRange === '1m') {
              baseSize = 2.5;
              maxSize = 3.5;
            } else {
              baseSize = 3;
              maxSize = 4;
            }
            
            return baseSize + (balanceChange / maxChange) * (maxSize - baseSize);
          },
          fill: true,
          tension: 0.4,
        }
      ]
    };
  }, [currentData, timeRange]);

  // Account data based on the latest trade data
  const latestTrade = tradeData[tradeData.length - 1];
  const accountData = {
    balance: latestTrade.balance,
    equity: latestTrade.balance,
    profit: ((latestTrade.balance - tradeData[0].balance) / tradeData[0].balance * 100).toFixed(2),
    platform: 'TRADELOCKER',
    accountType: '2 STEP PRO',
    phase: 'Student',
    accountSize: tradeData[0].balance,
    startDate: tradeData[0].date,
    endDate: latestTrade.date,
  };

  const tradingStats = {
    averageWin: 2500,
    averageLoss: 1250,
    winRatio: `${(stats.winRate).toFixed(1)}%`,
    profitFactor: 2.0,
  };

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: 'rgba(255,255,255,0.7)',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255,255,255,0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255,255,255,0.5)',
        }
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255,255,255,0.5)',
          callback: function(value: any) {
            return `$${value.toLocaleString()}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    animation: {
      duration: 1000
    }
  } as const;

  return (
    <div className="p-6 space-y-6">
      {/* Account Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-background-light rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-heading">Account Balance</div>
              <span className="text-3xl font-bold">${accountData.balance.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-muted">Equity: ${accountData.equity.toLocaleString()}</div>
              <div className={`flex items-center gap-1 ${Number(accountData.profit) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Number(accountData.profit) >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" />
                )}
                {accountData.profit}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-background p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Platform</span>
                <InformationCircleIcon className="h-5 w-5 text-text-muted" />
              </div>
              <div className="mt-2 font-medium">{accountData.platform}</div>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Account Type</span>
                <InformationCircleIcon className="h-5 w-5 text-text-muted" />
              </div>
              <div className="mt-2 font-medium">{accountData.accountType}</div>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Phase</span>
                <InformationCircleIcon className="h-5 w-5 text-text-muted" />
              </div>
              <div className="mt-2 font-medium">{accountData.phase}</div>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Account size</span>
                <InformationCircleIcon className="h-5 w-5 text-text-muted" />
              </div>
              <div className="mt-2 font-medium">${accountData.accountSize.toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setTimeRange('1d')}
                className={`px-4 py-2 rounded-lg ${timeRange === '1d' ? 'bg-primary text-white' : 'bg-background text-text-muted'}`}
              >
                1D
              </button>
              <button
                onClick={() => setTimeRange('1w')}
                className={`px-4 py-2 rounded-lg ${timeRange === '1w' ? 'bg-primary text-white' : 'bg-background text-text-muted'}`}
              >
                1W
              </button>
              <button
                onClick={() => setTimeRange('1m')}
                className={`px-4 py-2 rounded-lg ${timeRange === '1m' ? 'bg-primary text-white' : 'bg-background text-text-muted'}`}
              >
                1M
              </button>
              <button
                onClick={() => setTimeRange('3m')}
                className={`px-4 py-2 rounded-lg ${timeRange === '3m' ? 'bg-primary text-white' : 'bg-background text-text-muted'}`}
              >
                3M
              </button>
              <button
                onClick={() => setTimeRange('6m')}
                className={`px-4 py-2 rounded-lg ${timeRange === '6m' ? 'bg-primary text-white' : 'bg-background text-text-muted'}`}
              >
                6M
              </button>
            </div>
            <div className="h-[300px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="bg-background-light rounded-xl p-6">
          <h3 className="text-xl font-heading mb-4">Trading Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-muted">Win Rate</span>
                <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-sm">
                  {tradingStats.winRatio}
                </span>
              </div>
              <div className="h-2 bg-background rounded-full">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${stats.winRate}%` }}
                ></div>
              </div>
              <div className="text-sm text-text-muted mt-1">
                {stats.wins} Wins / {stats.losses} Losses
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-muted">Profit/Loss</span>
                <span className={`px-2 py-1 rounded text-sm ${stats.totalPnL >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  ${stats.totalPnL.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-background rounded-full">
                <div 
                  className={`h-full rounded-full ${stats.totalPnL >= 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                  style={{ width: `${Math.min(Math.abs(stats.percentageGain), 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-text-muted mt-1">
                {stats.percentageGain.toFixed(2)}% Growth
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedStats; 