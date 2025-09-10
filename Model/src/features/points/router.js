//Autor: Nikolas Paul Zimmer
//express wird importiert und ein Router wird erstellt + einbinden von service.js
const express = require("express");
const router = express.Router();
const { checkAnswers } = require("./service");

//Route wird definiert, Frontend sendet eine POST Anfrage an /points/check
router.post("/check", async (req, res) => {
  try {
    //Übergibt req.body an checkAnswers aus service.js als .json
    const result = await checkAnswers(req.body); 
    res.json(result);
  } catch (err) {
    console.error("Fehler bei /points/check:", err);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

module.exports = router;
