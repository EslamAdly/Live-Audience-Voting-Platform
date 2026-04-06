import rateLimit from "express-rate-limit";

export const voteRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many vote requests, please try again later." }
});
