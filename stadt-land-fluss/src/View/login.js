import React from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

/* Emilia */
export function LoginWindow() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="login-window">
      <button className="close-button" onClick={handleClose}>X</button>
      <div className="login-header">Login</div>
      <label className="input-label" htmlFor="username">Benutzername</label>
      <input className="input-field-username" id="username" type="text" placeholder="Benutzername" />
      <label className="input-label" htmlFor="password">Passwort</label>
      <input className="input-field-password" id="password" type="password" placeholder="Passwort" />
      <button onClick={() => console.log('Login-Funktionalität noch nicht implementiert')}>Einloggen</button>
    </div>
  );
}