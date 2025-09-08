const express = require("express");
const router = express.Router();
const { checkAnswers } = require("./service");

router.post("/check", async (req, res) => {
  try {
    const result = await checkAnswers(req.body); 
    res.json(result);
  } catch (err) {
    console.error("Fehler bei /points/check:", err);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

module.exports = router;
