/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AccessDialog from "../../_components/access-dialog";
import Menu from "../../_components/menu";

interface AccessProps {
  id: string;
  type: string;
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
  const marketplaceId = (params as { id?: string })?.id ?? "";

  const [lojas, setLojas] = useState<StoreProps[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // busca acessos da store atual (quando marketplaceId estiver disponível)
  const sortAccesses = (accesses: AccessProps[] = []) => {
    const order = ["Panel", "Database", "Ftp", "clientFtp"];
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

  const fetchStores = async () => {
    if (!marketplaceId) return;
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";
    const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? "secretkey";

    try {
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
          : Array.isArray(items) &&
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
    } catch {
      setLojas([]);
    }
  };

  useEffect(() => {
    fetchStores();
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

            {/* botão criar: usa o componente reutilizável */}
            <AccessDialog
              marketplaceId={marketplaceId}
              triggerLabel="Novo"
              title="Cadastrar loja"
              mode="create"
              onSaved={() => {
                fetchStores();
              }}
            />
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
              lojas
                .filter((l) =>
                  l.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item, index) => (
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

                      <div className="flex items-center gap-2">
                        {/* botão editar: usa o mesmo componente em mode="edit" */}
                        <AccessDialog
                          marketplaceId={marketplaceId}
                          triggerLabel="Editar"
                          title={`Editar ${item.name}`}
                          mode="edit"
                          onSaved={() => fetchStores()}
                        />

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
                          ? "opacity-100 max-h-[300px] p-6"
                          : "opacity-0 max-h-0 p-0"
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {item.accesses.map((access) => (
                          <div
                            key={access.id}
                            className="p-4 bg-white rounded-lg shadow-sm border flex flex-col text-sm"
                          >
                            <label className="font-bold">{access.type}</label>
                            <p>
                              <span className="font-semibold text-gray-600">Usuário:</span>{" "}
                              {access.username}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-600">Senha:</span>{" "}
                              {access.password ?? "-"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </li>
                ))
            ) : (
              <p className="text-gray-500 text-sm">Nenhum resultado encontrado.</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
