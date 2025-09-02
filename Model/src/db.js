//Datenbankverbindung und Hilfsfunktion (query) für SQL-Abfragen
//Autor: Torga Aslan


 // Laden der Umgebungsvariablen aus der .env-Datei in process.env
require('dotenv').config();

// Laden der Pool-Klasse aus dem installierten 'pg'-Paket 
const { Pool } = require('pg');


// Überprüfen ob die Umgebungsvariable DATABASE_URL gesetzt ist um eine Verbindung zur Datenbank herzustellen
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Initialisierung des Verbindungspools und Verbindung zur Datenbank mit der DATABASE_URL aus .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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