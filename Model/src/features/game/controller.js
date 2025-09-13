//===================================================================
// GAME CONTROLLER - HTTP Request Handling für Stadt-Land-Fluss Game
//===================================================================
// Autor: Torga Aslan, Emilia
//
// Beschreibung: Express Controller für Game Logic Endpoints
// - Spielstatus Management (Join/Leave/Status)
// - Answer Submission mit Validation
// - Voting System für umstrittene Antworten
// - Authentication Middleware Integration
//===================================================================

const gameService = require('./service');

//===================================================================
// GAME STATUS OPERATIONS
//===================================================================

// GET /api/game/status - Aktueller Spielstatus abrufen
// Returns: Kompletter Game State (Spieler, Runde, Timer etc.)
async function getGameStatus(req, res) {
    try {
        const gameState = gameService.getGameState();
        res.json(gameState);
    } catch (error) {
        console.error('Error getting game status:', error);
        res.status(500).json({ error: 'Failed to get game status' });
    }
}

//===================================================================
// PLAYER MANAGEMENT OPERATIONS  
//===================================================================

// POST /api/game/join - Spieler dem aktuellen Spiel hinzufügen
// Requires: Authentication (req.user)
// Returns: Updated game state mit neuem Spieler
async function joinGame(req, res) {
    try {
        // Authentication Check - User muss eingeloggt sein
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

// POST /api/game/leave - Spieler verlässt das aktuelle Spiel
// Requires: Authentication (req.user)
// Returns: Updated game state ohne den Spieler
async function leaveGame(req, res) {
    try {
        // Authentication Check - User muss eingeloggt sein
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
//===================================================================
// GAME SUBMISSION OPERATIONS
//===================================================================

// POST /api/game/submit - Spieler reicht Antworten für aktuelle Runde ein
// Body: { answers } - Object mit Stadt/Land/Fluss/Tier Antworten
// Returns: Submission result mit Validation Status
async function submitAnswers(req, res) {
    try {
        const { answers } = req.body;
        
        // Authentication Check - User muss eingeloggt sein
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Input Validation - Answers sind erforderlich
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

//===================================================================
// VOTING SYSTEM OPERATIONS
//===================================================================

// POST /api/game/vote - Abstimmung für umstrittene Antworten
// Body: { vote } - 'yes' oder 'no' für das aktuelle Voting Item
// Returns: Voting result und nächster Voting Status
async function vote(req, res) {
    try {
        const { vote } = req.body;

        // Authentication Check - User muss eingeloggt sein
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Vote Validation - Muss 'yes' oder 'no' sein
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

//===================================================================
// MODULE EXPORTS - Controller Interface
//===================================================================
module.exports = {
    getGameStatus,
    joinGame,
    submitAnswers,
    leaveGame,
    vote
};
