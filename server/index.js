const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/forex-factory-news', async (req, res) => {
  try {
    const response = await axios.get('https://www.forexfactory.com/calendar');
    const $ = cheerio.load(response.data);

    const events = [];
    
    // Find the calendar table
    $('.calendar__row').each((i, element) => {
      const row = $(element);
      
      // Skip header rows
      if (row.hasClass('calendar__row--header')) return;
      
      const time = row.find('.calendar__time').text().trim();
      const currency = row.find('.calendar__currency').text().trim();
      const impact = row.find('.calendar__impact').attr('title') || 'Low';
      const event = row.find('.calendar__event').text().trim();
      const forecast = row.find('.calendar__forecast').text().trim();
      const previous = row.find('.calendar__previous').text().trim();
      
      // Get the date from the header if available
      const date = row.find('.calendar__date').text().trim() || new Date().toISOString().split('T')[0];
      
      events.push({
        date,
        time,
        currency,
        impact,
        event,
        forecast,
        previous
      });
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching Forex Factory data:', error);
    res.status(500).json({ error: 'Failed to fetch news events' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 