//===================================================================
// Auth Controller - HTTP Request/Response Handling für Authentifizierung
// Autor: Torga Aslan
//===================================================================
// Zweck: HTTP-Layer zwischen Client und Business Logic
// Flow: HTTP Request → Input Validation → Service Call → Error Handling → JSON Response

const svc = require('./service');

// POST /api/auth/register - Neuen Benutzer registrieren
async function register(req, res) {
  try {
    // Request Body an Service weiterleiten für Validierung und DB-Insert
    const { user } = await svc.register(req.body || {});
    
    // Erfolgreich: HTTP 201 Created + User-Daten zurückgeben
    res.status(201).json({ user, note: 'Dev-Mode: JWT folgt' });
  } catch (e) {
    // Error-Mapping: Service Errors → HTTP Status Codes
    const statusCodeMapping = { 
      MISSING_FIELDS: 400,  // Bad Request - Pflichtfelder fehlen
      EMAIL_EXISTS: 409     // Conflict - E-Mail bereits registriert
    };
    res.status(statusCodeMapping[e.message] || 500).json({ error: e.message });
  }
}

// POST /api/auth/login - Benutzer anmelden und JWT Token generieren
async function login(req, res) {
  try {
    // Login-Credentials (email, password) an Service für Authentifizierung
    const { user, token } = await svc.login(req.body || {});
    
    // Erfolgreich: HTTP 200 OK + User-Daten + JWT Access Token
    res.json({ user, token });
  } catch (e) {
    // Error-Mapping für Login-spezifische Fehler
    const statusCodeMapping = { 
      MISSING_FIELDS: 400,       // Bad Request - Email/Password fehlen
      INVALID_CREDENTIALS: 401   // Unauthorized - Falsche Anmeldedaten
    };
    res.status(statusCodeMapping[e.message] || 500).json({ error: e.message });
  }
}

module.exports = { register, login };
