// Admin-Service für Business-Logic und Datenvalidierung
// Autor: Torga Aslan

const repo = require('./repo');
const bcrypt = require('bcryptjs');  // Konsistent mit auth/service.js

// ===== USER MANAGEMENT =====

async function getAllUsers() {
  try {
    // Repository selektiert bereits nur sichere Felder (ohne password)
    return await repo.findAllUsers();
  } catch (e) {
    throw new Error('DATABASE_ERROR');
  }
}

async function searchUsers(query) {
  if (!query || query.trim() === '') {
    throw new Error('MISSING_QUERY');
  }
  
  try {
    // Repository selektiert bereits nur sichere Felder (ohne password)
    return await repo.searchUsersByEmailOrUsername(query);
  } catch (e) {
    throw new Error('DATABASE_ERROR');
  }
}

async function createUser(userData) {
  const { email, username, password, is_admin } = userData;
  
  // Validierung
  if (!email || !username || !password) {
    throw new Error('MISSING_FIELDS');
  }
  
  if (password.length < 6) {
    throw new Error('PASSWORD_TOO_SHORT');
  }
  
  // Email-Format validieren
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('INVALID_EMAIL');
  }
  
  try {
    // Prüfen ob Email schon existiert
    const existingEmail = await repo.findUserByEmail(email);
    if (existingEmail) {
      throw new Error('EMAIL_EXISTS');
    }
    
    // Prüfen ob Username schon existiert
    const existingUsername = await repo.findUserByUsername(username);
    if (existingUsername) {
      throw new Error('USERNAME_EXISTS');
    }
    
    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // User erstellen - Repository gibt nur sichere Felder zurück
    return await repo.createUser({
      email,
      username,
      password: hashedPassword,
      is_admin: is_admin || false  // Explizit: falls undefined dann false
    });
    
  } catch (e) {
    if (e.message === 'EMAIL_EXISTS' || e.message === 'USERNAME_EXISTS') {
      throw e;
    }
    throw new Error('DATABASE_ERROR');
  }
}

async function deleteUser(userId) {
  if (!userId) {
    throw new Error('MISSING_USER_ID');
  }
  
  try {
    // User finden
    const user = await repo.findUserById(userId);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    
    // Admin kann sich nicht selbst löschen
    // (In echten Systemen würde man hier den aktuellen User prüfen)
    if (user.is_admin) {
      throw new Error('CANNOT_DELETE_ADMIN');
    }
    
    await repo.deleteUser(userId);
    
  } catch (e) {
    if (e.message === 'USER_NOT_FOUND' || e.message === 'CANNOT_DELETE_ADMIN') {
      throw e;
    }
    throw new Error('DATABASE_ERROR');
  }
}

// ===== WORD MANAGEMENT =====

async function getWordsByCategory(categoryId) {
  if (!categoryId) {
    throw new Error('MISSING_CATEGORY_ID');
  }
  
  try {
    // Prüfen ob Kategorie existiert
    const category = await repo.findCategoryById(categoryId);
    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }
    
    return await repo.findWordsByCategory(categoryId);
    
  } catch (e) {
    if (e.message === 'CATEGORY_NOT_FOUND') {
      throw e;
    }
    throw new Error('DATABASE_ERROR');
  }
}

async function createWord(wordData) {
  const { word, category_id } = wordData;
  
  if (!word || !category_id) {
    throw new Error('MISSING_FIELDS');
  }
  
  if (word.trim() === '') {
    throw new Error('MISSING_FIELDS');
  }
  
  try {
    // Prüfen ob Kategorie existiert
    const category = await repo.findCategoryById(category_id);
    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }
    
    // Prüfen ob Wort in dieser Kategorie schon existiert
    const existing = await repo.findWordInCategory(word.trim().toLowerCase(), category_id);
    if (existing) {
      throw new Error('WORD_EXISTS');
    }
    
    return await repo.createWord({
      word: word.trim(),
      category_id
    });
    
  } catch (e) {
    if (['CATEGORY_NOT_FOUND', 'WORD_EXISTS'].includes(e.message)) {
      throw e;
    }
    throw new Error('DATABASE_ERROR');
  }
}

async function deleteWord(wordId) {
  if (!wordId) {
    throw new Error('MISSING_WORD_ID');
  }
  
  try {
    const word = await repo.findWordById(wordId);
    if (!word) {
      throw new Error('WORD_NOT_FOUND');
    }
    
    await repo.deleteWord(wordId);
    
  } catch (e) {
    if (e.message === 'WORD_NOT_FOUND') {
      throw e;
    }
    throw new Error('DATABASE_ERROR');
  }
}

module.exports = {
  getAllUsers,
  searchUsers,
  createUser,
  deleteUser,
  getWordsByCategory,
  createWord,
  deleteWord
};
