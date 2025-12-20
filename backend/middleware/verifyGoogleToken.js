// TEMPORARY: Allow unauthenticated access for all requests
function verifyGoogleToken(req, res, next) {
  req.user = { unauthenticated: true };
  next();
}

module.exports = verifyGoogleToken;
