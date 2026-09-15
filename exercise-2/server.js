const path = require('path');
const express = require('express');

const app = express();

// Read the port from the environment, with a sensible default.
// This is how a containerised app should be configured: never hard-code.
const PORT = process.env.PORT || 3000;

// A label we can set at run time to prove environment variables reach the app.
const ENVIRONMENT = process.env.APP_ENV || 'development';

app.use(express.static(path.join(__dirname, 'public')));

// Tiny endpoint the lab uses to confirm the container is healthy.
app.get('/healthz', (req, res) => {
  res.json({
    status: 'ok',
    environment: ENVIRONMENT,
    hostname: require('os').hostname(),
    uptimeSeconds: Math.round(process.uptime())
  });
});

// SPA fallback: any unknown path returns index.html so client-side
// routing works when someone refreshes on /concepts or /commands.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SPA listening on port ${PORT} (env: ${ENVIRONMENT})`);
});
