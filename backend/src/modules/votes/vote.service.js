import { ApiError } from "../../utils/ApiError.js";
import { resultsRepository } from "../results/results.repository.js";
import { voteRepository } from "./vote.repository.js";

export const voteService = {
  async submitVote({ pollId, optionId, voterIp, sessionToken }) {
    const poll = await voteRepository.findPollWithOption(pollId, optionId);
    if (!poll) throw new ApiError(404, "Poll not found");
    if (!poll.has_option) throw new ApiError(400, "Invalid option for selected poll");

    const now = new Date();
    if (now < new Date(poll.start_time) || now > new Date(poll.end_time)) {
      throw new ApiError(400, "Poll is inactive (outside voting time window)");
    }

    try {
      await voteRepository.createVote({ pollId, optionId, voterIp, sessionToken });
    } catch (error) {
      if (error.code === "23505") {
        throw new ApiError(409, "Duplicate vote is not allowed");
      }
      throw error;
    }

    return resultsRepository.getPollResults(pollId);
  }
};
