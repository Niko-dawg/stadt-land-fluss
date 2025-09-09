// Game Service - Business Logic
// Autor: Torga & GitHub Copilot

const dataStore = require('../../store/DataStore'); // Schon eine Instanz (Singleton)

// Globaler Game State (Ein Raum für alle)
let globalGameState = {
    status: 'lobby', // 'lobby', 'playing', 'results'
    players: [], // [{ id, name, connected, answers, roundPoints }]
    currentRound: null, // { number, letter, categories, timeLeft, startTime }
    lastRoundResults: null, // Ergebnisse der letzten Runde für results-Screen
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
    
    const baseState = {
        status: globalGameState.status,
        players: globalGameState.players.map(p => ({
            id: p.id,
            name: p.name,
            connected: p.connected,
            hasSubmitted: p.answers && Object.keys(p.answers).length > 0,
            roundPoints: p.roundPoints || 0
        }))
    };

    // Je nach Status verschiedene Daten hinzufügen
    if (globalGameState.status === 'playing') {
        baseState.currentRound = globalGameState.currentRound;
    } else if (globalGameState.status === 'results') {
        baseState.lastRoundResults = globalGameState.lastRoundResults;
        baseState.nextRoundIn = globalGameState.nextRoundIn || 0;
    }
    
    return baseState;
}

// DataStore Hilfsfunktion
function ensureDataStoreInitialized() {
    if (!dataStore.initialized) {
        throw new Error('DataStore not initialized. Please wait for server startup to complete.');
    }
}

// Spieler beitritt
function joinGame(user) {
    ensureDataStoreInitialized();
    
    // Prüfen ob User bereits im Spiel
    const existingPlayer = globalGameState.players.find(p => p.id === user.id);
    if (existingPlayer) {
        throw new Error('You are already in this game');
    }

    // Prüfen ob Spiel läuft (dann muss gewartet werden)
    if (globalGameState.status === 'playing') {
        throw new Error('Game is currently running. Please wait for the next round.');
    }

    const newPlayer = {
        id: user.id,  // User-ID aus JWT Token (ursprünglich aus DB)
        name: user.username, // Username aus JWT Token
        connected: true,
        answers: {},
        roundPoints: 0
    };

    globalGameState.players.push(newPlayer);

    // Wenn erster Spieler und Status ist lobby → Spiel automatisch starten
    if (globalGameState.players.length === 1 && globalGameState.status === 'lobby') {
        startNewRound();
        return {
            success: true,
            playerId: user.id,
            message: `${user.username} joined and started the game!`,
            gameStarted: true
        };
    }

    return {
        success: true,
        playerId: user.id,
        message: `Player ${user.username} joined the game`,
        gameStarted: false
    };
}

// Neue Runde starten
function startNewRound() {
    // Zufälligen Buchstaben wählen (kann sich wiederholen für infinite game)
    const randomLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];

    // Alle Spieler-Antworten und Rundenpunkte zurücksetzen
    globalGameState.players.forEach(player => {
        player.answers = {};
        player.roundPoints = 0;
    });

    // Neue Runde erstellen
    globalGameState.currentRound = {
        letter: randomLetter,
        categories: CATEGORIES,
        timeLeft: ROUND_TIME,
        startTime: Date.now()
    };

    globalGameState.status = 'playing';
    globalGameState.lastRoundResults = null; // Clear previous results

    console.log(`🎮 New round started with letter: ${randomLetter}`);

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
function submitAnswers(user, answers) {
    if (globalGameState.status !== 'playing') {
        throw new Error('No active round to submit answers to');
    }

    const player = globalGameState.players.find(p => p.id === user.id);
    
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
async function endRound() {
    if (globalGameState.timer) {
        clearInterval(globalGameState.timer);
        globalGameState.timer = null;
    }

    // Punkte berechnen
    await calculateAndSavePoints();

    // Rundenergebnisse für Frontend vorbereiten
    globalGameState.lastRoundResults = {
        letter: globalGameState.currentRound.letter,
        playerResults: globalGameState.players.map(p => ({
            name: p.name,
            answers: p.answers,
            roundPoints: p.roundPoints,
            details: getPlayerRoundDetails(p, globalGameState.currentRound.letter)
        }))
    };

    globalGameState.status = 'results';
    globalGameState.currentRound = null;

    console.log(`📊 Round ended. Results:`, globalGameState.lastRoundResults.playerResults.map(p => `${p.name}: ${p.roundPoints}pts`));

    // Nach 10 Sekunden automatisch nächste Runde starten (wenn Spieler da sind)
    let countdown = 10;
    globalGameState.nextRoundIn = countdown;
    
    const countdownTimer = setInterval(() => {
        countdown--;
        globalGameState.nextRoundIn = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownTimer);
            
            // Wenn noch Spieler da sind → nächste Runde
            if (globalGameState.players.length > 0) {
                startNewRound();
            } else {
                // Keine Spieler mehr → zurück zur Lobby
                globalGameState.status = 'lobby';
                globalGameState.lastRoundResults = null;
            }
        }
    }, 1000);
}

