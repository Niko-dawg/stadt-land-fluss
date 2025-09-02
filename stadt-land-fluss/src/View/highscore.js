import React from "react";
import "./highscore.css";
import logo from "./img/Logo.png";
import { Test } from "./home";
import ReactDOM from "react-dom/client";

const highscores = [
  { position: 1, player: "EmiZocker", score: 100, crown: true },
  { position: 2, player: "TorgerLocker", score: 50, crown: false },
  { position: 3, player: "NikoRocker", score: 20, crown: false }
];

const HighscoreHeader = ({ onHelp, onHome }) => (
  <div className="header">
    <div className="logo"><img src={logo} alt="Logo" /></div>
    <div className="headerButtons">
      <button className="impressumBtn">Impressum</button>
      <button className="helpBtn" onClick={onHelp}>?</button>
      <button className="homeBtn" title="Home" onClick={onHome}>Home</button>
    </div>
  </div>
);

export class Highscore extends React.Component {
  homebtn = () => {
    ReactDOM.createRoot(document.getElementById("root")).render(<Test />);
  };

  helpbtn = () => {
    alert("Hier können Hilfetexte oder Anleitungen angezeigt werden.");
  };

  render() {
    return (
      <div className="highscore-container">
        <HighscoreHeader onHelp={this.helpbtn} onHome={this.homebtn} />
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
}