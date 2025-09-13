// Home-Seite: Startseite mit Multiplayer-Button und Login-Popup
import React, { useState } from "react"; // React-Hook für State
import "./home.css"; // CSS-Stile
import { useNavigate } from "react-router-dom"; // Navigation-Hook
import { Header } from "../components/Header.js"; // Header-Komponente
import SpielStart from "../View/img/SpielStart.png"; // Spiel-Start-Bild

/* Autor: Emilia */
// GameMode-Komponente: Rendert den Spiel-Start-Button
const GameMode = ({ title, players, onClick }) => (
  <div className="home-gameModeContainer">
      <button className="Button-Start" onClick={onClick}>
      <img src={SpielStart} alt="Spiel Start" className="SpielStart" />
      </button>
  </div>
);

/* Emilia */
// Haupt-Home-Komponente
export function Test() {
  const navigate = useNavigate(); // Navigation-Funktion
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // State für Login-Popup

  // Handler für Multiplayer-Button: Prüft Auth und navigiert
  const handleMultiPlayer = () => {
    const token = localStorage.getItem('token'); // Token aus localStorage holen
    if (!token) {
      setShowLoginPrompt(true); // Popup zeigen wenn nicht eingeloggt
      return;
    }
    navigate('/spiel/multi'); // Zum Multiplayer-Spiel navigieren
  };

  // Popup schließen
  const handleClosePopup = () => {
    setShowLoginPrompt(false);
  };

  // Zum Login navigieren und Popup schließen
  const handleGoToLogin = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: "#fcf8ed", minHeight: "100vh", padding: "10px" }}>
      <Header /> {/* Header mit Navigationsbuttons */}
      <GameMode title="Multiplayer" players={4} onClick={handleMultiPlayer} /> {/* Spiel-Button */}

      {/* Login-Popup wenn nicht eingeloggt */}
      {showLoginPrompt && (
        <div className="login-popup-overlay">
          <div className="login-popup">
            <button className="close-button" onClick={handleClosePopup}>×</button>
            <div className="popup-header">Login erforderlich</div>
            <div className="popup-content">
              <p>Nur angemeldete Benutzer können Multiplayer spielen.</p>
              <p>Bitte melden Sie sich an oder lassen Sie sich von einem Admin ein kostenloses Konto erstellen.</p>
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
