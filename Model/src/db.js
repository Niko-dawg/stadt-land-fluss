//Datenbankverbindung und Hilfsfunktion (query) für SQL-Abfragen
//Autor: Torga Aslan


 // Laden der Umgebungsvariablen aus der .env-Datei in process.env
require('dotenv').config();

// Laden der Pool-Klasse aus dem installierten 'pg'-Paket 
const { Pool } = require('pg');

// Standard-Datenbankverbindung passend zur docker-compose.yml
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://root:root@localhost:5432/slf_db';

// Initialisierung des Verbindungspools mit der DATABASE_URL aus .env oder Fallback
const pool = new Pool({
  connectionString: DATABASE_URL,
});

// Hilfsfunktion zum Ausführen von Abfragen
// Die Hilfsfunktion nimmt zwei Parameter an:
// 1. text: Der SQL-String mit Platzhaltern ($1, $2, ...)
// 2. params: Array mit den Werten für die Platzhalter
// Beispiel: 
// text = 'SELECT * FROM users WHERE id = $1'
// params = [userId] --> wird dann für $1 eingesetzt
const query = (text, params) => pool.query(text, params);

// Export des Verbindungspools und der Hilfsfunktion
module.exports = { pool, query };