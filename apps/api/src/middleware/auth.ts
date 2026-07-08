import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) throw new AppError(401, "No token provided");

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: string };
    
    req.userId = payload.userId;
    next();
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
}