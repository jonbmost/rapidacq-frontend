const express = require('express');
const verifyGoogleToken = require('./middleware/verifyGoogleToken');
const app = express();

app.use(express.json());

// Protect all routes below
app.use(verifyGoogleToken);

app.get('/api/secure-data', (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});

// Example: proxy to Anthropic API (replace with your logic)
app.post('/api/anthropic', async (req, res) => {
  // Use req.user info for user-specific logic
  // Call Anthropic API here
  res.json({ message: 'Anthropic API call would go here', user: req.user });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
