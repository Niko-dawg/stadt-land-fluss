// Header-Komponente: Zeigt Logo und Navigationsbuttons an
import React, { useState, useEffect } from "react"; // React-Hooks für State und Effekte
import { useNavigate } from "react-router-dom"; // Navigation-Hook
import logo from "../View/img/Logo.png"; // Logo-Bild

/*Autor: Emilia und Torga */

export const Header = ({
  showHighscore = true, // Zeigt Highscore-Button (default true)
  showLogin = true, // Zeigt Login/Logout-Button (default true)
  showAdmin = true, // Zeigt Admin-Button (default true)
  showHelp = true, // Zeigt Hilfe-Button (default true)
  showImpressum = true, // Zeigt Impressum-Button (default true)
  showHome = false, // Zeigt Home-Button (default false)
  customButtons = [], // Array für benutzerdefinierte Buttons
  onHighscore // Optionale Callback für Highscore
}) => {
  const navigate = useNavigate(); // Hook für Navigation
  const [user, setUser] = useState(null); // State für eingeloggten User

  // Überprüft Login-Status beim Mount und bei localStorage-Änderungen
  useEffect(() => {
    const checkLoginStatus = () => {
      const userData = localStorage.getItem('user'); // Holt User-Daten aus localStorage
      if (userData) {
        try {
          setUser(JSON.parse(userData)); // Parst User-Daten
        } catch (error) {
          console.error('Error parsing user data:', error); // Fehlerbehandlung
          localStorage.removeItem('user'); // Entfernt ungültige Daten
          setUser(null);
        }
      } else {
        setUser(null); // Kein User eingeloggt
      }
    };

    checkLoginStatus(); // Initiale Überprüfung

    // Lauscht auf localStorage-Änderungen (z.B. Login in anderem Tab)
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus); // Cleanup
    };
  }, []);

  // Handler-Funktionen für Button-Klicks
  const handleHighscore = onHighscore || (() => navigate('/highscore')); // Highscore navigieren
  const handleLogin = () => navigate('/login'); // Login-Seite
  const handleLogout = () => {
    localStorage.removeItem('user'); // Entfernt User-Daten
    localStorage.removeItem('token'); // Entfernt Token (Korrekt: 'token' nicht 'authToken')
    setUser(null); // Setzt User-State zurück
    navigate('/'); // Zur Startseite
  };
  const handleAdmin = () => navigate('/admin'); // Admin-Seite
  const handleHelp = () => navigate('/help'); // Hilfe-Seite
  const handleImpressum = () => navigate('/impressum'); // Impressum-Seite
  const handleHome = () => navigate('/'); // Startseite

  return (
    <header className="header"> {/* Header-Container */}
      <div className="logo"> {/* Logo-Bereich */}
        <img src={logo} alt="Logo" />
      </div>
      <div className="headerButtons"> {/* Button-Bereich */}
        {showImpressum && ( // Bedingtes Rendern des Impressum-Buttons
          <button className="impressumBtn" onClick={handleImpressum}>Impressum</button>
        )}

        {showHelp && ( // Hilfe-Button
          <button className="helpBtn" onClick={handleHelp}>Hilfe</button>
        )}

        {showHighscore && ( // Highscore-Button
          <button className="highscoreBtn" onClick={handleHighscore}>Highscore</button>
        )}

        {showAdmin && user && user.is_admin && ( // Admin-Button nur für Admins
          <button className="adminBtn" onClick={handleAdmin}>Admin</button>
        )}

        {showLogin && !user && ( // Login-Button wenn nicht eingeloggt
          <button className="loginBtn" onClick={handleLogin}>Log in</button>
        )}

        {showLogin && user && ( // Logout-Button mit Username wenn eingeloggt
          <button className="loginBtn" onClick={handleLogout}>
            Ausloggen ({user.username})
          </button>
        )}

        {showHome && ( // Home-Button
          <button className="homeBtn" onClick={handleHome}>Home</button>
        )}

        {/* Benutzerdefinierte Buttons für spezielle Seiten - erweiterbar */}
        {customButtons.map((button, index) => (
          <button
            key={index} // Eindeutiger Key für React
            className={button.className} // CSS-Klasse
            onClick={button.onClick} // Click-Handler
            title={button.title} // Tooltip
          >
            {button.text} {/* Button-Text */}
          </button>
        ))}
      </div>
    </header>
  );
};
