import * as SQLite from 'expo-sqlite';
import { SearchHistory } from '../types';

const db = SQLite.openDatabaseSync('chalo_bus.db');

export const initDatabase = async (): Promise<void> => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_city TEXT NOT NULL,
        to_city TEXT NOT NULL,
        search_count INTEGER DEFAULT 1,
        last_searched DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_last_searched ON search_history(last_searched DESC);
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const getSearchHistory = async (): Promise<SearchHistory[]> => {
  try {
    const result = await db.getAllAsync<{
      id: number;
      from_city: string;
      to_city: string;
      search_count: number;
      last_searched: string;
    }>(`
      SELECT * FROM search_history 
      ORDER BY last_searched DESC 
      LIMIT 5
    `);

    return result.map(row => ({
      id: row.id,
      fromCity: row.from_city,
      toCity: row.to_city,
      searchCount: row.search_count,
      lastSearched: row.last_searched,
    }));
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
};

export const addSearchHistory = async (
  fromCity: string,
  toCity: string
): Promise<void> => {
  try {
    const existing = await db.getAllAsync<{ id: number; search_count: number }>(
      `SELECT id, search_count FROM search_history 
       WHERE from_city = ? AND to_city = ?`,
      [fromCity, toCity]
    );

    if (existing.length > 0) {
      await db.runAsync(
        `UPDATE search_history 
         SET search_count = ?, last_searched = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [existing[0].search_count + 1, existing[0].id]
      );
    } else {
      await db.runAsync(
        `INSERT INTO search_history (from_city, to_city, search_count, last_searched) 
         VALUES (?, ?, 1, CURRENT_TIMESTAMP)`,
        [fromCity, toCity]
      );
    }
  } catch (error) {
    console.error('Error adding search history:', error);
    throw error;
  }
};

export const clearSearchHistory = async (): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM search_history');
  } catch (error) {
    console.error('Error clearing search history:', error);
    throw error;
  }
};
