import { useAuth } from "../context/authContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {user?.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-9 h-9 rounded-full"
              />
            )}
            <span className="font-medium text-gray-800">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Mis listas
        </h1>
        <p className="text-gray-500">Acá van a aparecer tus listas de deseos.</p>
      </div>
    </div>
  );
}