require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();
const youtubeApiKey = process.env.YOUTUBE_API_KEY;

// Define the YouTube Data API endpoint and API key
const YOUTUBE_API_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search'; // Replace with the actual YouTube Data API endpoint
const YOUTUBE_API_KEY = youtubeApiKey

// Modify the route handler to accept the 'eventName' query parameter
router.get('/', async (req, res) => {
    try {
      const { eventName } = req.query; // Get the query parameter 'eventName'
  
      // Build the API request URL with the query parameter and your API key
      const youtubeApiEndpoint = `${YOUTUBE_API_ENDPOINT}?part=snippet&maxResults=5&q=${encodeURIComponent(eventName)}&key=${YOUTUBE_API_KEY}`;
  
      // Make a GET request to the YouTube Data API
      const response = await axios.get(youtubeApiEndpoint);
  
      // Check if the response is successful and contains video items
      if (response.status === 200 && response.data.items) {
        // Extract the video items from the response
        const videos = response.data.items;
  
        // Map the video items to a simplified format
        const videoData = videos.map((video) => ({
          title: video.snippet.title,
          description: video.snippet.description,
          videoId: video.id.videoId,
          embedUrl: `https://www.youtube.com/embed/${video.id.videoId}`,
        }));
  
        // Send the video data as a JSON response
        res.json(videoData);
      } else {
        // Handle the case where there are no videos or the response is not successful
        res.status(404).json({ error: 'No videos found' });
      }
    } catch (error) {
      console.error('Error fetching YouTube video data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;
