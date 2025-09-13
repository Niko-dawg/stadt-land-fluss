//===================================================================
// Auth Service - Business Logic für Benutzerauthentifizierung
// Autor: Torga Aslan
//===================================================================
// Zweck: Sichere Registrierung/Login mit Password-Hashing und JWT-Tokens
// Features: bcrypt Password Hashing + JWT Token Generation + Admin Role Management

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('./repo');

// JWT Secret - In Production aus Environment Variable laden
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

//===================================================================
// JWT TOKEN MANAGEMENT
//===================================================================

// JWT Access Token generieren - Benutzerdaten in Token verpacken
function generateToken(user) {
  // Token Payload - Diese Daten sind später in req.user verfügbar (nach Middleware-Validierung)
  const payload = {
    id: user.id,              // User Database ID
    email: user.email,        // Email für Identifikation  
    username: user.username,  // Display Name
    is_admin: user.is_admin   // Admin-Berechtigung (wichtig für geschützte Routen)
  };
  
  // JWT Token erstellen - gültig für 24h, signiert mit SECRET (tamper-proof)
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

//===================================================================
// USER REGISTRATION
//===================================================================

// Neuen Benutzer registrieren - mit Input Validation und Password Hashing
async function register({ benutzername, email, passwort }) {
  // Input Validation - alle Pflichtfelder müssen vorhanden sein
  if (!benutzername || !email || !passwort) {
    throw new Error('MISSING_FIELDS');
  }
  
  // Duplicate Check - Email/Username bereits vergeben?
  if (await repo.existsByUsernameOrEmail(benutzername, email)) {
    throw new Error('EMAIL_EXISTS');
  }
  
  // Password Security - bcrypt hashing mit salt rounds = 10
  const hashedPassword = await bcrypt.hash(passwort, 10);
  
  // Database Insert - neuen User in DB speichern mit gehashtem Password
  const user = await repo.create({ 
    username: benutzername, 
    email, 
    passwordHash: hashedPassword 
  });
  
  // JWT Token für automatisches Login nach Registrierung generieren
  const token = generateToken(user);
  
  // Success Response - User-Daten und Access Token zurückgeben
  return { user, token };
}

//===================================================================
// USER LOGIN  
//===================================================================

// Benutzer anmelden - Email/Password Validation + JWT Token Generation
async function login({ email, passwort }) {
  // Input Validation - Email und Passwort sind Pflichtfelder
  if (!email || !passwort) {
    throw new Error('MISSING_FIELDS');
  }
  
  // Database Lookup - User anhand Email suchen
  const userFromDB = await repo.findByEmail(email);
  if (!userFromDB) {
    // Security: Keine Details preisgeben (Email existiert nicht)
    throw new Error('INVALID_CREDENTIALS');
  }
  
  // Password Verification - bcrypt compare mit gehashtem DB-Password
  const passwordIsValid = await bcrypt.compare(passwort, userFromDB.password_hash);
  if (!passwordIsValid) {
    // Security: Keine Details preisgeben (Password falsch)
    throw new Error('INVALID_CREDENTIALS');
  }
  
  // Optional: Account Status Checks (is_approved, is_locked) könnten hier eingefügt werden
  
  // User Object für Frontend formatieren (ohne sensitive Daten)
  const user = { 
    id: userFromDB.id, 
    username: userFromDB.username, 
    email: userFromDB.email, 
    is_admin: userFromDB.is_admin 
  };
  
  // JWT Token Generation - Benutzer Authentication für Frontend
  const token = generateToken(user);
  
  // Return User Data + Auth Token für Frontend Login Success
  return { user, token };
}

//===================================================================
// MODULE EXPORTS - Public Interface  
//===================================================================
module.exports = { register, login };