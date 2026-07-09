import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useLists, useDeleteList } from "../hooks/useLists";
import { CreateListModal } from "../components/CreateListModal";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { data: lists, isLoading } = useLists();
  const deleteList = useDeleteList();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="font-semibold text-gray-800">🎁 Wishlist</span>
          <div className="flex items-center gap-3">
            {user?.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Mis listas</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nueva lista
          </button>
        </div>

        {isLoading && (
          <p className="text-gray-400 text-sm">Cargando...</p>
        )}

        {!isLoading && lists?.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🎁</p>
            <p className="text-sm">Todavía no tenés listas.</p>
            <p className="text-sm">¡Creá tu primera lista de deseos!</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {lists?.map((list) => (
            <div
              key={list.id}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:border-gray-200 transition-colors"
            >
              <button
                onClick={() => navigate(`/lists/${list.id}`)}
                className="flex flex-col items-start gap-1 flex-1"
              >
                <span className="font-medium text-gray-800">{list.title}</span>
                {list.occasion && (
                  <span className="text-xs text-gray-400">{list.occasion}</span>
                )}
              </button>

              <button
                onClick={() => deleteList.mutate(list.id)}
                className="text-gray-300 hover:text-red-400 transition-colors ml-4 text-sm"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </main>

      {showModal && <CreateListModal onClose={() => setShowModal(false)} />}
    </div>
  );
}