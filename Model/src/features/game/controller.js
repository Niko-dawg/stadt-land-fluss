// Game Controller - HTTP Request Handling
// Autor: Torga & GitHub Copilot

const gameService = require('./service');

// GET /api/game/status - Aktueller Spielstatus
async function getGameStatus(req, res) {
    try {
        const gameState = gameService.getGameState();
        res.json(gameState);
    } catch (error) {
        console.error('Error getting game status:', error);
        res.status(500).json({ error: 'Failed to get game status' });
    }
}

// POST /api/game/join - Spieler beitritt
async function joinGame(req, res) {
    try {
        const { playerName } = req.body;
        const userId = req.user?.id; // Aus JWT Token
        
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!playerName || playerName.trim() === '') {
            return res.status(400).json({ error: 'Player name is required' });
        }

        const result = gameService.joinGame(userId, playerName.trim());
        res.json(result);
    } catch (error) {
        console.error('Error joining game:', error);
        res.status(400).json({ error: error.message });
    }
}

// POST /api/game/start - Spiel starten
async function startGame(req, res) {
    try {
        const result = gameService.startGame();
        res.json(result);
    } catch (error) {
        console.error('Error starting game:', error);
        res.status(400).json({ error: error.message });
    }
}

// POST /api/game/submit - Antworten einreichen
async function submitAnswers(req, res) {
    try {
        const { answers } = req.body;
        const userId = req.user?.id; // Aus JWT Token
        
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!answers) {
            return res.status(400).json({ error: 'Answers are required' });
        }

        const result = gameService.submitAnswers(userId, answers);
        res.json(result);
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(400).json({ error: error.message });
    }
}

// POST /api/game/leave - Spieler verlässt
async function leaveGame(req, res) {
    try {
        const userId = req.user?.id; // Aus JWT Token
        
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const result = gameService.leaveGame(userId);
        res.json(result);
    } catch (error) {
        console.error('Error leaving game:', error);
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getGameStatus,
    joinGame,
    startGame,
    submitAnswers,
    leaveGame
};
