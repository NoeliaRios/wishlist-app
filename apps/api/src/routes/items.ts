import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import type { CreateItemPayload } from "@wishlist/shared";

export const itemsRouter = Router();

// POST /lists/:listId/items
itemsRouter.post("/lists/:listId/items", requireAuth, async (req: AuthRequest, res) => {
  const list = await prisma.wishList.findUnique({ where: { id: req.params.listId } });
  if (!list) throw new AppError(404, "List not found");
  if (list.ownerId !== req.userId) throw new AppError(403, "Forbidden");

  const { title, description, url, imageUrl, priority } = req.body as CreateItemPayload;
  if (!title) throw new AppError(400, "title is required");

  const item = await prisma.wishItem.create({
    data: { listId: list.id, title, description, url, imageUrl, priority: priority ?? 2 },
  });
  res.status(201).json(item);
});

// PATCH /items/:id — editar item (solo dueño de la lista)
itemsRouter.patch("/items/:id", requireAuth, async (req: AuthRequest, res) => {
  const item = await prisma.wishItem.findUnique({
    where: { id: req.params.id },
    include: { list: true },
  });
  if (!item) throw new AppError(404, "Item not found");
  if (item.list.ownerId !== req.userId) throw new AppError(403, "Forbidden");

  const { title, description, url, imageUrl, priority } = req.body;
  const updated = await prisma.wishItem.update({
    where: { id: req.params.id },
    data: { title, description, url, imageUrl, priority },
  });
  res.json(updated);
});

// DELETE /items/:id
itemsRouter.delete("/items/:id", requireAuth, async (req: AuthRequest, res) => {
  const item = await prisma.wishItem.findUnique({
    where: { id: req.params.id },
    include: { list: true },
  });
  if (!item) throw new AppError(404, "Item not found");
  if (item.list.ownerId !== req.userId) throw new AppError(403, "Forbidden");

  await prisma.wishItem.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// PATCH /items/:id/reserve — cualquier usuario autenticado puede reservar
itemsRouter.patch("/items/:id/reserve", requireAuth, async (req: AuthRequest, res) => {
  const item = await prisma.wishItem.findUnique({ where: { id: req.params.id } });
  if (!item) throw new AppError(404, "Item not found");
  if (item.status !== "AVAILABLE") throw new AppError(409, "Item is not available");

  const updated = await prisma.wishItem.update({
    where: { id: req.params.id },
    data: { status: "RESERVED", reservedBy: req.userId },
  });
  res.json(updated);
});

// PATCH /items/:id/purchase — marcar como comprado
itemsRouter.patch("/items/:id/purchase", requireAuth, async (req: AuthRequest, res) => {
  const item = await prisma.wishItem.findUnique({ where: { id: req.params.id } });
  if (!item) throw new AppError(404, "Item not found");
  if (item.status === "PURCHASED") throw new AppError(409, "Item already purchased");

  const updated = await prisma.wishItem.update({
    where: { id: req.params.id },
    data: { status: "PURCHASED", purchasedBy: req.userId },
  });
  res.json(updated);
});

// PATCH /items/:id/unreserve — cancelar reserva (solo quien reservó)
itemsRouter.patch("/items/:id/unreserve", requireAuth, async (req: AuthRequest, res) => {
  const item = await prisma.wishItem.findUnique({ where: { id: req.params.id } });
  if (!item) throw new AppError(404, "Item not found");
  if (item.status !== "RESERVED") throw new AppError(409, "Item is not reserved");
  if (item.reservedBy !== req.userId) throw new AppError(403, "You didn't reserve this item");

  const updated = await prisma.wishItem.update({
    where: { id: req.params.id },
    data: { status: "AVAILABLE", reservedBy: null },
  });
  res.json(updated);
});