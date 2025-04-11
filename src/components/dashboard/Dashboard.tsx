import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import ChallengeCard from '../challenge/ChallengeCard';
import { tradeData } from '../../data/tradeData';
import { getTimeRangeData, calculateStats } from '../../utils/tradeDataUtils';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1d' | '1w' | '1m' | '3m' | '6m'>('1m');
  const { isDarkMode } = useTheme();

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} p-6 rounded-xl`}
        >
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} mb-2`}>Total Trades</h3>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{stats.totalTrades}</p>
          <p className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} mt-1`}>
            {stats.wins} Wins / {stats.losses} Losses
          </p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} p-6 rounded-xl`}
        >
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} mb-2`}>Win Rate</h3>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{stats.winRate.toFixed(1)}%</p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} p-6 rounded-xl`}
        >
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} mb-2`}>Total PnL</h3>
          <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${stats.totalPnL.toLocaleString()}
          </p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} p-6 rounded-xl`}
        >
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} mb-2`}>Percentage Gain</h3>
          <p className={`text-2xl font-bold ${stats.percentageGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stats.percentageGain.toFixed(2)}%
          </p>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={`${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} rounded-xl p-6`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>Balance History</h2>
          <div className="flex gap-2">
            {['1d', '1w', '1m', '3m', '6m'].map((range) => (
              <motion.button
                key={range}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1 rounded ${
                  timeRange === range 
                    ? 'bg-primary text-white' 
                    : `${isDarkMode ? 'bg-background text-text-muted' : 'bg-background-lightMode text-text-lightMode-muted'}`
                }`}
              >
                {range.toUpperCase()}
              </motion.button>
            ))}
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="h-[400px] w-full"
        >
          <Line data={chartData} options={chartOptions} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard; 