// Middleware für JWT-Token Validierung und Admin-Berechtigung
// Autor: Torga Aslan

const jwt = require('jsonwebtoken');

// JWT Secret (später in .env auslagern) - MUSS identisch mit auth/service.js sein!
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// MIDDLEWARE 1: JWT Token validieren und User-Daten extrahieren
// Läuft VOR jeder geschützten Route
async function authenticateToken(req, res, next) {
  // Token aus Authorization Header extrahieren: "Bearer eyJhbGciOiJIUzI1NiI..."
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer " entfernen

  if (!token) {
    return res.status(401).json({ error: 'ACCESS_TOKEN_REQUIRED' });
  }

  try {
    // Token dekodieren → gibt uns die User-Daten zurück (aus generateToken)
    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded = { id, email, username, is_admin, ... }
    
    req.user = decoded; // ← WICHTIG: User-Daten an Request anhängen für nachfolgende Middleware
    next(); // Weiter zur nächsten Middleware (z.B. requireAdmin)
  } catch (err) {
    return res.status(403).json({ error: 'INVALID_TOKEN' });
  }
}

// MIDDLEWARE 2: Admin-Berechtigung prüfen
// Läuft NACH authenticateToken → req.user ist bereits verfügbar
async function requireAdmin(req, res, next) {
  // Prüfen ob authenticateToken erfolgreich war
  if (!req.user) {
    return res.status(401).json({ error: 'AUTHENTICATION_REQUIRED' });
  }

  // Prüfen ob User Admin-Rechte hat (aus dem JWT Token payload)
  // req.user.is_admin kommt aus der generateToken Funktion
  if (!req.user.is_admin) {
    return res.status(403).json({ error: 'ADMIN_REQUIRED' });
  }

  next(); // Weiter zur eigentlichen Route (z.B. ctrl.getAllUsers)
}

module.exports = { authenticateToken, requireAdmin };