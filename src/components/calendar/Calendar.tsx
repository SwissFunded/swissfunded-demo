import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NewsEvent {
  date: string;
  time: string;
  currency: string;
  impact: string;
  event: string;
  forecast: string;
  previous: string;
}

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://swissfunded-demo-server.vercel.app/api/forex-news'
  : 'http://localhost:3001/api/forex-news';

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch news events');
        }
        const data = await response.json();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to fetch news events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6"
    >
      <h1 className="text-2xl font-bold mb-6">Forex News Calendar</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.map((event, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.currency}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getImpactColor(event.impact)}`}>
                    {event.impact}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{event.event}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{event.forecast}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{event.previous}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Calendar; 