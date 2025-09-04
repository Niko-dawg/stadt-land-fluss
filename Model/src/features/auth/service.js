//Autor: Torga Aslan
//Service für die Authentifizierung. Enthält die Logik für Registrierung und Login von Usern. Arbeitet mit dem Repo zusammen, um Daten in der DB zu speichern/abzufragen.
//Passwörter werden mit bcrypt gehasht. JWT-Token folgen später.
const bcrypt = require('bcryptjs');
const repo = require('./repo');


async function register({ benutzername, email, passwort }) {
  // Validierung der Eingabedaten
  if (!benutzername || !email || !passwort) throw new Error('MISSING_FIELDS');
  // Überprüfen, ob der Benutzername oder die E-Mail bereits existiert
  if (await repo.existsByUsernameOrEmail(benutzername, email)) throw new Error('EMAIL_EXISTS');
  // Passwort hashen
  const hash = await bcrypt.hash(passwort, 10);
  //User-Daten an Repo übergeben und create funktion aufrufen
  const user = await repo.create({ username: benutzername, email, passwordHash: hash });
  // Rückgabe der User-Daten
  return { user }; // Token folgt
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
  //Rückgabe der User-Daten
  return { user: { id: u.id, username: u.username, email: u.email } }; // Token folgt
}

module.exports = { register, login };