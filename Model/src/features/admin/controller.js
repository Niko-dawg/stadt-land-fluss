// Admin-Controller für User-Management und Wort-Verwaltung
// Autor: Torga Aslan

const svc = require('./service');

// ===== USER MANAGEMENT =====

async function getAllUsers(req, res) {
  try {
    const users = await svc.getAllUsers();
    res.json({ users });
  } catch (e) {
    const map = { DATABASE_ERROR: 500 };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

async function createUser(req, res) {
  try {
    const user = await svc.createUser(req.body || {});
    res.status(201).json({ user, message: 'User erfolgreich erstellt' });
  } catch (e) {
    const map = { 
      MISSING_FIELDS: 400, 
      EMAIL_EXISTS: 409,
      USERNAME_EXISTS: 409 
    };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

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

async function deleteUser(req, res) {
  try {
    await svc.deleteUser(req.params.id);
    res.json({ message: 'User erfolgreich gelöscht' });
  } catch (e) {
    const map = { 
      USER_NOT_FOUND: 404,
      CANNOT_DELETE_ADMIN: 400 
    };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

// ===== WORD MANAGEMENT =====

async function getWordsByCategory(req, res) {
  try {
    const words = await svc.getWordsByCategory(req.params.categoryId);
    res.json({ words });
  } catch (e) {
    const map = { CATEGORY_NOT_FOUND: 404 };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

async function createWord(req, res) {
  try {
    const word = await svc.createWord(req.body || {});
    res.status(201).json({ word, message: 'Wort erfolgreich hinzugefügt' });
  } catch (e) {
    const map = { 
      MISSING_FIELDS: 400,
      WORD_EXISTS: 409,
      CATEGORY_NOT_FOUND: 404 
    };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

async function deleteWord(req, res) {
  try {
    await svc.deleteWord(req.params.id);
    res.json({ message: 'Wort erfolgreich gelöscht' });
  } catch (e) {
    const map = { WORD_NOT_FOUND: 404 };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

module.exports = {
  getAllUsers,
  createUser,
  searchUsers,
  deleteUser,
  getWordsByCategory,
  createWord,
  deleteWord
};
