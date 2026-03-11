import { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import crypto from "crypto";

// 1. Create and export addRequestId function
export const addRequestId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = crypto.randomUUID();
  res.locals.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
};

// 2. Teach morgan to read request id
morgan.token("id", (req: Request, res: Response) => {
  return res.locals.requestId as string;
});

// 3. Export full setup middleware
export const httpLogger = morgan(
  "[ReqID: :id] :method :url -> Status: :status | Latencia: :response-time ms",
);
