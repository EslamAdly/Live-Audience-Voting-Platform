import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { requestContext } from "./middlewares/requestContext.js";
import { pollRouter } from "./modules/polls/poll.routes.js";
import { resultsRouter } from "./modules/results/results.routes.js";
import { voteRouter } from "./modules/votes/vote.routes.js";

const app = express();
const allowedOrigins = [env.frontendUrl, "http://localhost:5173", "http://127.0.0.1:5173"];

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

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/polls", pollRouter);
app.use("/polls", resultsRouter);
app.use("/vote", voteRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
