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
  const connectionString = cleanEnvVal(process.env.DATABASE_URL) || cleanEnvVal(process.env.POSTGRES_URL);
  if (connectionString) {
    console.log("[PostgreSQL] Initializing connection pool using connection string (e.g. DATABASE_URL)");
    // Determine if SSL is needed. Railway or production databases usually require SSL with rejectUnauthorized: false.
    const hasSslQuery = connectionString.includes('sslmode=require') || connectionString.includes('ssl=true');
    const isProd = process.env.NODE_ENV === 'production';
    const ssl = (hasSslQuery || isProd) ? { rejectUnauthorized: false } : undefined;
    
    return new Pool({
      connectionString,
      ssl,
      connectionTimeoutMillis: 15000,
    });
  }

  console.log("[PostgreSQL] Initializing connection pool using discrete variables (SQL_HOST, SQL_USER, etc.)");
  return new Pool({
    host: cleanEnvVal(process.env.SQL_HOST),
    user: cleanEnvVal(process.env.SQL_USER),
    password: cleanEnvVal(process.env.SQL_PASSWORD),
    database: cleanEnvVal(process.env.SQL_DB_NAME),
    port: parseInt(cleanEnvVal(process.env.SQL_PORT) || '5432', 10),
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
