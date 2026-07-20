import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthProvider";
import Header from "./Header";

export function RootLayout() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col">
        <Header />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  );
}