// Startskript: erstellt HTTP-Server und hört auf Port
// Autor: Torga Aslan
require('dotenv').config();
const http = require('http');
const app = require('./app');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`API läuft auf http://${HOST}:${PORT}`);
});