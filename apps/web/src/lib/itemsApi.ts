import { api } from "./api";
import type { WishItem, WishList, User, CreateItemPayload } from "@wishlist/shared";

export async function getList(id: string): Promise<ListWithItems> {
  const res = await api.get(`/lists/${id}`);
  return res.data;
}

export async function createItem(
  listId: string,
  payload: CreateItemPayload
): Promise<WishItem> {
  const res = await api.post(`/lists/${listId}/items`, payload);
  return res.data;
}

export async function deleteItem(id: string): Promise<void> {
  await api.delete(`/items/${id}`);
}

export async function reserveItem(id: string): Promise<WishItem> {
  const res = await api.patch(`/items/${id}/reserve`);
  return res.data;
}

export async function unreserveItem(id: string): Promise<WishItem> {
  const res = await api.patch(`/items/${id}/unreserve`);
  return res.data;
}

export async function purchaseItem(id: string): Promise<WishItem> {
  const res = await api.patch(`/items/${id}/purchase`);
  return res.data;
}

export async function getSharedList(token: string): Promise<ListWithItems> {
  const res = await api.get(`/lists/share/${token}`);
  return res.data;
}

export type ListWithItems = WishList & {
  items: (WishItem & {
    reservedByUser: Pick<User, "id" | "name" | "avatarUrl"> | null;
    purchasedByUser: Pick<User, "id" | "name" | "avatarUrl"> | null;
  })[];
  owner?: Pick<User, "id" | "name" | "avatarUrl">;
};