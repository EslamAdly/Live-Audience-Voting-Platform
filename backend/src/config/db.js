import pg from "pg";
import { env } from "./env.js";

const { Pool, types } = pg;

// Keep TIMESTAMP/TIMESTAMPTZ as raw strings to avoid implicit timezone shifts.
types.setTypeParser(1114, (value) => value);
types.setTypeParser(1184, (value) => value);

// export const pool = new Pool({
//   connectionString: env.databaseUrl,
//   max: env.database.maxClients,
//   idleTimeoutMillis: env.database.idleTimeoutMillis
// });

// export const verifyDatabaseConnection = async () => {
//   try {
//     await pool.query("SELECT 1");
//   } catch (error) {
//     const safeMessage =
//       error?.code === "28P01"
//         ? `PostgreSQL authentication failed for user "${env.database.user}". Check DB_USER/DB_PASSWORD in backend/.env.`
//         : `Unable to connect to PostgreSQL at ${env.database.host}:${env.database.port}/${env.database.name}. ${error.message}`;
//     throw new Error(safeMessage);
//   }
// };

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Supabase requires SSL
});

// Example query
pool.query('SELECT NOW()', (err, res) => {
  if (err) throw err;
  console.log(res.rows[0]);
});
