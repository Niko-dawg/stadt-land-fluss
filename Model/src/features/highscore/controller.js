//===================================================================
// HIGHSCORE CONTROLLER - HTTP Request Handling für Rangliste 
//===================================================================
// Autor: Torga Aslan
//
// Beschreibung: Express Controller für Highscore/Rangliste System
// - GET /api/highscore - Top Spieler mit Gesamtpunkten abrufen
// - Query Parameter Support (limit) für Performance
// - Error Handling mit detaillierter Logging
//===================================================================

const highscoreService = require('./service');

//===================================================================
// HIGHSCORE RETRIEVAL OPERATIONS
//===================================================================

// GET /api/highscore - Gesamte Highscore-Liste abrufen
// Query Parameters: ?limit=10 (default: 10 Top-Spieler)
// Returns: Sortierte Liste der besten Spieler mit Gesamtpunkten
async function getHighscore(req, res) {
  try {
    // Query Parameter Parsing - default auf 10 Top-Spieler
    const limit = parseInt(req.query.limit) || 10;
    
    // Business Logic Call - Service holt sortierte Highscore Daten
    const highscoreData = await highscoreService.getFullHighscore(limit);
    
    // Success Response - JSON mit Highscore Rankings
    res.json(highscoreData);
  } catch (error) {
    console.error('Fehler beim Abrufen der Highscore:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
}

//===================================================================
// MODULE EXPORTS - Controller Interface
//===================================================================
module.exports = {
  getHighscore
};
