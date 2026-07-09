import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLists, createList, deleteList } from "../lib/listsApi";
import type { CreateListPayload } from "@wishlist/shared";

// Clave del cache — centralizada para no escribirla mal en dos lugares
export const LISTS_QUERY_KEY = ["lists"];

export function useLists() {
  return useQuery({
    queryKey: LISTS_QUERY_KEY,
    queryFn: getLists,
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateListPayload) => createList(payload),
    onSuccess: () => {
      // Invalida el cache de listas para que se refetchee automáticamente
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
    },
  });
}