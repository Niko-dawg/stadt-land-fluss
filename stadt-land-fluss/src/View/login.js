//===================================================================
// LOGIN PAGE - User Authentication Interface
//===================================================================
// Autor: Torga Aslan, Emilia
//
// Beschreibung: React Login Component für User Authentication
// - Email/Password Login Form mit Validation
// - API Integration für Authentication  
// - JWT Token Storage in localStorage
// - Error Handling und Loading States
// - Navigation Integration nach Login Success
//===================================================================

import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

//===================================================================
// MAIN LOGIN COMPONENT - Authentication Interface
//===================================================================

export function LoginWindow() {
  const navigate = useNavigate(); // React Router Navigation
  
  // Form State Management
  const [email, setEmail] = useState('');           // Email Input State
  const [password, setPassword] = useState('');     // Password Input State  
  const [error, setError] = useState('');           // Error Message State
  const [isLoading, setIsLoading] = useState(false); // Loading Indicator State

  //===================================================================
  // EVENT HANDLERS - User Interaction Logic  
  //===================================================================

  // Close Login Window - Navigate to Homepage
  const handleClose = () => {
    navigate('/');
  };

  // Login Form Handler - Authentication API Call mit Validation
  const handleLogin = async () => {
    setError(''); // Reset Error State

    // Input Validation - Check Required Fields
    if (!email || !password) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    setIsLoading(true); // Set Loading State

    try {
      const response = await fetch('/api/auth/login', { // Login-API aufrufen
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          passwort: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Erfolgreicher Login
        console.log('Login erfolgreich:', data.user);

        // User-Daten und Token in localStorage speichern
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token); // Konsistent mit admin.js

        navigate('/'); // Zur Startseite navigieren
      } else {
        // Fehlerhafte Anmeldedaten
        switch (data.error) {
          case 'MISSING_FIELDS':
            setError('Bitte füllen Sie alle Felder aus.');
            break;
          case 'INVALID_CREDENTIALS':
            setError('Ungültige E-Mail oder Passwort.');
            break;
          default:
            setError('Ein Fehler ist aufgetreten. Versuchen Sie es später erneut.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Verbindungsfehler. Versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false); // Lade-Status zurücksetzen
    }
  };

  return (
    <div className="login-window">
      <button className="close-button" onClick={handleClose}>X</button>
      <div className="login-header">Login</div>
      <label className="input-label" htmlFor="email">E-Mail</label>
      <input 
        className="input-field-username" 
        id="email" 
        type="email" 
        placeholder="E-Mail" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className="input-label" htmlFor="password">Passwort</label>
      <input 
        className="input-field-password" 
        id="password" 
        type="password" 
        placeholder="Passwort" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
      />
      {error && <div className="error-message" style={{color: 'red', marginTop: '10px'}}>{error}</div>}
      <button 
        onClick={handleLogin}
        disabled={isLoading}
        style={{
          opacity: isLoading ? 0.6 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Wird eingeloggt...' : 'Einloggen'}
      </button>
    </div>
  );
}