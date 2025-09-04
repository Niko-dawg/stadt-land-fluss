import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../View/img/Logo.png";

export const Header = ({ showHighscore = true, showLogin = true, showAdmin = true, showHelp = true, customButtons = [] }) => {
  const navigate = useNavigate();

  const handleHighscore = () => navigate('/highscore');
  const handleLogin = () => navigate('/login');
  const handleAdmin = () => navigate('/admin');
  const handleHelp = () => alert("Hier können Hilfetexte oder Anleitungen angezeigt werden.");

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="headerButtons">
        <button className="impressumBtn">Impressum</button>
        
        {showHelp && (
          <button className="helpBtn" onClick={handleHelp}>Hilfe</button>
        )}
        
        {showHighscore && (
          <button className="highscoreBtn" onClick={handleHighscore}>Highscore</button>
        )}
        
        {showAdmin && (
          <button className="adminBtn" onClick={handleAdmin}>Admin</button>
        )}
        
        {showLogin && (
          <button className="loginBtn" onClick={handleLogin}>Log in</button>
        )}

        {/* Custom Buttons für spezielle Seiten */}
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
