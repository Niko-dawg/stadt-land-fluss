import React from "react";
import "./login.css";
import { Test } from "./home";
import ReactDOM from "react-dom/client";

export function LoginWindow() {
  const handleClose = () => {
    ReactDOM.createRoot(document.getElementById("root")).render(<Test />);
  };

  return (
    <div className="login-window">
      <button className="close-button" onClick={handleClose}>X</button>
      <div className="login-header">Login</div>
      <label className="input-label" htmlFor="username">Benutzername</label>
      <input className="input-field-username" id="username" type="text" placeholder="Benutzername" />
      <label className="input-label" htmlFor="password">Passwort</label>
      <input className="input-field-password" id="password" type="password" placeholder="Passwort" />
      <button>Einloggen</button>
    </div>
  );
}