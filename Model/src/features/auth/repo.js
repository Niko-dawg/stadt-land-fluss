//===================================================================
// AUTH REPOSITORY - Database Access Layer für User Management
//===================================================================
// Autor: Torga Aslan, Nikolas Zimmer
//
// Beschreibung: Repository Pattern für User-Database Operations
// - SQL Query Abstraktion für Authentication
// - Pure Database Access ohne Business Logic
// - Verwendung von PostgreSQL mit parameterized queries
//===================================================================

const db = require('../../db');
const dataStore = require('../../store/DataStore');

//===================================================================
// USER LOOKUP OPERATIONS
//===================================================================

// User per Email laden - für Login Authentication
// WICHTIG: Muss Database verwenden wegen password_hash (nicht in DataStore)
async function findByEmail(email) {
  const { rows } = await db.query(
     `SELECT 
        user_id AS id,           -- ID mapping für Frontend Konsistenz
        username,
        email,
        password_hash,           -- Nur für Authentication Checks
        is_admin
     FROM users
     WHERE email = $1`,
    [email]
  );
  return rows[0] || null;  // Return null wenn User nicht gefunden
}

//===================================================================
// USER VALIDATION OPERATIONS  
//===================================================================

// Unique Constraint Check - Username oder Email bereits vorhanden?
// Wird bei Registration verwendet um Duplikate zu verhindern
async function existsByUsernameOrEmail(username, email) {
  const { rows } = await db.query(
     `SELECT 1 FROM users
      WHERE username = $1 OR email = $2
      LIMIT 1`,  
    [username, email]
  );
  return rows.length > 0;  // true = bereits vorhanden, false = verfügbar
}

//===================================================================
// USER CREATION OPERATIONS
//===================================================================

// Neuen User in Database anlegen - Registration Process
// Returns: User Object ohne password_hash für Frontend
async function create({ username, email, passwordHash }) {
  const { rows } = await db.query(
   `INSERT INTO users (username, email, password_hash, is_admin)
       VALUES ($1,$2,$3,false)              -- Default: is_admin = false
       RETURNING user_id AS id, username, email, is_admin`, 
    [username, email, passwordHash]
  );
  
  // Return new User Object für Frontend (password_hash ausgeschlossen)
  return rows[0];
}

//===================================================================
// MODULE EXPORTS - Repository Interface  
//===================================================================
module.exports = { findByEmail, existsByUsernameOrEmail, create };
