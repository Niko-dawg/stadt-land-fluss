//Autor: Torga Aslan
//Controller für die Authentifizierung  liest den request.body aus, leitet die Daten an den Service weiter und ordnet Fehlermeldungen den http-status-codes zu.
//Anschließend wird die Antwort im JSON-Format zurückgeschickt 
const svc = require('./service');

async function register(req, res) {
  try {
    //Auslesen des req.body und Weiterleitung an den Service
    const { user } = await svc.register(req.body || {});
    //Bei Erfolg: statuscode 201 und user werden zurückgeschickt
    res.status(201).json({ user, note: 'Dev-Mode: JWT folgt' });
  } catch (e) {
    // Fehlerbehandlung: Mappings der Fehler zu HTTP-Status-Codes
    const map = { MISSING_FIELDS: 400, EMAIL_EXISTS: 409 };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}
async function login(req, res) {
  try {
    //Auslesen des req.body und Weiterleitung an den Service
    const { user } = await svc.login(req.body || {});
    //Bei Erfolg: User-Daten werden zurückgeschickt
    res.json({ user, note: 'Dev-Mode: Kein Token. JWT folgt.' });
  } catch (e) {
    // Fehlerbehandlung: Mappings der Fehler zu HTTP-Status-Codes
    const map = { MISSING_FIELDS: 400, INVALID_CREDENTIALS: 401 };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

module.exports = { register, login };
