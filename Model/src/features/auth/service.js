const bcrypt = require('bcryptjs');
const repo = require('./repo');

async function register({ benutzername, email, passwort }) {
  if (!benutzername || !email || !passwort) throw new Error('MISSING_FIELDS');
  if (await repo.existsByUsernameOrEmail(benutzername, email)) throw new Error('EMAIL_EXISTS');
  const hash = await bcrypt.hash(passwort, 10);
  const user = await repo.create({ username: benutzername, email, passwordHash: hash });
  return { user }; // kein Token jetzt
}

async function login({ email, passwort }) {
  if (!email || !passwort) throw new Error('MISSING_FIELDS');
  const u = await repo.findByEmail(email);
  if (!u) throw new Error('INVALID_CREDENTIALS');
  const ok = await bcrypt.compare(passwort, u.password_hash);
  if (!ok) throw new Error('INVALID_CREDENTIALS');
  // Optional: is_approved/is_locked schon prüfen
  return { user: { id: u.id, username: u.username, email: u.email } }; // kein Token
}

module.exports = { register, login };