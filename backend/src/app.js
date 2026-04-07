import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { verifyDatabaseConnection } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { requestContext } from "./middlewares/requestContext.js";
import { pollRouter } from "./modules/polls/poll.routes.js";
import { resultsRouter } from "./modules/results/results.routes.js";
import { voteRouter } from "./modules/votes/vote.routes.js";

const app = express();
const allowedOrigins = [
  env.frontendUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://live-audience-voting-platform.vercel.app",
  "https://live-audience-voting-platform-u2yx.vercel.app"
];

// Allow additional origins from environment variable (comma-separated)
if (process.env.ALLOWED_ORIGINS) {
  const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
  allowedOrigins.push(...additionalOrigins);
}

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(requestContext);

app.get("/health", async (_req, res) => {
  try {
    await verifyDatabaseConnection();
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ status: "error", database: error.message });
  }
});

app.use("/polls", pollRouter);
app.use("/polls", resultsRouter);
app.use("/vote", voteRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
