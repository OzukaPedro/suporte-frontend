"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Menu from "../../_components/menu";

interface StoreProps {
  id: string;
  name: string;
}
interface AcessProps {
  loja: "mforce" | "mkommerce";
  marca: string;
  url: string;
  painelAcesso: {
    usuarioPainel: string;
    senhaPainel: string;
  };
  bancoAcesso: {
    usuarioBanco: string;
    senhaBanco: string;
  };
  ftpAcesso: {
    hostFtp: string;
    usuarioFtp: string;
    senhaFtp: string;
  };
  ftpAcessoCliente: {
    usuarioFtpCliente: string;
    senhaFtpCliente: string;
  }
}


export default function AccessPage() {
  

  const [lojas, setLojas] = useState<StoreProps[]>([]);
  const [acessos, setAcessos] = useState<AcessProps[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Simula busca no banco (substitua pelo seu fetch real)
  useEffect(() => {
  fetch("http://localhost:3000/api/stores")
    .then((response) => response.json())
    .then((data) => setLojas(data));
    console.log(lojas)
}, []);
  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const acessosFiltrados = acessos.filter((item) =>
    item.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Menu options={
        lojas.map((loja) => ({
          label: loja.name,
          href: `/${loja.id}`,
        }))
      } />

      <Card className="shadow-lg border mt-10">
        <CardHeader className="text-lg font-semibold text-gray-800 capitalize">
          Acessos
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
            {acessosFiltrados.length > 0 ? (
              acessosFiltrados.map((item, index) => (
                <li
                  key={index}
                  className="border rounded-xl shadow-sm overflow-hidden bg-white"
                >
                  <div className="flex justify-between items-center p-5 px-8 gap-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col leading-3 flex-1">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Nome
                      </span>
                      <p className="ml-1 text-gray-800">{item.marca}</p>
                    </div>

                    <div className="flex flex-col leading-3 flex-1">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        URL
                      </span>
                      <a
                        href={item.url}
                        target="_blank"
                        className="ml-1 text-blue-600 hover:underline break-all"
                      >
                        {item.url}
                      </a>
                    </div>

                    <div className="flex justify-end flex-1">
                      <button
                        onClick={() => toggleOpen(index)}
                        className="rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                      >
                        {openIndex === index ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden border-t bg-gray-50 ${
                      openIndex === index
                        ? "opacity-100 max-h-[600px] p-6"
                        : "opacity-0 max-h-0 p-0"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row gap-6 justify-between">
                      {/* Painel */}
                      <section className="flex-1">
                        <h4 className="text-sm font-bold mb-2 text-gray-700">
                          Painel
                        </h4>
                        <div className="border text-sm border-gray-300 rounded-md p-3 bg-white space-y-1 w-fit">
                          <p>
                            <span className="font-medium">User:</span>{" "}
                            {item.painelAcesso.usuarioPainel}
                          </p>
                          <p>
                            <span className="font-medium">Password:</span>{" "}
                            {item.painelAcesso.senhaPainel}
                          </p>
                        </div>
                      </section>

                      {/* Banco */}
                      <section className="flex-1">
                        <h4 className="text-sm font-bold mb-2 text-gray-700">
                          Banco
                        </h4>
                        <div className="border text-sm border-gray-300 rounded-md p-3 bg-white space-y-1 w-fit">
                          <p>
                            <span className="font-medium">User:</span>{" "}
                            {item.bancoAcesso.usuarioBanco}
                          </p>
                          <p>
                            <span className="font-medium">Password:</span>{" "}
                            {item.bancoAcesso.senhaBanco}
                          </p>
                        </div>
                      </section>

                      {/* FTP */}
                      <section className="flex-1">
                        <h4 className="text-sm font-bold mb-2 text-gray-700">
                          FTP
                        </h4>
                        <div className="border text-sm border-gray-300 rounded-md p-3 bg-white space-y-1 w-fit">
                          <p>
                            <span className="font-medium">Host:</span>{" "}
                            {item.ftpAcesso.hostFtp}
                          </p>
                          <p>
                            <span className="font-medium">User:</span>{" "}
                            {item.ftpAcesso.usuarioFtp}
                          </p>
                          <p>
                            <span className="font-medium">Password:</span>{" "}
                            {item.ftpAcesso.senhaFtp}
                          </p>
                        </div>
                      </section>
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
