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
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

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
  const { isDarkMode } = useTheme();

  const accountData = {
    balance: 125000,
    equity: 124850,
    profit: '+3.75',
    platform: 'MetaTrader 5',
    accountType: 'Evaluation',
    phase: 'Phase 1',
    accountSize: 125000,
  };

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
    const chartColor = isNoChange ? '#ffffff' : (isInProfit ? '#22c55e' : '#ef4444');
    
    return {
      labels: currentData.map(d => d.date),
      datasets: [
        {
          data: currentData.map(d => d.balance),
          borderColor: chartColor,
          backgroundColor: `${chartColor}10`,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        }
      ]
    };
  }, [currentData]);

  const tradingStats = {
    averageWin: 2500,
    averageLoss: 1250,
    winRatio: `${(stats.winRate).toFixed(1)}%`,
    profitFactor: 2.0,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1F2937' : '#ffffff',
        titleColor: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
        bodyColor: isDarkMode ? '#ffffff' : '#000000',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
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
          color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          drawBorder: false,
        },
        ticks: {
          color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
        }
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          drawBorder: false,
        },
        ticks: {
          color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
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
        <div className={`col-span-2 ${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} rounded-xl p-6`}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className={`text-2xl font-heading ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>Account Balance</div>
              <span className={`text-3xl font-bold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>${accountData.balance.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <div className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>Equity: ${accountData.equity.toLocaleString()}</div>
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
            <div className={`${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} p-4 rounded-lg`}>
              <div className="flex items-center justify-between">
                <span className={`${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>Platform</span>
                <InformationCircleIcon className={`h-5 w-5 ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`} />
              </div>
              <div className={`mt-2 font-medium ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{accountData.platform}</div>
            </div>
            <div className={`${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} p-4 rounded-lg`}>
              <div className="flex items-center justify-between">
                <span className={`${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>Account Type</span>
                <InformationCircleIcon className={`h-5 w-5 ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`} />
              </div>
              <div className={`mt-2 font-medium ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{accountData.accountType}</div>
            </div>
            <div className={`${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} p-4 rounded-lg`}>
              <div className="flex items-center justify-between">
                <span className={`${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>Phase</span>
                <InformationCircleIcon className={`h-5 w-5 ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`} />
              </div>
              <div className={`mt-2 font-medium ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{accountData.phase}</div>
            </div>
            <div className={`${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} p-4 rounded-lg`}>
              <div className="flex items-center justify-between">
                <span className={`${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>Account size</span>
                <InformationCircleIcon className={`h-5 w-5 ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`} />
              </div>
              <div className={`mt-2 font-medium ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>${accountData.accountSize.toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex gap-4 mb-4">
              {['1d', '1w', '1m', '3m', '6m'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`px-4 py-2 rounded-lg ${
                    timeRange === range 
                      ? 'bg-primary text-white' 
                      : `${isDarkMode ? 'bg-background text-text-muted' : 'bg-background-lightMode text-text-lightMode-muted'}`
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
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