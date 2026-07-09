import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useListDetail, useDeleteItem, useItemActions } from "../hooks/useListDetail";
import { WishItemCard } from "../components/WishItemCard";
import { CreateItemModal } from "../components/CreateItemModal";

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: list, isLoading } = useListDetail(id!);
  const deleteItem = useDeleteItem(id!);
  const { reserve, unreserve, purchase } = useItemActions(id!);
  const [showModal, setShowModal] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (!list) return null;

  const shareUrl = `${window.location.origin}/share/${list.shareToken}`;

function copyShareLink() {
  navigator.clipboard.writeText(shareUrl).then(() => {
    alert("Link copiado");
  }).catch(() => {
    // Fallback para contextos no seguros
    const input = document.createElement("input");
    input.value = shareUrl;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    alert("Link copiado");
  });
}

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            ← Mis listas
          </button>
          <button
            onClick={copyShareLink}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Copiar link para compartir
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800">{list.title}</h1>
          {list.occasion && (
            <p className="text-sm text-gray-400 mt-1">{list.occasion}</p>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            {list.items?.length ?? 0} items
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Agregar item
          </button>
        </div>

        {list.items?.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">✨</p>
            <p className="text-sm">Todavía no hay items en esta lista.</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {list.items?.map((item) => (
            <WishItemCard
              key={item.id}
              item={item}
              isOwner={true}
              currentUserId={user?.id}
              onDelete={(itemId) => deleteItem.mutate(itemId)}
              onReserve={(itemId) => reserve.mutate(itemId)}
              onUnreserve={(itemId) => unreserve.mutate(itemId)}
              onPurchase={(itemId) => purchase.mutate(itemId)}
            />
          ))}
        </div>
      </main>

      {showModal && (
        <CreateItemModal
          listId={id!}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}