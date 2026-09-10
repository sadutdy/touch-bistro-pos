// Vercel serverless entry: the Express app (same handlers as `node server.js`).
// Static frontend is served from `dist/` (see vercel.json outputDirectory).
const app = require('../server.js');

module.exports = app;
