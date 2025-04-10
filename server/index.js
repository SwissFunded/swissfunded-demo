const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Parser = require('rss-parser');

const app = express();
const port = process.env.PORT || 3001;
const parser = new Parser();

// Configure CORS
const corsOptions = {
  origin: ['https://swissfunded-demo.vercel.app', 'http://localhost:3000'],
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
  if (origin && ['https://swissfunded-demo.vercel.app', 'http://localhost:3000'].includes(origin)) {
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

    console.log('Fetching news from Investing.com RSS...');
    
    // Fetch from multiple RSS feeds for comprehensive coverage
    const feeds = [
      'https://www.investing.com/rss/news_301.rss',  // Forex News
      'https://www.investing.com/rss/news_95.rss',   // Economic Indicators
      'https://www.investing.com/rss/news_1.rss'     // Headlines
    ];

    const feedPromises = feeds.map(feed => parser.parseURL(feed).catch(err => {
      console.log(`Error fetching feed ${feed}:`, err.message);
      return { items: [] };
    }));

    const feedResults = await Promise.all(feedPromises);
    const allItems = feedResults.flatMap(result => result.items || []);

    // Transform the data to match our frontend expectations
    const events = allItems.slice(0, 50).map(item => {
      const publishedDate = new Date(item.pubDate || item.isoDate);
      return {
        date: publishedDate.toISOString().split('T')[0],
        time: publishedDate.toLocaleTimeString(),
        currency: extractCurrencyPair(item.title + ' ' + (item.content || item.description || '')),
        impact: determineImpact(item.title, item.content || item.description || ''),
        event: item.title,
        forecast: item.content || item.description || 'N/A',
        previous: item.author || item.creator || 'Investing.com'
      };
    });

    // Update cache
    newsCache.data = events;
    newsCache.timestamp = Date.now();

    console.log(`Successfully processed ${events.length} news items`);
    res.json(events);
  } catch (error) {
    console.error('Error fetching forex news:', error.message);
    
    // If we have cached data, return it even if it's expired
    if (newsCache.data) {
      console.log('Returning expired cached data due to error');
      return res.json(newsCache.data);
    }
    
    console.log('Error occurred, falling back to mock data');
    res.json(mockEvents);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Using Investing.com RSS feeds for forex news');
}); 