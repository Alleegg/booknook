import { createPool } from './db/pool.js';
import { createLogger } from './logger.js';
import { createGenreModel } from './models/genreModel.js';
import { createBookModel } from './models/bookModel.js';
import { createOrderModel } from './models/orderModel.js';

export function createContainer(config) {
  const logger = createLogger();
  const pool = createPool(config.databaseUrl, logger);
  const genreModel = createGenreModel(pool);
  const bookModel = createBookModel(pool);
  const orderModel = createOrderModel(pool);

  return {
    config,
    logger,
    pool,
    genreModel,
    bookModel,
    orderModel,
  };
}

export async function closeContainer(container) {
  await container.pool.end();
}
