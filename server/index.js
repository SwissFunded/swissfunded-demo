const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

// NewsAPI key - you'll need to replace this with your own key from newsapi.org
const NEWS_API_KEY = '4169ea525c8b4b8887251c67b12e55e7';

// Configure CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'https://swissfunded-demo.vercel.app'],
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Add security headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ['http://localhost:3000', 'https://swissfunded-demo.vercel.app'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());

// Cache implementation
let newsCache = {
  data: null,
  timestamp: null,
  expiry: 10 * 60 * 1000 // 10 minutes
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

// Helper function to determine impact based on title and description
function determineImpact(title, description) {
  const highImpactTerms = ['rate decision', 'fed', 'fomc', 'nfp', 'non-farm', 'gdp', 'cpi', 'inflation'];
  const mediumImpactTerms = ['pmi', 'retail sales', 'employment', 'trade balance', 'manufacturing'];
  
  const text = (title + ' ' + description).toLowerCase();
  
  if (highImpactTerms.some(term => text.includes(term))) {
    return 'High';
  }
  if (mediumImpactTerms.some(term => text.includes(term))) {
    return 'Medium';
  }
  return 'Low';
}

// Helper function to extract currency pair from text
function extractCurrencyPair(text) {
  const commonPairs = {
    'EUR': 'EUR/USD',
    'USD': 'USD/JPY',
    'GBP': 'GBP/USD',
    'JPY': 'USD/JPY',
    'AUD': 'AUD/USD',
    'NZD': 'NZD/USD',
    'CAD': 'USD/CAD',
    'CHF': 'USD/CHF'
  };

  text = text.toUpperCase();
  for (const [currency, pair] of Object.entries(commonPairs)) {
    if (text.includes(currency)) {
      return pair;
    }
  }
  return 'FOREX';
}

app.get('/api/forex-news', async (req, res) => {
  try {
    // Check cache first
    if (newsCache.data && newsCache.timestamp && 
        (Date.now() - newsCache.timestamp) < newsCache.expiry) {
      console.log('Returning cached news data');
      return res.json(newsCache.data);
    }

    console.log('Fetching news from NewsAPI...');
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: '(forex OR "foreign exchange" OR currency) AND (trading OR market)',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 50,
        apiKey: NEWS_API_KEY
      }
    });

    if (!response.data || !response.data.articles || response.data.articles.length === 0) {
      console.log('No data from NewsAPI, falling back to mock data');
      return res.json(mockEvents);
    }

    // Transform the data to match our frontend expectations
    const events = response.data.articles.map(article => {
      const publishedDate = new Date(article.publishedAt);
      return {
        date: publishedDate.toISOString().split('T')[0],
        time: publishedDate.toLocaleTimeString(),
        currency: extractCurrencyPair(article.title + ' ' + article.description),
        impact: determineImpact(article.title, article.description),
        event: article.title,
        forecast: article.description?.substring(0, 200) + (article.description?.length > 200 ? '...' : '') || 'N/A',
        previous: article.source.name
      };
    });

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Using NewsAPI for forex news');
}); 