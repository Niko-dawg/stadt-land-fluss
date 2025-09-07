import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../View/img/Logo.png";

/* Emilia und Torga */

export const Header = ({ 
  showHighscore = true, 
  showLogin = true, 
  showAdmin = true, 
  showHelp = true, 
  showImpressum = true,
  showHome = false,
  customButtons = [], 
  onHighscore 
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check login status on component mount and localStorage changes
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
    setUser(null);
    navigate('/login');
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
