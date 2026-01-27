import { Pool } from 'pg';
import { config } from './config';
import logger from './logger';

let pool: Pool;

export const initializeDatabase = async (): Promise<void> => {
    try {
        pool = new Pool({
            connectionString: config.databaseUrl,
        });
        await pool.query('SELECT NOW()');
        logger.info('Database connection established successfully');
    } catch (error) {
        logger.error('Failed to connect to database:', error);
        throw error;
    }
};

export const getPool = (): Pool => {
    if (!pool) {
        throw new Error('Database pool not initialized. Call initializeDatabase first.');
    }
    return pool;
};

export const closeDatabase = async (): Promise<void> => {
    if (pool) {
        await pool.end();
        logger.info('Database connection closed');
    }
};
