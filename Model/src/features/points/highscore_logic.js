let highscores = [   { userId: "emilia", points: 95, createdAt: new Date("2025-09-02T14:30:00Z") } ];

//Punkteberechnung
function calculatePoints(answer, isValidWord, isUnique) {
  let basePoints = 0;
  if (!isValidWord) return 0; //ungültig keine Punkte
  //unkte abhängig von Wortlänge
  basePoints = answer.length;
  //Bonus wenn einzigartig
  if (isUnique) {
    basePoints += 5;
  }
  return basePoints;
}

//userId ist der Spielername
function addHighscore(answer, isValidWord, isUnique, userId) {
    const points = calculatePoints(answer, isValidWord, isUnique);
    const entry = { userId, points, createdAt: new Date() };
    highscores.push(entry);
    return entry;
}

function getHighscores() {
  //  return highscores;
    return highscores.sort((a, b) => b.points - a.points);
  //.sort sortiert die liste absteigend nach Punkten
}


// position: 1, player: "Anna", score: 150, crown: true }
//Formatiert die Highscores für das Frontend
function formatHighscoresForFrontend() {
    return getHighscores().map((entry, index) => ({
        position: index + 1,
        player: entry.userId,
        score: entry.points,
        crown: index === 0 // Krone für den ersten Platz
    }));
}

module.exports = { addHighscore, getHighscores, formatHighscoresForFrontend };
