const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

// Alpha Vantage API key
const ALPHA_VANTAGE_API_KEY = '8HPA8P1L9XGJLTPE';

// Configure CORS with specific options
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Add specific headers for Safari
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());

// Cache implementation
let newsCache = {
  data: null,
  timestamp: null,
  expiry: 5 * 60 * 1000 // 5 minutes
};

// Mock data for fallback
const mockEvents = [
  {
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString(),
    currency: 'EUR/USD',
    impact: 'High',
    event: 'ECB Interest Rate Decision',
    forecast: '4.50%',
    previous: '4.50%'
  },
  {
    date: new Date().toISOString().split('T')[0],
    time: new Date(Date.now() + 3600000).toLocaleTimeString(),
    currency: 'USD/JPY',
    impact: 'Medium',
    event: 'US Non-Farm Payrolls',
    forecast: '200K',
    previous: '175K'
  },
  {
    date: new Date().toISOString().split('T')[0],
    time: new Date(Date.now() + 7200000).toLocaleTimeString(),
    currency: 'GBP/USD',
    impact: 'Low',
    event: 'UK GDP',
    forecast: '0.2%',
    previous: '0.1%'
  }
];

// Helper function to parse Alpha Vantage time format
function parseAlphaVantageTime(timeStr) {
  try {
    // Format: YYYYMMDDTHHMMSS
    const year = timeStr.substring(0, 4);
    const month = timeStr.substring(4, 6);
    const day = timeStr.substring(6, 8);
    const hour = timeStr.substring(9, 11);
    const minute = timeStr.substring(11, 13);
    
    // Create date string in a format that works across all browsers
    const dateStr = `${year}-${month}-${day}T${hour}:${minute}:00Z`;
    const date = new Date(dateStr);
    
    // Validate the date
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    return date;
  } catch (error) {
    console.error('Error parsing date:', error);
    return new Date(); // Fallback to current date
  }
}

app.get('/api/forex-news', async (req, res) => {
  try {
    // Check cache first
    if (newsCache.data && newsCache.timestamp && 
        (Date.now() - newsCache.timestamp) < newsCache.expiry) {
      console.log('Returning cached news data');
      return res.json(newsCache.data);
    }

    console.log('Fetching news from Alpha Vantage...');
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'NEWS_SENTIMENT',
        topics: 'forex',
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    if (!response.data || !response.data.feed) {
      console.log('No data from Alpha Vantage, falling back to mock data');
      return res.json(mockEvents);
    }

    // Transform the data to match our frontend expectations
    const events = response.data.feed.map(item => {
      try {
        const publishedDate = parseAlphaVantageTime(item.time_published);
        
        return {
          date: publishedDate.toISOString().split('T')[0],
          time: publishedDate.toLocaleTimeString(),
          currency: 'FOREX',
          impact: getSentimentImpact(item.overall_sentiment_score),
          event: item.title,
          forecast: item.summary?.substring(0, 200) + (item.summary?.length > 200 ? '...' : ''),
          previous: item.source
        };
      } catch (err) {
        console.error('Error processing news item:', err);
        return null;
      }
    }).filter(Boolean); // Remove any null items from failed processing

    if (events.length === 0) {
      console.log('No valid news items processed, falling back to mock data');
      return res.json(mockEvents);
    }

    // Update cache
    newsCache.data = events;
    newsCache.timestamp = Date.now();

    console.log(`Successfully processed ${events.length} news items`);
    res.json(events);
  } catch (error) {
    console.error('Error fetching forex news:', error.message);
    if (error.response?.data) {
      console.error('API Response:', error.response.data);
    }
    
    // If we have cached data, return it even if it's expired
    if (newsCache.data) {
      console.log('Returning expired cached data due to API error');
      return res.json(newsCache.data);
    }
    
    console.log('Error occurred, falling back to mock data');
    res.json(mockEvents);
  }
});

// Helper function to convert sentiment score to impact level
function getSentimentImpact(score) {
  if (!score) return 'Neutral';
  if (score >= 0.5) return 'High';
  if (score >= 0.2) return 'Medium';
  if (score <= -0.5) return 'High';
  if (score <= -0.2) return 'Medium';
  return 'Low';
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Using Alpha Vantage API`);
}); 