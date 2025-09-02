import React from "react";
import "./home.css";
import ReactDOM from "react-dom/client";
import { Spiel } from "./spiel.js";
import logo from "./img/Logo.png";
import { Highscore } from "./highscore.js";
import { LoginWindow } from "./login.js";

const Header = ({ onHighscore }) => (
  <header className="header">
    <div className="logo"><img src={logo} alt="Logo" /></div>
    <div className="headerButtons">
      <button className="impressumBtn">Impressum</button>
      <button className="helpBtn">?</button>
      <button className="adminBtn">Admin</button>
      <button className="loginBtn" onClick={() => ReactDOM.createRoot(document.getElementById("root")).render(<LoginWindow />)}>Log in</button>
      <button className="highscoreBtn" onClick={onHighscore}>Highscore</button>
    </div>
  </header>
);

const GameMode = ({ title, players, onClick }) => (
  <div className="home-gameModeContainer">
    <div className="home-gameModeButtonWrapper">
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
  
  handleHighscore = () => {
    ReactDOM.createRoot(document.getElementById("root")).render(<Highscore />);
  };

  render() {
    return (
      <div style={{ backgroundColor: "#fcf8ed", minHeight: "100vh", padding: "10px" }}>
        <Header onHighscore={this.handleHighscore} />
        <GameMode title="Single Player" onClick={this.handleSinglePlayer} />
        <GameMode title="Multiplayer" players={4} onClick={this.handleMultiPlayer} />
      </div>
    );
  }
}