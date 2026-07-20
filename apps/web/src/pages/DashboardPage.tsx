import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Globe, Lock, Trash2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useLists, useDeleteList } from "../hooks/useLists";
import { CreateListModal } from "../components/CreateListModal";

const COLOR_OPTIONS = [
  { class: "bg-brand-lilac", label: "Lila" },
  { class: "bg-brand-yellow", label: "Amarillo" },
  { class: "bg-brand-coral", label: "Coral" },
  { class: "bg-brand-cyan", label: "Cian" },
  { class: "bg-brand-green", label: "Verde" },
  { class: "bg-brand-orange", label: "Naranja" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: lists, isLoading } = useLists();
  const deleteList = useDeleteList();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const totalItems = lists?.reduce((sum, list) => sum + (list._count?.items ?? 0), 0) ?? 0;
  const publicLists = lists?.filter((l) => l.isActive).length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-10">

      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b-4 border-black pb-8">
        <div>
          <span className="font-mono text-sm font-bold uppercase tracking-wider text-purple-600">
            PANEL DE CONTROL — WISHLIST.IO
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-1 text-black">
            ¡Hola de nuevo, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="font-semibold text-gray-700 mt-2">
            Gestiona tus listas de regalos y consulta cuáles deseos han sido reservados por tus amigos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          
          <button
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto px-6 py-3.5 bg-black text-white hover:bg-brand-lilac hover:text-black font-extrabold uppercase tracking-wider text-sm neo-border neo-shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Nueva Lista</span>
          </button>
        </div>
      </section>

      {/* Métricas */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-brand-lilac neo-border p-5 neo-shadow flex flex-col gap-1">
          <span className="font-mono text-xs font-bold text-gray-600 uppercase">Listas Creadas</span>
          <span className="text-3xl font-extrabold text-black">{lists?.length ?? 0}</span>
          <span className="text-xs font-bold text-gray-700 mt-2">
            ({publicLists} activas)
          </span>
        </div>
        <div className="bg-brand-yellow neo-border p-5 neo-shadow flex flex-col gap-1">
          <span className="font-mono text-xs font-bold text-gray-600 uppercase">Total Deseos</span>
          <span className="text-3xl font-extrabold text-black">{totalItems}</span>
          <span className="text-xs font-bold text-gray-700 mt-2">en todas tus listas</span>
        </div>
        <div className="bg-brand-green neo-border p-5 neo-shadow flex flex-col gap-1">
          <span className="font-mono text-xs font-bold text-gray-600 uppercase">Tu Link Base</span>
          <span className="text-xs font-mono font-bold text-black truncate mt-1 bg-white p-1.5 neo-border">
            wishlist.io/{user?.name?.split(" ")[0].toLowerCase()}
          </span>
          <span className="text-[11px] font-bold text-gray-700 mt-2">compartible con amigos</span>
        </div>
      </section>

      {/* Listas */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight">
            Mis Listas ({lists?.length ?? 0})
          </h2>
          <span className="font-mono text-xs bg-gray-200 px-2 py-1 neo-border font-bold">
            ORDEN: RECIENTE
          </span>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-100 neo-border animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && lists?.length === 0 && (
          <div
            onClick={() => setShowModal(true)}
            className="border-4 border-dashed border-black/40 hover:border-black p-16 flex flex-col items-center justify-center text-center gap-3 cursor-pointer bg-gray-50 hover:bg-white transition-all"
          >
            <Plus className="w-10 h-10 stroke-[2] text-black/40" />
            <span className="font-extrabold text-xl text-black/70">Crear primera lista</span>
            <span className="font-mono text-xs text-gray-400">Personalizá colores y emojis</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lists?.map((list, index) => {
            const color = COLOR_OPTIONS[index % COLOR_OPTIONS.length].class;
            return (
              <div
                key={list.id}
                className={`${color} neo-border-lg p-6 flex flex-col justify-between neo-shadow-lg min-h-64 transition-transform hover:-translate-y-1 relative`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-white neo-border flex items-center justify-center text-2xl neo-shadow-sm">
                    🎁
                  </div>
                  <span className="px-2 py-1 bg-white text-black neo-border text-xs font-mono font-bold flex items-center gap-1">
                    {list.isActive ? (
                      <><Globe className="w-3 h-3 text-emerald-600" /> Activa</>
                    ) : (
                      <><Lock className="w-3 h-3 text-gray-500" /> Inactiva</>
                    )}
                  </span>
                </div>

                <div className="flex-1 mb-6">
                  <h3 className="text-2xl font-extrabold text-black uppercase tracking-tight line-clamp-1 mb-2">
                    {list.title}
                  </h3>
                  {list.occasion && (
                    <p className="text-sm font-semibold text-gray-800">
                      {list.occasion}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t-2 border-black/20 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gray-700 uppercase">
                    Lista de deseos
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/lists/${list.id}`)}
                      className="px-3.5 py-1.5 bg-white text-black font-extrabold uppercase text-xs neo-border neo-interactive flex items-center gap-1"
                    >
                      <span>Ver</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar "${list.title}"?`)) {
                          deleteList.mutate(list.id);
                        }
                      }}
                      className="p-1.5 bg-brand-coral hover:bg-rose-400 text-black neo-border transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Card para crear nueva lista */}
          {!isLoading && (lists?.length ?? 0) > 0 && (
            <div
              onClick={() => setShowModal(true)}
              className="border-4 border-dashed border-black/40 hover:border-black p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer min-h-64 bg-gray-50 hover:bg-white transition-all group"
            >
              <div className="w-12 h-12 border-2 border-dashed border-black/30 group-hover:border-black flex items-center justify-center text-black/50 group-hover:text-black">
                <Plus className="w-6 h-6 stroke-[3]" />
              </div>
              <span className="font-extrabold text-lg text-black/70 group-hover:text-black">
                Crear otra lista
              </span>
              <span className="font-mono text-xs text-gray-400">Personalizá colores y emojis</span>
            </div>
          )}
        </div>
      </section>

      {showModal && <CreateListModal onClose={() => setShowModal(false)} />}
    </div>
  );
}