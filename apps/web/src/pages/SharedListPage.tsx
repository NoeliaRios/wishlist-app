import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Gift, Check, ExternalLink, HelpCircle, X } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useSharedList, useItemActions } from "../hooks/useItems";

const PRIORITY_CONFIG = {
  1: { label: "🔥 ALTA PRIORIDAD", color: "bg-brand-coral" },
  2: { label: "⚡ MEDIA", color: "bg-brand-yellow" },
  3: { label: "❄️ BAJA", color: "bg-brand-cyan" },
} as const;

export default function SharedListPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: list, isLoading } = useSharedList(token!);
  const { reserve, unreserve, purchase } = useItemActions(list?.id ?? "");
  const [claimingItemId, setClaimingItemId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <p className="font-mono font-bold uppercase text-gray-400">Cargando lista...</p>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <div className="text-center">
          <p className="font-extrabold text-2xl uppercase mb-2">Lista no encontrada</p>
          <p className="font-semibold text-gray-500">El link puede haber expirado o ser incorrecto.</p>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === list.owner?.id;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-10">

      {/* Banner informativo */}
      <div className="bg-brand-cyan neo-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-black shrink-0" />
          <div>
            <p className="text-sm font-bold uppercase tracking-wide">
              VISTA PÚBLICA — LINK COMPARTIDO
            </p>
            <p className="text-xs font-semibold text-gray-800">
              Esta es la vista que ven tus amigos cuando reciben tu link. ¡Reservá un regalo!
            </p>
          </div>
        </div>
        {!user && (
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-black text-white hover:bg-brand-lilac hover:text-black font-bold uppercase text-xs neo-border shrink-0"
          >
            Iniciar sesión →
          </button>
        )}
      </div>

      {/* Header de la lista */}
      <section className="bg-brand-lilac neo-border-lg p-6 md:p-8 neo-shadow-lg relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-black text-white px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-widest rotate-6 neo-border select-none">
          🎁 LISTA DE DESEOS
        </div>

        <div className="flex items-start gap-5 max-w-4xl">
          <div className="w-16 h-16 bg-white neo-border flex items-center justify-center text-4xl neo-shadow-sm shrink-0">
            🎁
          </div>
          <div>
            <span className="text-xs font-mono font-bold bg-white/70 px-2.5 py-1 neo-border inline-block mb-3">
              Lista de 👤 <strong>{list.owner?.name}</strong>
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-black leading-none mb-3">
              {list.title}
            </h1>
            {list.occasion && (
              <p className="font-semibold text-gray-800 text-sm">{list.occasion}</p>
            )}
          </div>
        </div>
      </section>

      {/* Modal de reserva */}
      {claimingItemId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white neo-border-lg p-6 max-w-md w-full neo-shadow-lg relative">
            <button
              onClick={() => setClaimingItemId(null)}
              className="absolute top-4 right-4 p-1 bg-gray-100 hover:bg-brand-coral neo-border"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Gift className="w-8 h-8 text-purple-600 shrink-0" />
              <div>
                <h3 className="font-bold text-xl uppercase">Reservar este regalo</h3>
                <p className="text-xs font-semibold text-gray-500">
                  El dueño de la lista no verá quién reservó.
                </p>
              </div>
            </div>

            <div className="p-3 bg-brand-lilac/20 neo-border text-sm font-semibold mb-4">
              Al reservar, el artículo se marcará como <strong>"Reservado"</strong> para evitar regalos repetidos.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setClaimingItemId(null)}
                className="px-4 py-2 text-xs font-bold uppercase neo-border bg-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  reserve.mutate(claimingItemId);
                  setClaimingItemId(null);
                }}
                className="px-5 py-2 text-xs font-extrabold uppercase bg-brand-green text-black neo-border neo-shadow-sm"
              >
                Confirmar Reserva 🎁
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-extrabold uppercase tracking-tight">
          Regalos Disponibles ({list.items?.length ?? 0})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.items?.map((item) => {
            const priority = item.priority as 1 | 2 | 3;
            const priorityConfig = PRIORITY_CONFIG[priority];
            const isReservedByMe = item.reservedBy === user?.id;

            return (
              <div
                key={item.id}
                className={`bg-white neo-border-lg p-5 flex flex-col justify-between relative ${
                  item.status !== "AVAILABLE" ? "opacity-90" : "neo-shadow hover:shadow-lg transition-all"
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <span className={`px-2.5 py-1 ${priorityConfig.color} text-black neo-border text-xs font-bold uppercase tracking-wider`}>
                    {priorityConfig.label}
                  </span>
                  {priority === 1 && item.status === "AVAILABLE" && (
                    <span className="text-xs font-mono font-bold uppercase text-purple-600 bg-brand-lilac/30 px-2 py-0.5 neo-border animate-bounce">
                      ¡Favorito!
                    </span>
                  )}
                </div>

                {/* Imagen placeholder */}
                <div className="w-full h-40 bg-brand-lilac/20 neo-border mb-4 flex items-center justify-center">
                  <Gift className="w-10 h-10 text-black/20" />
                </div>

                <div className="flex-1">
                  <h4 className="font-extrabold text-lg text-black uppercase tracking-tight line-clamp-2 mb-2">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs font-semibold text-gray-700 bg-gray-50 p-2.5 neo-border mb-3 leading-relaxed">
                      💡 {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-black/10 mt-4 flex flex-col gap-2">
                  {item.status === "PURCHASED" && (
                    <div className="bg-brand-green text-black px-3 py-2 neo-border text-xs font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                      Comprado
                    </div>
                  )}

                  {item.status === "RESERVED" && !isReservedByMe && (
                    <div className="bg-brand-yellow/50 px-3 py-2 neo-border text-xs font-bold text-gray-700">
                      Reservado por {!isOwner ? (item.reservedByUser?.name ?? "alguien") : "alguien 🤫"}
                    </div>
                  )}

                  {item.status === "RESERVED" && isReservedByMe && (
                    <div className="flex flex-col gap-2">
                      <div className="bg-brand-green text-black px-3 py-2 neo-border text-xs font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4 stroke-[3]" />
                        Reservado por vos
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => unreserve.mutate(item.id)}
                          disabled={unreserve.isPending}
                          className="flex-1 py-1.5 text-[10px] font-mono text-gray-500 hover:text-black neo-border bg-white flex items-center justify-center gap-1"
                        >
                          Cancelar reserva
                        </button>
                        <button
                          onClick={() => purchase.mutate(item.id)}
                          disabled={purchase.isPending}
                          className="flex-1 py-1.5 text-[10px] font-extrabold uppercase bg-brand-green text-black neo-border flex items-center justify-center gap-1"
                        >
                          Ya lo compré ✓
                        </button>
                      </div>
                    </div>
                  )}

                  {item.status === "AVAILABLE" && (
                    user ? (
                      <button
                        onClick={() => setClaimingItemId(item.id)}
                        disabled={reserve.isPending}
                        className="w-full py-2.5 bg-black text-white hover:bg-brand-lilac hover:text-black font-extrabold uppercase text-xs tracking-wider neo-border neo-interactive flex items-center justify-center gap-2"
                      >
                        <Gift className="w-4 h-4 stroke-[2]" />
                        Reservar este regalo
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/")}
                        className="w-full py-2.5 bg-black text-white hover:bg-brand-lilac hover:text-black font-extrabold uppercase text-xs tracking-wider neo-border neo-interactive flex items-center justify-center gap-2"
                      >
                        Iniciá sesión para reservar →
                      </button>
                    )
                  )}

                  {item.url && (
                    
                      <a href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 bg-white text-gray-800 hover:text-black font-bold text-xs neo-border neo-interactive flex items-center justify-center gap-1.5"
                    >
                      Ver tienda del producto
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}