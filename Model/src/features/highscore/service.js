//===================================================================
// HIGHSCORE SERVICE - Business Logic für Highscore/Rangliste System
//===================================================================
// Autor: Torga Aslan
//
// Beschreibung: Service Layer für Highscore Berechnungen und Rankings
// - Database Aggregation aller User Punkte aus game_entries
// - Fallback auf DataStore Cache bei Database Fehlern
// - Multiplayer-Filter für faire Rangliste
// - Performance Optimization mit LIMIT Parameter
//===================================================================

const DataStore = require('../../store/DataStore');
const db = require('../../db');

//===================================================================
// HIGHSCORE CALCULATION OPERATIONS
//===================================================================

// Komplette Highscore aus Database laden (nicht nur Cache)
// Aggregiert alle Punkte pro User aus sämtlichen gespielten Runden
async function getFullHighscore(limit = 10) {
  try {
    // SQL AGGREGATION QUERY: Summe aller Punkte pro User
    // - LEFT JOIN: Auch User ohne Spiele anzeigen (mit 0 Punkten)
    // - Multiplayer Filter: Nur echte Multiplayer-Spiele zählen
    // - GROUP BY: Punkte pro User summieren  
    // - ORDER BY: Beste Spieler zuerst (DESC)
    const query = `
      SELECT 
        u.username,                           -- Username für Anzeige
        u.id as user_id,                     -- User ID für weitere Queries
        COALESCE(SUM(ge.points), 0) as total_points,  -- Gesamtpunkte (NULL → 0)
        COUNT(ge.id) as games_played,        -- Anzahl gespielte Runden
        MAX(ge.created_at) as last_game      -- Letztes Spiel (für Aktivität)
      FROM users u 
      LEFT JOIN game_entries ge ON u.id = ge.user_id 
      WHERE ge.is_multiplayer = true OR ge.is_multiplayer IS NULL  -- Nur Multiplayer Spiele
      GROUP BY u.id, u.username 
      ORDER BY total_points DESC             -- Beste Spieler zuerst
      LIMIT $1                              -- Performance: Top-N nur
    `;
    
    const result = await db.query(query, [limit]);
    
    // Frontend Data Formatting - User-friendly Format mit Rankings
    return result.rows.map((row, index) => ({
      rank: index + 1,                         // 1, 2, 3, ... (Position in Rangliste)
      username: row.username,                  // Anzeigename
      totalPoints: parseInt(row.total_points), // Gesamtpunkte als Number
      gamesPlayed: parseInt(row.games_played), // Anzahl Spiele als Number
      lastGame: row.last_game                  // Letzte Aktivität (Timestamp)
    }));
    
  } catch (error) {
    console.error('Fehler beim Laden der Highscore aus Datenbank:', error);
    
    // FALLBACK STRATEGY: DataStore Cache verwenden wenn Database fail
    console.log('Fallback: Verwende DataStore-Cache für Highscore');
    return DataStore.getMultiplayerHighscore(limit);
  }
}

//===================================================================
// MODULE EXPORTS - Service Interface
//===================================================================
module.exports = {
  getFullHighscore
};
