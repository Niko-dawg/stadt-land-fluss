// Express-App: Middleware + Routen (kein Port/Listen hier)
// Autor: Torga Aslan
const express = require('express');
const cors = require('cors');


// Feature-Router
const authRouter = require('./features/auth/router');

const app = express();


app.use(cors({ origin: '*' })); // CORS-Middleware, um Cross-Origin-Anfragen zu erlauben
app.use(express.json()); // Middleware zum Parsen von JSON-Anfragen

// Features mounten
app.use('/api/auth', authRouter);


module.exports = app;
