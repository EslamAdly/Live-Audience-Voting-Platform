import crypto from "crypto";

export const requestContext = (req, _res, next) => {
  const forwarded = req.headers["x-forwarded-for"];
  const ipFromHeader = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "";

  req.clientIp = ipFromHeader || req.ip || req.socket.remoteAddress || "unknown";
  req.sessionToken = req.headers["x-session-token"] || crypto.randomUUID();

  next();
};
