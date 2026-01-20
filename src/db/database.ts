import * as SQLite from 'expo-sqlite';
import { BusOperator, BusSchedule, SearchHistory } from '../types';

const db = SQLite.openDatabaseSync('chalo_bus.db');

type SqliteBoolean = 0 | 1;

const toSqliteBoolean = (value: unknown): SqliteBoolean => {
  if (value === true || value === 1 || value === '1' || value === 'true') {
    return 1;
  }
  return 0;
};

const fromSqliteBoolean = (value: unknown): boolean => {
  return value === 1 || value === '1' || value === true || value === 'true';
};

const normalizeBusOperatorRow = (row: {
  id: number;
  operator_name: string;
  operator_code: string;
  is_state_transport: unknown;
}): BusOperator => {
  return {
    id: row.id,
    operatorName: row.operator_name,
    operatorCode: row.operator_code,
    isStateTransport: fromSqliteBoolean(row.is_state_transport),
  };
};

const normalizeBusScheduleRow = (row: {
  id: number;
  bus_number: string;
  operator_id: number;
  from_city: string;
  to_city: string;
  departure_time: string;
  arrival_time: string;
  fare: number;
  is_ac: unknown;
  is_sleeper: unknown;
}): BusSchedule => {
  return {
    id: row.id,
    busNumber: row.bus_number,
    operatorId: row.operator_id,
    fromCity: row.from_city,
    toCity: row.to_city,
    departureTime: row.departure_time,
    arrivalTime: row.arrival_time,
    fare: row.fare,
    isAc: fromSqliteBoolean(row.is_ac),
    isSleeper: fromSqliteBoolean(row.is_sleeper),
  };
};

export const initDatabase = async (): Promise<void> => {
  try {
    await db.execAsync(`PRAGMA foreign_keys = ON;`);

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

    const busOperatorsInfo = await db.getAllAsync<{ name: string; type: string }>(
      `PRAGMA table_info(bus_operators)`
    );
    const isStateTransportColumn = busOperatorsInfo.find(
      (col) => col.name === 'is_state_transport'
    );
    const needsBusOperatorsRecreate =
      busOperatorsInfo.length > 0 &&
      (!isStateTransportColumn ||
        isStateTransportColumn.type.toUpperCase() !== 'INTEGER');

    const busSchedulesInfo = await db.getAllAsync<{ name: string; type: string }>(
      `PRAGMA table_info(bus_schedules)`
    );
    const isAcColumn = busSchedulesInfo.find((col) => col.name === 'is_ac');
    const isSleeperColumn = busSchedulesInfo.find(
      (col) => col.name === 'is_sleeper'
    );
    const needsBusSchedulesRecreate =
      busSchedulesInfo.length > 0 &&
      ((!isAcColumn || isAcColumn.type.toUpperCase() !== 'INTEGER') ||
        (!isSleeperColumn || isSleeperColumn.type.toUpperCase() !== 'INTEGER'));

    if (needsBusOperatorsRecreate || needsBusSchedulesRecreate) {
      await db.execAsync(`
        DROP TABLE IF EXISTS bus_schedules;
        DROP TABLE IF EXISTS bus_operators;
      `);
    }

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS bus_operators (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operator_name TEXT NOT NULL,
        operator_code TEXT NOT NULL UNIQUE,
        is_state_transport INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS bus_schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bus_number TEXT NOT NULL,
        operator_id INTEGER NOT NULL,
        from_city TEXT NOT NULL,
        to_city TEXT NOT NULL,
        departure_time TEXT NOT NULL,
        arrival_time TEXT NOT NULL,
        fare INTEGER NOT NULL,
        is_ac INTEGER NOT NULL DEFAULT 0,
        is_sleeper INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY(operator_id) REFERENCES bus_operators(id)
      );

      CREATE INDEX IF NOT EXISTS idx_bus_schedules_route ON bus_schedules(from_city, to_city);
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

export const addBusOperator = async (
  operatorName: string,
  operatorCode: string,
  isStateTransport: boolean
): Promise<void> => {
  try {
    await db.runAsync(
      `INSERT INTO bus_operators (operator_name, operator_code, is_state_transport)
       VALUES (?, ?, ?)
       ON CONFLICT(operator_code) DO UPDATE SET
         operator_name = excluded.operator_name,
         is_state_transport = excluded.is_state_transport`,
      [operatorName, operatorCode, toSqliteBoolean(isStateTransport)]
    );
  } catch (error) {
    console.error('Error adding bus operator:', error);
    throw error;
  }
};

export const getBusOperators = async (): Promise<BusOperator[]> => {
  try {
    const result = await db.getAllAsync<{
      id: number;
      operator_name: string;
      operator_code: string;
      is_state_transport: unknown;
    }>(`SELECT * FROM bus_operators`);

    return result.map(normalizeBusOperatorRow);
  } catch (error) {
    console.error('Error getting bus operators:', error);
    return [];
  }
};

export const addBusSchedule = async (
  busNumber: string,
  operatorId: number,
  fromCity: string,
  toCity: string,
  departureTime: string,
  arrivalTime: string,
  fare: number,
  isAc: boolean,
  isSleeper: boolean
): Promise<void> => {
  try {
    await db.runAsync(
      `INSERT INTO bus_schedules 
       (bus_number, operator_id, from_city, to_city, departure_time, arrival_time, fare, is_ac, is_sleeper) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        busNumber,
        operatorId,
        fromCity,
        toCity,
        departureTime,
        arrivalTime,
        fare,
        toSqliteBoolean(isAc),
        toSqliteBoolean(isSleeper),
      ]
    );
  } catch (error) {
    console.error('Error adding bus schedule:', error);
    throw error;
  }
};

export const getBusSchedules = async (
  fromCity: string,
  toCity: string
): Promise<BusSchedule[]> => {
  try {
    const result = await db.getAllAsync<{
      id: number;
      bus_number: string;
      operator_id: number;
      from_city: string;
      to_city: string;
      departure_time: string;
      arrival_time: string;
      fare: number;
      is_ac: unknown;
      is_sleeper: unknown;
    }>(
      `SELECT * FROM bus_schedules 
       WHERE from_city = ? AND to_city = ? 
       ORDER BY departure_time`,
      [fromCity, toCity]
    );

    return result.map(normalizeBusScheduleRow);
  } catch (error) {
    console.error('Error getting bus schedules:', error);
    return [];
  }
};
