import React from "react";
import "./home.css";
import ReactDOM from "react-dom/client";
import { Spiel } from "./spiel.js";
import logo from "./img/logo.png";



const Header = () => (
  <header className="header">
    <div className="logo"><img src={logo} alt="Logo" /></div>
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
    ReactDOM.createRoot(document.getElementById("root")).render(<Spiel />);
  };

  handleMultiPlayer = () => {
    ReactDOM.createRoot(document.getElementById("root")).render(<Spiel />);
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