import dotenv from 'dotenv';

dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  redisUrl: string;
  logLevel: string;
}

const getConfig = (): Config => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = parseInt(process.env.PORT || '3000', 10);
  const databaseUrl = process.env.DATABASE_URL || '';
  const redisUrl = process.env.REDIS_URL || '';
  const logLevel = process.env.LOG_LEVEL || 'info';

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  if (!redisUrl) {
    throw new Error('REDIS_URL environment variable is required');
  }

  return {
    nodeEnv,
    port,
    databaseUrl,
    redisUrl,
    logLevel,
  };
};

export const config = getConfig();