// Highscore Router - API Endpoints für Highscore-Funktionalität
// Autor: GitHub Copilot

const express = require('express');
const highscoreController = require('./controller');

const router = express.Router();

// GET /api/highscore - Gesamte Highscore-Liste abrufen
router.get('/', highscoreController.getHighscore);

module.exports = router;
