// Game Service - Business Logic
// Autor: Torga & GitHub Copilot

const DataStore = require('../../store/DataStore');
const dataStore = new DataStore();

// Globaler Game State (Ein Raum für alle)
let globalGameState = {
    status: 'lobby', // 'lobby', 'playing', 'scoring', 'finished'
    players: [], // [{ id, name, connected, answers, points }]
    currentRound: null, // { number, letter, categories, timeLeft, startTime }
    rounds: [], // Verlauf aller Runden
    timer: null // Timer-Referenz
};

// Kategorien für das Spiel
const CATEGORIES = ['Stadt', 'Land', 'Fluss', 'Tier'];
const ROUND_TIME = 60; // Sekunden
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Game State abrufen
function getGameState() {
    // Timer aktualisieren falls Runde läuft
    if (globalGameState.status === 'playing' && globalGameState.currentRound) {
        updateTimer();
    }
    
    return {
        status: globalGameState.status,
        players: globalGameState.players.map(p => ({
            id: p.id,
            name: p.name,
            connected: p.connected,
            hasSubmitted: p.answers && Object.keys(p.answers).length > 0,
            points: p.points || 0
        })),
        currentRound: globalGameState.currentRound,
        roundNumber: globalGameState.rounds.length + 1
    };
}

// DataStore Hilfsfunktion
function ensureDataStoreInitialized() {
    if (!dataStore.initialized) {
        throw new Error('DataStore not initialized. Please wait for server startup to complete.');
    }
}

// Spieler beitritt
function joinGame(userId, playerName) {
    ensureDataStoreInitialized();
    
    // Prüfen ob User bereits im Spiel
    const existingPlayer = globalGameState.players.find(p => p.id === userId);
    if (existingPlayer) {
        throw new Error('You are already in this game');
    }

    // Prüfen ob Spiel läuft (dann muss gewartet werden)
    if (globalGameState.status === 'playing') {
        throw new Error('Game is currently running. Please wait for the next round.');
    }

    const newPlayer = {
        id: userId,  // User-ID aus DB
        name: playerName,
        connected: true,
        answers: {},
        points: 0
    };

    globalGameState.players.push(newPlayer);

    return {
        success: true,
        playerId: userId,
        message: `Player ${playerName} joined the game`
    };
}

// Spiel starten
function startGame() {
    ensureDataStoreInitialized();
    
    if (globalGameState.status !== 'lobby') {
        throw new Error('Game can only be started from lobby');
    }

    if (globalGameState.players.length === 0) {
        throw new Error('Need at least one player to start');
    }

    startNewRound();

    return {
        success: true,
        message: 'Game started!'
    };
}

// Neue Runde starten
function startNewRound() {
    // Zufälligen Buchstaben wählen
    const usedLetters = globalGameState.rounds.map(r => r.letter);
    const availableLetters = LETTERS.filter(l => !usedLetters.includes(l));
    
    if (availableLetters.length === 0) {
        // Alle Buchstaben durch - Spiel beenden
        globalGameState.status = 'finished';
        return;
    }

    const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];

    // Alle Spieler-Antworten zurücksetzen
    globalGameState.players.forEach(player => {
        player.answers = {};
    });

    // Neue Runde erstellen
    globalGameState.currentRound = {
        number: globalGameState.rounds.length + 1,
        letter: randomLetter,
        categories: CATEGORIES,
        timeLeft: ROUND_TIME,
        startTime: Date.now()
    };

    globalGameState.status = 'playing';

    // Timer starten
    startRoundTimer();
}

// Round Timer starten
function startRoundTimer() {
    if (globalGameState.timer) {
        clearInterval(globalGameState.timer);
    }

    globalGameState.timer = setInterval(() => {
        updateTimer();
        
        // Prüfen ob Zeit abgelaufen oder alle haben abgegeben
        if (globalGameState.currentRound.timeLeft <= 0 || allPlayersSubmitted()) {
            endRound();
        }
    }, 1000);
}

// Timer aktualisieren
function updateTimer() {
    if (!globalGameState.currentRound) return;

    const elapsed = Math.floor((Date.now() - globalGameState.currentRound.startTime) / 1000);
    globalGameState.currentRound.timeLeft = Math.max(0, ROUND_TIME - elapsed);
}

// Prüfen ob alle Spieler abgegeben haben
function allPlayersSubmitted() {
    return globalGameState.players.every(player => 
        player.answers && Object.keys(player.answers).length === CATEGORIES.length
    );
}

