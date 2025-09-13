// Game Service - Business Logic
// Autor: Torga & Emilia
// 
// ===== WICHTIGE ERKENNTNISSE =====
// - globalGameState: PRIVATER Server-Zustand (komplette Daten)
// - baseState: ÖFFENTLICHE Frontend-Daten (gefiltert je nach Status)
// - Lobby existiert nur wenn NIEMAND im Spiel ist
// - Erster Spieler → Spiel startet SOFORT
// - Timer-System: setInterval (starten) + clearInterval (stoppen) für 1s-Takt

const dataStore = require('../../store/DataStore'); // Schon eine Instanz (Singleton)

// ===== GLOBALER GAME STATE (Vollständiger Server-Zustand) =====
let globalGameState = {
    status: 'lobby',              // 'lobby' (leer), 'playing' (Runde läuft), 'results' (Ergebnisse), 'voting' (Abstimmung)
    players: [],                  // [{ id, name, connected, answers, roundPoints, waitingForNextRound }]
    currentRound: null,           // { letter, categories, timeLeft, startTime, endTime } - nur während 'playing'
    lastRoundResults: null,       // Gespeicherte Ergebnisse für Results-Screen (nach endRound())
    timer: null,                  // setInterval Timer-ID für Rundentimer/Voting
    voting: null,                 // { word, category, votes: {yes:[], no:[]}, timeLeft } - nur während 'voting'
    votingQueue: [],              // Queue aller Wörter die abgestimmt werden müssen
    nextRoundIn: 0,              // Countdown für nächste Runde (10,9,8...) - nur während 'results'
    nextRoundEndTime: null       // Absolute End-Zeit für Next-Round-Timer - nur während 'results'
};

// Kategorien für das Spiel
const CATEGORIES = ['Stadt', 'Land', 'Fluss', 'Tier'];
const ROUND_TIME = 60; // Sekunden
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// ===== FRONTEND-DATENFILTERUNG =====
// Game State abrufen - WICHTIG: Nur gefilterte Daten ans Frontend!
// globalGameState = PRIVATER Server-Zustand (alles)
// baseState = ÖFFENTLICHER Frontend-Zustand (nur was nötig ist)
function getGameState() {
    // Timer aktualisieren falls Runde läuft (Live-Update für timeLeft)
    if (globalGameState.status === 'playing' && globalGameState.currentRound) {
        updateTimer(); // Berechnet aktuelle timeLeft basierend auf verstrichener Zeit
    }
    
    // BASIS-ZUSTAND: Immer verfügbar fürs Frontend
    const baseState = {
        status: globalGameState.status,
        players: globalGameState.players.map(p => ({
            id: p.id,
            name: p.name,
            connected: p.connected,
            hasSubmitted: p.answers && Object.keys(p.answers).length > 0, // Boolean statt komplette answers
            roundPoints: p.roundPoints || 0,
            waitingForNextRound: p.waitingForNextRound || false
        }))
    };

    // ===== STATUS-ABHÄNGIGE DATEN =====
    // Je nach Spielstatus werden verschiedene Daten hinzugefügt:
    if (globalGameState.status === 'playing') {
        // WÄHREND RUNDE: Frontend braucht currentRound für Timer + Buchstabe
        baseState.currentRound = globalGameState.currentRound; // { letter, timeLeft, endTime, etc. }
    } else if (globalGameState.status === 'results') {
        // NACH RUNDE: Frontend braucht Ergebnisse + Countdown zur nächsten Runde
        baseState.lastRoundResults = globalGameState.lastRoundResults; // Wer hat was geantwortet + Punkte
        baseState.nextRoundIn = globalGameState.nextRoundIn || 0; // Countdown: 10,9,8...
        baseState.nextRoundEndTime = globalGameState.nextRoundEndTime; // Für smooth Timer
    } else if (globalGameState.status === 'voting') {
        // WÄHREND ABSTIMMUNG: Frontend braucht voting für Abstimmungs-UI
        baseState.voting = globalGameState.voting; // { word, category, votes, timeLeft }
    }
    // LOBBY: Keine extra Daten nötig
    
    return baseState; // Gefilterte, sichere Daten für Frontend
}

