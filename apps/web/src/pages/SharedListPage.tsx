import { useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useSharedList, useItemActions } from "../hooks/useListDetail";
import { WishItemCard } from "../components/WishItemCard";

export default function SharedListPage() {
  const { token } = useParams<{ token: string }>();
  const { user } = useAuth();
  const { data: list, isLoading } = useSharedList(token!);

  // listId lo necesitamos para invalidar el cache después de una acción
  const { reserve, unreserve, purchase } = useItemActions(list?.id ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Lista no encontrada.</p>
      </div>
    );
  }

  const isOwner = user?.id === list.owner?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-gray-400">Lista de deseos de</p>
          <div className="flex items-center gap-2 mt-1">
            {list.owner?.avatarUrl && (
              <img
                src={list.owner.avatarUrl}
                alt={list.owner.name}
                className="w-7 h-7 rounded-full"
              />
            )}
            <span className="font-medium text-gray-800">{list.owner?.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800">{list.title}</h1>
          {list.occasion && (
            <p className="text-sm text-gray-400 mt-1">{list.occasion}</p>
          )}
        </div>

        {!user && (
          <div className="bg-blue-50 text-blue-700 text-sm px-4 py-3 rounded-lg mb-6">
            Iniciá sesión para poder reservar o marcar items como comprados.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {list.items?.map((item) => (
            <WishItemCard
              key={item.id}
              item={item}
              isOwner={isOwner}
              currentUserId={user?.id}
              onReserve={user ? (id) => reserve.mutate(id) : undefined}
              onUnreserve={user ? (id) => unreserve.mutate(id) : undefined}
              onPurchase={user ? (id) => purchase.mutate(id) : undefined}
            />
          ))}
        </div>
      </main>
    </div>
  );
}