//Autor: Torga Aslan
// Definiert die Endpunkte
const router = require('express').Router();
const ctrl = require('./controller');

router.post('/register', ctrl.register); // POST /api/auth/register
router.post('/login', ctrl.login);       // POST /api/auth/login

module.exports = router;

userLogin = (username, password) => {
  // Hier könnte die Logik für die Benutzeranmeldung stehen
};
