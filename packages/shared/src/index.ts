// Tipos del dominio — única fuente de verdad compartida entre frontend y backend

export type ItemStatus = "AVAILABLE" | "RESERVED" | "PURCHASED";
export type ItemPriority = 1 | 2 | 3; // 1=alta, 2=media, 3=baja

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface WishList {
  id: string;
  ownerId: string;
  title: string;
  description: string | null;
  occasion: string | null;
  isActive: boolean;
  shareToken: string;
  createdAt: string;
  _count?: {
    items: number;
  };
}

export interface WishItem {
  id: string;
  listId: string;
  title: string;
  description: string | null;
  url: string | null;
  imageUrl: string | null;
  priority: ItemPriority;
  status: ItemStatus;
  reservedBy: string | null;
  purchasedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListPayload {
  title: string;
  description?: string;
  occasion?: string;
}

export interface CreateItemPayload {
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  priority?: ItemPriority;
}

export interface UpdateListPayload {
  title?: string;
  description?: string;
  occasion?: string;
  isActive?: boolean;
}