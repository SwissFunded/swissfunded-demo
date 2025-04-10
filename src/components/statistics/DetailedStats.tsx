import React, { useState, useMemo } from 'react';
import {
  InformationCircleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { tradeData } from '../../data/tradeData';
import { getTimeRangeData, calculateStats, getChartData } from '../../utils/tradeDataUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DetailedStats: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1d' | '1w' | '1m' | '3m'>('1m');

  const daysMap = {
    '1d': 1,
    '1w': 7,
    '1m': 30,
    '3m': 90
  };

  const currentData = useMemo(() => {
    return getTimeRangeData(tradeData, daysMap[timeRange]);
  }, [timeRange]);

  const stats = useMemo(() => {
    return calculateStats(currentData);
  }, [currentData]);

  const chartData = useMemo(() => {
    return getChartData(currentData);
  }, [currentData]);

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
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
        }
      }
    }
  };

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
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255, 255, 255, 0.5)"
                    tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                  />
                  <YAxis 
                    stroke="rgba(255, 255, 255, 0.5)"
                    tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#10B981"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
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