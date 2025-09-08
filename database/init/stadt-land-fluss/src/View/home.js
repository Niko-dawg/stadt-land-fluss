import React from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header.js";

/* Emilia */
const GameMode = ({ title, players, onClick }) => (
  <div className="home-gameModeContainer">
    <div className="home-gameModeButtonWrapper">
      <br />
      <br />
      <button className="gameModeContent" onClick={onClick}>
        <h2>{title}</h2>
        {players !== undefined && <p>Spielende Spieler : {players}</p>}
      </button>
    </div>
  </div>
);

/* Emilia */
export function Test() {
  const navigate = useNavigate();

  const handleSinglePlayer = () => {
    navigate('/spiel/single');
  };
  
  const handleMultiPlayer = () => {
    navigate('/spiel/multi');
  };

  return (
    <div style={{ backgroundColor: "#fcf8ed", minHeight: "100vh", padding: "10px" }}>
      <Header />
      <GameMode title="Single Player" onClick={handleSinglePlayer} />
      <GameMode title="Multiplayer" players={4} onClick={handleMultiPlayer} />
    </div>
  );
}