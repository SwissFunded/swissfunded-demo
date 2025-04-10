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
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const cache = useRef<{ data: NewsEvent[]; timestamp: number } | null>(null);
  const maxRetries = 3;

  // Filter states
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [selectedImpact, setSelectedImpact] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  // Dropdown states
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showImpactDropdown, setShowImpactDropdown] = useState(false);
  const [showEventDropdown, setShowEventDropdown] = useState(false);

  // Get unique values for filters
  const uniqueCurrencies = useMemo(() => 
    Array.from(new Set(newsEvents.map(event => event.currency))).sort(),
    [newsEvents]
  );
  
  const uniqueImpacts = useMemo(() => 
    Array.from(new Set(newsEvents.map(event => event.impact))).sort(),
    [newsEvents]
  );
  
  const uniqueEvents = useMemo(() => 
    Array.from(new Set(newsEvents.map(event => event.event))).sort(),
    [newsEvents]
  );

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    return newsEvents.filter(event => {
      const matchesCurrency = selectedCurrency === null || event.currency === selectedCurrency;
      const matchesImpact = selectedImpact === null || event.impact === selectedImpact;
      const matchesEvent = selectedEvent === null || event.event === selectedEvent;
      const eventDate = new Date(event.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      const matchesDate = (!dateRange.start || eventDate >= startDate) && 
                         (!dateRange.end || eventDate <= endDate);
      return matchesCurrency && matchesImpact && matchesEvent && matchesDate;
    });
  }, [newsEvents, selectedCurrency, selectedImpact, selectedEvent, dateRange]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Check cache first
        if (cache.current && Date.now() - cache.current.timestamp < CACHE_DURATION) {
          setNewsEvents(cache.current.data);
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
        
        setNewsEvents(data);
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
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Forex News Calendar</h1>
        
        {/* Filters */}
        <div className="bg-[#2a2a2a] rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Currency Pairs Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Currency Pairs</label>
              <div className="relative">
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333333] rounded-md text-white hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center justify-between"
                >
                  <span>{selectedCurrency || 'All Pairs'}</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showCurrencyDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-[#333333] rounded-md shadow-lg">
                    <button
                      onClick={() => {
                        setSelectedCurrency(null);
                        setShowCurrencyDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm ${
                        selectedCurrency === null
                          ? 'bg-primary text-white'
                          : 'text-gray-300 hover:bg-[#333333]'
                      }`}
                    >
                      All Pairs
                    </button>
                    {uniqueCurrencies.map((currency) => (
                      <button
                        key={currency}
                        onClick={() => {
                          setSelectedCurrency(currency);
                          setShowCurrencyDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm ${
                          selectedCurrency === currency
                            ? 'bg-primary text-white'
                            : 'text-gray-300 hover:bg-[#333333]'
                        }`}
                      >
                        {currency}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Impact Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Impact</label>
              <div className="relative">
                <button
                  onClick={() => setShowImpactDropdown(!showImpactDropdown)}
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333333] rounded-md text-white hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center justify-between"
                >
                  <span>{selectedImpact || 'All Impacts'}</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showImpactDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-[#333333] rounded-md shadow-lg">
                    <button
                      onClick={() => {
                        setSelectedImpact(null);
                        setShowImpactDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm ${
                        selectedImpact === null
                          ? 'bg-primary text-white'
                          : 'text-gray-300 hover:bg-[#333333]'
                      }`}
                    >
                      All Impacts
                    </button>
                    {uniqueImpacts.map((impact) => (
                      <button
                        key={impact}
                        onClick={() => {
                          setSelectedImpact(impact);
                          setShowImpactDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm ${
                          selectedImpact === impact
                            ? 'bg-primary text-white'
                            : 'text-gray-300 hover:bg-[#333333]'
                        }`}
                      >
                        {impact}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Event Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Event Type</label>
              <div className="relative">
                <button
                  onClick={() => setShowEventDropdown(!showEventDropdown)}
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333333] rounded-md text-white hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center justify-between"
                >
                  <span>{selectedEvent || 'All Events'}</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showEventDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-[#333333] rounded-md shadow-lg">
                    <button
                      onClick={() => {
                        setSelectedEvent(null);
                        setShowEventDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm ${
                        selectedEvent === null
                          ? 'bg-primary text-white'
                          : 'text-gray-300 hover:bg-[#333333]'
                      }`}
                    >
                      All Events
                    </button>
                    {uniqueEvents.map((event) => (
                      <button
                        key={event}
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowEventDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm ${
                          selectedEvent === event
                            ? 'bg-primary text-white'
                            : 'text-gray-300 hover:bg-[#333333]'
                        }`}
                      >
                        {event}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-md bg-[#1a1a1a] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-md bg-[#1a1a1a] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
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
      </div>
    </div>
  );
};

export default Calendar; 