// Game Service - Business Logic
// Autor: Torga & Emilia

const dataStore = require('../../store/DataStore'); // Schon eine Instanz (Singleton)

// Globaler Game State (Ein Raum für alle)
let globalGameState = {
    status: 'lobby', // 'lobby', 'playing', 'results', 'voting'
    players: [], // [{ id, name, connected, answers, roundPoints }]
    currentRound: null, // { number, letter, categories, timeLeft, startTime }
    lastRoundResults: null, // Ergebnisse der letzten Runde für results-Screen
    timer: null, // Timer-Referenz
    voting: null // { word, category, votes: { yes: [], no: [] }, timeout, pendingAnswers: [] }
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
            roundPoints: p.roundPoints || 0,
            waitingForNextRound: p.waitingForNextRound || false
        }))
    };

    // Je nach Status verschiedene Daten hinzufügen
    if (globalGameState.status === 'playing') {
        baseState.currentRound = globalGameState.currentRound;
    } else if (globalGameState.status === 'results') {
        baseState.lastRoundResults = globalGameState.lastRoundResults;
        baseState.nextRoundIn = globalGameState.nextRoundIn || 0;
        baseState.nextRoundEndTime = globalGameState.nextRoundEndTime; // Für smooth Timer
    } else if (globalGameState.status === 'voting') {
        baseState.voting = globalGameState.voting;
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
        // Spieler ist bereits im Spiel - einfach verbunden markieren und Status zurückgeben
        existingPlayer.connected = true;
        return {
            success: true,
            playerId: user.id,
            message: `${user.username} is already in the game`,
            gameStarted: false,
            rejoined: true
        };
    }

    const newPlayer = {
        id: user.id,  // User-ID aus JWT Token (ursprünglich aus DB)
        name: user.username, // Username aus JWT Token
        connected: true,
        answers: {},
        roundPoints: 0,
        waitingForNextRound: false // Flag für Spieler die während einer Runde joinen
    };

    globalGameState.players.push(newPlayer);

    // Wenn Spiel läuft - Spieler kann joinen aber muss bis zur nächsten Runde warten
    if (globalGameState.status === 'playing') {
        newPlayer.waitingForNextRound = true;
        return {
            success: true,
            playerId: user.id,
            message: `${user.username} joined during round. You'll participate in the next round.`,
            gameStarted: false,
            waitingForNextRound: true
        };
    }

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
        player.waitingForNextRound = false; // Reset waiting flag für neue Runde
    });

    // Neue Runde erstellen
    globalGameState.currentRound = {
        letter: randomLetter,
        categories: CATEGORIES,
        timeLeft: ROUND_TIME,
        startTime: Date.now(),
        endTime: Date.now() + (ROUND_TIME * 1000) // Absolute End-Zeit für smooth Frontend-Timer
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

// Prüfen ob alle aktiven Spieler abgegeben haben (nicht die wartenden)
function allPlayersSubmitted() {
    // Nur Spieler berücksichtigen, die nicht auf die nächste Runde warten
    const activePlayers = globalGameState.players.filter(player => !player.waitingForNextRound);
    
    // Wenn keine aktiven Spieler vorhanden sind, ist niemand fertig
    if (activePlayers.length === 0) {
        return false;
    }
    
    // Prüfen ob alle aktiven Spieler abgegeben haben
    return activePlayers.every(player => 
        player.answers && Object.keys(player.answers).length === CATEGORIES.length
    );
}

// Antworten einreichen
async function submitAnswers(user, answers) {
    if (globalGameState.status !== 'playing') {
        throw new Error('No active round to submit answers to');
    }

    const player = globalGameState.players.find(p => p.id === user.id);
    
    if (!player) {
        throw new Error('Player not found in current game');
    }

    // Prüfen ob Spieler auf nächste Runde wartet
    if (player.waitingForNextRound) {
        throw new Error('You are waiting for the next round and cannot submit answers yet');
    }

    // Prüfen ob Spieler bereits abgegeben hat
    if (player.answers && Object.keys(player.answers).length > 0) {
        throw new Error('You have already submitted your answers for this round');
    }
    
    // Antworten validieren und speichern
    const validatedAnswers = {};
    CATEGORIES.forEach(category => {
        const answer = answers[category] || '';
        validatedAnswers[category] = answer.trim();
    });

    player.answers = validatedAnswers;

    // Sofort vorläufige Punkte für diesen Spieler berechnen (ohne Unique-Bonus)
    const playerResults = await calculatePlayerPreviewPoints(player);

    return {
        success: true,
        message: 'Answers submitted successfully',
        preview: playerResults
    };
}

// Vorläufige Punkte für einen Spieler berechnen (ohne Unique-Bonus)
async function calculatePlayerPreviewPoints(player) {
    const currentLetter = globalGameState.currentRound.letter.toLowerCase();
    const results = {};
    let totalBasePoints = 0;

    for (const categoryName of CATEGORIES) {
        const answer = player.answers[categoryName] || '';
        
        if (!answer.trim()) {
            results[categoryName] = {
                answer: '',
                valid: false,
                basePoints: 0,
                reason: 'No answer provided'
            };
            continue;
        }

        // Category-ID aus DataStore holen
        const categoryData = dataStore.findCategoryByName(categoryName);
        if (!categoryData) {
            results[categoryName] = {
                answer: answer,
                valid: false,
                basePoints: 0,
                reason: 'Category not found'
            };
            continue;
        }

        const normalizedAnswer = answer.toLowerCase().trim();

        // 1. Prüfen ob Antwort mit richtigem Buchstaben beginnt
        if (!normalizedAnswer.startsWith(currentLetter)) {
            results[categoryName] = {
                answer: answer,
                valid: false,
                basePoints: 0,
                reason: `Must start with letter '${globalGameState.currentRound.letter.toUpperCase()}'`
            };
            continue;
        }

        // 2. Prüfen ob Wort in der Datenbank existiert
        const wordInDB = dataStore.findWordInCategory(answer, categoryData.category_id);
        if (!wordInDB) {
            results[categoryName] = {
                answer: answer,
                valid: false,
                basePoints: 0,
                reason: 'Word not found in database'
            };
            continue;
        }

        // 3. Grundpunkte basierend auf Wortlänge
        const basePoints = answer.length;
        totalBasePoints += basePoints;

        results[categoryName] = {
            answer: answer,
            valid: true,
            basePoints: basePoints,
            reason: 'Valid word'
        };
    }

    return {
        categoryResults: results,
        totalBasePoints: totalBasePoints,
        note: 'Base points only. Uniqueness bonus (+5 per unique word) will be calculated when round ends.'
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
    globalGameState.nextRoundEndTime = Date.now() + 10000; // Absolute End-Zeit für Lobby-Timer
    
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

// Finale Punkte berechnen und in DB speichern (mit Unique-Bonus)
async function calculateAndSavePoints() {
    const currentLetter = globalGameState.currentRound.letter.toLowerCase();
    const db = require('../../db'); // DB-Verbindung
    const pendingVotes = []; // { word, category, playerId, playerName }

    // Alle Spieler-Rundenpunkte zurücksetzen für finale Berechnung
    globalGameState.players.forEach(player => {
        player.roundPoints = 0;
    });

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
                // Prüfe auf ähnliche Wörter (bis zu 80% Fehlerquote), aber nur mit richtigem Anfangsbuchstaben
                const similarWord = findSimilarWord(a.answer, categoryData.category_id, currentLetter);
                if (similarWord && similarWord.similarity) {
                    // Grundpunkte basierend auf Wortlänge für ähnliche Wörter
                    let basePoints = a.answer.length;
                    const isUnique = answerCounts[normalizedAnswer] === 1;
                    if (isUnique) {
                        basePoints += 5;
                    }

                    // Verwende die bereits berechnete Ähnlichkeit aus findSimilarWord
                    const partialPoints = Math.floor(basePoints * similarWord.similarity);
                    console.log(`⚠️ ${a.playerName}: "${a.answer}" (Category: ${categoryName}) - Similar to "${similarWord.word}" (${Math.round(similarWord.similarity * 100)}%), awarding ${partialPoints} points`);

                    player.roundPoints = (player.roundPoints || 0) + partialPoints;

                    // In game_entries speichern
                    if (partialPoints > 0) {
                        try {
                            await db.query(`
                                INSERT INTO game_entries (user_id, category_id, answer, points, is_multiplayer)
                                VALUES ($1, $2, $3, $4, true)
                            `, [a.playerId, categoryData.category_id, a.answer, partialPoints]);

                            // DataStore synchronisieren
                            dataStore.addGameEntry({
                                game_entries_id: null,
                                user_id: a.playerId,
                                category_id: categoryData.category_id,
                                answer: a.answer,
                                points: partialPoints,
                                is_multiplayer: true
                            });

                            console.log(`💾 Saved partial entry: ${a.playerName} - ${a.answer} (${partialPoints}pts) to DB + DataStore`);
                        } catch (error) {
                            console.error(`❌ Failed to save partial game entry for ${a.playerName}:`, error);
                        }
                    }
                } else {
                    console.log(`❌ ${a.playerName}: "${a.answer}" (Category: ${categoryName}) - Not in database, starting vote`);
                    // Sammle für Abstimmung statt 0 Punkte
                    pendingVotes.push({
                        word: a.answer,
                        category: categoryName,
                        categoryId: categoryData.category_id,
                        playerId: a.playerId,
                        playerName: a.playerName
                    });
                }
                return;
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

    // Wenn es Wörter für Abstimmung gibt, starte Abstimmung
    if (pendingVotes.length > 0) {
        startVoting(pendingVotes[0]); // Erstes Wort zur Abstimmung
    }
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
        timer: null,
        voting: null
    };
    
    console.log('🔄 Game reset to lobby');
}

// Hilfsfunktion: Ähnliches Wort finden (Levenshtein-Distanz)
function findSimilarWord(inputWord, categoryId, requiredLetter) {
    const words = dataStore.findWordsByCategory(categoryId);
    console.log(`🔍 DEBUG: Looking for similar words for "${inputWord}" in category ${categoryId}`);
    console.log(`🔍 DEBUG: Found ${words ? words.length : 0} words in category`);
    
    if (!words) return null;

    let bestMatch = null;
    let bestSimilarity = 0;

    words.forEach((word, index) => {
        // ANTI-CHEAT: Nur Wörter prüfen, die mit dem richtigen Buchstaben anfangen
        if (requiredLetter && !word.word.toLowerCase().startsWith(requiredLetter.toLowerCase())) {
            return; // Skip dieses Wort
        }
        
        // Case-insensitive Vergleich
        const similarity = calculateSimilarity(inputWord.toLowerCase(), word.word.toLowerCase());
        
        // Debug für erste 5 Vergleiche und alle relevanten Matches
        if (index < 5 || similarity >= 0.6) {
            console.log(`🔍 DEBUG: "${inputWord}" vs "${word.word}": ${Math.round(similarity * 100)}% similarity`);
        }
        
        if (similarity > bestSimilarity && similarity >= 0.8) { // Mindestens 80% Ähnlichkeit
            bestSimilarity = similarity;
            bestMatch = word;
            console.log(`🎯 DEBUG: New best match: "${word.word}" with ${Math.round(similarity * 100)}%`);
        }
    });

    console.log(`🔍 DEBUG: Final result for "${inputWord}": ${bestMatch ? bestMatch.word : 'no match'}`);
    
    // Gebe sowohl das Wort als auch die Ähnlichkeit zurück
    if (bestMatch) {
        return {
            word: bestMatch.word,
            similarity: bestSimilarity
        };
    }
    return null;
}

// Hilfsfunktion: Ähnlichkeit berechnen (Levenshtein-Distanz)
function calculateSimilarity(str1, str2) {
    // Bereits in lowercase konvertiert durch den Aufruf
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = levenshteinDistance(longer, shorter);
    const similarity = (longer.length - distance) / longer.length;
    
    // Debug für kritische Fälle
    if (similarity >= 0.7) {
        console.log(`🧮 CALC DEBUG: "${str1}" vs "${str2}" -> distance: ${distance}, longer: ${longer.length}, similarity: ${Math.round(similarity * 100)}%`);
    }
    
    return similarity;
}

// Levenshtein-Distanz berechnen
function levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Substitution
                    matrix[i][j - 1] + 1,     // Insertion
                    matrix[i - 1][j] + 1      // Deletion
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}

// ====== VOTING SYSTEM ======

// Abstimmung für ein unbekanntes Wort starten
function startVoting(pendingVote) {
    globalGameState.status = 'voting';
    globalGameState.voting = {
        word: pendingVote.word,
        category: pendingVote.category,
        categoryId: pendingVote.categoryId,
        playerId: pendingVote.playerId,
        playerName: pendingVote.playerName,
        votes: { yes: [], no: [] },
        timeLeft: 30, // 30 Sekunden für Abstimmung
        startTime: Date.now(),
        endTime: Date.now() + 30000 // Absolute End-Zeit für Voting
    };

    console.log(`🗳️ Voting started for "${pendingVote.word}" (${pendingVote.category}) by ${pendingVote.playerName}`);

    // Timer für Abstimmung starten
    globalGameState.timer = setInterval(() => {
        globalGameState.voting.timeLeft = Math.max(0, 30 - Math.floor((Date.now() - globalGameState.voting.startTime) / 1000));

        if (globalGameState.voting.timeLeft <= 0 || allPlayersVoted()) {
            endVoting();
        }
    }, 1000);
}

// Stimme abgeben
function vote(user, voteType) {
    if (globalGameState.status !== 'voting') {
        throw new Error('No active voting');
    }

    const player = globalGameState.players.find(p => p.id === user.id);
    if (!player) {
        throw new Error('Player not found');
    }

    // Entferne vorherige Stimme falls vorhanden
    globalGameState.voting.votes.yes = globalGameState.voting.votes.yes.filter(id => id !== user.id);
    globalGameState.voting.votes.no = globalGameState.voting.votes.no.filter(id => id !== user.id);

    // Füge neue Stimme hinzu
    if (voteType === 'yes') {
        globalGameState.voting.votes.yes.push(user.id);
    } else if (voteType === 'no') {
        globalGameState.voting.votes.no.push(user.id);
    }

    console.log(`🗳️ ${user.username} voted ${voteType} for "${globalGameState.voting.word}"`);

    // Prüfe ob alle abgestimmt haben
    if (allPlayersVoted()) {
        endVoting();
    }

    return { success: true, message: `Vote recorded: ${voteType}` };
}

// Prüfen ob alle Spieler abgestimmt haben
function allPlayersVoted() {
    if (!globalGameState.voting) return false;
    
    const votedPlayerIds = [...globalGameState.voting.votes.yes, ...globalGameState.voting.votes.no];
    const activePlayers = globalGameState.players.filter(p => !p.waitingForNextRound);
    
    return activePlayers.every(player => votedPlayerIds.includes(player.id));
}

// Abstimmung beenden
async function endVoting() {
    if (globalGameState.timer) {
        clearInterval(globalGameState.timer);
        globalGameState.timer = null;
    }

    const voting = globalGameState.voting;
    const yesVotes = voting.votes.yes.length;
    const noVotes = voting.votes.no.length;

    console.log(`🗳️ Voting ended for "${voting.word}": ${yesVotes} yes, ${noVotes} no`);

    // Entscheidung treffen (Mehrheit gewinnt)
    if (yesVotes > noVotes) {
        // Wort akzeptiert - zur DB hinzufügen und Punkte vergeben
        try {
            await dataStore.addWord({ word: voting.word, category_id: voting.categoryId });

            const player = globalGameState.players.find(p => p.id === voting.playerId);
            if (player) {
                const points = voting.word.length; // Grundpunkte basierend auf Wortlänge
                player.roundPoints = (player.roundPoints || 0) + points;
                
                console.log(`✅ Word "${voting.word}" accepted and ${points} points awarded to ${voting.playerName}`);
            }
        } catch (error) {
            console.error(`❌ Failed to add word "${voting.word}" to database:`, error);
        }
    } else {
        console.log(`❌ Word "${voting.word}" rejected by vote`);
    }

    // Abstimmung zurücksetzen
    globalGameState.voting = null;

    // Zurück zu results 
    globalGameState.status = 'results';
}

module.exports = {
    joinGame,
    getGameState,
    submitAnswers,
    resetGame,
    vote,
    leaveGame
};
