import { env } from "../config/env.js";

export const notFoundHandler = (_req, res) => {
  res.status(404).json({ message: "Route not found" });
};

const isPostgresAuthError = (err) =>
  err?.code === "28P01" ||
  (typeof err?.message === "string" && err.message.includes("password authentication failed"));

export const errorHandler = (err, _req, res, _next) => {
  if (env.nodeEnv !== "production" && err?.message) {
    console.error(err);
  }

  if (isPostgresAuthError(err)) {
    return res.status(503).json({
      message:
        "Database connection failed: invalid PostgreSQL credentials. Update DATABASE_URL in backend/.env to match your PostgreSQL user and password.",
      details: env.nodeEnv === "development" ? { code: err.code } : null
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    message,
    details: err.details || null
  });
};
