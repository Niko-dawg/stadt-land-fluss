const { query } = require("../../db");
const { calculatePoints } = require("./highscore_logic");

//Kategorie zu ID Zuordnung für die Datenbankabfrage
const categoryMap = {
  stadt: 1,
  land: 2,
  fluss: 3,
  tier: 4};

async function checkAnswers(answers) {
  const { stadt, land, fluss, tier, buchstabe } = answers;
  const results = {};
  let totalPoints = 0;

  //Hilfsfunktion zur Validierung einer Antwort
  async function validateAnswer(answer, categoryName) {
    if (!answer || answer.trim() === "") {
      return { valid: false, points: 0, reason: "Empty answer" };
    }

    const categoryId = categoryMap[categoryName];
    if (!categoryId) {
      return { valid: false, points: 0, reason: "Invalid category" };
    }

    //Überprüfen ob das Wort mit dem korrektem Buchstaben anfängt
    if (!answer.toLowerCase().startsWith(buchstabe.toLowerCase())) {
      return { valid: false, points: 0, reason: "Does not start with the letter" };
    }

    //Überprüfen ob das Wort in der Datenbank vohanden ist
    const sql = "SELECT word FROM valid_words WHERE category_id = $1 AND LOWER(word) = LOWER($2)";
    const params = [categoryId, answer.trim()];
    const res = await query(sql, params);

    if (res.rows.length === 0) {
      return { valid: false, points: 0, reason: "Not a valid word for this category" };
    }

    //Zusammenrechnen
    const points = calculatePoints(answer, true, true);
    return { valid: true, points, reason: "Valid" };
  }

  
  results.stadt = await validateAnswer(stadt, "stadt");
  results.land = await validateAnswer(land, "land");
  results.fluss = await validateAnswer(fluss, "fluss");
  results.tier = await validateAnswer(tier, "tier");

  //Gesamtepunktzahl berechnen
  totalPoints = Object.values(results).reduce((sum, res) => sum + res.points, 0);

  return {
    results,
    totalPoints,
    buchstabe
  };
}

module.exports = { checkAnswers };