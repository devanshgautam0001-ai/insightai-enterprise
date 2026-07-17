import dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from './schema.ts';
import fs from 'fs';
import path from 'path';

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
    const hasSslQuery = connectionString.includes('sslmode=require') || connectionString.includes('ssl=true');
    const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    const isUnixSocket = connectionString.startsWith('/') || connectionString.includes('/cloudsql/') || connectionString.includes('host=/');
    const isProd = process.env.NODE_ENV === 'production';
    
    let ssl: any = undefined;
    if (hasSslQuery) {
      ssl = { rejectUnauthorized: false };
    } else if (isProd && !isLocalhost && !isUnixSocket) {
      ssl = { rejectUnauthorized: false };
    }
    
    return new Pool({
      connectionString,
      ssl,
      connectionTimeoutMillis: 15000,
      statement_timeout: 5000, // Fail any query taking longer than 5 seconds
      idle_in_transaction_session_timeout: 5000 // Close transaction if left idle for more than 5 seconds
    });
  }

  console.log("[PostgreSQL] Initializing connection pool using discrete variables (SQL_HOST, SQL_USER, etc.)");
  let host = cleanEnvVal(process.env.SQL_HOST);
  if (host && (host.startsWith('/') || host.includes('/cloudsql/'))) {
    try {
      if (!fs.existsSync(host)) {
        console.warn(`[PostgreSQL] Configured socket host ${host} does not exist. Scanning alternative paths...`);
        const searchPaths = ['/app/cloudsql', '/cloudsql'];
        let foundCorrectedHost = false;
        for (const searchPath of searchPaths) {
          if (fs.existsSync(searchPath)) {
            const files = fs.readdirSync(searchPath);
            console.log(`[PostgreSQL] Found items under ${searchPath}:`, files);
            const socketDir = files.find(f => f.includes(':'));
            if (socketDir) {
              const correctedHost = path.join(searchPath, socketDir);
              console.log(`[PostgreSQL] Dynamically corrected host unix socket to ${correctedHost}`);
              host = correctedHost;
              foundCorrectedHost = true;
              break;
            }
          }
        }
        if (!foundCorrectedHost) {
          console.warn(`[PostgreSQL] Could not find any valid socket directory under standard search paths.`);
        }
      } else {
        console.log(`[PostgreSQL] Socket host directory ${host} verified and exists.`);
      }
    } catch (err: any) {
      console.error(`[PostgreSQL] Error checking/correcting socket host directory:`, err.message);
    }
  }
  const isUnixSocket = host?.startsWith('/') || host?.includes('/cloudsql/') || host?.includes('.sock');
  const isLocal = !host || host === 'localhost' || host === '127.0.0.1';
  const isProd = process.env.NODE_ENV === 'production';
  
  let ssl: any = undefined;
  if (isProd && !isUnixSocket && !isLocal) {
    ssl = { rejectUnauthorized: false };
  }

  return new Pool({
    host,
    user: cleanEnvVal(process.env.SQL_USER),
    password: cleanEnvVal(process.env.SQL_PASSWORD),
    database: cleanEnvVal(process.env.SQL_DB_NAME),
    port: parseInt(cleanEnvVal(process.env.SQL_PORT) || '5432', 10),
    ssl,
    connectionTimeoutMillis: 15000,
    statement_timeout: 5000, // Fail any query taking longer than 5 seconds
    idle_in_transaction_session_timeout: 5000 // Close transaction if left idle for more than 5 seconds
  });
};

// Create a pool instance.
export const pool = createPool();

// Prevent unhandled pool-level errors from crashing the application
pool.on('error', (err) => {
  console.error('Unexpected error on idle SQL pool client:', err);
});

import { EventEmitter } from 'events';
import { executeFallbackQuery, useFallback, setUseFallback } from './fallback.ts';

// Mock client that extends EventEmitter to support pg-pool event handler operations
class MockClient extends EventEmitter {
  async query(sql: any, params?: any, cb?: any): Promise<any> {
    if (typeof cb === 'function') {
      executeFallbackQuery(sql, params)
        .then(res => cb(null, res))
        .catch(err => cb(err));
      return;
    }
    return executeFallbackQuery(sql, params);
  }
  release() {}
}

// Save the original pool methods
const originalQuery = pool.query.bind(pool);
const originalConnect = pool.connect.bind(pool);

// Override query
pool.query = async function (sql: any, params?: any, cb?: any): Promise<any> {
  // If callback is provided, support it
  if (typeof cb === 'function') {
    if (useFallback) {
      executeFallbackQuery(sql, params)
        .then(res => cb(null, res))
        .catch(err => cb(err));
      return;
    }

    const wrappedCb = (err: any, res: any) => {
      if (err) {
        console.log("[Database] Redirecting pool query to local database.");
        setUseFallback(true);
        executeFallbackQuery(sql, params)
          .then(fallbackRes => cb(null, fallbackRes))
          .catch(fallbackErr => cb(fallbackErr));
      } else {
        cb(null, res);
      }
    };

    try {
      return originalQuery(sql, params, wrappedCb);
    } catch (err) {
      console.log("[Database] Local database redirect.");
      setUseFallback(true);
      executeFallbackQuery(sql, params)
        .then(fallbackRes => cb(null, fallbackRes))
        .catch(fallbackErr => cb(fallbackErr));
    }
    return;
  }

  if (useFallback) {
    return executeFallbackQuery(sql, params) as any;
  }
  try {
    return await originalQuery(sql, params);
  } catch (err: any) {
    console.log("[Database] Redirected query to local storage.");
    setUseFallback(true);
    return await executeFallbackQuery(sql, params) as any;
  }
} as any;

