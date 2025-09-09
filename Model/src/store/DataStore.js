// In-Memory Data Store - Lädt alle Daten beim Start in den RAM
// Autor: Torga Aslan

const db = require('../db');

class DataStore {
  constructor() {
    this.users = [];
    this.categories = [];
    this.words = [];
    this.gameEntries = []; // Game entries für Highscore-Cache
    this.initialized = false;
  }

  // Lädt alle Daten aus der DB in den RAM
  async initialize() {
    try {
      console.log('🔄 Lade Daten in den RAM...');
      
      // Alle Tabellen parallel laden
      const [usersResult, categoriesResult, wordsResult, gameEntriesResult] = await Promise.all([
        db.query('SELECT user_id, username, email, is_admin FROM users ORDER BY user_id'),
        db.query('SELECT category_id, category_name FROM categories ORDER BY category_name'),
        db.query(`
          SELECT w.word_id, w.word, w.category_id,
                 c.category_name
          FROM valid_words w 
          JOIN categories c ON w.category_id = c.category_id 
          ORDER BY c.category_name, w.word
        `),
        db.query(`
          SELECT game_entries_id, user_id, category_id, answer, points, is_multiplayer
          FROM game_entries
          ORDER BY game_entries_id DESC
        `)
      ]);

      this.users = usersResult.rows;
      this.categories = categoriesResult.rows;
      this.words = wordsResult.rows;
      this.gameEntries = gameEntriesResult.rows;
      
      this.initialized = true;
      
      // Debug: Zeige wie die Daten aussehen
      console.log('📊 usersResult.rows:', JSON.stringify(usersResult.rows, null, 2));
      console.log('📊 categoriesResult.rows:', JSON.stringify(categoriesResult.rows, null, 2));
      console.log('📊 wordsResult.rows:', JSON.stringify(wordsResult.rows, null, 2));
      
      console.log(`✅ Daten geladen: ${this.users.length} Users, ${this.categories.length} Categories, ${this.words.length} Words, ${this.gameEntries.length} Game Entries`);
      
    } catch (error) {
      console.error('❌ Fehler beim Laden der Daten:', error);
      throw error;
    }
  }

  // Prüft ob Store initialisiert ist
  ensureInitialized() {
    if (!this.initialized) {
      throw new Error('DataStore ist noch nicht initialisiert. Rufe initialize() auf.');
    }
  }

  // ===== USER QUERIES (JavaScript statt SQL) =====

  getAllUsers() {
    this.ensureInitialized();
    return [...this.users]; // Kopie zurückgeben
  }

  findUserById(userId) {
    this.ensureInitialized();
    return this.users.find(user => user.user_id === parseInt(userId));
  }

  findUserByEmail(email) {
    this.ensureInitialized();
    return this.users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  findUserByUsername(username) {
    this.ensureInitialized();
    return this.users.find(user => user.username.toLowerCase() === username.toLowerCase());
  }

  searchUsersByEmailOrUsername(query) {
    this.ensureInitialized();
    const searchTerm = query.toLowerCase();
    return this.users.filter(user => 
      user.email.toLowerCase().includes(searchTerm) || 
      user.username.toLowerCase().includes(searchTerm)
    );
  }

  // ===== CATEGORY QUERIES =====

  getAllCategories() {
    this.ensureInitialized();
    return [...this.categories];
  }

  findCategoryById(categoryId) {
    this.ensureInitialized();
    return this.categories.find(cat => cat.category_id === parseInt(categoryId));
  }

  findCategoryByName(name) {
    this.ensureInitialized();
    return this.categories.find(cat => cat.category_name.toLowerCase() === name.toLowerCase());
  }

  // ===== WORD QUERIES =====

  getAllWords() {
    this.ensureInitialized();
    return [...this.words];
  }

  findWordsByCategory(categoryId) {
    this.ensureInitialized();
    return this.words.filter(word => word.category_id === parseInt(categoryId));
  }

  findWordById(wordId) {
    this.ensureInitialized();
    return this.words.find(word => word.word_id === parseInt(wordId));
  }

  findWordInCategory(word, categoryId) {
    this.ensureInitialized();
    return this.words.find(w => 
      w.word.toLowerCase() === word.toLowerCase() && 
      w.category_id === parseInt(categoryId)
    );
  }

  // Erweiterte Suche für Spiellogik
  findWordsByLetter(letter, categoryId = null) {
    this.ensureInitialized();
    const searchLetter = letter.toLowerCase();
    
    return this.words.filter(word => {
      const startsWithLetter = word.word.toLowerCase().startsWith(searchLetter);
      const categoryMatch = categoryId ? word.category_id === parseInt(categoryId) : true;
      return startsWithLetter && categoryMatch;
    });
  }

  // ===== WRITE OPERATIONS (Schreibt in DB UND aktualisiert RAM) =====

  async addUser(userData) {
    // Erst in DB schreiben
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, is_admin) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, is_admin',
      [userData.username, userData.email, userData.password, userData.is_admin || false]
    );
    
    const newUser = result.rows[0];
    
    // Dann RAM aktualisieren
    this.users.unshift(newUser); // Am Anfang hinzufügen (neueste zuerst)
    
    return newUser;
  }

  async removeUser(userId) {
    // Erst aus DB löschen
    await db.query('DELETE FROM users WHERE user_id = $1', [userId]);
    
    // Dann aus RAM entfernen
    this.users = this.users.filter(user => user.user_id !== parseInt(userId));
  }

  async addWord(wordData) {
    const result = await db.query(
      'INSERT INTO valid_words (word, category_id) VALUES ($1, $2) RETURNING word_id, word, category_id',
      [wordData.word, wordData.category_id]
    );
    
    const newWord = result.rows[0];
    
    // Category Name hinzufügen für Konsistenz
    const category = this.findCategoryById(newWord.category_id);
    newWord.category_name = category ? category.category_name : 'Unknown';
    
    this.words.push(newWord);
    
    return newWord;
  }

  async removeWord(wordId) {
    await db.query('DELETE FROM valid_words WHERE word_id = $1', [wordId]);
    this.words = this.words.filter(word => word.word_id !== parseInt(wordId));
  }

  // Game Entry zum DataStore hinzufügen (für Live-Highscore Updates)
  addGameEntry(gameEntry) {
    // Neue Entry zum Cache hinzufügen
    this.gameEntries.unshift(gameEntry); // Am Anfang hinzufügen (neueste zuerst)
    console.log(`📝 Game entry added to DataStore cache: ${gameEntry.answer} (${gameEntry.points}pts)`);
  }

  // Multiplayer Highscore aus Cache berechnen
  getMultiplayerHighscore(limit = 10) {
    const playerScores = {};
    
    // Alle Multiplayer game_entries durchgehen
    this.gameEntries
      .filter(entry => entry.is_multiplayer)
      .forEach(entry => {
        if (!playerScores[entry.user_id]) {
          const user = this.users.find(u => u.user_id === entry.user_id);
          playerScores[entry.user_id] = {
            user_id: entry.user_id,
            username: user ? user.username : 'Unknown',
            total_points: 0
          };
        }
        playerScores[entry.user_id].total_points += entry.points;
      });

    // Nach Punkten sortieren und Top X zurückgeben
    return Object.values(playerScores)
      .sort((a, b) => b.total_points - a.total_points)
      .slice(0, limit);
  }
}

// Singleton Pattern - eine Instanz für die ganze App
const dataStore = new DataStore();

module.exports = dataStore;
