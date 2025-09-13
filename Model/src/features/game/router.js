//===================================================================
// GAME ROUTER - HTTP Route Definitions für Stadt-Land-Fluss Game
//===================================================================
// Autor: Torga Aslan, Emilia
//
// Beschreibung: Express Router für Game Logic Endpoints
// - Public Routes: Game Status für Zuschauer
// - Protected Routes: Join/Submit/Leave/Vote mit Authentication
// - Middleware Integration für Token Validation
//===================================================================

const express = require('express');
const gameController = require('./controller');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

//===================================================================
// PUBLIC GAME ROUTES (ohne Authentication)
//===================================================================

// GET /api/game/status - Game State abrufen (auch für Zuschauer)
router.get('/status', gameController.getGameStatus);

//===================================================================  
// PROTECTED GAME ROUTES (mit Authentication Middleware)
//===================================================================

// POST /api/game/join - Spieler dem Game hinzufügen
router.post('/join', authenticateToken, gameController.joinGame);

// POST /api/game/submit - Antworten für aktuelle Runde einreichen
router.post('/submit', authenticateToken, gameController.submitAnswers);

// POST /api/game/leave - Spieler verlässt das Game
router.post('/leave', authenticateToken, gameController.leaveGame);

// POST /api/game/vote - Abstimmung für umstrittene Antworten
router.post('/vote', authenticateToken, gameController.vote);

//===================================================================
// MODULE EXPORTS - Router Configuration  
//===================================================================
module.exports = router;
