import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

export function loadConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required (see .env.example)');
  }
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    databaseUrl,
    sessionSecret: process.env.SESSION_SECRET || 'dev-insecure-secret',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin',
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}
