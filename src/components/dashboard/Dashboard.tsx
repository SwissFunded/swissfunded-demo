import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChallengeCard from '../challenge/ChallengeCard';
import { tradeData } from '../../data/tradeData';
import { getTimeRangeData, calculateStats, getChartData } from '../../utils/tradeDataUtils';

const mockBalanceHistory = [
  // September 2023 - Starting with small consistent growth
  { date: '2023-09-01', balance: 5000.00, trades: 0, winRate: 0 },
  { date: '2023-09-02', balance: 5120.00, trades: 4, winRate: 75 },  // +120.00
  { date: '2023-09-03', balance: 5250.00, trades: 5, winRate: 60 },  // +130.00
  { date: '2023-09-04', balance: 5180.00, trades: 6, winRate: 50 },  // -70.00
  { date: '2023-09-05', balance: 5300.00, trades: 4, winRate: 75 },  // +120.00
  { date: '2023-09-06', balance: 5450.00, trades: 5, winRate: 80 },  // +150.00
  { date: '2023-09-07', balance: 5380.00, trades: 7, winRate: 42.9 },// -70.00
  { date: '2023-09-08', balance: 5500.00, trades: 5, winRate: 60 },  // +120.00
  { date: '2023-09-09', balance: 5650.00, trades: 4, winRate: 75 },  // +150.00
  { date: '2023-09-10', balance: 5550.00, trades: 6, winRate: 50 },  // -100.00
  { date: '2023-09-11', balance: 5700.00, trades: 5, winRate: 60 },  // +150.00
  { date: '2023-09-12', balance: 5850.00, trades: 4, winRate: 75 },  // +150.00
  { date: '2023-09-13', balance: 5750.00, trades: 7, winRate: 42.9 },// -100.00
  { date: '2023-09-14', balance: 5900.00, trades: 5, winRate: 60 },  // +150.00
  { date: '2023-09-15', balance: 6050.00, trades: 4, winRate: 75 },  // +150.00
  { date: '2023-09-16', balance: 5950.00, trades: 6, winRate: 50 },  // -100.00
  { date: '2023-09-17', balance: 6100.00, trades: 5, winRate: 60 },  // +150.00
  { date: '2023-09-18', balance: 6250.00, trades: 4, winRate: 75 },  // +150.00
  { date: '2023-09-19', balance: 6150.00, trades: 7, winRate: 42.9 },// -100.00
  { date: '2023-09-20', balance: 6300.00, trades: 5, winRate: 60 },  // +150.00
  { date: '2023-09-21', balance: 6450.00, trades: 4, winRate: 75 },  // +150.00
  { date: '2023-09-22', balance: 6350.00, trades: 6, winRate: 50 },  // -100.00
  { date: '2023-09-23', balance: 6500.00, trades: 5, winRate: 60 },  // +150.00
  { date: '2023-09-24', balance: 6650.00, trades: 4, winRate: 75 },  // +150.00
  { date: '2023-09-25', balance: 6550.00, trades: 7, winRate: 42.9 },// -100.00
  { date: '2023-09-26', balance: 6700.00, trades: 5, winRate: 60 },  // +150.00
  { date: '2023-09-27', balance: 6850.00, trades: 4, winRate: 75 },  // +150.00
  { date: '2023-09-28', balance: 6750.00, trades: 6, winRate: 50 },  // -100.00
  { date: '2023-09-29', balance: 6900.00, trades: 5, winRate: 60 },  // +150.00
  { date: '2023-09-30', balance: 7050.00, trades: 4, winRate: 75 },  // +150.00

  // October 2023 - More volatile month
  { date: '2023-10-01', balance: 7200.00, trades: 5, winRate: 60 },  // +150.00
  { date: '2023-10-02', balance: 7400.00, trades: 4, winRate: 75 },  // +200.00
  { date: '2023-10-03', balance: 7100.00, trades: 8, winRate: 37.5 },// -300.00
  { date: '2023-10-04', balance: 7300.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-10-05', balance: 7000.00, trades: 9, winRate: 33.3 },// -300.00
  { date: '2023-10-06', balance: 7200.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-10-07', balance: 6900.00, trades: 8, winRate: 37.5 },// -300.00
  { date: '2023-10-08', balance: 7100.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-10-09', balance: 6800.00, trades: 9, winRate: 33.3 },// -300.00
  { date: '2023-10-10', balance: 7000.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-10-11', balance: 6700.00, trades: 8, winRate: 37.5 },// -300.00
  { date: '2023-10-12', balance: 6900.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-10-13', balance: 6600.00, trades: 9, winRate: 33.3 },// -300.00
  { date: '2023-10-14', balance: 6800.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-10-15', balance: 6500.00, trades: 8, winRate: 37.5 },// -300.00
  { date: '2023-10-16', balance: 6700.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-10-17', balance: 6400.00, trades: 9, winRate: 33.3 },// -300.00
  { date: '2023-10-18', balance: 6600.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-10-19', balance: 6300.00, trades: 8, winRate: 37.5 },// -300.00
  { date: '2023-10-20', balance: 6500.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-10-21', balance: 6200.00, trades: 9, winRate: 33.3 },// -300.00
  { date: '2023-10-22', balance: 6400.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-10-23', balance: 6100.00, trades: 8, winRate: 37.5 },// -300.00
  { date: '2023-10-24', balance: 6300.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-10-25', balance: 6000.00, trades: 9, winRate: 33.3 },// -300.00
  { date: '2023-10-26', balance: 6200.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-10-27', balance: 5900.00, trades: 8, winRate: 37.5 },// -300.00
  { date: '2023-10-28', balance: 6100.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-10-29', balance: 5800.00, trades: 9, winRate: 33.3 },// -300.00
  { date: '2023-10-30', balance: 6000.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-10-31', balance: 5700.00, trades: 8, winRate: 37.5 },// -300.00

  // November 2023 - Recovery and steady growth
  { date: '2023-11-01', balance: 5900.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-11-02', balance: 6100.00, trades: 4, winRate: 75 },  // +200.00
  { date: '2023-11-03', balance: 6300.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-11-04', balance: 6500.00, trades: 4, winRate: 75 },  // +200.00
  { date: '2023-11-05', balance: 6700.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-11-06', balance: 6900.00, trades: 4, winRate: 75 },  // +200.00
  { date: '2023-11-07', balance: 7100.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-11-08', balance: 7300.00, trades: 4, winRate: 75 },  // +200.00
  { date: '2023-11-09', balance: 7500.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-11-10', balance: 7700.00, trades: 4, winRate: 75 },  // +200.00
  { date: '2023-11-11', balance: 7900.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-11-12', balance: 8100.00, trades: 4, winRate: 75 },  // +200.00
  { date: '2023-11-13', balance: 8300.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-11-14', balance: 8500.00, trades: 4, winRate: 75 },  // +200.00
  { date: '2023-11-15', balance: 8700.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-11-16', balance: 8900.00, trades: 4, winRate: 75 },  // +200.00
  { date: '2023-11-17', balance: 9100.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-11-18', balance: 9300.00, trades: 4, winRate: 75 },  // +200.00
  { date: '2023-11-19', balance: 9500.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-11-20', balance: 9700.00, trades: 4, winRate: 75 },  // +200.00
  { date: '2023-11-21', balance: 9900.00, trades: 5, winRate: 60 },  // +200.00
  { date: '2023-11-22', balance: 10100.00, trades: 4, winRate: 75 }, // +200.00
  { date: '2023-11-23', balance: 10300.00, trades: 5, winRate: 60 }, // +200.00
  { date: '2023-11-24', balance: 10500.00, trades: 4, winRate: 75 }, // +200.00
  { date: '2023-11-25', balance: 10700.00, trades: 5, winRate: 60 }, // +200.00
  { date: '2023-11-26', balance: 10900.00, trades: 4, winRate: 75 }, // +200.00
  { date: '2023-11-27', balance: 11100.00, trades: 5, winRate: 60 }, // +200.00
  { date: '2023-11-28', balance: 11300.00, trades: 4, winRate: 75 }, // +200.00
  { date: '2023-11-29', balance: 11500.00, trades: 5, winRate: 60 }, // +200.00
  { date: '2023-11-30', balance: 11700.00, trades: 4, winRate: 75 }, // +200.00

  // December 2023 - Big drawdown and recovery
  { date: '2023-12-01', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2023-12-02', balance: 10700.00, trades: 9, winRate: 33.3 },// -500.00
  { date: '2023-12-03', balance: 10200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2023-12-04', balance: 9700.00, trades: 9, winRate: 33.3 }, // -500.00
  { date: '2023-12-05', balance: 9200.00, trades: 8, winRate: 37.5 }, // -500.00
  { date: '2023-12-06', balance: 8700.00, trades: 9, winRate: 33.3 }, // -500.00
  { date: '2023-12-07', balance: 8200.00, trades: 8, winRate: 37.5 }, // -500.00
  { date: '2023-12-08', balance: 7700.00, trades: 9, winRate: 33.3 }, // -500.00
  { date: '2023-12-09', balance: 7200.00, trades: 8, winRate: 37.5 }, // -500.00
  { date: '2023-12-10', balance: 6700.00, trades: 9, winRate: 33.3 }, // -500.00
  { date: '2023-12-11', balance: 6200.00, trades: 8, winRate: 37.5 }, // -500.00
  { date: '2023-12-12', balance: 5700.00, trades: 9, winRate: 33.3 }, // -500.00
  { date: '2023-12-13', balance: 5200.00, trades: 8, winRate: 37.5 }, // -500.00
  { date: '2023-12-14', balance: 4700.00, trades: 9, winRate: 33.3 }, // -500.00
  { date: '2023-12-15', balance: 4200.00, trades: 8, winRate: 37.5 }, // -500.00
  { date: '2023-12-16', balance: 3700.00, trades: 9, winRate: 33.3 }, // -500.00
  { date: '2023-12-17', balance: 4200.00, trades: 5, winRate: 60 },  // +500.00
  { date: '2023-12-18', balance: 4700.00, trades: 4, winRate: 75 },  // +500.00
  { date: '2023-12-19', balance: 5200.00, trades: 5, winRate: 60 },  // +500.00
  { date: '2023-12-20', balance: 5700.00, trades: 4, winRate: 75 },  // +500.00
  { date: '2023-12-21', balance: 6200.00, trades: 5, winRate: 60 },  // +500.00
  { date: '2023-12-22', balance: 6700.00, trades: 4, winRate: 75 },  // +500.00
  { date: '2023-12-23', balance: 7200.00, trades: 5, winRate: 60 },  // +500.00
  { date: '2023-12-24', balance: 7700.00, trades: 4, winRate: 75 },  // +500.00
  { date: '2023-12-25', balance: 8200.00, trades: 5, winRate: 60 },  // +500.00
  { date: '2023-12-26', balance: 8700.00, trades: 4, winRate: 75 },  // +500.00
  { date: '2023-12-27', balance: 9200.00, trades: 5, winRate: 60 },  // +500.00
  { date: '2023-12-28', balance: 9700.00, trades: 4, winRate: 75 },  // +500.00
  { date: '2023-12-29', balance: 10200.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2023-12-30', balance: 10700.00, trades: 4, winRate: 75 }, // +500.00
  { date: '2023-12-31', balance: 11200.00, trades: 5, winRate: 60 }, // +500.00

  // January 2024 - Mixed performance
  { date: '2024-01-01', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-02', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-03', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-04', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-05', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-06', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-07', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-08', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-09', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-10', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-11', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-12', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-13', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-14', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-15', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-16', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-17', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-18', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-19', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-20', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-21', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-22', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-23', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-24', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-25', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-26', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-27', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-28', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-29', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-01-30', balance: 11200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-01-31', balance: 11700.00, trades: 5, winRate: 60 }, // +500.00

  // February 2024 - Steady growth with small setbacks
  { date: '2024-02-01', balance: 12200.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-02-02', balance: 12700.00, trades: 4, winRate: 75 }, // +500.00
  { date: '2024-02-03', balance: 12200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-02-04', balance: 12700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-02-05', balance: 13200.00, trades: 4, winRate: 75 }, // +500.00
  { date: '2024-02-06', balance: 12700.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-02-07', balance: 13200.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-02-08', balance: 13700.00, trades: 4, winRate: 75 }, // +500.00
  { date: '2024-02-09', balance: 13200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-02-10', balance: 13700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-02-11', balance: 14200.00, trades: 4, winRate: 75 }, // +500.00
  { date: '2024-02-12', balance: 13700.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-02-13', balance: 14200.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-02-14', balance: 14700.00, trades: 4, winRate: 75 }, // +500.00
  { date: '2024-02-15', balance: 14200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-02-16', balance: 14700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-02-17', balance: 15200.00, trades: 4, winRate: 75 }, // +500.00
  { date: '2024-02-18', balance: 14700.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-02-19', balance: 15200.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-02-20', balance: 15700.00, trades: 4, winRate: 75 }, // +500.00
  { date: '2024-02-21', balance: 15200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-02-22', balance: 15700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-02-23', balance: 16200.00, trades: 4, winRate: 75 }, // +500.00
  { date: '2024-02-24', balance: 15700.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-02-25', balance: 16200.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-02-26', balance: 16700.00, trades: 4, winRate: 75 }, // +500.00
  { date: '2024-02-27', balance: 16200.00, trades: 8, winRate: 37.5 },// -500.00
  { date: '2024-02-28', balance: 16700.00, trades: 5, winRate: 60 }, // +500.00
  { date: '2024-02-29', balance: 17200.00, trades: 4, winRate: 75 }, // +500.00

  // March 2024 - Current month with dramatic movements
  { date: '2024-03-01', balance: 5000.00, trades: 0, winRate: 0 },   // Starting balance
  { date: '2024-03-02', balance: 5250.00, trades: 3, winRate: 66.7 },// +250.00 good start
  { date: '2024-03-03', balance: 5100.00, trades: 5, winRate: 40 },  // -150.00 small loss
  { date: '2024-03-04', balance: 4900.00, trades: 6, winRate: 33.3 },// -200.00 bad day
  { date: '2024-03-05', balance: 4650.00, trades: 7, winRate: 28.6 },// -250.00 losing streak
  { date: '2024-03-06', balance: 4300.00, trades: 8, winRate: 25 },  // -350.00 emotional trading
  { date: '2024-03-07', balance: 3950.00, trades: 9, winRate: 22.2 },// -350.00 continued tilt
  { date: '2024-03-08', balance: 3600.00, trades: 10, winRate: 20 }, // -350.00 worst day
  { date: '2024-03-09', balance: 3850.00, trades: 4, winRate: 75 },  // +250.00 small recovery
  { date: '2024-03-10', balance: 4200.00, trades: 5, winRate: 60 },  // +350.00 good recovery
  { date: '2024-03-11', balance: 4550.00, trades: 5, winRate: 60 },  // +350.00 strong day
  { date: '2024-03-12', balance: 4900.00, trades: 5, winRate: 60 },  // +350.00 winning streak
  { date: '2024-03-13', balance: 5250.00, trades: 5, winRate: 60 },  // +350.00 breaking even
  { date: '2024-03-14', balance: 5600.00, trades: 5, winRate: 60 },  // +350.00 in profit
  { date: '2024-03-15', balance: 5300.00, trades: 6, winRate: 50 },  // -300.00 setback
  { date: '2024-03-16', balance: 5650.00, trades: 5, winRate: 60 },  // +350.00 recovery
  { date: '2024-03-17', balance: 6000.00, trades: 5, winRate: 60 },  // +350.00 strong day
  { date: '2024-03-18', balance: 5700.00, trades: 6, winRate: 50 },  // -300.00 small loss
  { date: '2024-03-19', balance: 6050.00, trades: 5, winRate: 60 },  // +350.00 good day
  { date: '2024-03-20', balance: 6400.00, trades: 5, winRate: 60 },  // +350.00 winning streak
  { date: '2024-03-21', balance: 6750.00, trades: 5, winRate: 60 },  // +350.00 strong day
  { date: '2024-03-22', balance: 7100.00, trades: 5, winRate: 60 },  // +350.00 consistent
  { date: '2024-03-23', balance: 6800.00, trades: 6, winRate: 50 },  // -300.00 small loss
  { date: '2024-03-24', balance: 7150.00, trades: 5, winRate: 60 },  // +350.00 recovery
  { date: '2024-03-25', balance: 7500.00, trades: 5, winRate: 60 },  // +350.00 strong finish
  { date: '2024-03-26', balance: 7200.00, trades: 6, winRate: 50 },  // -300.00 small loss
  { date: '2024-03-27', balance: 7550.00, trades: 5, winRate: 60 },  // +350.00 recovery
  { date: '2024-03-28', balance: 7900.00, trades: 5, winRate: 60 },  // +350.00 strong day
  { date: '2024-03-29', balance: 8250.00, trades: 5, winRate: 60 },  // +350.00 winning streak
  { date: '2024-03-30', balance: 8500.00, trades: 5, winRate: 60 },  // +250.00 final day
];

// Calculate performance metrics from chart data
const totalTrades = mockBalanceHistory.reduce((sum, day) => sum + day.trades, 0);
const averageWinRate = mockBalanceHistory.reduce((sum, day) => sum + day.winRate, 0) / mockBalanceHistory.length;
const totalProfit = mockBalanceHistory[mockBalanceHistory.length - 1].balance - mockBalanceHistory[0].balance;
const averageDailyProfit = totalProfit / (mockBalanceHistory.length - 1);
const largestDailyProfit = Math.max(...mockBalanceHistory.map((day, i) => 
  i > 0 ? day.balance - mockBalanceHistory[i - 1].balance : 0
));
const averageTradesPerDay = totalTrades / (mockBalanceHistory.length - 1);
const profitableDays = mockBalanceHistory.filter((day, i) => 
  i > 0 && day.balance > mockBalanceHistory[i - 1].balance
).length;
const winRateDays = mockBalanceHistory.filter(day => day.winRate >= 50).length;
const averageDailyWinRate = mockBalanceHistory.reduce((sum, day) => sum + day.winRate, 0) / mockBalanceHistory.length;

const mockChallenge = {
  platform: "FundingPips",
  accountId: "#FP12345",
  type: "Evaluation",
  trades: totalTrades,
  daysPassed: 12,
  daysLeft: 3,
  status: "Active",
  profitTarget: 8,
  maxDrawdown: 5,
  dailyLossLimit: 4,
  currentProfit: Number(((totalProfit / mockBalanceHistory[0].balance) * 100).toFixed(1)),
  currentDrawdown: 2.3,
  dailyLossUsed: 1.8,
  instruments: ["EURUSD", "GBPUSD", "XAUUSD"],
  averageTradeSize: 0.5,
  winRate: `${averageWinRate.toFixed(1)}%`,
  profitFactor: 2.1,
  bestDay: largestDailyProfit,
  worstDay: -187.50
};

const CustomDot = (props: any) => {
  const { cx, cy, index } = props;
  const isLastDot = index === mockBalanceHistory.length - 1;

  if (isLastDot) {
    return (
      <>
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill="#ff0000"
          className="pulse-dot"
        />
        <circle
          cx={cx}
          cy={cy}
          r={3}
          fill="#ff0000"
          style={{ filter: 'drop-shadow(0 0 4px rgba(255, 0, 0, 0.3))' }}
        />
      </>
    );
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill="#ff0000"
    />
  );
};

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<number>(30);

  const currentData = useMemo(() => {
    return getTimeRangeData(tradeData, timeRange);
  }, [timeRange]);

  const stats = useMemo(() => {
    return calculateStats(currentData);
  }, [currentData]);

  const chartData = useMemo(() => {
    return getChartData(currentData);
  }, [currentData]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div>
        <label className="block text-sm font-medium mb-2">Time Range (days)</label>
        <input
          type="range"
          min="1"
          max="90"
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="text-sm text-gray-500 mt-1">{timeRange} days</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Total Trades</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalTrades}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Win Rate</h3>
          <p className="text-3xl font-bold mt-2">{stats.winRate.toFixed(1)}%</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Total PnL</h3>
          <p className={`text-3xl font-bold mt-2 ${stats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${stats.totalPnL.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Percentage Gain</h3>
          <p className={`text-3xl font-bold mt-2 ${stats.percentageGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stats.percentageGain.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Balance History</h2>
        <div className="h-[400px]">
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
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white'
                }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Balance']}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 