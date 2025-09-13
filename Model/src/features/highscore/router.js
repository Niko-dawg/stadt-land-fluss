//===================================================================
// HIGHSCORE ROUTER - HTTP Route Definitions für Highscore/Rangliste
//===================================================================
// Autor: Torga Aslan
//
// Beschreibung: Express Router für Highscore System Endpoints
// - GET /api/highscore - Top Spieler Rangliste abrufen
// - Public Endpoint (keine Authentication erforderlich)
// - Query Parameter Support für Pagination
//===================================================================

const express = require('express');
const highscoreController = require('./controller');

const router = express.Router();

//===================================================================
// HIGHSCORE ROUTES (Public - keine Authentication)
//===================================================================

// GET /api/highscore - Gesamte Highscore-Liste abrufen
// Query Params: ?limit=10 für Top-N Spieler
router.get('/', highscoreController.getHighscore);

//===================================================================
// MODULE EXPORTS - Router Configuration
//===================================================================
module.exports = router;
