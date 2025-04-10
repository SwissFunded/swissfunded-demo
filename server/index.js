const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

// Alpha Vantage API key
const ALPHA_VANTAGE_API_KEY = '8HPA8P1L9XGJLTPE';

// Configure CORS with specific options for Safari
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:3000', 'https://swissfunded-demo.vercel.app'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Add security headers for Safari
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ['http://localhost:3000', 'https://swissfunded-demo.vercel.app'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Handle preflight requests
app.options('*', cors(corsOptions));

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
    console.log('Using Alpha Vantage API');
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'NEWS_SENTIMENT',
        topics: 'forex',
        apikey: '8HPA8P1L9XGJLTPE',
        sort: 'LATEST',
        limit: 50
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
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