import React from "react";
import "./highscore.css";
import { Header } from "../components/Header.js";
import { useNavigate } from "react-router-dom";

/* Emilia */
const highscores = [
  { position: 1, player: "EmiZocker", score: 100, crown: true },
  { position: 2, player: "TorgerLocker", score: 50, crown: false },
  { position: 3, player: "NikoRocker", score: 20, crown: false }
];

/* Emilia */
export function Highscore() {
  const navigate = useNavigate();
  
  const customButtons = [
    {
      text: "Home",
      className: "homeBtn",
      title: "Home", 
      onClick: () => navigate('/')
    }
  ];

  return (
    <div className="highscore-container">
      <Header 
        showLogin={false} 
        showAdmin={false} 
        showHighscore={false}
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
