import axios from "axios";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const ERROR_MESSAGES: Record<number, string> = {
  400: "Datos inválidos",
  401: "Tu sesión expiró, iniciá sesión de nuevo",
  403: "No tenés permiso para hacer eso",
  404: "No encontramos lo que buscabas",
  409: "Esta acción no está disponible — el item puede haber cambiado",
  500: "Algo salió mal en el servidor, intentá de nuevo",
};

export const api_instance = api;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.error ??
      ERROR_MESSAGES[status] ??
      "Ocurrió un error inesperado";

    // No mostramos toast en 401 — el AuthContext lo maneja redirigiendo
    if (status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);