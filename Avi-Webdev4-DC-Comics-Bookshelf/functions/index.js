const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require("axios");

exports.searchComics = onRequest({ cpu: 1 }, async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Missing search query.' });
  }

  try {
    const response = await axios.get('https://comicvine.gamespot.com/api/search/', {
      params: {
        api_key: 'YOUR_API_KEY_HERE',
        format: 'json',
        query: query,
        resources: 'volume'
      },
      headers: {
        'User-Agent': 'DCBookshelfApp/1.0'
      }
    });

    const results = response.data.results.map(item => ({
      name: item.name,
      image: item.image?.small_url || '',
      description: item.description || 'No description'
    }));

    res.status(200).json({ results });
  } catch (error) {
    logger.error('ComicVine API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch comics.' });
  }
});