// Antworten einreichen
function submitAnswers(userId, answers) {
    if (globalGameState.status !== 'playing') {
        throw new Error('No active round to submit answers to');
    }

    const player = globalGameState.players.find(p => p.id === userId);
    if (!player) {
        throw new Error('Player not found');
    }

    // Antworten validieren und speichern
    const validatedAnswers = {};
    CATEGORIES.forEach(category => {
        const answer = answers[category] || '';
        validatedAnswers[category] = answer.trim();
    });

    player.answers = validatedAnswers;

    return {
        success: true,
        message: 'Answers submitted successfully'
    };
}

// Runde beenden
function endRound() {
    if (globalGameState.timer) {
        clearInterval(globalGameState.timer);
        globalGameState.timer = null;
    }

    // Punkte berechnen
    calculatePoints();

    // Runde zum Verlauf hinzufügen
    globalGameState.rounds.push({
        ...globalGameState.currentRound,
        playerAnswers: globalGameState.players.map(p => ({
            playerId: p.id,
            playerName: p.name,
            answers: p.answers
        }))
    });

    globalGameState.status = 'scoring';
    globalGameState.currentRound = null;

    // Nach 10 Sekunden automatisch zur Lobby (für nächste Runde)
    setTimeout(() => {
        if (globalGameState.status === 'scoring') {
            globalGameState.status = 'lobby';
        }
    }, 10000);
}

// Punkte berechnen
function calculatePoints() {
    const currentLetter = globalGameState.currentRound.letter.toLowerCase();

    CATEGORIES.forEach(categoryName => {
        // Category-ID aus DataStore holen
        const categoryData = dataStore.findCategoryByName(categoryName);
        if (!categoryData) {
            console.warn(`Category '${categoryName}' not found in database`);
            return;
        }

        // Alle Antworten für diese Kategorie sammeln
        const answers = globalGameState.players.map(p => ({
            playerId: p.id,
            playerName: p.name,
            answer: p.answers[categoryName] || ''
        })).filter(a => a.answer.length > 0);

        // Eindeutigkeit prüfen (case-insensitive)
        const answerCounts = {};
        answers.forEach(a => {
            const normalizedAnswer = a.answer.toLowerCase().trim();
            answerCounts[normalizedAnswer] = (answerCounts[normalizedAnswer] || 0) + 1;
        });

        // Punkte vergeben
        answers.forEach(a => {
            const player = globalGameState.players.find(p => p.id === a.playerId);
            const normalizedAnswer = a.answer.toLowerCase().trim();
            
            // 1. Prüfen ob Antwort mit richtigem Buchstaben beginnt
            const startsWithLetter = normalizedAnswer.startsWith(currentLetter);
            if (!startsWithLetter) {
                console.log(`❌ ${a.playerName}: "${a.answer}" (Category: ${categoryName}) - Wrong letter`);
                return; // 0 Punkte
            }

            // 2. Prüfen ob Wort in der Datenbank existiert
            const wordInDB = dataStore.findWordInCategory(a.answer, categoryData.category_id);
            if (!wordInDB) {
                console.log(`❌ ${a.playerName}: "${a.answer}" (Category: ${categoryName}) - Not in database`);
                return; // 0 Punkte
            }

            // 3. Grundpunkte basierend auf Wortlänge
            let points = a.answer.length;

            // 4. Bonus für einzigartige Antworten
            const isUnique = answerCounts[normalizedAnswer] === 1;
            if (isUnique) {
                points += 5;
                console.log(`✅ ${a.playerName}: "${a.answer}" (Category: ${categoryName}) - ${points} points (UNIQUE bonus!)`);
            } else {
                console.log(`✅ ${a.playerName}: "${a.answer}" (Category: ${categoryName}) - ${points} points`);
            }

            player.points = (player.points || 0) + points;
        });
    });
}

// Spieler verlässt
function leaveGame(userId) {
    const playerIndex = globalGameState.players.findIndex(p => p.id === userId);
    if (playerIndex === -1) {
        throw new Error('Player not found');
    }

    const playerName = globalGameState.players[playerIndex].name;
    globalGameState.players.splice(playerIndex, 1);

    // Wenn alle Spieler weg sind, Spiel zurücksetzen
    if (globalGameState.players.length === 0) {
        resetGame();
    }

    return {
        success: true,
        message: `Player ${playerName} left the game`
    };
}

// Spiel komplett zurücksetzen
function resetGame() {
    if (globalGameState.timer) {
        clearInterval(globalGameState.timer);
    }

    globalGameState = {
        status: 'lobby',
        players: [],
        currentRound: null,
        rounds: [],
        timer: null
    };
}

module.exports = {
    getGameState,
    joinGame,
    startGame,
    submitAnswers,
    leaveGame,
    resetGame
};