// DataStore Hilfsfunktion
function ensureDataStoreInitialized() {
    if (!dataStore.initialized) {
        throw new Error('DataStore not initialized. Please wait for server startup to complete.');
    }
}

// ===== SPIELER-BEITRITT =====
// WICHTIGE ERKENNTNISSE:
// - Lobby existiert NUR wenn players.length === 0 
// - Erster Spieler → Spiel startet SOFORT (keine Wartelobby!)
// - Während laufender Runde → Spieler wartet bis nächste Runde
function joinGame(user) {
    ensureDataStoreInitialized();
    
    // FALL 1: Spieler ist bereits im Spiel (Reconnect)
    const existingPlayer = globalGameState.players.find(p => p.id === user.id);
    if (existingPlayer) {
        existingPlayer.connected = true;
        return {
            success: true,
            playerId: user.id,
            message: `${user.username} is already in the game`,
            gameStarted: false,
            rejoined: true
        };
    }

    // Neuen Spieler erstellen (aber noch NICHT hinzufügen!)
    const newPlayer = {
        id: user.id,              // User-ID aus JWT Token
        name: user.username,      // Username aus JWT Token
        connected: true,
        answers: {},              // Antworten für aktuelle Runde
        roundPoints: 0,           // Punkte der aktuellen Runde
        waitingForNextRound: false // Flag: Muss bis nächste Runde warten?
    };

    // FALL 2: Spiel läuft bereits → Spieler muss warten
    if (globalGameState.status === 'playing') {
        newPlayer.waitingForNextRound = true; // Flag setzen BEVOR er hinzugefügt wird
        globalGameState.players.push(newPlayer); // Jetzt hinzufügen
        return {
            success: true,
            playerId: user.id,
            message: `${user.username} joined during round. You'll participate in the next round.`,
            gameStarted: false,
            waitingForNextRound: true
        };
    }

    // FALL 3: Erster Spieler in leerer Lobby → SOFORT SPIELEN!
    if (globalGameState.players.length === 0 && globalGameState.status === 'lobby') {
        globalGameState.players.push(newPlayer); // Hinzufügen
        startNewRound(); // Spiel startet automatisch
        return {
            success: true,
            playerId: user.id,
            message: `${user.username} joined and started the game!`,
            gameStarted: true
        };
    }

    // FALL 4: Unerwarteter Zustand (sollte nie passieren)
    // Mehrere Spieler in Lobby ist unmöglich, da erster Spieler → sofort spielen
    throw new Error(`Cannot join game in unexpected state: status=${globalGameState.status}, players=${globalGameState.players.length}`);
}

// ===== NEUE RUNDE STARTEN =====
function startNewRound() {
    // Zufälligen Buchstaben wählen (kann sich wiederholen für infinite game)
    const randomLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];

    // Alle Spieler für neue Runde zurücksetzen
    globalGameState.players.forEach(player => {
        player.answers = {};                    // Leere Antworten
        player.roundPoints = 0;                 // Punkte zurücksetzen
        player.waitingForNextRound = false;     // Alle können wieder mitspielen
    });

    // ===== CURRENTROUND ERSTELLEN =====
    // Dies ist die Quelle für baseState.currentRound im Frontend!
    globalGameState.currentRound = {
        letter: randomLetter,                           // Der aktuelle Buchstabe (z.B. "A")
        categories: CATEGORIES,                         // ["Stadt", "Land", "Fluss", "Tier"]
        timeLeft: ROUND_TIME,                          // 60 Sekunden (wird jede Sekunde reduziert)
        startTime: Date.now(),                         // Wann Runde startete (für Berechnung)
        endTime: Date.now() + (ROUND_TIME * 1000)     // Absolute End-Zeit für smooth Frontend-Timer
    };

    globalGameState.status = 'playing';                // Status auf 'playing' setzen
    globalGameState.lastRoundResults = null;           // Vorherige Ergebnisse löschen

    console.log(`🎮 New round started with letter: ${randomLetter}`);

    // ===== TIMER STARTEN =====
    startRoundTimer(); // Startet setInterval für 60-Sekunden Countdown
}

