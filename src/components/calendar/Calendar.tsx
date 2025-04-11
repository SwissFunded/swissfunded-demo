import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import {
  CalendarDaysIcon,
  ClockIcon,
  BoltIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

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
  const { isDarkMode } = useTheme();
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

  // Quick filter states
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showHighImpact, setShowHighImpact] = useState(false);
  const [showToday, setShowToday] = useState(false);

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

  // Quick filter handlers
  const handleTodayFilter = () => {
    const today = new Date().toISOString().split('T')[0];
    setDateRange({ start: today, end: today });
    setShowToday(true);
    setShowUpcoming(false);
    setShowHighImpact(false);
  };

  const handleUpcomingFilter = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDateRange({
      start: today.toISOString().split('T')[0],
      end: tomorrow.toISOString().split('T')[0]
    });
    setShowUpcoming(true);
    setShowToday(false);
    setShowHighImpact(false);
  };

  const handleHighImpactFilter = () => {
    setSelectedImpact('high');
    setShowHighImpact(true);
    setShowToday(false);
    setShowUpcoming(false);
  };

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    return newsEvents.filter(event => {
      const matchesCurrency = !selectedCurrency || event.currency === selectedCurrency;
      const matchesImpact = !selectedImpact || event.impact.toLowerCase() === selectedImpact.toLowerCase();
      const matchesEvent = !selectedEvent || event.event === selectedEvent;
      const matchesDateRange = !dateRange.start || !dateRange.end || 
        (event.date >= dateRange.start && event.date <= dateRange.end);

      return matchesCurrency && matchesImpact && matchesEvent && matchesDateRange;
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>Forex News Calendar</h1>
        
        {/* Quick Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTodayFilter}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                showToday
                  ? 'bg-primary text-white'
                  : `${isDarkMode ? 'bg-background-light hover:bg-background-lighter' : 'bg-background-lightMode-light hover:bg-background-lightMode-lighter'} ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`
              } transition-all duration-200`}
            >
              <CalendarDaysIcon className="h-5 w-5" />
              Today's Events
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpcomingFilter}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                showUpcoming
                  ? 'bg-primary text-white'
                  : `${isDarkMode ? 'bg-background-light hover:bg-background-lighter' : 'bg-background-lightMode-light hover:bg-background-lightMode-lighter'} ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`
              } transition-all duration-200`}
            >
              <ClockIcon className="h-5 w-5" />
              Next 24 Hours
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleHighImpactFilter}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                showHighImpact
                  ? 'bg-primary text-white'
                  : `${isDarkMode ? 'bg-background-light hover:bg-background-lighter' : 'bg-background-lightMode-light hover:bg-background-lightMode-lighter'} ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`
              } transition-all duration-200`}
            >
              <BoltIcon className="h-5 w-5" />
              High Impact Only
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Currency Pairs Filter */}
          <div className={`${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} rounded-lg p-4 hover:${isDarkMode ? 'bg-background-lighter' : 'bg-background-lightMode-lighter'} transition-colors cursor-pointer`} onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}>
            <div className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} mb-1`}>Currency Pair</div>
            <div className={`text-xl font-semibold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{selectedCurrency || 'All Pairs'}</div>
            {showCurrencyDropdown && (
              <div className={`absolute z-10 mt-2 w-48 ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} border ${isDarkMode ? 'border-background-lighter' : 'border-background-lightMode-lighter'} rounded-md shadow-lg`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCurrency(null);
                    setShowCurrencyDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm ${
                    selectedCurrency === null
                      ? 'bg-primary text-white'
                      : `${isDarkMode ? 'text-text-muted hover:bg-background-lighter' : 'text-text-lightMode-muted hover:bg-background-lightMode-lighter'}`
                  }`}
                >
                  All Pairs
                </button>
                {uniqueCurrencies.map((currency) => (
                  <button
                    key={currency}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCurrency(currency);
                      setShowCurrencyDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm ${
                      selectedCurrency === currency
                        ? 'bg-primary text-white'
                        : `${isDarkMode ? 'text-text-muted hover:bg-background-lighter' : 'text-text-lightMode-muted hover:bg-background-lightMode-lighter'}`
                    }`}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Impact Filter */}
          <div className={`${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} rounded-lg p-4 hover:${isDarkMode ? 'bg-background-lighter' : 'bg-background-lightMode-lighter'} transition-colors cursor-pointer`} onClick={() => setShowImpactDropdown(!showImpactDropdown)}>
            <div className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} mb-1`}>Impact</div>
            <div className={`text-xl font-semibold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{selectedImpact || 'All Impacts'}</div>
            {showImpactDropdown && (
              <div className={`absolute z-10 mt-2 w-48 ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} border ${isDarkMode ? 'border-background-lighter' : 'border-background-lightMode-lighter'} rounded-md shadow-lg`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImpact(null);
                    setShowImpactDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm ${
                    selectedImpact === null
                      ? 'bg-primary text-white'
                      : `${isDarkMode ? 'text-text-muted hover:bg-background-lighter' : 'text-text-lightMode-muted hover:bg-background-lightMode-lighter'}`
                  }`}
                >
                  All Impacts
                </button>
                {uniqueImpacts.map((impact) => (
                  <button
                    key={impact}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImpact(impact);
                      setShowImpactDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm ${
                      selectedImpact === impact
                        ? 'bg-primary text-white'
                        : `${isDarkMode ? 'text-text-muted hover:bg-background-lighter' : 'text-text-lightMode-muted hover:bg-background-lightMode-lighter'}`
                    }`}
                  >
                    {impact}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Event Type Filter */}
          <div className={`${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} rounded-lg p-4 hover:${isDarkMode ? 'bg-background-lighter' : 'bg-background-lightMode-lighter'} transition-colors cursor-pointer`} onClick={() => setShowEventDropdown(!showEventDropdown)}>
            <div className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} mb-1`}>Event Type</div>
            <div className={`text-xl font-semibold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{selectedEvent || 'All Events'}</div>
            {showEventDropdown && (
              <div className={`absolute z-10 mt-2 w-48 ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} border ${isDarkMode ? 'border-background-lighter' : 'border-background-lightMode-lighter'} rounded-md shadow-lg`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(null);
                    setShowEventDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm ${
                    selectedEvent === null
                      ? 'bg-primary text-white'
                      : `${isDarkMode ? 'text-text-muted hover:bg-background-lighter' : 'text-text-lightMode-muted hover:bg-background-lightMode-lighter'}`
                  }`}
                >
                  All Events
                </button>
                {uniqueEvents.map((event) => (
                  <button
                    key={event}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                      setShowEventDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm ${
                      selectedEvent === event
                        ? 'bg-primary text-white'
                        : `${isDarkMode ? 'text-text-muted hover:bg-background-lighter' : 'text-text-lightMode-muted hover:bg-background-lightMode-lighter'}`
                    }`}
                  >
                    {event}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Filter */}
          <div className={`${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} rounded-lg p-4`}>
            <div className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} mb-2`}>Date Range</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className={`w-full h-8 px-2 text-xs rounded-md ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} border ${isDarkMode ? 'border-background-lighter' : 'border-background-lightMode-lighter'} ${isDarkMode ? 'text-text' : 'text-text-lightMode'} focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent`}
                />
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className={`w-full h-8 px-2 text-xs rounded-md ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} border ${isDarkMode ? 'border-background-lighter' : 'border-background-lightMode-lighter'} ${isDarkMode ? 'text-text' : 'text-text-lightMode'} focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Table with Visual Enhancements */}
        <div className={`overflow-x-auto ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} border ${isDarkMode ? 'border-background-light' : 'border-background-lightMode-light'} rounded-lg shadow-lg`}>
          <table className="min-w-full divide-y divide-[#2a2a2a]">
            <thead className={`${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} uppercase tracking-wider`}>Date</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} uppercase tracking-wider`}>Time</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} uppercase tracking-wider`}>Currency</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} uppercase tracking-wider`}>Impact</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} uppercase tracking-wider`}>Event</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} uppercase tracking-wider`}>Forecast</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} uppercase tracking-wider`}>Previous</th>
              </tr>
            </thead>
            <tbody className={`${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} divide-y ${isDarkMode ? 'divide-background-light' : 'divide-background-lightMode-light'}`}>
              {filteredEvents.map((event, index) => (
                <motion.tr
                  key={`${event.date}-${event.time}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group hover:${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} transition-colors duration-200`}
                >
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>
                    <div className="flex items-center gap-2">
                      <ChevronRightIcon className={`h-4 w-4 ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'} group-hover:text-primary transition-colors`} />
                      {event.date}
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{event.time}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{event.currency}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getImpactColor(event.impact)}`}>
                      {event.impact}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{event.event}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{event.forecast}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>{event.previous}</td>
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