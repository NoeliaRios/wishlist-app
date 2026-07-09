import { useState } from "react";
import { useCreateItem } from "../hooks/useListDetail";

interface Props {
  listId: string;
  onClose: () => void;
}

export function CreateItemModal({ listId, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [priority, setPriority] = useState<1 | 2 | 3>(2);
  const createItem = useCreateItem(listId);

  async function handleSubmit() {
    if (!title.trim()) return;
    await createItem.mutateAsync({ title, description, url, priority });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Agregar item</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Nombre *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Auriculares Sony WH-1000XM5"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles adicionales..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Link del producto</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Prioridad</label>
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value) as 1 | 2 | 3)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>Alta</option>
            <option value={2}>Media</option>
            <option value={3}>Baja</option>
          </select>
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
            disabled={!title.trim() || createItem.isPending}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createItem.isPending ? "Agregando..." : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}