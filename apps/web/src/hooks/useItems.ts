import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
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
import type { ListWithItems } from "../lib/itemsApi";

export function useListDetail(id: string) {
  return useQuery<ListWithItems>({
    queryKey: ["lists", id],
    queryFn: () => getList(id),
  });
}

export function useSharedList(token: string) {
  return useQuery<ListWithItems>({
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
      toast.success("Item agregado");
    },
  });
}

export function useDeleteItem(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", listId] });
      toast.success("Item eliminado");
    },
  });
}

export function useItemActions(listId: string) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["lists", listId] });

  const reserve = useMutation({
    mutationFn: reserveItem,
    onSuccess: () => { invalidate(); toast.success("Item reservado"); },
  });

  const unreserve = useMutation({
    mutationFn: unreserveItem,
    onSuccess: () => { invalidate(); toast.success("Reserva cancelada"); },
  });

  const purchase = useMutation({
    mutationFn: purchaseItem,
    onSuccess: () => { invalidate(); toast.success("¡Marcado como comprado!"); },
  });

  return { reserve, unreserve, purchase };
}