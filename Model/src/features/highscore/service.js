// Highscore Service - Geschäftslogik für Highscore-Berechnungen  
// Autor: Torga

const DataStore = require('../../store/DataStore');
const db = require('../../db');

// Komplette Highscore aus Datenbank laden (nicht nur Cache)
async function getFullHighscore(limit = 10) {
  try {
    // SQL-Query: Alle Punkte pro User aus allen Spielen summieren
    const query = `
      SELECT 
        u.username,
        u.id as user_id,
        COALESCE(SUM(ge.points), 0) as total_points,
        COUNT(ge.id) as games_played,
        MAX(ge.created_at) as last_game
      FROM users u 
      LEFT JOIN game_entries ge ON u.id = ge.user_id 
      WHERE ge.is_multiplayer = true OR ge.is_multiplayer IS NULL
      GROUP BY u.id, u.username 
      ORDER BY total_points DESC 
      LIMIT $1
    `;
    
    const result = await db.query(query, [limit]);
    
    // Formatierung für Frontend
    return result.rows.map((row, index) => ({
      rank: index + 1,
      username: row.username,
      totalPoints: parseInt(row.total_points),
      gamesPlayed: parseInt(row.games_played),
      lastGame: row.last_game
    }));
    
  } catch (error) {
    console.error('Fehler beim Laden der Highscore aus Datenbank:', error);
    
    // Fallback: DataStore-Cache verwenden
    console.log('Fallback: Verwende DataStore-Cache für Highscore');
    return DataStore.getMultiplayerHighscore(limit);
  }
}

module.exports = {
  getFullHighscore
};
