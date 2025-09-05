
let highscores = [];

export function addHighscore() {
    const entry = { userId, points, createdAt: new Date() };
    highscores.push(entry);
    return entry;
}

function getHighscores() {
  //  return highscores;
    //Sortieren muss noch eingebaut werden!!!!
    return highscores.sort((a, b) => b.points - a.points);
}

function validatePoints(points) {
    return Number.isInteger(points) && points >= 0;
    // Nur positive und ganze Zahlen!
}

module.exports = { addHighscore, getHighscores, validatePoints };

/* position: 1, player: "Anna", score: 150, crown: true },* /