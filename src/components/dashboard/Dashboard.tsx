import React, { useState, useMemo, useEffect } from 'react';
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
import { getTimeRangeData, calculateStats, getChartData } from '../../utils/tradeDataUtils';

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

  const daysMap = {
    '1d': 1,
    '1w': 7,
    '1m': 30,
    '3m': 90,
    '6m': 180
  };

  const currentData = useMemo(() => {
    return getTimeRangeData(tradeData, daysMap[timeRange]);
  }, [timeRange, daysMap]);

  const stats = useMemo(() => {
    return calculateStats(currentData);
  }, [currentData]);

  const chartData = useMemo(() => {
    return {
      labels: currentData.map(d => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          label: 'Balance',
          data: currentData.map(d => d.balance),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#ef4444',
          pointBorderWidth: 2,
          pointRadius: (context: any) => {
            const index = context.dataIndex;
            if (index === 0) return 4; // Show first point
            if (index === currentData.length - 1) return 4; // Show last point
            
            // Calculate the balance change
            const balanceChange = Math.abs(currentData[index].balance - currentData[index - 1].balance);
            const maxChange = Math.max(...currentData.map((d, i) => 
              i > 0 ? Math.abs(d.balance - currentData[i - 1].balance) : 0
            ));
            
            // Only show points where balance changed (trade occurred)
            if (balanceChange === 0) return 0;
            
            // Scale point size based on the relative size of the change
            // For longer time ranges, use smaller points
            const baseSize = timeRange === '6m' || timeRange === '3m' ? 2 : 3;
            const maxSize = timeRange === '6m' || timeRange === '3m' ? 4 : 5;
            
            return baseSize + (balanceChange / maxChange) * (maxSize - baseSize);
          },
          pointHoverRadius: (context: any) => {
            const index = context.dataIndex;
            if (index === 0 || index === currentData.length - 1) return 6;
            
            const balanceChange = Math.abs(currentData[index].balance - currentData[index - 1].balance);
            const maxChange = Math.max(...currentData.map((d, i) => 
              i > 0 ? Math.abs(d.balance - currentData[i - 1].balance) : 0
            ));
            
            if (balanceChange === 0) return 0;
            
            // Smaller hover sizes for longer time ranges
            const baseSize = timeRange === '6m' || timeRange === '3m' ? 3 : 4;
            const maxSize = timeRange === '6m' || timeRange === '3m' ? 5 : 6;
            
            return baseSize + (balanceChange / maxChange) * (maxSize - baseSize);
          },
          fill: true,
          tension: 0.4,
        }
      ]
    };
  }, [currentData]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-light p-6 rounded-xl">
          <h3 className="text-lg font-medium text-text-muted mb-2">Total Trades</h3>
          <p className="text-2xl font-bold">{stats.totalTrades}</p>
          <p className="text-sm text-text-muted mt-1">
            {stats.wins} Wins / {stats.losses} Losses
          </p>
        </div>
        <div className="bg-background-light p-6 rounded-xl">
          <h3 className="text-lg font-medium text-text-muted mb-2">Win Rate</h3>
          <p className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</p>
        </div>
        <div className="bg-background-light p-6 rounded-xl">
          <h3 className="text-lg font-medium text-text-muted mb-2">Total PnL</h3>
          <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${stats.totalPnL.toLocaleString()}
          </p>
        </div>
        <div className="bg-background-light p-6 rounded-xl">
          <h3 className="text-lg font-medium text-text-muted mb-2">Percentage Gain</h3>
          <p className={`text-2xl font-bold ${stats.percentageGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stats.percentageGain.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="bg-background-light rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Balance History</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('1d')}
              className={`px-3 py-1 rounded ${timeRange === '1d' ? 'bg-primary text-white' : 'bg-background text-text-muted'}`}
            >
              1D
            </button>
            <button
              onClick={() => setTimeRange('1w')}
              className={`px-3 py-1 rounded ${timeRange === '1w' ? 'bg-primary text-white' : 'bg-background text-text-muted'}`}
            >
              1W
            </button>
            <button
              onClick={() => setTimeRange('1m')}
              className={`px-3 py-1 rounded ${timeRange === '1m' ? 'bg-primary text-white' : 'bg-background text-text-muted'}`}
            >
              1M
            </button>
            <button
              onClick={() => setTimeRange('3m')}
              className={`px-3 py-1 rounded ${timeRange === '3m' ? 'bg-primary text-white' : 'bg-background text-text-muted'}`}
            >
              3M
            </button>
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-3 py-1 rounded ${timeRange === '6m' ? 'bg-primary text-white' : 'bg-background text-text-muted'}`}
            >
              6M
            </button>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 