import { asyncHandler } from "../../utils/asyncHandler.js";
import { resultsRepository } from "./results.repository.js";

export const getPollResults = asyncHandler(async (req, res) => {
  const pollId = Number(req.params.id);
  const data = await resultsRepository.getPollResults(pollId);
  res.json(data);
});
