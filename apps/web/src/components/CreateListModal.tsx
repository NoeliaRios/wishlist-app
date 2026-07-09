import { useState } from "react";
import { useCreateList } from "../hooks/useLists";

interface Props {
  onClose: () => void;
}

export function CreateListModal({ onClose }: Props) {
  const [title, setTitle] = useState("");
  const [occasion, setOccasion] = useState("");
  const createList = useCreateList();

  async function handleSubmit() {
    if (!title.trim()) return;

    await createList.mutateAsync({ title, occasion: occasion || undefined });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Nueva lista</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Nombre *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Mi cumpleaños 2025"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Ocasión</label>
          <input
            type="text"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="Ej: Cumpleaños, Navidad..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || createList.isPending}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createList.isPending ? "Creando..." : "Crear lista"}
          </button>
        </div>
      </div>
    </div>
  );
}