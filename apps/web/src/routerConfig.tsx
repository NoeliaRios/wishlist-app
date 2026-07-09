import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/RootLayout";
import { RequireAuth } from "./components/RequireAuth";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SharedListPage from "./pages/SharedListPage";
import ListDetailPage from "./pages/ListDetailPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LoginPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/lists/:id", element: <ListDetailPage /> },
        ],
      },
      { path: "/share/:token", element: <SharedListPage /> },
    ],
  },
]);