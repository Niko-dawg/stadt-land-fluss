import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

/* Emilia */
export function LoginWindow() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    navigate('/');
  };

  const handleLogin = async () => {
    // Reset error
    setError('');
    
    // Validation
    if (!email || !password) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
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
        // Login erfolgreich
        console.log('Login erfolgreich:', data.user);
        
        // User-Daten UND Token speichern
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);  // Konsistent mit admin.js
        
        navigate('/');
      } else {
        // Login fehlgeschlagen
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
      setIsLoading(false);
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