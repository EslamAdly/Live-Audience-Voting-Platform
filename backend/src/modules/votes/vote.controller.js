import { asyncHandler } from "../../utils/asyncHandler.js";
import { getSocketServer } from "../../socket.js";
import { voteService } from "./vote.service.js";

export const submitVote = asyncHandler(async (req, res) => {
  const { pollId, optionId } = req.validatedBody;
  const results = await voteService.submitVote({
    pollId,
    optionId,
    voterIp: req.clientIp,
    sessionToken: String(req.sessionToken)
  });

  const io = getSocketServer();
  if (io) {
    io.to(`poll:${pollId}`).emit("poll:results:update", { pollId, results });
  }

  res.status(201).json({
    message: "Vote submitted successfully",
    results,
    sessionToken: req.sessionToken
  });
});
