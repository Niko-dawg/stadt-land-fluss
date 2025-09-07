// Admin-Repository für Datenbankzugriffe  
// Autor: Torga Aslan

const db = require('../../db');
const dataStore = require('../../store/DataStore');// ===== USER OPERATIONS =====

async function findAllUsers() {
  // Verwendet RAM statt DB
  return dataStore.getAllUsers();
}

async function findUserById(userId) {
  return dataStore.findUserById(userId);
}

async function findUserByEmail(email) {
  return dataStore.findUserByEmail(email);
}

async function findUserByUsername(username) {
  return dataStore.findUserByUsername(username);
}

async function searchUsersByEmailOrUsername(query) {
  return dataStore.searchUsersByEmailOrUsername(query);
}

async function createUser(userData) {
  // Schreibt in DB UND aktualisiert RAM
  return await dataStore.addUser(userData);
}

async function deleteUser(userId) {
  // Löscht aus DB UND aus RAM
  await dataStore.removeUser(userId);
}

// ===== CATEGORY OPERATIONS (Nur für Word-Validierung) =====

async function findCategoryById(categoryId) {
  return dataStore.findCategoryById(categoryId);
}

// ===== WORD OPERATIONS =====

async function findWordsByCategory(categoryId) {
  return dataStore.findWordsByCategory(categoryId);
}

async function findWordById(wordId) {
  return dataStore.findWordById(wordId);
}

async function findWordInCategory(word, categoryId) {
  return dataStore.findWordInCategory(word, categoryId);
}

async function createWord(wordData) {
  return await dataStore.addWord(wordData);
}

async function deleteWord(wordId) {
  await dataStore.removeWord(wordId);
}

module.exports = {
  findAllUsers,
  findUserById,
  findUserByEmail,
  findUserByUsername,
  searchUsersByEmailOrUsername,
  createUser,
  deleteUser,
  findCategoryById,
  findWordsByCategory,
  findWordById,
  findWordInCategory,
  createWord,
  deleteWord
};
