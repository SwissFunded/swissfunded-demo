import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import ChallengeCard from '../challenge/ChallengeCard';
import { tradeData } from '../../data/tradeData';
import { getTimeRangeData, calculateStats, getChartData } from '../../utils/tradeDataUtils';

const CustomDot = (props: any) => {
  if (!props.cx || !props.cy) return null;
  
  const { cx, cy, index, payload, data } = props;
  const isLastDot = index === data.length - 1;

  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={isLastDot ? 6 : 4} 
      stroke="#ef4444"
      strokeWidth={2} 
      fill={isLastDot ? "#ef4444" : "#ffffff"}
      fillOpacity={isLastDot ? 1 : 0.2}
      className={isLastDot ? "animate-pulse" : ""}
    />
  );
};

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1d' | '1w' | '1m' | '3m'>('1m');
  const [mounted, setMounted] = useState(false);

  const daysMap = {
    '1d': 1,
    '1w': 7,
    '1m': 30,
    '3m': 90
  };

  const currentData = useMemo(() => {
    return getTimeRangeData(tradeData, daysMap[timeRange]);
  }, [timeRange, daysMap]);

  const stats = useMemo(() => {
    return calculateStats(currentData);
  }, [currentData]);

  const chartData = useMemo(() => {
    return currentData.map(d => ({
      date: d.date,
      balance: d.balance
    }));
  }, [currentData]);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          </div>
        </div>
        <div className="h-[400px] w-full">
          {mounted && (
            <LineChart 
              width={800} 
              height={400} 
              data={chartData} 
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Balance']}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#ef4444"
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 8, fill: '#ef4444' }}
                isAnimationActive={true}
                animationDuration={1000}
                fill="url(#colorBalance)"
              />
            </LineChart>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 