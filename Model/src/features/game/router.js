// Game Router - Route Definitions
// Autor: Torga & Emilia

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
router.post('/vote', authenticateToken, gameController.vote);

module.exports = router;
