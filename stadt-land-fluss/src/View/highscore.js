import React, { useState, useEffect } from "react";
import "./highscore.css";
import { Header } from "../components/Header.js";
import { useNavigate, useParams } from "react-router-dom";

//Autor : Torga & Emilia
export function Highscore() {
  const navigate = useNavigate();
  const [highscores, setHighscores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  let customButtons = [];

  // Highscore-Daten vom Backend laden
  useEffect(() => {
    async function fetchHighscore() {
      try {
        setLoading(true);
        const response = await fetch('/api/highscore?limit=10');
        
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Highscore');
        }
        
        const data = await response.json();
        
        // Daten für Frontend formatieren mit rank
        const formattedData = data.map((entry, index) => ({
          rank: index + 1,
          username: entry.username,
          totalPoints: entry.total_points
        }));
        
        setHighscores(formattedData);
      } catch (err) {
        console.error('Fehler beim Laden der Highscore:', err);
        setError('Highscore konnte nicht geladen werden');
      } finally {
        setLoading(false);
      }
    }
    
    fetchHighscore();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="highscore-container">
        <Header 
          showLogin={false} 
          showAdmin={false} 
          showHighscore={false}
          showHome={true}
          customButtons={customButtons}
        />
        <div className="highscore-table-container">
          <h2 className="highscore-title">Highscore</h2>
          <div className="loading">Lade Highscore...</div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="highscore-container">
        <Header 
          showLogin={false} 
          showAdmin={false} 
          showHighscore={false}
          showHome={true}
          customButtons={customButtons}
        />
        <div className="highscore-table-container">
          <h2 className="highscore-title">Highscore</h2>
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  // TODO: Später erweitern wenn Single/Multiplayer unterschieden wird
  // Für jetzt erstmal einfach halten
  
  return (
    <div className="highscore-container">
      <Header 
        showLogin={false} 
        showAdmin={false} 
        showHighscore={false}
        showHome={true}
        customButtons={customButtons}
      />
      <div className="highscore-table-container">
        <h2 className="highscore-title">Highscore</h2>
        <table className="highscore-table">
          <thead>
            <tr>
              <th>Platz</th>
              <th>Spieler</th>
              <th>Punkte</th>
            </tr>
          </thead>
          <tbody>
            {highscores.map(entry => (
              <tr key={entry.rank}>
                <td>{entry.rank}</td>
                <td>{entry.rank === 1 ? "👑 " : ""}{entry.username}</td>
                <td>{entry.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="highscore-weather-vane"></div>
    </div>
  );
}
