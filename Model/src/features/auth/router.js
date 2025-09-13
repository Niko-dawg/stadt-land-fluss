//===================================================================
// AUTH ROUTER - HTTP Route Definitions für Authentication
//===================================================================
// Autor: Torga Aslan
//
// Beschreibung: Express Router für Authentication Endpoints
// - POST /api/auth/register - Neue User Registrierung  
// - POST /api/auth/login - User Login Authentication
// - Route-Controller Pattern für saubere Code Trennung
//===================================================================

const router = require('express').Router();
const ctrl = require('./controller');

//===================================================================
// AUTHENTICATION ROUTES
//===================================================================

// User Registration - Neuen Account anlegen
router.post('/register', ctrl.register);  // POST /api/auth/register

// User Login - Authentication mit Email/Password  
router.post('/login', ctrl.login);        // POST /api/auth/login

//===================================================================
// MODULE EXPORTS - Router Configuration
//===================================================================
module.exports = router;
