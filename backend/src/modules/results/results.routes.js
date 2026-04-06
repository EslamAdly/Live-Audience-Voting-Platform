import { Router } from "express";
import { getPollResults } from "./results.controller.js";

const resultsRouter = Router();

resultsRouter.get("/:id/results", getPollResults);

export { resultsRouter };
