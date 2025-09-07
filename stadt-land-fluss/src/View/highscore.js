import React from "react";
import "./highscore.css";
import { Header } from "../components/Header.js";
import { useNavigate, useParams } from "react-router-dom";
// import {getHighscores, addHighscore, validatePoints } from "../Model/highscore_logic.js";

/* Emilia
const highscore = getHighscores();
const newEntry = addHighscore('00', 75);
const validatePointsResult = validatePoints(75);
*/

/* Emilia */

const highscores = [
  { position: 1, player: "Anna", score: 150, crown: true },
  { position: 2, player: "Benny", score: 100, crown: false },
  { position: 3, player: "Clara", score: 75, crown: false },
  { position: 4, player: "David", score: 50, crown: false },
];

/* Emilia */
export function Highscore() {
  const navigate = useNavigate();
  
  let customButtons = [];

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
              <tr key={entry.position}>
                <td>{entry.position}</td>
                <td>{entry.crown ? "👑 " : ""}{entry.player}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="highscore-weather-vane"></div>
    </div>
  );
}
