//Autor: Torga Aslan
//Service für die Authentifizierung. Enthält die Logik für Registrierung und Login von Usern. Arbeitet mit dem Repo zusammen, um Daten in der DB zu speichern/abzufragen.
//Passwörter werden mit bcrypt gehasht. JWT-Token für sichere Session-Verwaltung.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('./repo');

// JWT Secret (in Produktion aus .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// JWT Token generieren - packt User-Daten (inkl. is_admin) in den Token
function generateToken(user) {
  // Payload = Daten die im Token gespeichert werden
  // Diese Daten sind später in req.user verfügbar (nach jwt.verify)
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    is_admin: user.is_admin  // ← Wichtig! Admin-Status aus DB wird im Token gespeichert
  };
  
  // Token gültig für 24 Stunden, signiert mit SECRET (kann nicht gefälscht werden)
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}


async function register({ benutzername, email, passwort }) {
  // Validierung der Eingabedaten
  if (!benutzername || !email || !passwort) throw new Error('MISSING_FIELDS');
  // Überprüfen, ob der Benutzername oder die E-Mail bereits existiert
  if (await repo.existsByUsernameOrEmail(benutzername, email)) throw new Error('EMAIL_EXISTS');
  // Passwort hashen
  const hash = await bcrypt.hash(passwort, 10);
  //User-Daten an Repo übergeben und create funktion aufrufen
  const user = await repo.create({ username: benutzername, email, passwordHash: hash });
  
  // JWT-Token generieren
  const token = generateToken(user);
  
  // Rückgabe der User-Daten mit Token
  return { user, token };
}

async function login({ email, passwort }) {
  // Validierung der Eingabedaten
  if (!email || !passwort) throw new Error('MISSING_FIELDS');
  // User per E-Mail laden
  const u = await repo.findByEmail(email);
  //wenn die Email nicht existiert Fehlermeldung auslösen
  if (!u) throw new Error('INVALID_CREDENTIALS');
  // Passwort überprüfen
  const ok = await bcrypt.compare(passwort, u.password_hash);
  //wenn das Passwort nicht übereinstimmt Fehlermeldung auslösen
  if (!ok) throw new Error('INVALID_CREDENTIALS');
  // Optional: is_approved/is_locked schon prüfen
  
  // User-Objekt formatieren
  const user = { 
    id: u.id, 
    username: u.username, 
    email: u.email, 
    is_admin: u.is_admin 
  };
  
  // JWT-Token generieren
  const token = generateToken(user);
  
  //Rückgabe der User-Daten mit Token
  return { user, token };
}

module.exports = { register, login };