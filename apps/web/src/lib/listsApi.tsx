import { api } from "./api";
import type { WishList, CreateListPayload } from "@wishlist/shared";

export async function getLists(): Promise<WishList[]> {
  const res = await api.get("/lists");
  return res.data;
}

export async function createList(payload: CreateListPayload): Promise<WishList> {
  const res = await api.post("/lists", payload);
  return res.data;
}

// export async function getList(id: string): Promise<WishList & { items: any[] }> {
//   const res = await api.get(`/lists/${id}`);
//   return res.data;
// }

// Usamos un objeto genérico temporal de TypeScript ({ [key: string]: unknown })
export async function getList(id: string): Promise<WishList & { items: Record<string, unknown>[] }> {
  const res = await api.get(`/lists/${id}`);
  return res.data;
}

export async function deleteList(id: string): Promise<void> {
  await api.delete(`/lists/${id}`);
}