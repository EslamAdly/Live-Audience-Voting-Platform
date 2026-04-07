import pg from "pg";
import { env } from "./env.js";

const { Pool, types } = pg;

// Keep TIMESTAMP/TIMESTAMPTZ as raw strings to avoid implicit timezone shifts.
types.setTypeParser(1114, (value) => value);
types.setTypeParser(1184, (value) => value);

export const pool = new Pool({
  connectionString: env.databaseUrl || process.env.DATABASE_URL,
  max: env.database?.maxClients || 10,
  idleTimeoutMillis: env.database?.idleTimeoutMillis || 30000,
  ssl: { rejectUnauthorized: false } // Supabase requires SSL
});

export const verifyDatabaseConnection = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connection verified");
  } catch (error) {
    const safeMessage =
      error?.code === "28P01"
        ? `PostgreSQL authentication failed. Check DB_USER/DB_PASSWORD.`
        : `Unable to connect to PostgreSQL. ${error.message}`;
    throw new Error(safeMessage);
  }
};
