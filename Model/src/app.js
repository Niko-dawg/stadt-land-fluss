//===================================================================
// EXPRESS APP - Hauptapplikation mit Middleware und Route Configuration
//===================================================================
// Autor: Torga Aslan
//
// Beschreibung: Express.js App Setup und Configuration
// - CORS Policy für Frontend-Backend Communication
// - JSON Body Parsing für API Requests
// - Feature-basierte Router Mounting (auth, admin, game, etc.)
// - Static File Serving für React Build
// - SPA Routing Fallback für React Router
//===================================================================

const express = require('express');
const cors = require('cors');
const path = require('path');

//===================================================================
// FEATURE ROUTERS - Modular Route Organization
//===================================================================

// Feature-Router Import - Jeweils ein Router pro Business Domain
const authRouter = require('./features/auth/router');
const adminRouter = require('./features/admin/router');
const gameRouter = require('./features/game/router');
const highscoreRouter = require('./features/highscore/router');

//===================================================================
// EXPRESS APP INITIALIZATION
//===================================================================

const app = express();

//===================================================================
// GLOBAL MIDDLEWARE CONFIGURATION  
//===================================================================

// CORS Middleware - Cross-Origin-Anfragen von Frontend erlauben
app.use(cors({ origin: '*' })); // TODO: In Production spezifische Origins setzen

// JSON Body Parser - Für API Request Body Parsing (POST/PUT)
app.use(express.json());

//===================================================================
// API ROUTES MOUNTING - Feature-basierte URL-Struktur
//===================================================================

// API Routes - Jedes Feature hat eigenen Namensraum
app.use('/api/auth', authRouter);           // Authentication & Registration
app.use('/api/admin', adminRouter);         // Admin Panel (User & Word Management)
app.use('/api/game', gameRouter);          // Game Logic (Join/Submit/Vote)
app.use('/api/highscore', highscoreRouter); // Leaderboard & Rankings

//===================================================================
// STATIC FILE SERVING - React Frontend Integration
//===================================================================

// React Build statisch ausliefern - Production Build aus build/
const buildDir = path.resolve(__dirname, '../../stadt-land-fluss/build');
app.use(express.static(buildDir));

//===================================================================
// SPA ROUTING FALLBACK - React Router Support
//===================================================================

// Catch-All für Nicht-API-Routen → React App (Single Page Application)
// WICHTIG: NUR für Nicht-/api-Routen (Express 5 kompatibel)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(buildDir, 'index.html')); // React App Entry Point
});

//===================================================================
// MODULE EXPORTS - App Configuration
//===================================================================
module.exports = app;
