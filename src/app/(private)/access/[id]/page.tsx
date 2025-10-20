"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Menu from "../../_components/menu";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AccessProps {
  id: string;
  type: string; // antes "name" — agora "type"
  username: string;
  password?: string;
}
interface StoreProps {
  id: string;
  name: string;
  baseUrl: string;
  accesses: AccessProps[];
}

export default function AccessPage() {
  const params = useParams();
  // aqui o [id] representa o marketplaceId (ex: mkommerce)
  const marketplaceId = (params as { id?: string })?.id ?? "";

  const [lojas, setLojas] = useState<StoreProps[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- estados do form de criar loja ---
  const allowedTypes = ["painel", "ftp", "banco", "clientftp"];
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreUrl, setNewStoreUrl] = useState("");
  const [newAccesses, setNewAccesses] = useState<
    { id: string; type: string; username: string; password: string }[]
  >([{ id: "a0", type: "painel", username: "", password: "" }]);

  const addAccess = () => {
    if (newAccesses.length >= allowedTypes.length) return;
    // adiciona próximo tipo disponível (evita duplicatas)
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
    setNewAccesses((s) =>
      s.map((a) => (a.id === id ? { ...a, ...fields } : a))
    );
  };

  const canAddMore =
    newAccesses.length < allowedTypes.length && newAccesses.length > -1;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // montar payload
    const payload = {
      name: newStoreName,
      baseUrl: newStoreUrl,
      marketplaceId,
      accesses: newAccesses.map(({ id, ...rest }) => rest),
    };
    try {
      const base =
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";
      const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? "secretkey";
      await fetch(`${base}/stores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });
      // simples refresh local: re-fetch lojas
      setNewStoreName("");
      setNewStoreUrl("");
      setNewAccesses([
        { id: "a0", type: "painel", username: "", password: "" },
      ]);
      setOpenIndex(null);
      // refetch lojas
      const res = await fetch(`${base}/stores/marketplace/${marketplaceId}`, {
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
      });
      const data = await res.json();
      const items = Array.isArray(data)
        ? data
        : data.stores ?? data.accesses ?? [];
    } catch (error) {
      console.error("Erro ao criar loja:", error);
    }
  };

  // busca acessos da store atual (quando marketplaceId estiver disponível)
  useEffect(() => {
    if (!marketplaceId) return;

    const sortAccesses = (accesses: AccessProps[] = []) => {
      const order = ["painel", "ftp", "banco", "clientftp"];
      return [...accesses].sort((a, b) => {
        const aType = (a.type ?? "").toLowerCase();
        const bType = (b.type ?? "").toLowerCase();
        const ai = order.findIndex((k) => aType.includes(k));
        const bi = order.findIndex((k) => bType.includes(k));
        const aIndex = ai === -1 ? order.length : ai;
        const bIndex = bi === -1 ? order.length : bi;
        return aIndex - bIndex;
      });
    };

    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";
    const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? "secretkey";

    fetch(`${base}/stores/marketplace/${marketplaceId}`, {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data)
          ? data
          : data.stores ?? data.accesses ?? [];

        const mapped =
          Array.isArray(items) && items.length > 0 && (items[0] as any).accesses
            ? (items as any[]).map((store) => ({
                ...store,
                accesses: sortAccesses(
                  (store.accesses ?? []).map((a: any) => ({
                    id: a.id,
                    type: (a.name ?? a.type ?? "").toString(),
                    username: a.username,
                    password: a.password ?? "",
                  }))
                ),
              }))
            : // se a resposta for um array direto de accesses (não stores), converte para um store fictício
            Array.isArray(items) &&
              items.length > 0 &&
              (items[0] as any).username
            ? [
                {
                  id: marketplaceId,
                  name: "Resultado",
                  baseUrl: "",
                  accesses: sortAccesses(
                    (items as any[]).map((a) => ({
                      id: a.id,
                      type: (a.name ?? a.type ?? "").toString(),
                      username: a.username,
                      password: a.password ?? "",
                    }))
                  ),
                },
              ]
            : [];

        setLojas(mapped as StoreProps[]);
      })
      .catch(() => setLojas([]));
  }, [marketplaceId]);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Menu />

      <Card className="shadow-lg border mt-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
              Acessos
            </h2>
            <Dialog>
              <DialogTrigger className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Novo
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-bold">
                    Cadastrar loja
                  </DialogTitle>
                </DialogHeader>
                {/* Formulário de criação de novo acesso vai aqui */}
                <DialogDescription>
                  <form action="" onSubmit={handleCreateSubmit}>
                    <div className="space-y-4">
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
                        <label className="block text-sm font-medium text-gray-700">
                          URL da loja
                        </label>
                        <input
                          type="text"
                          value={newStoreUrl}
                          onChange={(e) => setNewStoreUrl(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Acesso */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Acessos
                        </label>
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
                                  onChange={(e) =>
                                    updateAccess(access.id, {
                                      type: e.target.value,
                                    })
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {(() => {
                                    // tipos já usados por outros acessos (exclui o atual)
                                    const used = new Set(
                                      newAccesses
                                        .filter((x) => x.id !== access.id)
                                        .map((x) => x.type)
                                    );
                                    // manter sempre a opção atual + somente tipos não usados
                                    const available = [
                                      access.type,
                                      ...allowedTypes.filter(
                                        (t) => t !== access.type && !used.has(t)
                                      ),
                                    ].filter(
                                      (v, i, arr) => arr.indexOf(v) === i
                                    );
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
                                  onChange={(e) =>
                                    updateAccess(access.id, {
                                      username: e.target.value,
                                    })
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-500 uppercase">
                                  Senha
                                </label>
                                <input
                                  type="password"
                                  value={access.password}
                                  onChange={(e) =>
                                    updateAccess(access.id, {
                                      password: e.target.value,
                                    })
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div className="flex items-end">
                                <button
                                  type="button"
                                  onClick={() => removeAccess(access.id)}
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
                    </div>
                  </form>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Barra de pesquisa */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Lista de acessos */}
          <ul className="space-y-4">
            {lojas.length > 0 ? (
              lojas.map((item, index) => (
                <li
                  key={item.id}
                  className="border rounded-xl shadow-sm overflow-hidden bg-white"
                >
                  <div className="flex justify-between items-center p-5 px-8 gap-4 hover:bg-gray-50 transition-colors">
                    <div>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Nome
                      </span>
                      <p className="ml-1 text-gray-800">{item.name}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Url
                      </span>
                      <p className="ml-1 text-blue-600 hover:underline ">
                        {item.baseUrl}
                      </p>
                    </div>

                    <div className="flex justify-end ">
                      <button
                        onClick={() => toggleOpen(index)}
                        className="rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                        aria-expanded={openIndex === index}
                        aria-controls={`access-${item.id}`}
                      >
                        {openIndex === index ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </div>
                  </div>

                  <div
                    id={`access-${item.id}`}
                    className={`transition-all duration-300 ease-in-out overflow-hidden border-t bg-gray-50 ${
                      openIndex === index
                        ? "opacity-100 max-h-[200px] p-6"
                        : "opacity-0 max-h-0 p-0"
                    }`}
                  >
                    <div className="flex gap-4 justify-around">
                      {item.accesses.map((access) => (
                        <div
                          key={access.id}
                          className="p-4 bg-white rounded-lg shadow-sm border flex flex-col flex-1 text-sm"
                        >
                          <label className="font-bold">{access.type}</label>
                          <p>
                            <span className="font-semibold text-gray-600">
                              Usuário:
                            </span>{" "}
                            {access.username}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-600">
                              Senha:
                            </span>{" "}
                            {access.password ?? "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                Nenhum resultado encontrado.
              </p>
            )}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
