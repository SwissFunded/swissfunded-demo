const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

// Finnhub API key
const FINNHUB_API_KEY = 'cvs1dahr01qp7viu6ff0cvs1dahr01qp7viu6ffg';

app.use(cors());
app.use(express.json());

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

app.get('/api/forex-news', async (req, res) => {
  try {
    console.log('Fetching news from Finnhub...');
    const response = await axios.get('https://finnhub.io/api/v1/news', {
      params: {
        category: 'forex',
        token: FINNHUB_API_KEY
      },
      headers: {
        'X-Finnhub-Token': FINNHUB_API_KEY
      }
    });

    if (!response.data || !Array.isArray(response.data)) {
      console.log('No data from Finnhub, falling back to mock data');
      return res.json(mockEvents);
    }

    // Transform the data to match our frontend expectations
    const events = response.data.map(item => {
      try {
        const publishedDate = new Date(item.datetime * 1000); // Convert Unix timestamp to Date
        return {
          date: publishedDate.toISOString().split('T')[0],
          time: publishedDate.toLocaleTimeString(),
          currency: 'FOREX',
          impact: getSentimentImpact(item.sentiment),
          event: item.headline,
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

    console.log(`Successfully processed ${events.length} news items`);
    res.json(events);
  } catch (error) {
    console.error('Error fetching forex news:', error.message);
    if (error.response?.data) {
      console.error('API Response:', error.response.data);
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
  console.log(`Using Finnhub API`);
}); 