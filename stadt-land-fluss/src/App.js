// Haupt-App-Komponente: Verwaltet das Routing der Anwendung
//Autor : Torga & Emilia
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Routing-Bibliothek für Navigation
import { Test } from './View/home.js'; // Startseite (Home)
import { Spiel } from './View/spiel.js'; // Spiel-Seite
import { Highscore } from './View/highscore.js'; // Highscore-Seite
import { LoginWindow } from './View/login.js'; // Login-Seite
import Admin from './View/admin.js'; // Admin-Seite
import HelpPage from './View/help.js'; // Hilfe-Seite
import Impressum from './View/impressum.js'; // Impressum-Seite

function App() {
  // Rendert die App mit Router und definierten Routen
  return (
    <Router> {/* BrowserRouter für clientseitiges Routing */}
      <Routes> {/* Container für alle Routen */}
        <Route path="/" element={<Test />} /> {/* Startseite */}
        <Route path="/spiel/:gameMode?" element={<Spiel />} /> {/* Spiel-Seite mit optionalem gameMode-Parameter */}
        <Route path="/highscore" element={<Highscore />} /> {/* Highscore-Seite */}
        <Route path="/highscore/:from?" element={<Highscore />} /> {/* nicht benutzt*/}
        <Route path="/login" element={<LoginWindow />} /> {/* Login-Seite */}
        <Route path="/admin" element={<Admin />} /> {/* Admin-Seite */}
        <Route path="/help" element={<HelpPage />} /> {/* Hilfe-Seite */}
        <Route path="/impressum" element={<Impressum />} /> {/* Impressum-Seite */}
      </Routes>
    </Router>
  );
}

export default App; // Export für Verwendung in index.js
