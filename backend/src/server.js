const express = require('express');
const cors = require('cors');
const http = require('http');
const { PORT, CLIENT_URL, ALLOWED_ROOMS } = require('./config');
const { attachSocketServer } = require('./socket');

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({
    message: 'Real-Time Chat API is running',
    endpoints: ['/', '/health', '/rooms']
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', websocket: 'enabled' });
});

app.get('/rooms', (_req, res) => {
  res.json({ rooms: ALLOWED_ROOMS });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

const io = attachSocketServer(server);

server.listen(PORT, () => {
  console.log(`HTTP + Socket.IO server listening on http://localhost:${PORT}`);
});

module.exports = { app, server, io };
