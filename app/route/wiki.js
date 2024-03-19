const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/:hotelName', async (req, res) => {
    try {
        const hotelName = req.params.hotelName; 

        if (!hotelName) {
            return res.status(400).json({ error: 'Hotel name parameter is required.' });
        }

        const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${(hotelName)}`);

        if (response.status === 200) {
            const data = response.data;

            
            const hotelDescription = data.extract;
            const hotelImage = data.thumbnail?.source;

            res.json({ description: hotelDescription, image: hotelImage });
        } else {
            throw new Error('Failed to fetch data from Wikipedia API');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
