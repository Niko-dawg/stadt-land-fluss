//===================================================================
// ADMIN ROUTER - HTTP Route Definitions für Admin Panel
//===================================================================
// Autor: Torga Aslan
//
// Beschreibung: Express Router für Admin-Only Operations
// - User Management Routes (CRUD für alle User)
// - Word Management Routes (Kategorie-Wörter verwalten)
// - Security: Doppelte Middleware-Kette (JWT + Admin Check)
// - Alle Routes automatisch Admin-protected
//===================================================================

const router = require('express').Router();
const ctrl = require('./controller');
const { authenticateToken, requireAdmin } = require('../../middleware/auth');

//===================================================================
// SECURITY MIDDLEWARE CHAIN - Alle Admin Routes automatisch geschützt
//===================================================================
// MIDDLEWARE-KETTE: Alle Admin-Routen sind automatisch geschützt
// 1. authenticateToken → dekodiert JWT Token → setzt req.user
// 2. requireAdmin → prüft req.user.is_admin
// 3. Dann erst die eigentliche Route
router.use(authenticateToken);  // JWT Token Validation
router.use(requireAdmin);       // Admin Permission Check

//===================================================================
// USER MANAGEMENT ROUTES
//===================================================================

// GET /api/admin/users - Alle User für Admin Dashboard
router.get('/users', ctrl.getAllUsers);           

// POST /api/admin/users - Neuen User anlegen (Admin kann User erstellen)
router.post('/users', ctrl.createUser);           

// GET /api/admin/users/search?query=xyz - User durchsuchen
router.get('/users/search', ctrl.searchUsers);    

// DELETE /api/admin/users/:id - User löschen (Admin kann andere User löschen)
router.delete('/users/:id', ctrl.deleteUser);     

//===================================================================
// WORD MANAGEMENT ROUTES  
//===================================================================

// GET /api/admin/words/:categoryId - Alle Wörter einer Kategorie
router.get('/words/:categoryId', ctrl.getWordsByCategory);  

// POST /api/admin/words - Neues Wort zu Kategorie hinzufügen
router.post('/words', ctrl.createWord);                     

// DELETE /api/admin/words/:id - Wort aus Kategorie löschen
router.delete('/words/:id', ctrl.deleteWord);               

//===================================================================
// MODULE EXPORTS - Router Configuration
//===================================================================
module.exports = router;
