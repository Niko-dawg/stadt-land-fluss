//===================================================================
// HOME PAGE - Landing Page mit Multiplayer Game Entry Point
//===================================================================
// Autor: Torga Aslan, Emilia
//
// Beschreibung: React Homepage Component mit Game Access Control
// - Multiplayer Game Entry mit Authentication Check
// - Login-Required Popup für nicht-eingeloggte User
// - Navigation Integration mit React Router
// - Responsive UI mit Background Styling
//===================================================================

import React, { useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header.js";
import SpielStart from "../View/img/SpielStart.png";

//===================================================================
// GAME MODE COMPONENT - Reusable Game Entry Button
//===================================================================

// GameMode Button Component - Renders Spiel-Start Button mit Custom Styling
const GameMode = ({ title, players, onClick }) => (
  <div className="home-gameModeContainer">
      <button className="Button-Start" onClick={onClick}>
      <img src={SpielStart} alt="Spiel Start" className="SpielStart" />
      </button>
  </div>
);

//===================================================================
// MAIN HOME COMPONENT - Landing Page mit Authentication Flow
//===================================================================

// Main Home Page Component mit Login-Gated Multiplayer Access
export function Test() {
  const navigate = useNavigate(); // React Router Navigation
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // Login Popup State

  //===================================================================
  // EVENT HANDLERS - User Interaction Logic
  //===================================================================

  // Multiplayer Button Handler - Authentication Check vor Game Entry
  const handleMultiPlayer = () => {
    const token = localStorage.getItem('token'); // JWT Token Check
    if (!token) {
      setShowLoginPrompt(true); // Show Login Required Popup
      return;
    }
    navigate('/spiel/multi'); // Navigate to Multiplayer Game
  };

  // Login Popup Close Handler
  const handleClosePopup = () => {
    setShowLoginPrompt(false);
  };

  // Navigate to Login Page Handler
  const handleGoToLogin = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  //===================================================================
  // COMPONENT RENDER - UI Layout
  //===================================================================

  return (
    <div style={{ backgroundColor: "#fcf8ed", minHeight: "100vh", padding: "10px" }}>
      <Header /> {/* Navigation Header Component */}
      <GameMode title="Multiplayer" players={4} onClick={handleMultiPlayer} /> {/* Game Entry Button */}

            {/* Authentication Required Popup Modal */}
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
