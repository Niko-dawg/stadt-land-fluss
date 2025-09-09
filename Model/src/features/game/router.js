// Game Router - Route Definitions
// Autor: Torga & GitHub Copilot

const express = require('express');
const gameController = require('./controller');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

// Game Status ist öffentlich (für Zuschauer)
router.get('/status', gameController.getGameStatus);

// Alle anderen Routes brauchen Authentication
router.post('/join', authenticateToken, gameController.joinGame);
router.post('/submit', authenticateToken, gameController.submitAnswers);
router.post('/leave', authenticateToken, gameController.leaveGame);

module.exports = router;