// Punkte berechnen und in DB speichern
async function calculateAndSavePoints() {
    const currentLetter = globalGameState.currentRound.letter.toLowerCase();
    const db = require('../../db'); // DB-Verbindung

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
        answers.forEach(async a => {
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
                return; // 0 Punkte CHEF SAGT MORGEN ABSTIMMUNG NOCH EINBAUEN SONST GIBTS SCHLÄGE DANKESCHÖN
            }

            // 3. Grundpunkte basierend auf Wortlänge::::80% richtiges Wort soll trotzdem Punkte geben sagt Chef
            let points = a.answer.length;

            // 4. Bonus für einzigartige Antworten 
            const isUnique = answerCounts[normalizedAnswer] === 1;
            if (isUnique) {
                points += 5;
                console.log(`✅ ${a.playerName}: "${a.answer}" (Category: ${categoryName}) - ${points} points (UNIQUE bonus!)`);
            } else {
                console.log(`✅ ${a.playerName}: "${a.answer}" (Category: ${categoryName}) - ${points} points`);
            }

            player.roundPoints = (player.roundPoints || 0) + points;

            // Antwort in game_entries speichern
            if (points > 0) {
                try {
                    await db.query(`
                        INSERT INTO game_entries (user_id, category_id, answer, points, is_multiplayer)
                        VALUES ($1, $2, $3, $4, true)
                    `, [a.playerId, categoryData.category_id, a.answer, points]);
                    
                    // DataStore synchronisieren - neue Entry hinzufügen
                    dataStore.addGameEntry({
                        game_entries_id: null, // Wird von DB generiert
                        user_id: a.playerId,
                        category_id: categoryData.category_id,
                        answer: a.answer,
                        points: points,
                        is_multiplayer: true
                    });
                    
                    console.log(`💾 Saved entry: ${a.playerName} - ${a.answer} (${points}pts) to DB + DataStore`);
                } catch (error) {
                    console.error(`❌ Failed to save game entry for ${a.playerName}:`, error);
                }
            }
        });
    });

    // Keine separaten Punkte-Updates mehr nötig - alles in game_entries!
}

// Hilfsfunktion für detaillierte Rundenergebnisse
function getPlayerRoundDetails(player, letter) {
    const details = {};
    CATEGORIES.forEach(category => {
        const answer = player.answers[category] || '';
        if (answer) {
            details[category] = {
                answer: answer,
                valid: answer.toLowerCase().startsWith(letter.toLowerCase()),
                // Weitere Details könnten hier hinzugefügt werden
            };
        }
    });
    return details;
}

// Spieler verlässt
function leaveGame(user) {
    const playerIndex = globalGameState.players.findIndex(p => p.id === user.id);
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
        lastRoundResults: null,
        timer: null
    };
    
    console.log('🔄 Game reset to lobby');
}

module.exports = {
    getGameState,
    joinGame,
    submitAnswers,
    leaveGame,
    resetGame
};
