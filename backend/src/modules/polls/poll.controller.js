import { asyncHandler } from "../../utils/asyncHandler.js";
import { pollService } from "./poll.service.js";

export const listPolls = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = await pollService.list(page, pageSize);
  res.json(result);
});

export const getPollById = asyncHandler(async (req, res) => {
  const poll = await pollService.getById(Number(req.params.id));
  res.json(poll);
});

export const createPoll = asyncHandler(async (req, res) => {
  const poll = await pollService.create(req.validatedBody);
  res.status(201).json(poll);
});

export const updatePoll = asyncHandler(async (req, res) => {
  const poll = await pollService.update(Number(req.params.id), req.validatedBody);
  res.json(poll);
});

export const deletePoll = asyncHandler(async (req, res) => {
  await pollService.remove(Number(req.params.id));
  res.status(204).send();
});
