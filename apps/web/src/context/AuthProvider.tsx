import { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "../lib/api";
import type { User } from "@wishlist/shared";
import { AuthContext, authUserQueryKey } from "./authContext";

function hasToken() {
  return Boolean(localStorage.getItem("token"));
}

async function fetchCurrentUser() {
  const res = await api.get<User>("/auth/me");
  return res.data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tokenPresent = hasToken();

  const userQuery = useQuery({
    queryKey: authUserQueryKey,
    queryFn: fetchCurrentUser,
    enabled: tokenPresent,
    retry: false,
    initialData: tokenPresent ? undefined : null,
  });

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          queryClient.setQueryData(authUserQueryKey, null);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [queryClient]);

  async function login(idToken: string) {
    const res = await api.post<{ token: string; user: User }>(
      "/auth/google",
      { idToken }
    );
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    queryClient.setQueryData(authUserQueryKey, user);
    navigate("/dashboard", { replace: true });
  }

  function logout() {
    localStorage.removeItem("token");
    queryClient.removeQueries({ queryKey: authUserQueryKey });
    navigate("/", { replace: true });
  }

  return (
    <AuthContext.Provider
      value={{
        user: userQuery.data ?? null,
        login,
        logout,
        isLoading: tokenPresent ? userQuery.isPending : false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
