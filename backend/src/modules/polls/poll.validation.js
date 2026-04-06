import { z } from "zod";

const optionSchema = z.string().trim().min(1).max(255);
const dateTimeSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Invalid date/time value"
});

const basePollSchema = {
  title: z.string().trim().min(3).max(255),
  description: z.string().trim().min(3).max(2000),
  options: z.array(optionSchema).min(2).max(10),
  startTime: dateTimeSchema,
  endTime: dateTimeSchema,
  status: z.enum(["active", "inactive"]).default("inactive")
};

export const createPollSchema = z.object(basePollSchema).superRefine((data, ctx) => {
  if (new Date(data.endTime) <= new Date(data.startTime)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endTime"],
      message: "endTime must be greater than startTime"
    });
  }
});

export const updatePollSchema = z.object(basePollSchema).partial().superRefine((data, ctx) => {
  if (data.startTime && data.endTime && new Date(data.endTime) <= new Date(data.startTime)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endTime"],
      message: "endTime must be greater than startTime"
    });
  }
});
