import pg from 'pg';

export function createPool(databaseUrl, logger) {
  const pool = new pg.Pool({
    connectionString: databaseUrl,
    max: 10,
  });
  pool.on('error', (err) => {
    logger.error('PostgreSQL pool error', err);
  });
  return pool;
}
