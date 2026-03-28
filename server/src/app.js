import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import session from 'express-session';
import { loadConfig } from './config.js';
import { createContainer, closeContainer } from './container.js';
import { flashMiddleware } from './middleware/flash.js';
import { createRouter } from './routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function buildApp(container) {
  const app = express();
  const { config, logger } = container;

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  app.use(
    express.static(path.join(__dirname, '../../public'), {
      index: false,
    }),
  );
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      name: 'booknook.sid',
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        // Для HTTPS за прокси задайте COOKIE_SECURE=1 и настройте trust proxy
        secure: process.env.COOKIE_SECURE === '1',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    }),
  );

  app.use(flashMiddleware);

  app.use(createRouter(container));

  app.use((req, res) => {
    res.status(404).send('Страница не найдена');
  });

  app.use((err, req, res, _next) => {
    logger.error('Unhandled error', err);
    res.status(500).send('Внутренняя ошибка сервера');
  });

  return app;
}

async function main() {
  const config = loadConfig();
  const container = createContainer(config);
  const app = buildApp(container);
  const server = app.listen(config.port, () => {
    container.logger.info(`BookNook слушает порт ${config.port}`);
  });

  const shutdown = async () => {
    server.close();
    await closeContainer(container);
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
