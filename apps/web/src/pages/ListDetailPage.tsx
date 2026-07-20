import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Check, Plus, Trash2, ExternalLink, AlertCircle, Gift } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useListDetail, useDeleteItem } from "../hooks/useItems"; // <-- Quitamos useItemActions si no se usa acá
import { CreateItemModal } from "../components/CreateItemModal";

const PRIORITY_CONFIG = {
  1: { label: "🔥 ALTA", color: "bg-brand-coral" },
  2: { label: "⚡ MEDIA", color: "bg-brand-yellow" },
  3: { label: "❄️ BAJA", color: "bg-brand-cyan" },
} as const;

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useAuth();
  const { data: list, isLoading } = useListDetail(id!);
  const deleteItem = useDeleteItem(id!);
  
  // 💡 Comentado para evitar el error de ESLint de variables no usadas. 
  // Si las necesitas más adelante, simplemente descomentalas y usalas en un botón.
  // const { reserve, unreserve, purchase } = useItemActions(id!);
  
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <p className="font-mono font-bold uppercase text-gray-400">Cargando lista...</p>
      </div>
    );
  }

  if (!list) return null;

  const shareUrl = `${window.location.origin}/share/${list.shareToken}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl).catch(() => {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-10">

      {/* Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-bold uppercase text-xs neo-border neo-interactive max-w-max"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </button>

        <button
          onClick={handleCopyLink}
          className="px-4 py-2 bg-brand-cyan text-black font-bold uppercase text-xs neo-border neo-interactive flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          {copied ? "¡Copiado!" : "Copiar Link Público"}
        </button>
      </div>

      {/* Header de la lista */}
      <section className="bg-brand-lilac neo-border-lg p-6 md:p-8 neo-shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 bg-white neo-border flex items-center justify-center text-4xl neo-shadow-sm shrink-0">
            🎁
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-black leading-none mb-2">
              {list.title}
            </h1>
            {list.occasion && (
              <p className="font-semibold text-gray-800 text-sm">{list.occasion}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-mono font-bold text-gray-700">
              <span className="bg-white/70 px-2.5 py-1 neo-border">
                {list.items?.length ?? 0} deseos cargados
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto px-5 py-3.5 bg-black text-white hover:bg-brand-green hover:text-black font-extrabold uppercase text-xs tracking-wider neo-border neo-shadow-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Agregar un Deseo
        </button>
      </section>

      {/* Banner de link */}
      {list.isActive && (
        <div className="bg-brand-yellow neo-border p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="text-sm font-bold">
              ¡Esta lista es <strong>Pública</strong>! Cualquiera con el link puede verla y reservar regalos.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="px-3 py-1.5 text-xs font-mono neo-border bg-white flex-1 md:w-80 truncate outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-black text-white hover:bg-brand-cyan hover:text-black font-bold uppercase text-xs neo-border shrink-0"
            >
              {copied ? "¡Copiado!" : "Copiar"}
            </button>
          </div>
        </div>
      )}

      {/* Items */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-extrabold uppercase tracking-tight">
          Artículos ({list.items?.length ?? 0})
        </h2>

        {list.items?.length === 0 && (
          <div className="border-4 border-dashed border-black p-12 text-center bg-white flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-gray-400" />
            <p className="font-extrabold text-lg">Aún no hay deseos en esta lista</p>
            <p className="text-sm font-semibold text-gray-500">
              Hacé clic en "Agregar un Deseo" para empezar.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.items?.map((item) => {
            const priority = item.priority as 1 | 2 | 3;
            const priorityConfig = PRIORITY_CONFIG[priority];

            return (
              <div
                key={item.id}
                className="bg-white neo-border-lg p-5 flex flex-col justify-between neo-shadow relative"
              >
                {/* Prioridad y eliminar */}
                <div className="flex justify-between items-start gap-4 mb-3">
                  <span className={`px-2.5 py-1 ${priorityConfig.color} text-black neo-border text-xs font-bold uppercase tracking-wider`}>
                    {priorityConfig.label}
                  </span>
                  {item.status === "AVAILABLE" && (
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar "${item.title}"?`)) {
                          deleteItem.mutate(item.id);
                        }
                      }}
                      className="p-1.5 bg-gray-100 hover:bg-brand-coral text-black neo-border transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Placeholder imagen */}
                <div className="w-full h-40 bg-brand-lilac/30 neo-border mb-4 flex items-center justify-center">
                  <Gift className="w-12 h-12 text-black/20 stroke-[1.5]" />
                </div>

                {/* Título */}
                <div className="flex-1">
                  <h4 className="font-extrabold text-lg text-black uppercase tracking-tight line-clamp-2 mb-2">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs font-semibold text-gray-600 bg-gray-50 p-2.5 neo-border mb-3 leading-relaxed">
                      💡 {item.description}
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-black/10 mt-4 flex flex-col gap-3">
                  {/* Estado */}
                  {item.status === "PURCHASED" && (
                    <div className="bg-brand-green text-black px-3 py-2 neo-border text-xs font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                      Comprado
                    </div>
                  )}
                  {item.status === "RESERVED" && (
                    <div className="bg-brand-yellow/50 p-2.5 neo-border text-xs font-bold text-gray-700">
                      Reservado — la sorpresa está a salvo 🤫
                    </div>
                  )}
                  {item.status === "AVAILABLE" && (
                    <div className="bg-gray-100 p-2.5 neo-border text-xs font-bold text-gray-600">
                      🟢 Disponible
                    </div>
                  )}

                  {/* Link externo (🟢 Corregido el tag <a href...>) */}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-3 py-1.5 bg-white text-black font-bold text-xs neo-border neo-interactive flex items-center justify-center gap-1.5"
                    >
                      Ver tienda del artículo
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {showModal && (
        <CreateItemModal listId={id!} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}