// ===== TIMER-SYSTEM =====
// WICHTIG: setInterval = "Mach das alle X Sekunden"
//          clearInterval = "Hör auf damit!"

// Round Timer starten - Der "Herzschlag" des Spiels
function startRoundTimer() {
    // DEFENSIVE PROGRAMMIERUNG: Alten Timer stoppen falls vorhanden
    // Verhindert mehrere parallel laufende Timer (Race Conditions)
    if (globalGameState.timer) {
        clearInterval(globalGameState.timer); // Timer stoppen
    }

    // NEUEN TIMER STARTEN: Alle 1000ms (1 Sekunde) ausführen
    globalGameState.timer = setInterval(() => {
        updateTimer();  // Zeit reduzieren (60 → 59 → 58 ...)
        
        // RUNDE BEENDEN wenn:
        // 1. Zeit abgelaufen (timeLeft <= 0) ODER
        // 2. Alle aktiven Spieler haben abgegeben
        if (globalGameState.currentRound.timeLeft <= 0 || allPlayersSubmitted()) {
            endRound(); // Runde beenden
        }
    }, 1000);  // ← 1000ms = 1 Sekunde Intervall ("Tick-Tock")
}

// Timer aktualisieren - Berechnet aktuelle verbleibende Zeit
function updateTimer() {
    // SAFETY CHECK: Falls currentRound null ist (Race Condition)
    // Verhindert Crashes nach Rundende wenn Timer noch läuft
    if (!globalGameState.currentRound) return;

    // Zeit berechnen: Wie viele Sekunden sind seit Rundenbeginn vergangen?
    const elapsed = Math.floor((Date.now() - globalGameState.currentRound.startTime) / 1000);
    // Verbleibende Zeit = Gesamtzeit - vergangene Zeit (min. 0)
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

// ===== RUNDE BEENDEN =====
async function endRound() {
    // TIMER STOPPEN: Wichtig um Memory Leaks zu vermeiden
    if (globalGameState.timer) {
        clearInterval(globalGameState.timer); // Timer stoppen
        globalGameState.timer = null;         // Timer-ID löschen
    }

    // Buchstaben SICHERN bevor currentRound gelöscht wird
    const currentLetter = globalGameState.currentRound.letter;
    globalGameState.currentRound = null; // Round-Daten löschen (Status → nicht mehr 'playing')

    // ===== PUNKTE BERECHNEN =====
    // ERST finale Punkte berechnen (mit Unique-Bonus + Ähnlichkeits-Algorithmus)
    await calculateAndSavePoints(currentLetter);

    // ===== LASTROUNDRESULTS ERSTELLEN =====
    // DANN Rundenergebnisse für Frontend vorbereiten
    // WARUM SPEICHERN? Frontend braucht diese Daten für Results-Screen:
    // - Welcher Buchstabe war dran? (currentRound ist schon null!)
    // - Was hat jeder geantwortet?
    // - Wie viele Punkte wurden vergeben?
    const roundResults = {
        letter: currentLetter,    // Buchstabe der beendeten Runde
        playerResults: globalGameState.players.map(p => ({
            name: p.name,
            answers: p.answers,           // Was wurde geantwortet
            roundPoints: p.roundPoints,   // Erhaltene Punkte (nach Berechnung!)
            details: getPlayerRoundDetails(p, currentLetter)
        }))
    };

    globalGameState.lastRoundResults = roundResults; // Für Frontend verfügbar machen

    console.log(`📊 Round ended. Results:`, globalGameState.lastRoundResults.playerResults.map(p => `${p.name}: ${p.roundPoints}pts`));
}

// Finale Punkte berechnen und in DB speichern (mit Unique-Bonus)
async function calculateAndSavePoints(currentLetter) {
    const currentLetterLower = currentLetter.toLowerCase();
    const db = require('../../db'); // DB-Verbindung
    const pendingVotes = []; // { word, category, playerId, playerName }

    // Alle Spieler-Rundenpunkte zurücksetzen für finale Berechnung
    globalGameState.players.forEach(player => {
        player.roundPoints = 0;
    });

    // CATEGORIES mit for...of statt forEach für async/await
    for (const categoryName of CATEGORIES) {
        // Category-ID aus DataStore holen
        const categoryData = dataStore.findCategoryByName(categoryName);
        if (!categoryData) {
            console.warn(`Category '${categoryName}' not found in database`);
            continue;
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
        for (const a of answers) {
            const player = globalGameState.players.find(p => p.id === a.playerId);
            const normalizedAnswer = a.answer.toLowerCase().trim();
            
            // 1. Prüfen ob Antwort mit richtigem Buchstaben beginnt
            const startsWithLetter = normalizedAnswer.startsWith(currentLetterLower);
            if (!startsWithLetter) {
                console.log(`❌ ${a.playerName}: "${a.answer}" (Category: ${categoryName}) - Wrong letter`);
                continue; // 0 Punkte
            }

            // 2. Prüfen ob Wort in der Datenbank existiert
            const wordInDB = dataStore.findWordInCategory(a.answer, categoryData.category_id);
            if (!wordInDB) {
                // Prüfe auf ähnliche Wörter (bis zu 80% Fehlerquote), aber nur mit richtigem Anfangsbuchstaben
                const similarWord = findSimilarWord(a.answer, categoryData.category_id, currentLetterLower);
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
                continue; // Nächste Antwort in dieser Kategorie
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
        }
    } // Ende der for...of Schleife

    // Wenn es Wörter für Abstimmung gibt, starte Abstimmungssequenz
    if (pendingVotes.length > 0) {
        globalGameState.votingQueue = [...pendingVotes]; // ALLE falschen Wörter in Queue
        console.log(`🗳️ Starting voting sequence for ${globalGameState.votingQueue.length} words`);
        startNextVoting(); // Startet das erste Voting aus der Queue
    } else {
        // Kein Voting → Direkt zu Results
        globalGameState.status = 'results';
        
        // Nach 10 Sekunden automatisch nächste Runde starten
        setupNextRoundTimer();
    }
}

// Next Round Timer Setup (ausgelagert)
function setupNextRoundTimer() {
    let countdown = 10;
    globalGameState.nextRoundIn = countdown;
    globalGameState.nextRoundEndTime = Date.now() + 10000;
    
    const countdownTimer = setInterval(() => {
        countdown--;
        globalGameState.nextRoundIn = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownTimer);
            
            // Wenn noch Spieler da sind → nächste Runde
            if (globalGameState.players.length > 0) {
                startNewRound();
            } else {
                // Spiel beenden wenn keine Spieler mehr da
                resetGame();
            }
        }
    }, 1000);
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
        voting: null,
        votingQueue: [],             // Voting-Queue zurücksetzen
        nextRoundIn: 0,              // Countdown zurücksetzen
        nextRoundEndTime: null       // Timer zurücksetzen
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

// Nächstes Voting aus der Queue starten
function startNextVoting() {
    if (globalGameState.votingQueue.length === 0) {
        // Keine Wörter mehr in der Queue → Zu Results
        console.log(`🎯 All voting completed, moving to results`);
        globalGameState.status = 'results';
        setupNextRoundTimer();
        return;
    }

    // Erstes Wort aus der Queue nehmen
    const nextVote = globalGameState.votingQueue.shift(); // shift() entfernt und gibt erstes Element zurück
    console.log(`🗳️ Starting vote ${globalGameState.votingQueue.length + 1} for "${nextVote.word}" - ${globalGameState.votingQueue.length} remaining`);
    startVoting(nextVote);
}

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
        timeLeft: 60, // 60 Sekunden für Abstimmung (länger für bessere UX)
        startTime: Date.now(),
        endTime: Date.now() + 60000 // 60 Sekunden Timer
    };

    console.log(`🗳️ Voting started for "${pendingVote.word}" (${pendingVote.category}) by ${pendingVote.playerName} - 60 seconds to decide`);

    // Timer für Abstimmung starten
    globalGameState.timer = setInterval(() => {
        globalGameState.voting.timeLeft = Math.max(0, 60 - Math.floor((Date.now() - globalGameState.voting.startTime) / 1000));

        // NUR bei Zeit abgelaufen beenden - KEIN Auto-Accept mehr!
        if (globalGameState.voting.timeLeft <= 0) {
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

    // Prüfe ob alle abgestimmt haben - NUR wenn ALLE Spieler abgestimmt haben
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
    
    // Bei 0 Spielern → nicht alle haben gevotet (verhindert sofortiges Ende)
    if (activePlayers.length === 0) return false;
    
    // ALLE SPIELER müssen abstimmen - auch der der das Wort eingegeben hat!
    // KEIN Auto-Accept mehr - jeder entscheidet selbst über sein Wort
    console.log(`🗳️ Voting check: ${votedPlayerIds.length}/${activePlayers.length} players voted (including word submitter)`);
    
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

    // EINFACHE DEMOKRATISCHE ENTSCHEIDUNG - Mehrheit gewinnt!
    // Kein Auto-Accept, keine komplizierte Validierung
    if (yesVotes > noVotes) {
        // Wort akzeptiert - zur DB hinzufügen und Punkte vergeben
        try {
            await dataStore.addWord({ word: voting.word, category_id: voting.categoryId });

            const player = globalGameState.players.find(p => p.id === voting.playerId);
            if (player) {
                const points = voting.word.length; // Grundpunkte basierend auf Wortlänge
                player.roundPoints = (player.roundPoints || 0) + points;
                
                //  WICHTIG: Auch game_entries für Highscore erstellen!
                const db = require('../../db');
                await db.query(`
                    INSERT INTO game_entries (user_id, category_id, answer, points, is_multiplayer)
                    VALUES ($1, $2, $3, $4, true)
                `, [voting.playerId, voting.categoryId, voting.word, points]);
                
                // DataStore synchronisieren
                dataStore.addGameEntry({
                    game_entries_id: null,
                    user_id: voting.playerId,
                    category_id: voting.categoryId,
                    answer: voting.word,
                    points: points,
                    is_multiplayer: true
                });
                
                console.log(`✅ Word "${voting.word}" accepted by majority vote and ${points} points awarded to ${voting.playerName}`);
                console.log(`💾 Voting word saved to game_entries for highscore calculation`);
            }
        } catch (error) {
            console.error(`❌ Failed to add word "${voting.word}" to database:`, error);
        }
    } else {
        console.log(`❌ Word "${voting.word}" rejected by majority vote (or tie = reject)`);
    }

    // Abstimmung zurücksetzen
    globalGameState.voting = null;

    // Results mit aktuellen Punkten aktualisieren falls sie existieren
    if (globalGameState.lastRoundResults) {
        globalGameState.lastRoundResults.playerResults.forEach(result => {
            const player = globalGameState.players.find(p => p.name === result.name);
            if (player) {
                result.roundPoints = player.roundPoints; // Aktualisierte Punkte nach Voting
            }
        });
    }
    
    // NÄCHSTES VOTING starten oder zu Results wenn Queue leer
    startNextVoting();
}

module.exports = {
    joinGame,
    getGameState,
    submitAnswers,
    resetGame,
    vote,
    leaveGame
};
