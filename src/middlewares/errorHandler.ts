import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../models";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) => {
  // req.id comes from logger middleware
  const reqId = res.locals.requestId || "no-id";

  console.error(`[${reqId}] DB Error:`, err.message);

  res.status(500).json({ error: "Internal error in database" });
};
