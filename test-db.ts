import pkg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const { Pool } = pkg;

const cleanEnvVal = (val: string | undefined): string | undefined => {
  if (!val) return val;
  let s = val.trim();
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.substring(1, s.length - 1);
  }
  return s;
};

async function testConnection() {
  const host = "/app/cloudsql/end--to-end-data-pipeline:asia-southeast1:ai-studio-a182af98";
  const user = cleanEnvVal(process.env.SQL_USER) || "ai_studio_app_user";
  const password = cleanEnvVal(process.env.SQL_PASSWORD) || "";
  const database = cleanEnvVal(process.env.SQL_DB_NAME) || "cloud_sql_development_database";

  console.log("=== DB Connection Diagnostics ===");
  console.log("Host (hardcoded):", host);
  console.log("User:", user);
  console.log("Password (raw):", password);
  console.log("Password char codes:", Array.from(password).map(c => `${c}:${c.charCodeAt(0)}`).join(', '));
  console.log("Database name:", database);

  // Test 1: App User over Unix Socket
  console.log("\n--- Test 1: App User over Unix Socket ---");
  const pool1 = new Pool({
    host,
    user,
    password,
    database,
    port: 5432,
    connectionTimeoutMillis: 5000,
  });
  try {
    const client = await pool1.connect();
    console.log("SUCCESS Test 1!");
    const res = await client.query("SELECT 1+1 AS result");
    console.log("Result:", res.rows);
    client.release();
  } catch (err: any) {
    console.error("FAILED Test 1:", err.message, err.code);
  } finally {
    await pool1.end();
  }

  // Test 2: App User with replaced newline in password
  const unescapedPassword = password.replace(/\\n/g, '\n');
  console.log("\n--- Test 2: App User with \\n unescaped to actual newline ---");
  console.log("Unescaped password char codes:", Array.from(unescapedPassword).map(c => `${c}:${c.charCodeAt(0)}`).join(', '));
  const pool2 = new Pool({
    host,
    user,
    password: unescapedPassword,
    database,
    port: 5432,
    connectionTimeoutMillis: 5000,
  });
  try {
    const client = await pool2.connect();
    console.log("SUCCESS Test 2!");
    const res = await client.query("SELECT 1+1 AS result");
    console.log("Result:", res.rows);
    client.release();
  } catch (err: any) {
    console.error("FAILED Test 2:", err.message, err.code);
  } finally {
    await pool2.end();
  }

  // Test 3: Admin User over Unix Socket
  const adminUser = cleanEnvVal(process.env.SQL_ADMIN_USER) || "ai_studio_admin";
  const adminPassword = cleanEnvVal(process.env.SQL_ADMIN_PASSWORD) || "";
  console.log("\n--- Test 3: Admin User over Unix Socket ---");
  console.log("Admin User:", adminUser);
  console.log("Admin Password:", adminPassword);
  const pool3 = new Pool({
    host,
    user: adminUser,
    password: adminPassword,
    database,
    port: 5432,
    connectionTimeoutMillis: 5000,
  });
  try {
    const client = await pool3.connect();
    console.log("SUCCESS Test 3!");
    const res = await client.query("SELECT 1+1 AS result");
    console.log("Result:", res.rows);
    client.release();
  } catch (err: any) {
    console.error("FAILED Test 3:", err.message, err.code);
  } finally {
    await pool3.end();
  }

  // Test 4: Localhost/TCP (port 5432)
  console.log("\n--- Test 4: Connecting via localhost:5432 TCP ---");
  const pool4 = new Pool({
    host: 'localhost',
    user,
    password,
    database,
    port: 5432,
    connectionTimeoutMillis: 5000,
  });
  try {
    const client = await pool4.connect();
    console.log("SUCCESS Test 4!");
    const res = await client.query("SELECT 1+1 AS result");
    console.log("Result:", res.rows);
    client.release();
  } catch (err: any) {
    console.error("FAILED Test 4:", err.message, err.code);
  } finally {
    await pool4.end();
  }
}

testConnection();

