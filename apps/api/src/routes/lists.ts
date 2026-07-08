import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import type { CreateListPayload, UpdateListPayload } from "@wishlist/shared";

export const listsRouter = Router();

// GET /lists — listas del usuario autenticado
listsRouter.get("/", requireAuth, async (req: AuthRequest, res) => {
  const lists = await prisma.wishList.findMany({
    where: { ownerId: req.userId },
    orderBy: { createdAt: "desc" },
  });
  res.json(lists);
});

// POST /lists
listsRouter.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { title, description, occasion } = req.body as CreateListPayload;
  if (!title) throw new AppError(400, "title is required");

  const list = await prisma.wishList.create({
    data: { ownerId: req.userId!, title, description, occasion },
  });
  res.status(201).json(list);
});

// GET /lists/share/:token — vista pública, sin auth
listsRouter.get("/share/:token", async (req, res) => {
  const list = await prisma.wishList.findUnique({
    where: { shareToken: req.params.token },
    include: {
      owner: { select: { id: true, name: true, avatarUrl: true } },
      items: {
        orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
        include: {
          reservedByUser: { select: { id: true, name: true, avatarUrl: true } },
          purchasedByUser: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
    },
  });

  if (!list || !list.isActive) throw new AppError(404, "List not found");

  res.json(list);
});

// GET /lists/:id — detalle, solo el dueño
listsRouter.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const list = await prisma.wishList.findUnique({
    where: { id: req.params.id },
    include: {
      items: {
        orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
        include: {
          reservedByUser: { select: { id: true, name: true, avatarUrl: true } },
          purchasedByUser: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
    },
  });

  if (!list) throw new AppError(404, "List not found");
  if (list.ownerId !== req.userId) throw new AppError(403, "Forbidden");

  res.json(list);
});

// PATCH /lists/:id
listsRouter.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  const list = await prisma.wishList.findUnique({ where: { id: req.params.id } });
  if (!list) throw new AppError(404, "List not found");
  if (list.ownerId !== req.userId) throw new AppError(403, "Forbidden");

  const { title, description, occasion, isActive } = req.body as UpdateListPayload;
  const updated = await prisma.wishList.update({
    where: { id: req.params.id },
    data: { title, description, occasion, isActive },
  });
  res.json(updated);
});

// DELETE /lists/:id
listsRouter.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const list = await prisma.wishList.findUnique({ where: { id: req.params.id } });
  if (!list) throw new AppError(404, "List not found");
  if (list.ownerId !== req.userId) throw new AppError(403, "Forbidden");

  await prisma.wishList.delete({ where: { id: req.params.id } });
  res.status(204).send();
});