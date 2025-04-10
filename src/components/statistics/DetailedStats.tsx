import React from 'react';
import {
  InformationCircleIcon,
  ArrowDownIcon,
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Mock data to match home page
const mockData = [
  { date: 'Mar 1', balance: 5000.00 },   // Starting balance
  { date: 'Mar 2', balance: 5250.00 },   // +250.00 good start
  { date: 'Mar 3', balance: 5100.00 },   // -150.00 small loss
  { date: 'Mar 4', balance: 4900.00 },   // -200.00 bad day
  { date: 'Mar 5', balance: 4650.00 },   // -250.00 losing streak
  { date: 'Mar 6', balance: 4300.00 },   // -350.00 emotional trading
  { date: 'Mar 7', balance: 3950.00 },   // -350.00 continued tilt
  { date: 'Mar 8', balance: 3600.00 },   // -350.00 worst day
  { date: 'Mar 9', balance: 3850.00 },   // +250.00 small recovery
  { date: 'Mar 10', balance: 4200.00 },  // +350.00 good recovery
  { date: 'Mar 11', balance: 4550.00 },  // +350.00 strong day
  { date: 'Mar 12', balance: 4900.00 },  // +350.00 winning streak
  { date: 'Mar 13', balance: 5250.00 },  // +350.00 breaking even
  { date: 'Mar 14', balance: 5600.00 },  // +350.00 in profit
  { date: 'Mar 15', balance: 5300.00 },  // -300.00 setback
  { date: 'Mar 16', balance: 5650.00 },  // +350.00 recovery
  { date: 'Mar 17', balance: 6000.00 },  // +350.00 strong day
  { date: 'Mar 18', balance: 5700.00 },  // -300.00 small loss
  { date: 'Mar 19', balance: 6050.00 },  // +350.00 good day
  { date: 'Mar 20', balance: 6400.00 },  // +350.00 winning streak
  { date: 'Mar 21', balance: 6750.00 },  // +350.00 strong day
  { date: 'Mar 22', balance: 7100.00 },  // +350.00 consistent
  { date: 'Mar 23', balance: 6800.00 },  // -300.00 small loss
  { date: 'Mar 24', balance: 7150.00 },  // +350.00 recovery
  { date: 'Mar 25', balance: 7500.00 },  // +350.00 strong finish
  { date: 'Mar 26', balance: 7200.00 },  // -300.00 small loss
  { date: 'Mar 27', balance: 7550.00 },  // +350.00 recovery
  { date: 'Mar 28', balance: 7900.00 },  // +350.00 strong day
  { date: 'Mar 29', balance: 8250.00 },  // +350.00 winning streak
  { date: 'Mar 30', balance: 8500.00 },  // +250.00 final day
];

const DetailedStats: React.FC = () => {
  // Mock data for demonstration
  const accountData = {
    balance: 6500.00,
    equity: 6500.00,
    profit: 30.00,
    platform: 'TRADELOCKER',
    accountType: '2 STEP PRO',
    phase: 'Student',
    accountSize: 5000.00,
    startDate: 'Mar 01, 2024',
    endDate: 'May 31, 2024',
  };

  const tradingStats = {
    averageWin: 250.00,
    averageLoss: 120.00,
    winRatio: '68%',
    profitFactor: 2.08,
  };

  const dailySummary = [
    { date: '3/30/2024', trades: 3, lots: 0.35, result: 443.22 },
    { date: '3/29/2024', trades: 2, lots: 0.31, result: 333.33 },
  ];

  const accountAnalysis = {
    avgTradesPerDay: 2.13,
    totalLotsUsed: 4.84,
    avgLotsUsed: 0.42,
    biggestWin: 443.22,
    biggestLoss: -333.22,
    positiveDays: 18,
    avgPositiveDay: 250.00,
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

  const longShortData = {
    labels: ['Buy', 'Sell'],
    datasets: [{
      data: [-20, -140],
      backgroundColor: ['rgba(235, 87, 87, 0.7)', 'rgba(235, 87, 87, 0.7)'],
      borderColor: ['rgb(235, 87, 87)', 'rgb(235, 87, 87)'],
      borderWidth: 1
    }]
  };

  const instrumentProfitData = {
    labels: ['EURUSD'],
    datasets: [{
      data: [-160],
      backgroundColor: ['rgba(235, 87, 87, 0.7)'],
      borderColor: ['rgb(235, 87, 87)'],
      borderWidth: 1
    }]
  };

  const instrumentVolumeData = {
    labels: ['EURUSD'],
    datasets: [{
      data: [3.8],
      backgroundColor: ['rgba(72, 187, 120, 0.7)'],
      borderColor: ['rgb(72, 187, 120)'],
      borderWidth: 1
    }]
  };

  const tradingTimeData = {
    labels: ['10:00'],
    datasets: [{
      data: [-160],
      backgroundColor: ['rgba(235, 87, 87, 0.7)'],
      borderColor: ['rgb(235, 87, 87)'],
      borderWidth: 1
    }]
  };

  const volumeTimeData = {
    labels: ['10:00'],
    datasets: [{
      data: [4.5],
      backgroundColor: ['rgba(72, 187, 120, 0.7)'],
      borderColor: ['rgb(72, 187, 120)'],
      borderWidth: 1
    }]
  };

  return (
    <div className="p-6 space-y-6">
      {/* Account Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-background-light rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-heading">Account Balance</div>
              <span className="text-3xl font-bold">${accountData.balance}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-muted">Equity: ${accountData.equity}</div>
              <div className="flex items-center gap-1 text-red-500">
                <ArrowDownIcon className="h-4 w-4" />
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
              <div className="mt-2 font-medium">${accountData.accountSize}</div>
            </div>
          </div>
        </div>

        <div className="bg-background-light rounded-xl p-6">
          <h3 className="text-xl font-heading mb-4">Trading Objectives</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-muted">Min Trading Days</span>
                <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-sm">100%</span>
              </div>
              <div className="h-2 bg-background rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="text-sm text-text-muted mt-1">0 Day(s) Left</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-muted">Daily Loss Limit</span>
                <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-sm">53.40%</span>
              </div>
              <div className="h-2 bg-background rounded-full">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '53.40%' }}></div>
              </div>
              <div className="text-sm text-text-muted mt-1">$66.67 Left</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-background-light rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-heading">Average Win</h3>
            <InformationCircleIcon className="h-5 w-5 text-text-muted" />
          </div>
          <div className="text-2xl font-bold">${tradingStats.averageWin}</div>
        </div>

        <div className="bg-background-light rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-heading">Average Loss</h3>
            <InformationCircleIcon className="h-5 w-5 text-text-muted" />
          </div>
          <div className="text-2xl font-bold text-red-500">${tradingStats.averageLoss}</div>
        </div>

        <div className="bg-background-light rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-heading">Balance Overview</h3>
            <InformationCircleIcon className="h-5 w-5 text-text-muted" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">$4,728.27 min</span>
              <span className="text-text-muted">$5,000 max</span>
            </div>
            <div className="h-2 bg-background rounded-full">
              <div className="h-full bg-primary rounded-full" style={{ width: '94.5%' }}></div>
            </div>
            <div className="text-center text-primary">$4,896.67</div>
          </div>
        </div>
      </div>

      {/* Daily Summary and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-light rounded-xl p-6">
          <h3 className="text-xl font-heading mb-4">Daily Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-text-muted border-b border-white/[0.08]">
                  <th className="text-left py-2">DATE</th>
                  <th className="text-left py-2">TRADES</th>
                  <th className="text-left py-2">LOTS</th>
                  <th className="text-left py-2">RESULT</th>
                </tr>
              </thead>
              <tbody>
                {dailySummary.map((day, index) => (
                  <tr key={index} className="border-b border-white/[0.08]">
                    <td className="py-2">{day.date}</td>
                    <td className="py-2">{day.trades}</td>
                    <td className="py-2">{day.lots}</td>
                    <td className="py-2 text-red-500">${day.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-background-light rounded-xl p-6">
          <h3 className="text-xl font-heading mb-4">Account analysis</h3>
          <div className="space-y-4">
            {Object.entries(accountAnalysis).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-text-muted">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                <span className={value < 0 ? 'text-red-500' : ''}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trading Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-background-light rounded-xl p-6">
          <h3 className="text-xl font-heading mb-4">Long and Short Analysis</h3>
          <div className="h-[300px]">
            <Bar data={longShortData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-background-light rounded-xl p-6">
          <h3 className="text-xl font-heading mb-4">Instrument Profit Analysis</h3>
          <div className="h-[300px]">
            <Bar data={instrumentProfitData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-background-light rounded-xl p-6">
          <h3 className="text-xl font-heading mb-4">Instrument Volume Analysis</h3>
          <div className="h-[300px]">
            <Bar data={instrumentVolumeData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Time-based Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-light rounded-xl p-6">
          <h3 className="text-xl font-heading mb-4">Results by Trading Time</h3>
          <div className="h-[300px]">
            <Bar data={tradingTimeData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-background-light rounded-xl p-6">
          <h3 className="text-xl font-heading mb-4">Volume By Trading Time</h3>
          <div className="h-[300px]">
            <Bar data={volumeTimeData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Balance History Chart */}
      <div className="bg-background-light rounded-xl p-6 mb-6">
        <h3 className="text-xl font-heading mb-4">Balance History</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="0"
                vertical={false}
                horizontal={true}
                stroke="rgba(255, 255, 255, 0.05)"
              />
              <XAxis 
                dataKey="date" 
                stroke="#888888"
                tick={{ fill: '#888888' }}
              />
              <YAxis 
                stroke="#888888"
                tick={{ fill: '#888888' }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#c0392b"
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: '#c0392b',
                  stroke: '#c0392b',
                  strokeWidth: 2
                }}
                activeDot={{
                  r: 6,
                  fill: '#c0392b',
                  stroke: '#c0392b',
                  strokeWidth: 2
                }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DetailedStats; 