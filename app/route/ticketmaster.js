require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();
const tmApiKey = process.env.TM_API_KEY;

// Define your Ticketmaster API key and base URL
const API_KEY = tmApiKey;
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

// Route handler for fetching Ticketmaster events
router.get('/events', async (req, res) => {
  try {
    const { startDate, endDate, eventName, location } = req.query;
    const cities = Array.isArray(location) ? location : [location.replace(/\s+/g, '')];

    // Build your API request URL here using Axios
    const ticketmasterEndpoint = `${BASE_URL}/events.json?apikey=${API_KEY}&startDateTime=${startDate}&endDateTime=${endDate}&keyword=${eventName}&city=${cities.join(',')}`;

    const response = await axios.get(ticketmasterEndpoint);
    const eventData = response.data?._embedded?.events || [];

    res.json(eventData);
  } catch (error) {
    console.error('Error fetching Ticketmaster data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
