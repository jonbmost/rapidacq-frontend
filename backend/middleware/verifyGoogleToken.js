const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const client = new OAuth2Client(CLIENT_ID);

async function verifyGoogleToken(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing ID token' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    req.user = ticket.getPayload(); // user info (email, sub, etc.)
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid ID token' });
  }
}

module.exports = verifyGoogleToken;
