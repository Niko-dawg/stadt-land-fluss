// Startskript: erstellt HTTP-Server und hört auf Port
// Autor: Torga Aslan
require('dotenv').config();
const http = require('http');
const app = require('./app');
const dataStore = require('./store/DataStore');

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

// Server starten mit DataStore Initialisierung
async function startServer() {
  try {
    // Erst DataStore mit allen Daten laden
    await dataStore.initialize();
    
    // Dann Server starten
    server.listen(PORT, HOST, () => {
      console.log(`🚀 API läuft auf http://${HOST}:${PORT}`);
      console.log(`📊 DataStore geladen und bereit!`);
    });
    
  } catch (error) {
    console.error('❌ Fehler beim Server-Start:', error);
    process.exit(1);
  }
}

startServer();