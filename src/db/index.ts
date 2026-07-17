import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from './schema.ts';

const { Pool } = pkg;

// Helper to clean environment variables that might be wrapped in quotes
const cleanEnvVal = (val: string | undefined): string | undefined => {
  if (!val) return val;
  let s = val.trim();
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.substring(1, s.length - 1);
  }
  return s;
};

// Function to create a new connection pool.
export const createPool = () => {
  return new Pool({
    host: cleanEnvVal(process.env.SQL_HOST),
    user: cleanEnvVal(process.env.SQL_USER),
    password: cleanEnvVal(process.env.SQL_PASSWORD),
    database: cleanEnvVal(process.env.SQL_DB_NAME),
    connectionTimeoutMillis: 15000,
  });
};

// Create a pool instance.
const pool = createPool();

// Prevent unhandled pool-level errors from crashing the application
pool.on('error', (err) => {
  console.error('Unexpected error on idle SQL pool client:', err);
});

// Initialize Drizzle with the pool and schema.
export const db = drizzle(pool, { schema });
export { schema };
