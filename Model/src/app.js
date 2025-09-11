// Express-App: Middleware + Routen (kein Port/Listen hier)
// Autor: Torga Aslan
const express = require('express');
const cors = require('cors');
const path = require('path');


// Feature-Router
const authRouter = require('./features/auth/router');
const adminRouter = require('./features/admin/router');
const pointsRouter = require('./features/points/router');
const gameRouter = require('./features/game/router');

const app = express();


app.use(cors({ origin: '*' })); // CORS-Middleware, um Cross-Origin-Anfragen zu erlauben
app.use(express.json()); // Middleware zum Parsen von JSON-Anfragen

// Features mounten
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/points', pointsRouter);
app.use('/api/game', gameRouter);

// --- React-Build statisch ausliefern ---
const buildDir = path.resolve(__dirname, '../../stadt-land-fluss/build');
app.use(express.static(buildDir));

// --- Catch-All NUR für Nicht-/api-Routen (Express 5 kompatibel) ---
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});
module.exports = app;
