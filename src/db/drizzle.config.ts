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

const databaseUrl = cleanEnvVal(process.env.DATABASE_URL) || cleanEnvVal(process.env.POSTGRES_URL);

let dbCredentials: any = {};
if (databaseUrl) {
  const isProd = process.env.NODE_ENV === "production";
  const hasSslQuery = databaseUrl.includes("sslmode=require") || databaseUrl.includes("ssl=true");
  dbCredentials = {
    url: databaseUrl,
    ssl: (hasSslQuery || isProd) ? { rejectUnauthorized: false } : false,
  };
} else {
  dbCredentials = {
    host: cleanEnvVal(process.env.SQL_HOST) || "localhost",
    user: cleanEnvVal(process.env.SQL_ADMIN_USER) || cleanEnvVal(process.env.SQL_USER) || "postgres",
    password: cleanEnvVal(process.env.SQL_ADMIN_PASSWORD) || cleanEnvVal(process.env.SQL_PASSWORD) || "",
    database: cleanEnvVal(process.env.SQL_DB_NAME) || cleanEnvVal(process.env.SQL_DB) || "postgres",
    port: parseInt(cleanEnvVal(process.env.SQL_PORT) || "5432", 10),
    ssl: false,
  };
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle", // Output directory for migrations.
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials,
  verbose: true,
});
