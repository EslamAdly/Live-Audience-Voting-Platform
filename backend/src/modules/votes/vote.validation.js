import { z } from "zod";

export const voteSchema = z.object({
  pollId: z.number().int().positive(),
  optionId: z.number().int().positive()
});
