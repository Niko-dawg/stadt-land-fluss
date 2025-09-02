const svc = require('./service');

async function register(req, res) {
  try {
    const { user } = await svc.register(req.body || {});
    res.status(201).json({ user, note: 'Dev-Mode: JWT folgt' });
  } catch (e) {
    const map = { MISSING_FIELDS: 400, EMAIL_EXISTS: 409 };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}
async function login(req, res) {
  try {
    const { user } = await svc.login(req.body || {});
    res.json({ user, note: 'Dev-Mode: Kein Token. JWT folgt.' });
  } catch (e) {
    const map = { MISSING_FIELDS: 400, INVALID_CREDENTIALS: 401 };
    res.status(map[e.message] || 500).json({ error: e.message });
  }
}

module.exports = { register, login };
