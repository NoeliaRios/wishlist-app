import type { WishItem } from "@wishlist/shared";

interface Props {
  item: WishItem & {
    reservedByUser?: { name: string } | null;
    purchasedByUser?: { name: string } | null;
  };
  isOwner: boolean;
  onDelete?: (id: string) => void;
  onReserve?: (id: string) => void;
  onUnreserve?: (id: string) => void;
  onPurchase?: (id: string) => void;
  currentUserId?: string;
}

const PRIORITY_LABEL = { 1: "Alta", 2: "Media", 3: "Baja" } as const;
const PRIORITY_COLOR = {
  1: "text-red-500",
  2: "text-yellow-500",
  3: "text-gray-400",
} as const;

export function WishItemCard({
  item,
  isOwner,
  onDelete,
  onReserve,
  onUnreserve,
  onPurchase,
  currentUserId,
}: Props) {
  const priority = item.priority as 1 | 2 | 3;
  const isReservedByMe = item.reservedBy === currentUserId;

  function getStatusBadge() {
    if (item.status === "PURCHASED") {
      return (
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
          Comprado
        </span>
      );
    }
    if (item.status === "RESERVED") {
      // El dueño no ve quién reservó — solo que está reservado
      if (isOwner) {
        return (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
            Reservado
          </span>
        );
      }
      return (
        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
          Reservado por {item.reservedByUser?.name ?? "alguien"}
        </span>
      );
    }
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">{item.title}</span>
            <span className={`text-xs ${PRIORITY_COLOR[priority]}`}>
              {PRIORITY_LABEL[priority]}
            </span>
          </div>

          {item.description && (
            <p className="text-sm text-gray-500">{item.description}</p>
          )}

          {item.url && (
            
             <a href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              Ver producto →
            </a>
          )}

          {getStatusBadge()}
        </div>

        {isOwner && onDelete && item.status === "AVAILABLE" && (
          <button
            onClick={() => onDelete(item.id)}
            className="text-gray-300 hover:text-red-400 transition-colors text-sm shrink-0"
          >
            Eliminar
          </button>
        )}
      </div>

      {/* Acciones para visitantes */}
      {!isOwner && (
        <div className="flex gap-2 mt-1">
          {item.status === "AVAILABLE" && onReserve && (
            <button
              onClick={() => onReserve(item.id)}
              className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Reservar
            </button>
          )}

          {item.status === "RESERVED" && isReservedByMe && onUnreserve && (
            <button
              onClick={() => onUnreserve(item.id)}
              className="text-xs px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancelar reserva
            </button>
          )}

          {item.status === "RESERVED" && isReservedByMe && onPurchase && (
            <button
              onClick={() => onPurchase(item.id)}
              className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              Marcar como comprado
            </button>
          )}
        </div>
      )}
    </div>
  );
}