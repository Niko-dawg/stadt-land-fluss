// Game Controller - HTTP Request Handling
// Autor: Torga & Emilia

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
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const result = gameService.joinGame(req.user);
        res.json(result);
    } catch (error) {
        console.error('Error joining game:', error);
        res.status(400).json({ error: error.message });
    }
}

// POST /api/game/submit - Antworten einreichen
async function submitAnswers(req, res) {
    try {
        const { answers } = req.body;
        
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!answers) {
            return res.status(400).json({ error: 'Answers are required' });
        }

        const result = gameService.submitAnswers(req.user, answers);
        res.json(result);
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(400).json({ error: error.message });
    }
}

// POST /api/game/leave - Spieler verlässt
async function leaveGame(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const result = gameService.leaveGame(req.user);
        res.json(result);
    } catch (error) {
        console.error('Error leaving game:', error);
        res.status(400).json({ error: error.message });
    }
}

// POST /api/game/vote - Stimme abgeben
async function vote(req, res) {
    try {
        const { vote } = req.body; // 'yes' or 'no'

        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!vote || !['yes', 'no'].includes(vote)) {
            return res.status(400).json({ error: 'Valid vote (yes/no) is required' });
        }

        const result = gameService.vote(req.user, vote);
        res.json(result);
    } catch (error) {
        console.error('Error voting:', error);
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getGameStatus,
    joinGame,
    submitAnswers,
    leaveGame,
    vote
};
