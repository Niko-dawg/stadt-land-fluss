// DB-Zugriffe für User (nur SQL hier)
// Tabelle anpassen, falls sie anders heißt als app_user
const db = require('../../db');

// User per E-Mail holen (für Login)
async function findByEmail(email) {
  const { rows } = await db.query(
    `SELECT id, username, email, password_hash
       FROM app_user
      WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

// Prüfen ob Username ODER E-Mail schon existieren (für Register)
async function existsByUsernameOrEmail(username, email) {
  const { rows } = await db.query(
    `SELECT 1
       FROM app_user
      WHERE username = $1 OR email = $2
      LIMIT 1`,
    [username, email]
  );
  return rows.length > 0;
}

// Neuen User anlegen
async function create({ username, email, passwordHash }) {
  const { rows } = await db.query(
    `INSERT INTO app_user (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email`,
    [username, email, passwordHash]
  );
  return rows[0];
}

module.exports = { findByEmail, existsByUsernameOrEmail, create };
