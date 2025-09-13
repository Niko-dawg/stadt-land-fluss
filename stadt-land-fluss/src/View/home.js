import React, { useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header.js";
import SpielStart from "../View/img/SpielStart.png";


/* Emilia */
const GameMode = ({ title, players, onClick }) => (
  <div className="home-gameModeContainer">
   
      <br />
      <button className="Button-Start" onClick={onClick}>
      <img src={SpielStart} alt="Spiel Start" />
      </button>
    
  </div>
);

/* Emilia */
export function Test() {
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  
  const handleMultiPlayer = () => {
    // Erst Auth-Status prüfen für Multiplayer
    const token = localStorage.getItem('token');
    if (!token) {
      // Popup anzeigen anstatt Alert
      setShowLoginPrompt(true);
      return;
    }
    
    // Wenn Token vorhanden, zum Multiplayer-Spiel
    navigate('/spiel/multi');
  };

  const handleClosePopup = () => {
    setShowLoginPrompt(false);
  };

  const handleGoToLogin = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: "#fcf8ed", minHeight: "100vh", padding: "10px" }}>
      <Header />
      <GameMode title="Multiplayer" players={4} onClick={handleMultiPlayer} />
      
      {/* Login Required Popup */}
      {showLoginPrompt && (
        <div className="login-popup-overlay">
          <div className="login-popup">
            <button className="close-button" onClick={handleClosePopup}>×</button>
            <div className="popup-header">Login erforderlich</div>
            <div className="popup-content">
              <p>Nur angemeldete Benutzer können Multiplayer spielen.</p>
              <p>Bitte melden Sie sich an oder erstellen Sie ein kostenloses Konto.</p>
            </div>
            <div className="popup-buttons">
              <button className="popup-login-btn" onClick={handleGoToLogin}>
                Zum Login
              </button>
              <button className="popup-cancel-btn" onClick={handleClosePopup}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}