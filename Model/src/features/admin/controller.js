//===================================================================
// ADMIN CONTROLLER - HTTP Request Handling für Admin Panel
//===================================================================
// Autor: Torga Aslan
//
// Beschreibung: Express Controller für Admin-Only Operations
// - User Management (CRUD Operations für alle User)
// - Word Management (Kategorie-Wörter hinzufügen/löschen)
// - Authentication: Nur Admin-User können diese Endpoints nutzen
// - Error Mapping mit HTTP Status Codes für Frontend
//===================================================================

const svc = require('./service');

//===================================================================
// USER MANAGEMENT OPERATIONS
//===================================================================

// GET /api/admin/users - Alle User abrufen (Admin Dashboard)
async function getAllUsers(req, res) {
  try {
    const users = await svc.getAllUsers();
    res.json({ users });
  } catch (e) {
    const map = { DATABASE_ERROR: 500 };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

// POST /api/admin/users - Neuen User erstellen (Admin kann User anlegen)
async function createUser(req, res) {
  try {
    const user = await svc.createUser(req.body || {});
    res.status(201).json({ user, message: 'User erfolgreich erstellt' });
  } catch (e) {
    const map = { 
      MISSING_FIELDS: 400,     // Pflichtfelder fehlen
      EMAIL_EXISTS: 409,       // Email bereits vorhanden
      USERNAME_EXISTS: 409     // Username bereits vorhanden
    };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

// GET /api/admin/users/search?query=xyz - User suchen (für Admin Panel)
async function searchUsers(req, res) {
  try {
    const { query } = req.query;
    const users = await svc.searchUsers(query);
    res.json({ users });
  } catch (e) {
    const map = { MISSING_QUERY: 400 };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

// DELETE /api/admin/users/:id - User löschen (nur Admin kann andere User löschen)
async function deleteUser(req, res) {
  try {
    await svc.deleteUser(req.params.id);
    res.json({ message: 'User erfolgreich gelöscht' });
  } catch (e) {
    const map = { 
      USER_NOT_FOUND: 404,      // User existiert nicht
      CANNOT_DELETE_ADMIN: 400  // Admin kann nicht gelöscht werden
    };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

//===================================================================
// WORD MANAGEMENT OPERATIONS
//===================================================================

// GET /api/admin/words/:categoryId - Wörter einer Kategorie abrufen
async function getWordsByCategory(req, res) {
  try {
    const words = await svc.getWordsByCategory(req.params.categoryId);
    res.json({ words });
  } catch (e) {
    const map = { CATEGORY_NOT_FOUND: 404 };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

// POST /api/admin/words - Neues Wort zu Kategorie hinzufügen
async function createWord(req, res) {
  try {
    const word = await svc.createWord(req.body || {});
    res.status(201).json({ word, message: 'Wort erfolgreich hinzugefügt' });
  } catch (e) {
    const map = { 
      MISSING_FIELDS: 400,      // word oder category_id fehlen
      WORD_EXISTS: 409,         // Wort bereits in dieser Kategorie
      CATEGORY_NOT_FOUND: 404   // Kategorie existiert nicht
    };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

// DELETE /api/admin/words/:id - Wort aus Kategorie löschen
async function deleteWord(req, res) {
  try {
    await svc.deleteWord(req.params.id);
    res.json({ message: 'Wort erfolgreich gelöscht' });
  } catch (e) {
    const map = { WORD_NOT_FOUND: 404 };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

//===================================================================
// MODULE EXPORTS - Controller Interface
//===================================================================
module.exports = {
  getAllUsers,
  createUser,
  searchUsers,
  deleteUser,
  getWordsByCategory,
  createWord,
  deleteWord
};
