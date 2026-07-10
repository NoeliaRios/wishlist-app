import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getLists, createList, deleteList } from "../lib/listsApi";
import type { CreateListPayload } from "@wishlist/shared";

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
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
      toast.success("Lista creada");
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
      toast.success("Lista eliminada");
    },
  });
}