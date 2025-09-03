// DB-Zugriffe für User (nur SQL hier)
// Tabelle anpassen, falls sie anders heißt als app_user
const db = require('../../db');

// User per E-Mail holen (für Login)
async function findByEmail(email) {
  const { rows } = await db.query(
    `SELECT user_id, username, email, password_hash
       FROM users
      WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

// Prüfen ob Username ODER E-Mail schon existieren (für Register)
async function existsByUsernameOrEmail(username, email) {
  const { rows } = await db.query(
    `SELECT 1
       FROM users
      WHERE username = $1 OR email = $2
      LIMIT 1`,
    [username, email]
  );
  return rows.length > 0;
}

// Neuen User anlegen
async function create({ username, email, passwordHash }) {
  const { rows } = await db.query(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING user_id, username, email`,
    [username, email, passwordHash]
  );
  return rows[0];
}

//Wörtebuch speichern
async function savevalid_words(userId, vocabulary) {
  const { rows } = await db.query(
    'SELECT * FROM valid_words',
    []
  );
  return rows;
}
module.exports = { findByEmail, existsByUsernameOrEmail, create };
