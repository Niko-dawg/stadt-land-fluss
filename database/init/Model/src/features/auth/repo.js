// DB-Zugriffe für User (nur SQL hier)
//Autoren: Torga Aslan, Nikolas Zimmer
const db = require('../../db');
const dataStore = require('../../store/DataStore');

// User per E-Mail holen (für Login) - MUSS noch DB verwenden wegen Password
async function findByEmail(email) {
  const { rows } = await db.query(
     `SELECT 
        user_id AS id,           
        username,
        email,
        password_hash,           
        is_admin
     FROM users
     WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

// Prüfen ob Username ODER E-Mail schon existieren (für Register)
async function existsByUsernameOrEmail(username, email) {
  const { rows } = await db.query(
     `SELECT 1 FROM users
      WHERE username = $1 OR email = $2
      LIMIT 1`,
    [username, email]
  );
  return rows.length > 0;
}

// Neuen User anlegen
async function create({ username, email, passwordHash }) {
  const { rows } = await db.query(
   `INSERT INTO users (username, email, password_hash, is_admin)
       VALUES ($1,$2,$3,false)
       RETURNING user_id AS id, username, email, is_admin`,
    [username, email, passwordHash]
  );
  return rows[0];
}

module.exports = { findByEmail, existsByUsernameOrEmail, create };
