import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env file.
dotenv.config();

// Helper to clean environment variables that might be wrapped in quotes
const cleanEnvVal = (val: string | undefined): string | undefined => {
  if (!val) return val;
  let s = val.trim();
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.substring(1, s.length - 1);
  }
  return s;
};

const sqlHost = cleanEnvVal(process.env.SQL_HOST);
const sqlDbName = cleanEnvVal(process.env.SQL_DB_NAME);
const user = cleanEnvVal(process.env.SQL_ADMIN_USER);
const password = cleanEnvVal(process.env.SQL_ADMIN_PASSWORD);

if (!sqlHost) {
  throw new Error("SQL_HOST must be set in environment variables.");
}
if (!sqlDbName) {
  throw new Error("SQL_DB_NAME must be set in environment variables.");
}
if (!user) {
  throw new Error("SQL_ADMIN_USER must be set in environment variables.");
}
if (!password) {
  throw new Error("SQL_ADMIN_PASSWORD must be set in environment variables.");
}
console.log(`Using user: ${user} to connect to database.`);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle", // Output directory for migrations.
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    host: sqlHost,
    user: user,
    password: password,
    database: sqlDbName,
    ssl: false,
  },
  verbose: true,
});
