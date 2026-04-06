import { ApiError } from "../utils/ApiError.js";

export const validateRequest = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return next(new ApiError(400, "Invalid request payload", result.error.flatten()));
  }

  req.validatedBody = result.data;
  return next();
};
