import { RouterProvider } from "react-router-dom";
import { router } from "./routerConfig.tsx";

export function AppRouter() {
  return <RouterProvider router={router} />;
}