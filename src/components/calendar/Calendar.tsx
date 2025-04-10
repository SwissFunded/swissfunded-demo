import React, { useState, useEffect, useRef, useMemo } from 'react';
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

// Use production server URL
const API_URL = 'https://swissfunded-demo-server.vercel.app/api/forex-news';

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const cache = useRef<{ data: NewsEvent[]; timestamp: number } | null>(null);
  const maxRetries = 3;

  // Filter states
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Get unique values for filters
  const uniqueCurrencies = useMemo(() => 
    Array.from(new Set(events.map(event => event.currency))).sort(),
    [events]
  );
  
  const uniqueImpacts = useMemo(() => 
    Array.from(new Set(events.map(event => event.impact))).sort(),
    [events]
  );
  
  const uniqueEvents = useMemo(() => 
    Array.from(new Set(events.map(event => event.event))).sort(),
    [events]
  );

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesCurrency = selectedCurrency === 'all' || event.currency === selectedCurrency;
      const matchesImpact = selectedImpact === 'all' || event.impact === selectedImpact;
      const matchesEvent = selectedEvent === 'all' || event.event === selectedEvent;
      const eventDate = new Date(event.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      const matchesDate = eventDate >= startDate && eventDate <= endDate;
      
      return matchesCurrency && matchesImpact && matchesEvent && matchesDate;
    });
  }, [events, selectedCurrency, selectedImpact, selectedEvent, dateRange]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Check cache first
        if (cache.current && Date.now() - cache.current.timestamp < CACHE_DURATION) {
          setEvents(cache.current.data);
          setLoading(false);
          return;
        }

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Cache the data
        cache.current = { data, timestamp: Date.now() };
        
        setEvents(data);
        setError(null);
        setRetryCount(0);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to fetch news. Please try again later.');
        if (retryCount < maxRetries) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [retryCount]);

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-[#e74c3c]/10 text-[#e74c3c]';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'low':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-64 space-y-4"
      >
        <p className="text-[#e74c3c]">{error}</p>
        {retryCount < maxRetries && (
          <button
            onClick={() => setRetryCount(prev => prev + 1)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
        <div>
          <label className="block text-sm font-medium text-[#cccccc] mb-2">Currency Pair</label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-lg px-3 py-2 focus:border-primary focus:ring-primary"
          >
            <option value="all">All Pairs</option>
            {uniqueCurrencies.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#cccccc] mb-2">Impact</label>
          <select
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-lg px-3 py-2 focus:border-primary focus:ring-primary"
          >
            <option value="all">All Impacts</option>
            {uniqueImpacts.map(impact => (
              <option key={impact} value={impact}>{impact}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#cccccc] mb-2">Event</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-lg px-3 py-2 focus:border-primary focus:ring-primary"
          >
            <option value="all">All Events</option>
            {uniqueEvents.map(event => (
              <option key={event} value={event}>{event}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#cccccc] mb-2">Date Range</label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-lg px-3 py-2 focus:border-primary focus:ring-primary"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-lg px-3 py-2 focus:border-primary focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Calendar Table */}
      <div className="overflow-x-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
        <table className="min-w-full divide-y divide-[#2a2a2a]">
          <thead className="bg-[#2a2a2a]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase tracking-wider">Currency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase tracking-wider">Impact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase tracking-wider">Forecast</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#cccccc] uppercase tracking-wider">Previous</th>
            </tr>
          </thead>
          <tbody className="bg-[#1a1a1a] divide-y divide-[#2a2a2a]">
            {filteredEvents.map((event, index) => (
              <motion.tr
                key={`${event.date}-${event.time}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-[#2a2a2a]"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{event.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{event.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{event.currency}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getImpactColor(event.impact)}`}>
                    {event.impact}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{event.event}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{event.forecast}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{event.previous}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Calendar; 