//===================================================================
// HEADER COMPONENT - Navigation Bar für gesamte Application  
//===================================================================
// Autor: Torga Aslan, Emilia
//
// Beschreibung: React Header Component für App Navigation
// - Configurable Button Display (showLogin, showAdmin, etc.)
// - User Authentication Status Display
// - Logo und Brand Integration
// - Responsive Navigation für alle Views
// - Custom Button Support für spezielle Views
//===================================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../View/img/Logo.png";

//===================================================================
// MAIN HEADER COMPONENT - Configurable Navigation Bar
//===================================================================

export const Header = ({ 
  showHighscore = true,     // Highscore Button anzeigen
  showLogin = true,         // Login/Logout Button anzeigen
  showAdmin = true,         // Admin Button anzeigen (nur für Admins)
  showHelp = true,          // Help Button anzeigen
  showImpressum = true,     // Impressum Button anzeigen
  showHome = false,         // Home Button anzeigen
  customButtons = [],       // Custom Buttons für spezielle Views
  onHighscore              // Custom Highscore Handler
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Authentication Status Check - Login Status überwachen
  useEffect(() => {
    const checkLoginStatus = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkLoginStatus();

    // Listen for localStorage changes (e.g., when user logs in from another tab)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleHighscore = onHighscore || (() => navigate('/highscore'));
  const handleLogin = () => navigate('/login');
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Korrekt: 'token' nicht 'authToken'
    setUser(null);
    navigate('/');
  };
  const handleAdmin = () => navigate('/admin');
  const handleHelp = () => navigate('/help');
  const handleImpressum = () => navigate('/impressum');
  const handleHome = () => navigate('/');

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="headerButtons">
        {showImpressum && (
          <button className="impressumBtn" onClick={handleImpressum}>Impressum</button>
        )}

        {showHelp && (
          <button className="helpBtn" onClick={handleHelp}>Hilfe</button>
        )}
        
        {showHighscore && (
          <button className="highscoreBtn" onClick={handleHighscore}>Highscore</button>
        )}
        
        {showAdmin && user && user.is_admin && (
          <button className="adminBtn" onClick={handleAdmin}>Admin</button>
        )}
        
        {showLogin && !user && (
          <button className="loginBtn" onClick={handleLogin}>Log in</button>
        )}

        {showLogin && user && (
          <button className="loginBtn" onClick={handleLogout}>
            Ausloggen ({user.username})
          </button>
        )}

        {showHome && (
          <button className="homeBtn" onClick={handleHome}>Home</button>
        )}

        {/* Custom Buttons für spezielle Seiten... in speziellen Fällen einfach erweiterbar */}
        {customButtons.map((button, index) => (
          <button 
            key={index} 
            className={button.className} 
            onClick={button.onClick}
            title={button.title}
          >
            {button.text}
          </button>
        ))}
      </div>
    </header>
  );
};
