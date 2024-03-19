require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();
const hotelsApiKey = process.env.HOTELS_API_KEY;

router.get('/searchLocation', async (req, res) => {
    try {
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required.' });
        }

        const response = await axios.get(`https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query=${query}`, {
            headers: {
                'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com',
                'X-RapidAPI-Key': hotelsApiKey
            }
        });

        // Check for valid response status from TripAdvisor API
        if (response.status !== 200) {
            throw new Error('Failed to fetch data from TripAdvisor API');
        }

        res.json(response.data);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;