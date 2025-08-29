import React from "react";
import "./home.css";

const Header = () => (
  <header className="header">
    <div className="logo">SLF!</div>
    <div className="headerButtons">
      <button className="helpBtn">?</button>
      <button className="adminBtn">Admin</button>
      <button className="loginBtn">Log in</button>
    </div>
  </header>
);

const GameMode = ({ title, players, onClick }) => (
  <div className="gameModeContainer">
    <button className="highscoreBtn">Highscore</button>
    <div className="gameModeButtonWrapper">
      <button className="gameModeContent" onClick={onClick}>
        <h2>{title}</h2>
        {players !== undefined && <p>Spielende Spieler : {players}</p>}
      </button>
    </div>
  </div>
);

export class Test extends React.Component {
  handleSinglePlayer = () => {
    alert("Single Player ausgewählt!");
  };

  handleMultiPlayer = () => {
    alert("Multiplayer ausgewählt!");
  };

  render() {
    return (
      <div style={{ backgroundColor: "#fcf8ed", minHeight: "100vh", padding: "10px" }}>
        <Header />
        <GameMode title="Single Player" onClick={this.handleSinglePlayer} />
        <GameMode title="Multiplayer" players={4} onClick={this.handleMultiPlayer} />
      </div>
    );
  }
}