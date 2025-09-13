//===================================================================
// AUTH MIDDLEWARE - JWT Token Validation und Authorization  
//===================================================================
// Autor: Torga Aslan
//
// Beschreibung: Express Middleware für Authentication & Authorization
// - JWT Token Validation mit automatischer User-Daten Extraktion
// - Admin Permission Checks für protected Routes  
// - Error Handling mit standardisierten HTTP Status Codes
// - Integration in Route-Middleware-Ketten
//===================================================================

const jwt = require('jsonwebtoken');

//===================================================================
// CONFIGURATION - JWT Secret Key Management
//===================================================================

// JWT Secret (später in .env auslagern) - MUSS identisch mit auth/service.js sein!
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

//===================================================================
// AUTHENTICATION MIDDLEWARE
//===================================================================

// MIDDLEWARE 1: JWT Token validieren und User-Daten extrahieren
// Läuft VOR jeder geschützten Route - dekodiert Token und setzt req.user
async function authenticateToken(req, res, next) {
  // Token aus Authorization Header extrahieren: "Bearer eyJhbGciOiJIUzI1NiI..."
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer " entfernen

  // Token Required Check - No Token = No Access
  if (!token) {
    return res.status(401).json({ error: 'ACCESS_TOKEN_REQUIRED' });
  }

  try {
    // JWT Token dekodieren → gibt uns die User-Daten zurück (aus generateToken)
    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded = { id, email, username, is_admin, ... }
    
    // WICHTIG: User-Daten an Request Object anhängen für nachfolgende Middleware
    req.user = decoded; 
    next(); // Weiter zur nächsten Middleware (z.B. requireAdmin) oder Route
  } catch (err) {
    return res.status(403).json({ error: 'INVALID_TOKEN' });
  }
}

//===================================================================
// AUTHORIZATION MIDDLEWARE
//===================================================================

// MIDDLEWARE 2: Admin-Berechtigung prüfen
// Läuft NACH authenticateToken → req.user ist bereits verfügbar
async function requireAdmin(req, res, next) {
  // Authentication Check - User muss durch authenticateToken gesetzt sein
  if (!req.user) {
    return res.status(401).json({ error: 'AUTHENTICATION_REQUIRED' });
  }

  // Admin Permission Check - req.user.is_admin kommt aus JWT Token payload
  if (!req.user.is_admin) {
    return res.status(403).json({ error: 'ADMIN_REQUIRED' });
  }

  next(); // Weiter zur eigentlichen Route (z.B. ctrl.getAllUsers)
}

//===================================================================
// MODULE EXPORTS - Middleware Interface
//===================================================================
module.exports = { authenticateToken, requireAdmin };