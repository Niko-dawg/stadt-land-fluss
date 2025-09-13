// Spiel-Komponente: Hauptspiel-Logik für Single- und Multiplayer
import React, { useState, useEffect } from "react"; // React-Hooks
import "./spiel.css"; // Spiel-CSS
import { Header } from "../components/Header.js"; // Header-Komponente
import { useNavigate, useParams } from "react-router-dom"; // Navigation und URL-Parameter

/* Emilia & Torga */
export function Spiel() {
  const navigate = useNavigate(); // Navigation-Funktion
  const { gameMode } = useParams(); // Spielmodus aus URL ('single' oder 'multi')
  const [gameState, setGameState] = useState(null); // Aktueller Spielstatus
  const [answers, setAnswers] = useState({ // Antworten-State
    Stadt: '',
    Land: '',
    Fluss: '',
    Tier: ''
  });
  const [submissionResult, setSubmissionResult] = useState(null); // Abgabe-Ergebnis
  const [isSubmitted, setIsSubmitted] = useState(false); // Abgabe-Status
  const [loading, setLoading] = useState(true); // Lade-Status
  const [error, setError] = useState(null); // Fehler-Status

  // Smooth Timer States für flüssige Countdowns
  const [smoothTimer, setSmoothTimer] = useState(0);
  const [smoothLobbyTimer, setSmoothLobbyTimer] = useState(0);
  const [smoothVotingTimer, setSmoothVotingTimer] = useState(0);

  // Hilfsfunktion: Prüft ob aktueller Spieler bereits abgestimmt hat
  const hasVoted = () => {
    if (!gameState?.voting) return false;
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // JWT decodieren
      return [...gameState.voting.votes.yes, ...gameState.voting.votes.no].includes(payload.id);
    } catch {
      return false;
    }
  };

  // Hilfsfunktion: Prüft ob Spieler auf nächste Runde wartet
  const isWaitingForNextRound = () => {
    if (!gameState?.players) return false;
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // JWT decodieren
      const currentPlayer = gameState.players.find(p => p.id === payload.id);
      return currentPlayer?.waitingForNextRound || false;
    } catch {
      return false;
    }
  };

  const handleVote = async (voteType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/game/vote', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vote: voteType })
      });

      if (response.ok) {
        console.log(`Voted ${voteType} successfully`);
        // Game state wird durch polling automatisch aktualisiert
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      setError('Network error during voting');
    }
  };

  // Cleanup-Funktion für Multiplayer
  const leaveMultiplayerGame = async () => {
    if (gameMode === 'multi') {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await fetch('/api/game/leave', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('Left multiplayer game');
        }
      } catch (error) {
        console.error('Error leaving game:', error);
      }
    }
  };

  // Multiplayer: Game State polling
  useEffect(() => {
    if (gameMode === 'multi') {
      // Direkt dem Spiel beitreten (Auth-Prüfung passiert schon in home.js)
      joinMultiplayerGame();
      
      // Dann regelmäßig Status abfragen
      const interval = setInterval(fetchGameStatus, 1000);
      
      // Cleanup beim Unmount
      return () => {
        clearInterval(interval);
        leaveMultiplayerGame();
      };
    } else {
      // Singleplayer: Lokaler State
      setGameState({
        status: 'playing',
        currentRound: {
          letter: 'A', // TODO: Zufällig generieren
          timeLeft: 60
        }
      });
      setLoading(false);
    }
  }, [gameMode, navigate]);

  // Browser-Close/Refresh Cleanup
  useEffect(() => {
    const handleBeforeUnload = () => {
      leaveMultiplayerGame();
    };

    if (gameMode === 'multi') {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [gameMode]);

  // State-Reset bei neuer Runde
  useEffect(() => {
    if (gameState?.status === 'playing' && gameState?.currentRound) {
      // Neue Runde erkannt - State zurücksetzen
      setAnswers({
        Stadt: '',
        Land: '',
        Fluss: '',
        Tier: ''
      });
      setIsSubmitted(false);
      setSubmissionResult(null);
      setError(null);
      console.log(`🆕 New round started: Letter ${gameState.currentRound.letter}`);
    }
  }, [gameState?.status, gameState?.currentRound?.letter]);

  // Smooth Timer für bessere UX
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      if (gameState?.status === 'playing' && gameState?.currentRound?.endTime) {
        const timeLeft = Math.max(0, Math.ceil((gameState.currentRound.endTime - now) / 1000));
        setSmoothTimer(timeLeft);
      }
      
      if (gameState?.status === 'results' && gameState?.nextRoundEndTime) {
        const timeLeft = Math.max(0, Math.ceil((gameState.nextRoundEndTime - now) / 1000));
        setSmoothLobbyTimer(timeLeft);
      }
      
      if (gameState?.status === 'voting' && gameState?.voting?.endTime) {
        const timeLeft = Math.max(0, Math.ceil((gameState.voting.endTime - now) / 1000));
        setSmoothVotingTimer(timeLeft);
      }
    }, 100); // Alle 100ms für smooth countdown

    return () => clearInterval(interval);
  }, [gameState?.status, gameState?.currentRound?.endTime, gameState?.nextRoundEndTime, gameState?.voting?.endTime]);

  const joinMultiplayerGame = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('/api/game/join', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to join game');
        setLoading(false); // Loading beenden auch bei Fehler
        return;
      }

      const data = await response.json();
      console.log('Joined game:', data.message);
      
      // Spezielle Behandlung für verschiedene Join-Szenarien
      if (data.waitingForNextRound) {
        setError(null); // Kein Fehler, nur Info
        console.log('Joined during active round - waiting for next round');
      } else if (data.rejoined) {
        console.log('Rejoined existing game');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error joining game:', error);
      setError('Network error');
      setLoading(false); // Loading beenden auch bei Network-Fehler
    }
  };

  const fetchGameStatus = async () => {
    try {
      const response = await fetch('/api/game/status');
      if (response.ok) {
        const data = await response.json();
        
        // DEBUG: Voting-Status loggen
        if (data.status === 'voting' || data.voting) {
          console.log('🗳️ FRONTEND: Voting detected:', { 
            status: data.status, 
            voting: data.voting, 
            gameMode: gameMode 
          });
        }
        
        setGameState(data);
      }
    } catch (error) {
      console.error('Error fetching game status:', error);
    }
  };

  const handleInputChange = (category, value) => {
    setAnswers(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;

    if (gameMode === 'multi') {
      // Multiplayer: Submit über API
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/game/submit', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ answers })
        });

        if (response.ok) {
          const data = await response.json();
          // Two-Phase System: Preview Points sofort anzeigen
          setSubmissionResult({
            previewPoints: data.previewPoints, // PHASE 1: Sofortige Vorschau
            message: data.message
          });
          setIsSubmitted(true);
          // --- UX-Boost: eigenen Spieler sofort auf hasSubmitted setzen ---
          setGameState(prev => {
            if (!prev || !prev.players) return prev;
            try {
              const token = localStorage.getItem('token');
              const payload = JSON.parse(atob(token.split('.')[1]));
              const myId = payload.id;
              return {
                ...prev,
                players: prev.players.map(p =>
                  p.id === myId ? { ...p, hasSubmitted: true } : p
                )
              };
            } catch {
              return prev;
            }
          });
          // -------------------------------------------------------------
          console.log('Answers submitted with preview points:', data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to submit answers');
        }
      } catch (error) {
        console.error('Error submitting answers:', error);
        setError('Network error');
      }
    } else {
      // Singleplayer: Lokale Verarbeitung
      // TODO: Lokale Validierung implementieren
      setIsSubmitted(true);
      console.log('Singleplayer answers:', answers);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Header showLogin={false} showAdmin={false} showHome={true} />
        <div className="loading">Loading game...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Header showLogin={false} showAdmin={false} showHome={true} />
        <div className="error">
          <h2>Error: {error}</h2>
          {error.includes('Login required') && (
            <p>Redirecting to login page...</p>
          )}
        </div>
        <button onClick={() => navigate('/')}>Back to Home</button>
        {error.includes('Login required') && (
          <button onClick={() => navigate('/login')}>Go to Login</button>
        )}
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="container">
        <Header showLogin={false} showAdmin={false} showHome={true} />
        <div className="waiting">Waiting for game...</div>
      </div>
    );
  }

  // Render verschiedene Game States
  if (gameState.status === 'lobby') {
    return (
      <div className="container">
        <Header showLogin={false} showAdmin={false} showHome={true} />
        <div className="lobby">
          <h2>Waiting for players...</h2>
          <p>The game will start automatically when players join.</p>
        </div>
      </div>
    );
  }

  // Special view for players waiting for next round during active game
  if (gameState.status === 'playing' && gameMode === 'multi' && isWaitingForNextRound()) {
    return (
      <div className="container">
        <Header showLogin={false} showAdmin={false} showHome={true} />
        <div className="waiting-for-round">
          <h2>⏭️ Warten auf nächste Runde</h2>
          <p>Das Spiel läuft bereits. Du nimmst an der nächsten Runde teil!</p>
          
          <div className="current-round-info">
            <div className="timer">
              Verbleibende Zeit: {smoothTimer || 60}s
            </div>
            <div className="letter"> 
              <p>Aktueller Buchstabe: <strong>{gameState.currentRound?.letter}</strong></p>
            </div>
          </div>

          {/* Zeige andere Spieler Status */}
          {gameState.players && (
            <div className="players-finished">
              <h3>Spieler Status</h3>
              <div className="player-list">
                {gameState.players.map((player, index) => (
                  <div key={index} className={`player-status ${
                    player.waitingForNextRound ? 'waiting' : 
                    player.hasSubmitted ? 'submitted' : 'pending'
                  }`}>
                    <span className="player-name">
                      {player.name} {
                        player.waitingForNextRound ? '⏭️' : 
                        player.hasSubmitted ? '✓' : '⏳'
                      }
                    </span>
                    {player.waitingForNextRound && (
                      <span className="player-waiting-label">
                        (wartet auf nächste Runde)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState.status === 'results') {
    return (
      <div className="container">
        <Header showLogin={false} showAdmin={false} showHome={true} />
        
        {/* Results Header */}
        <div className="results-header">
          <h2>🏆 Rundenergebnisse</h2>
          <div className="round-letter">
            <span>Buchstabe: </span>
            <div className="letter-badge">{gameState.lastRoundResults?.letter}</div>
          </div>
        </div>

        {/* Player Results */}
        <div className="results-list">
          {gameState.lastRoundResults?.playerResults?.map((player, index) => (
            <div key={index} className={`player-result-card ${index === 0 ? 'winner' : ''}`}>
              <div className="player-rank">#{index + 1}</div>
              <div className="player-info">
                <div className="player-name">{player.name}</div>
                <div className="player-points">{player.roundPoints} Punkte</div>
              </div>
              {index === 0 && <div className="winner-crown">👑</div>}
            </div>
          ))}
        </div>

        {/* Next Round Timer */}
        <div className="next-round">
          <div className="countdown-timer">
            <div className="countdown-number">{smoothLobbyTimer}</div>
            <div className="countdown-text">Nächste Runde</div>
          </div>
        </div>
        
      </div>
    );
  }

  // Main Playing State
  return (
      <div className="container">
        <Header 
          showLogin={false} 
          showAdmin={false}
          showHome={true}
        />
        <div className="secondheader">
          <div className="timer">
            {smoothTimer || 60}
          </div>
          <div className="letter"> 
            <p>Der gesuchte Buchstabe ist :</p>
            <div className="big-letter">
              {gameState.currentRound?.letter || 'A'}
            </div>
          </div>
        </div>

        <div className="game-grid">
          <div className="input-row">
            <div className="background-image bg-1"></div>
            <label>Stadt</label>
            <input 
              type="text" 
              value={answers.Stadt}
              onChange={(e) => handleInputChange('Stadt', e.target.value)}
              disabled={isSubmitted}
            />
          </div>
          <div className="input-row">
            <div className="background-image bg-2"></div>
            <label>Land</label>
            <input 
              type="text" 
              value={answers.Land}
              onChange={(e) => handleInputChange('Land', e.target.value)}
              disabled={isSubmitted}
            />
          </div>
          <div className="input-row">
            <div className="background-image bg-3"></div>
            <label>Fluss</label>
            <input 
              type="text" 
              value={answers.Fluss}
              onChange={(e) => handleInputChange('Fluss', e.target.value)}
              disabled={isSubmitted}
            />
          </div>
          <div className="input-row">
            <div className="background-image bg-4"></div>
            <label>Tier</label>
            <input 
              type="text" 
              value={answers.Tier}
              onChange={(e) => handleInputChange('Tier', e.target.value)}
              disabled={isSubmitted}
            />
          </div>
        </div>

        <button 
          className="AntwortBtn"
          onClick={handleSubmit}
          disabled={isSubmitted}
        >
          {isSubmitted ? 'Antworten abgegeben' : 'Antworten abgeben'}
        </button>

        {/* Submission Results anzeigen - Two-Phase Points */}
        <br />
        <br />
        {submissionResult && submissionResult.previewPoints && (
          <div className="submission-results">
            <h3>🔍 Deine Vorschau-Punkte (Phase 1):</h3>
            <div className="total-preview">
              <strong>Vorläufig: {submissionResult.previewPoints.total} Punkte</strong>
            </div>
            {Object.entries(submissionResult.previewPoints.details).map(([category, detail]) => (
              <div key={category} className={`result-item ${detail.points > 0 ? 'valid' : 'invalid'}`}>
                <strong>{category}:</strong> {answers[category]} 
                <span className="points">({detail.points} Pkt.)</span>
                <span className="reason">{detail.reason}</span>
              </div>
            ))}
            <p className="preview-note">
              ℹ️ {submissionResult.previewPoints.note}
            </p>
            <p className="preview-warning">
              ⚠️ Finale Punkte können abweichen (DB-Prüfung, Uniqueness-Bonus, Voting)
            </p>
          </div>
        )}

        {/* Multiplayer: Spieler Status & Preview Points */}
        {gameMode === 'multi' && gameState.players && (
          <div className="players-finished">
            Fertige Spieler: {gameState.players.filter(p => p.hasSubmitted).length}/{gameState.players.filter(p => !p.waitingForNextRound).length}
            <div className="player-list">
              {gameState.players.map((player, index) => (
                <div key={index} className={`player-status ${
                  player.waitingForNextRound ? 'waiting' : 
                  player.hasSubmitted ? 'submitted' : 'pending'
                }`}>
                  <span className="player-name">
                    {player.name} {
                      player.waitingForNextRound ? '⏭️' : 
                      player.hasSubmitted ? '✓' : '⏳'
                    }
                  </span>
                  {player.waitingForNextRound && (
                    <span className="player-waiting-label">
                      (wartet auf nächste Runde)
                    </span>
                  )}
                  {player.previewPoints && !player.waitingForNextRound && (
                    <span className="player-preview-points">
                      (Vorschau: {player.previewPoints.total} Pkt.)
                    </span>
                  )}
                  {player.roundPoints > 0 && !player.waitingForNextRound && (
                    <span className="player-final-points">
                      [Final: {player.roundPoints} Pkt.]
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DEBUG: Status-Anzeige */}
        {gameMode === 'multi' && (
          <div style={{position: 'fixed', top: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '8px', fontSize: '12px', borderRadius: '4px'}}>
            Status: {gameState?.status} | Voting: {gameState?.voting ? 'YES' : 'NO'}
          </div>
        )}

        {/* Voting Interface für unbekannte Wörter */}
        {gameMode === 'multi' && gameState.status === 'voting' && gameState.voting && (
          <div className="voting-interface">
            <h3>🗳️ Abstimmung über unbekanntes Wort</h3>
            <div className="voting-word">
              <strong>"{gameState.voting.word}"</strong> 
              <span className="voting-category">(Kategorie: {gameState.voting.category})</span>
              <span className="voting-player">von {gameState.voting.playerName}</span>
            </div>
            <div className="voting-timer">
              Zeit: {smoothVotingTimer}s
            </div>
            <div className="voting-buttons">
              <button 
                className="vote-yes"
                onClick={() => handleVote('yes')}
                disabled={hasVoted()}
              >
                ✅ Ja, gültiges Wort
              </button>
              <button 
                className="vote-no"
                onClick={() => handleVote('no')}
                disabled={hasVoted()}
              >
                ❌ Nein, ungültiges Wort
              </button>
            </div>
            <div className="voting-status">
              <span className="yes-votes">Ja: {gameState.voting.votes.yes.length}</span>
              <span className="no-votes">Nein: {gameState.voting.votes.no.length}</span>
            </div>
            {hasVoted() && (
              <p className="voted-message">✓ Du hast bereits abgestimmt!</p>
            )}
          </div>
        )}

        {/* Singleplayer: Einfacher Status */}
        {gameMode === 'single' && (
          <div className="single-player-status">
            <p>Singleplayer Mode - {isSubmitted ? 'Antworten abgegeben!' : 'Fülle alle Felder aus'}</p>
          </div>
        )}
      </div>
    );
}