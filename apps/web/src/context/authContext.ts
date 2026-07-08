import { createContext, useContext } from "react";
import type { User } from "@wishlist/shared";

export interface AuthContextType {
  user: User | null;
  login: (idToken: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
export const authUserQueryKey = ["auth", "me"] as const;

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
