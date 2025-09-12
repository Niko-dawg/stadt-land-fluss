// Highscore Controller - Business Logic für Highscore API
// Autor: GitHub Copilot

const highscoreService = require('./service');

// GET /api/highscore - Gesamte Highscore-Liste abrufen
async function getHighscore(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const highscoreData = await highscoreService.getFullHighscore(limit);
    res.json(highscoreData);
  } catch (error) {
    console.error('Fehler beim Abrufen der Highscore:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
}

module.exports = {
  getHighscore
};
