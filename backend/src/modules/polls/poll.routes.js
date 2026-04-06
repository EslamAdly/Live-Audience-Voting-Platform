import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createPollSchema, updatePollSchema } from "./poll.validation.js";
import { createPoll, deletePoll, getPollById, listPolls, updatePoll } from "./poll.controller.js";

const pollRouter = Router();

pollRouter.get("/", listPolls);
pollRouter.get("/:id", getPollById);
pollRouter.post("/", validateRequest(createPollSchema), createPoll);
pollRouter.put("/:id", validateRequest(updatePollSchema), updatePoll);
pollRouter.delete("/:id", deletePoll);

export { pollRouter };
