import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getList,
  createItem,
  deleteItem,
  reserveItem,
  unreserveItem,
  purchaseItem,
  getSharedList,
} from "../lib/itemsApi";
import type { CreateItemPayload } from "@wishlist/shared";

export function useListDetail(id: string) {
  return useQuery({
    queryKey: ["lists", id],
    queryFn: () => getList(id),
  });
}

export function useSharedList(token: string) {
  return useQuery({
    queryKey: ["shared", token],
    queryFn: () => getSharedList(token),
  });
}

export function useCreateItem(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateItemPayload) => createItem(listId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", listId] });
    },
  });
}

export function useDeleteItem(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", listId] });
    },
  });
}

export function useItemActions(listId: string) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["lists", listId] });

  const reserve = useMutation({ mutationFn: reserveItem, onSuccess: invalidate });
  const unreserve = useMutation({ mutationFn: unreserveItem, onSuccess: invalidate });
  const purchase = useMutation({ mutationFn: purchaseItem, onSuccess: invalidate });

  return { reserve, unreserve, purchase };
}