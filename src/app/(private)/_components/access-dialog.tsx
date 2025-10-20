 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

type AccessItem = { id?: string; type: string; username: string; password?: string };
type StoreProps = {
  id: string;
  name: string;
  marketplaceId: string;
  baseUrl: string;
  accesses: AccessItem[];
};

interface Props {
  marketplaceId: string;
  triggerLabel?: string;
  title?: string;
  mode?: "create" | "edit";
  initial?: StoreProps | null;
  onSaved?: (saved?: StoreProps) => void;
}

const allowedTypes = ["Panel", "Ftp", "Database", "ClientFtp"];

export default function AccessDialog({
  marketplaceId,
  triggerLabel = "Novo",
  title = "Cadastrar loja",
  mode = "create",
  initial = null,
  onSaved,
}: Props) {
  const [open, setOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreUrl, setNewStoreUrl] = useState("");
  const [newAccesses, setNewAccesses] = useState<AccessItem[]>([
    { id: "a0", type: "painel", username: "", password: "" },
  ]);

  useEffect(() => {
    if (mode === "edit" && initial) {
      setNewStoreName(initial.name ?? "");
      setNewStoreUrl(initial.baseUrl ?? "");
      setNewAccesses(
        (initial.accesses ?? []).map((a) => ({
          id: a.id ?? `${Date.now()}-${Math.random()}`,
          type: a.type ?? "panel",
          username: a.username ?? "",
          password: a.password ?? "",
        }))
      );
    } else if (mode === "create") {
      // reset on open
      setNewStoreName("");
      setNewStoreUrl("");
      setNewAccesses([{ id: "a0", type: "Panel", username: "", password: "" }]);
    }
  }, [mode, initial, open]);

  const addAccess = () => {
    if (newAccesses.length >= allowedTypes.length) return;
    const used = new Set(newAccesses.map((a) => a.type));
    const next = allowedTypes.find((t) => !used.has(t)) ?? allowedTypes[0];
    setNewAccesses((s) => [
      ...s,
      { id: `${Date.now()}`, type: next, username: "", password: "" },
    ]);
  };

  const removeAccess = (id: string) => {
    setNewAccesses((s) => s.filter((a) => a.id !== id));
  };

  const updateAccess = (
    id: string,
    fields: Partial<{ type: string; username: string; password: string }>
  ) => {
    setNewAccesses((s) => s.map((a) => (a.id === id ? { ...a, ...fields } : a)));
  };

  const canAddMore = newAccesses.length < allowedTypes.length && newAccesses.length > -1;

  // adiciona helper para garantir headers consistentes
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";
  const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? "secretkey";


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload: StoreProps = {
    id: initial?.id ?? "",
    marketplaceId,
    name: newStoreName,
    baseUrl: newStoreUrl,
    accesses: newAccesses.map((a) => ({
      type: a.type,
      username: a.username,
      password: a.password,
    })),
  };

  try {
    const storeRes = await fetch(`${base}/stores`, {
      method: mode === "create" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!storeRes.ok) throw new Error("Erro ao salvar loja e acessos");

    const savedStore = await storeRes.json();

    // Callback e fechar modal
    onSaved?.(savedStore);
    setOpen(false);
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar a loja e acessos.");
  }
};

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        {triggerLabel}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold">{title}</DialogTitle>
        </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 ">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome da loja
                </label>
                <input
                  type="text"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL da loja</label>
                <input
                  type="text"
                  value={newStoreUrl}
                  onChange={(e) => setNewStoreUrl(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Acessos</label>
                <div className="space-y-2">
                  {newAccesses.map((access) => (
                    <div
                      key={access.id}
                      className="p-4 bg-white rounded-lg shadow-sm border flex flex-col sm:flex-row gap-2"
                    >
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-500 uppercase">
                          Tipo
                        </label>
                        <select
                          value={access.type}
                          onChange={(e) => updateAccess(access.id || '', { type: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {(() => {
                            const used = new Set(
                              newAccesses.filter((x) => x.id !== access.id).map((x) => x.type)
                            );
                            const available = [
                              access.type,
                              ...allowedTypes.filter((t) => t !== access.type && !used.has(t)),
                            ].filter((v, i, arr) => arr.indexOf(v) === i);
                            return available.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ));
                          })()}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-500 uppercase">
                          Usuário
                        </label>
                        <input
                          type="text"
                          value={access.username}
                          onChange={(e) => updateAccess(access.id || '', { username: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-500 uppercase">
                          Senha
                        </label>
                        <input
                          type="text"
                          value={access.password}
                          onChange={(e) => updateAccess(access.id || '', { password: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeAccess(access.id || '')}
                          className="bg-red-500 hover:bg-red-600 transition p-2 rounded-lg text-white "
                        >
                          <Trash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {canAddMore && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={addAccess}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Adicionar acesso
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Salvar
                </button>
              </div>
           
          </form>
      </DialogContent>
    </Dialog>
  );
}