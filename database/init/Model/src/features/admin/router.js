// Admin-Router für User-Management und Wort-Verwaltung
// Autor: Torga Aslan

const router = require('express').Router();
const ctrl = require('./controller');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');

// MIDDLEWARE-KETTE: Alle Admin-Routen sind automatisch geschützt
// 1. authenticateToken → dekodiert JWT Token → setzt req.user
// 2. requireAdmin → prüft req.user.is_admin
// 3. Dann erst die eigentliche Route
router.use(authenticateToken);
router.use(requireAdmin);

// User-Management
router.get('/users', ctrl.getAllUsers);           // User-Liste anzeigen
router.post('/users', ctrl.createUser);           // User anlegen  
router.get('/users/search', ctrl.searchUsers);    // User suchen
router.delete('/users/:id', ctrl.deleteUser);     // User löschen

// Wort-Management
router.get('/words/:categoryId', ctrl.getWordsByCategory);  // Wörter einer Kategorie
router.post('/words', ctrl.createWord);                     // Wort anlegen
router.delete('/words/:id', ctrl.deleteWord);               // Wort löschen

module.exports = router;
