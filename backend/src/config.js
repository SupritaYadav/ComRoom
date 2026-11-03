require('dotenv').config();

const PORT = Number(process.env.PORT) || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const ALLOWED_ROOMS = ['General', 'Tech Support'];

module.exports = { PORT, CLIENT_URL, ALLOWED_ROOMS };