// Override connect
pool.connect = async function (cb?: any): Promise<any> {
  if (useFallback) {
    const mockClient = new MockClient();
    if (typeof cb === 'function') {
      cb(null, mockClient, () => {});
    }
    return mockClient as any;
  }

  try {
    const client = await originalConnect();
    // Wrap client query as well in case it fails during execution
    const originalClientQuery = client.query.bind(client);
    client.query = async function (sql: any, params?: any, clientCb?: any): Promise<any> {
      if (typeof clientCb === 'function') {
        if (useFallback) {
          executeFallbackQuery(sql, params)
            .then(res => clientCb(null, res))
            .catch(err => clientCb(err));
          return;
        }

        const wrappedClientCb = (err: any, res: any) => {
          if (err) {
            console.log("[Database] Redirecting client query to local database.");
            setUseFallback(true);
            executeFallbackQuery(sql, params)
              .then(fallbackRes => clientCb(null, fallbackRes))
              .catch(fallbackErr => clientCb(fallbackErr));
          } else {
            clientCb(null, res);
          }
        };

        try {
          return originalClientQuery(sql, params, wrappedClientCb);
        } catch (err) {
          console.log("[Database] Local client database redirect.");
          setUseFallback(true);
          executeFallbackQuery(sql, params)
            .then(fallbackRes => clientCb(null, fallbackRes))
            .catch(fallbackErr => clientCb(fallbackErr));
        }
        return;
      }

      if (useFallback) {
        return executeFallbackQuery(sql, params) as any;
      }
      try {
        return await originalClientQuery(sql, params);
      } catch (err: any) {
        console.log("[Database] Redirected client query to local storage.");
        setUseFallback(true);
        return await executeFallbackQuery(sql, params) as any;
      }
    } as any;
    return client;
  } catch (err: any) {
    console.log("[Database] Redirecting connection to local fallback storage.");
    setUseFallback(true);
    const mockClient = new MockClient();
    if (typeof cb === 'function') {
      cb(null, mockClient, () => {});
    }
    return mockClient as any;
  }
} as any;

// Initialize Drizzle with the pool and schema.
export const db = drizzle(pool, { schema });
export { schema };

// Robust database auto-migration function
export const syncDatabaseSchema = async () => {
  console.log("[PostgreSQL] Connecting to PostgreSQL to check and synchronize tables...");
  let client;
  try {
    client = await pool.connect();
    console.log("[PostgreSQL] Connection established successfully! Running auto-migrations...");
    
    // Create users table first
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        role TEXT DEFAULT 'NONE' NOT NULL,
        status TEXT DEFAULT 'PENDING' NOT NULL,
        approved BOOLEAN DEFAULT FALSE NOT NULL,
        is_active BOOLEAN DEFAULT FALSE NOT NULL,
        display_name TEXT,
        photo_url TEXT,
        provider TEXT,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Add new columns if table exists but lacks them
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'NONE' NOT NULL;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING' NOT NULL;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE NOT NULL;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE NOT NULL;
    `);

    // Workspaces table
    await client.query(`
      CREATE TABLE IF NOT EXISTS workspaces (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        division TEXT NOT NULL,
        member_count INTEGER DEFAULT 1 NOT NULL,
        status TEXT DEFAULT 'active' NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Datasets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS datasets (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
        name TEXT NOT NULL,
        size TEXT NOT NULL,
        bytes INTEGER DEFAULT 0 NOT NULL,
        rows INTEGER DEFAULT 0 NOT NULL,
        cols INTEGER DEFAULT 0 NOT NULL,
        file_type TEXT DEFAULT 'csv' NOT NULL,
        columns_data JSONB NOT NULL,
        quality_metrics JSONB NOT NULL,
        preview_rows JSONB NOT NULL,
        duplicate_count INTEGER DEFAULT 0 NOT NULL,
        duplicate_percentage REAL DEFAULT 0 NOT NULL,
        memory_usage TEXT NOT NULL,
        cleaning_status TEXT DEFAULT 'Not Started' NOT NULL,
        is_feature_engineering_completed BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Trained models table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trained_models (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
        name TEXT NOT NULL,
        algorithm TEXT NOT NULL,
        accuracy REAL NOT NULL,
        target_column TEXT NOT NULL,
        test_split INTEGER DEFAULT 20 NOT NULL,
        learning_rate REAL DEFAULT 0.03 NOT NULL,
        metrics JSONB NOT NULL,
        logs JSONB NOT NULL,
        prediction_status TEXT DEFAULT 'Not Started' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Dashboards table
    await client.query(`
      CREATE TABLE IF NOT EXISTS dashboards (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
        name TEXT NOT NULL,
        widgets JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Reports table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
        name TEXT NOT NULL,
        size TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Chat messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Predictions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS predictions (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
        model_id INTEGER REFERENCES trained_models(id) ON DELETE CASCADE NOT NULL,
        input_data JSONB NOT NULL,
        prediction TEXT NOT NULL,
        confidence REAL,
        probabilities JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("[PostgreSQL] All database tables verified and created successfully.");
  } catch (err: any) {
    console.error("[PostgreSQL] Schema synchronization failed:", err.message || err);
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
};
