import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

export const authRouter = Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /auth/google
authRouter.post("/google", async (req, res) => {
  const { idToken } = req.body as { idToken: string };
  if (!idToken) throw new AppError(400, "idToken is required");

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) throw new AppError(400, "Invalid Google token");

  // Upsert: si el user existe lo actualiza, si no lo crea
  const user = await prisma.user.upsert({
    where: { email: payload.email },
    update: { name: payload.name ?? "", avatarUrl: payload.picture ?? null },
    create: {
      email: payload.email,
      name: payload.name ?? "",
      avatarUrl: payload.picture ?? null,
    },
  });

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
});

// GET /auth/me
authRouter.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new AppError(401, "No token");

  const payload = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as { userId: string };
  
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: payload.userId },
  });

  res.json(user);
});