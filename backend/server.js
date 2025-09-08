const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 8000;

// Middleware for JSON parsing
app.use(express.json());

// Middleware for CORS
app.use(cors());
// In-memory storage for URLs
const urlStore = new Map();

// Function to store a new URL
function storeUrl(shortcode, originalUrl, expiryTimestamp = null) {
  if (urlStore.has(shortcode)) {
    throw new Error('Shortcode already exists');
  }
  const data = {
    originalUrl,
    creationTimestamp: new Date().toISOString(),
    expiryTimestamp,
    clicks: []
  };
  urlStore.set(shortcode, data);
}

// Function to retrieve URL data
function getUrl(shortcode) {
  return urlStore.get(shortcode) || null;
}

// Function to update URL data
function updateUrl(shortcode, updates) {
  const data = getUrl(shortcode);
  if (!data) return false;
  Object.assign(data, updates);
  return true;
}

// Function to add a click event
function addClick(shortcode, clickData) {
  const data = getUrl(shortcode);
  if (!data) return false;
  data.clicks.push({
    timestamp: clickData.timestamp || new Date().toISOString(),
    referrer: clickData.referrer || null,
    location: clickData.location || null
  });
  return true;
}

// Helper function to validate URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Helper function to generate random shortcode
function generateShortcode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper function to get unique shortcode
function getUniqueShortcode(custom = null) {
  if (custom) {
    if (urlStore.has(custom)) {
      throw new Error('Shortcode already in use');
    }
    return custom;
  }
  let shortcode;
  do {
    shortcode = generateShortcode();
  } while (urlStore.has(shortcode));
  return shortcode;
}

app.post('/shorturls', (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL provided' });
    }
    if (validity && (typeof validity !== 'number' || validity <= 0)) {
      return res.status(400).json({ error: 'Validity must be a positive integer' });
    }
    if (shortcode && (typeof shortcode !== 'string' || !/^[a-zA-Z0-9]{1,6}$/.test(shortcode))) {
      return res.status(400).json({ error: 'Shortcode must be alphanumeric and up to 6 characters' });
    }
    const uniqueShortcode = getUniqueShortcode(shortcode);
    const expiryTimestamp = new Date(Date.now() + validity * 60 * 1000).toISOString();
    storeUrl(uniqueShortcode, url, expiryTimestamp);
    const shortLink = `http://localhost:${PORT}/${uniqueShortcode}`;
    res.status(201).json({ shortLink, expiry: expiryTimestamp });
  } catch (error) {
    if (error.message === 'Shortcode already in use') {
      return res.status(409).json({ error: 'Shortcode already in use' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /shorturls/:shortcode
app.get('/shorturls/:shortcode', (req, res) => {
  try {
    const { shortcode } = req.params;
    const data = getUrl(shortcode);
    if (!data) {
      return res.status(404).json({ error: 'Shortcode not found' });
    }
    const now = new Date();
    const expiry = new Date(data.expiryTimestamp);
    if (data.expiryTimestamp && expiry < now) {
      return res.status(410).json({ error: 'URL has expired' });
    }
    const stats = {
      totalClicks: data.clicks.length,
      originalUrl: data.originalUrl,
      creationTimestamp: data.creationTimestamp,
      expiryTimestamp: data.expiryTimestamp,
      clicks: data.clicks
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /:shortcode - Redirect endpoint with click tracking
app.get('/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    const data = getUrl(shortcode);
    if (!data) {
      return res.status(404).send('Not Found');
    }
    const now = new Date();
    const expiry = new Date(data.expiryTimestamp);
    if (data.expiryTimestamp && expiry < now) {
      return res.status(410).send('Gone');
    }
    // Track click
    const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const referrer = req.get('Referer') || null;
    let location = null;
    try {
      const geoRes = await axios.get(`http://ipapi.co/${ip}/json/`);
      if (geoRes.data && geoRes.data.country_name) {
        location = `${geoRes.data.city || 'Unknown'}, ${geoRes.data.country_name}`;
      }
    } catch (geoError) {
      console.error('Geolocation failed:', geoError.message);
    }
    addClick(shortcode, {
      timestamp: new Date().toISOString(),
      referrer,
      location
    });
    res.redirect(302, data.originalUrl);
  } catch (error) {
    console.error('Error in redirect:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Server listening
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});