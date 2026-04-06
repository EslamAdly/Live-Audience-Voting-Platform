import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const required = (value, key) => {
  if (!value) {
    throw new Error(`${key} is required in backend/.env`);
  }
  return value;
};

const dbHost = required(process.env.DB_HOST, "DB_HOST");
const dbPort = Number(process.env.DB_PORT || 5432);
const dbUser = required(process.env.DB_USER, "DB_USER");
const dbPassword = required(process.env.DB_PASSWORD, "DB_PASSWORD");
const dbName = required(process.env.DB_NAME, "DB_NAME");

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  databaseUrl:
    process.env.DATABASE_URL ||
    `postgresql://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbName}`,
  database: {
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    name: dbName,
    maxClients: Number(process.env.DB_MAX_CLIENTS || 10),
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT || 30000)
  }
};
