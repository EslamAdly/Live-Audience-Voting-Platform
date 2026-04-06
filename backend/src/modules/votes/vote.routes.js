import { Router } from "express";
import { voteRateLimiter } from "../../middlewares/rateLimiter.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { submitVote } from "./vote.controller.js";
import { voteSchema } from "./vote.validation.js";

const voteRouter = Router();

voteRouter.post("/", voteRateLimiter, validateRequest(voteSchema), submitVote);

export { voteRouter };
