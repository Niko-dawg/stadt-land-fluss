//===================================================================
// APP COMPONENT - Haupt React Router Configuration für SPA
//===================================================================
// Autor: Torga Aslan, Emilia
//
// Beschreibung: React App Main Component mit Client-Side Routing
// - BrowserRouter für SEO-friendly URLs ohne #
// - Route Definitions für alle App-Bereiche (Game, Admin, etc.)
// - SPA Navigation zwischen verschiedenen Views
// - Parameter-basierte Routen für Game Modes
//===================================================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//===================================================================
// VIEW COMPONENTS IMPORT - Lazy Loading könnte hier implementiert werden
//===================================================================

import { Test } from './View/home.js';          // Homepage/Landing Page
import { Spiel } from './View/spiel.js';        // Game View (Stadt-Land-Fluss)
import { Highscore } from './View/highscore.js'; // Leaderboard/Rankings
import { LoginWindow } from './View/login.js';   // Authentication View
import Admin from './View/admin.js';             // Admin Panel (User & Word Management)  
import HelpPage from './View/help.js';          // Help/Tutorial Page
import Impressum from './View/impressum.js';    // Legal/Impressum Page

//===================================================================
// MAIN APP COMPONENT - React Router Configuration
//===================================================================

function App() {
  // React Router Setup mit allen App-Routen
  return (
    <Router> {/* BrowserRouter für clientseitiges Routing (ohne #-URLs) */}
      <Routes> {/* Container für alle definierten Routen */}
        
        {/* PUBLIC ROUTES - Für alle User zugänglich */}
        <Route path="/" element={<Test />} />                    {/* Homepage */}
        <Route path="/help" element={<HelpPage />} />           {/* Hilfe-Seite */}
        <Route path="/impressum" element={<Impressum />} />     {/* Impressum */}
        
        {/* AUTHENTICATION ROUTES */}
        <Route path="/login" element={<LoginWindow />} />       {/* Login/Register */}
        
        {/* GAME ROUTES */}
        <Route path="/spiel/:gameMode?" element={<Spiel />} />  {/* Game View mit optionalem Mode */}
        <Route path="/highscore" element={<Highscore />} />     {/* Highscore-Liste */}
        <Route path="/highscore/:from?" element={<Highscore />} /> {/* Legacy Route (nicht genutzt) */}
        
        {/* ADMIN ROUTES - Nur für Admin User */}
        <Route path="/admin" element={<Admin />} />             {/* Admin Panel */}
        
      </Routes>
    </Router>
  );
}

//===================================================================
// MODULE EXPORTS - React Component Export
//===================================================================
export default App; // Export für Verwendung in index.js
