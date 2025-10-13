"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState } from "react";
import Menu from "../../_components/menu";

interface Props {
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
}

export default function MForceAccess() {
  // Exemplo de dados
  const acessos: Props[] = [
    {
      loja: "mforce",
      marca: "Polo From England",
      url: "https://polofromengland.com.br/painel",
      painelAcesso: {
        usuarioPainel: "suporte@marknet.com.br",
        senhaPainel: "123456",
      },
      bancoAcesso: {
        usuarioBanco: "polofrom_u",
        senhaBanco: "11111111",
      },
      ftpAcesso: {
        hostFtp: "ftp.polofromengland.com.br",
        usuarioFtp: "polofrom_f",
        senhaFtp: "********",
      },
    },
    {
      loja: "mkommerce",
      marca: "Champion Brasil",
      url: "https://championbrasil.com.br/painel",
      painelAcesso: {
        usuarioPainel: "suporte@marknet.com.br",
        senhaPainel: "654321",
      },
      bancoAcesso: {
        usuarioBanco: "champion_u",
        senhaBanco: "22222222",
      },
      ftpAcesso: {
        hostFtp: "ftp.championbrasil.com.br",
        usuarioFtp: "champion_f",
        senhaFtp: "********",
      },
    },
    {
      loja: "mforce",
      marca: "Ferracini Shoes",
      url: "https://ferracini.com.br/painel",
      painelAcesso: {
        usuarioPainel: "admin@marknet.com.br",
        senhaPainel: "987654",
      },
      bancoAcesso: {
        usuarioBanco: "ferracini_u",
        senhaBanco: "33333333",
      },
      ftpAcesso: {
        hostFtp: "ftp.ferracini.com.br",
        usuarioFtp: "ferracini_f",
        senhaFtp: "********",
      },
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filtro: mostra só lojas mforce + filtra pela marca
  const acessosFiltrados = acessos.filter(
    (item) =>
      item.loja === "mforce" &&
      item.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Menu />

      <Card className="shadow-lg border mt-10">
        <CardHeader className="text-lg font-semibold text-gray-800">
          Acessos Mforce
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
                  {/* Cabeçalho */}
                  <div className="flex justify-between items-center p-5 px-8 gap-4 hover:bg-gray-50 transition-colors">
                    {/* Nome */}
                    <div className="flex flex-col leading-3 flex-1">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Nome
                      </span>
                      <p className="ml-1 text-gray-800">{item.marca}</p>
                    </div>

                    {/* URL */}
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

                    {/* Botão toggle */}
                    <div className="flex justify-end flex-1">
                      <button
                        onClick={() => toggleOpen(index)}
                        className="rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                        aria-label="Mostrar detalhes"
                      >
                        {openIndex === index ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </div>
                  </div>

                  {/* Conteúdo expandido */}
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
                          <div className="flex gap-2">
                            <span className="font-medium">User:</span>
                            <p>{item.painelAcesso.usuarioPainel}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-medium">Password:</span>
                            <p>{item.painelAcesso.senhaPainel}</p>
                          </div>
                        </div>
                      </section>

                      {/* Banco */}
                      <section className="flex-1">
                        <h4 className="text-sm font-bold mb-2 text-gray-700">
                          Banco
                        </h4>
                        <div className="border text-sm border-gray-300 rounded-md p-3 bg-white space-y-1 w-fit">
                          <div className="flex gap-2">
                            <span className="font-medium">User:</span>
                            <p>{item.bancoAcesso.usuarioBanco}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-medium">Password:</span>
                            <p>{item.bancoAcesso.senhaBanco}</p>
                          </div>
                        </div>
                      </section>

                      {/* FTP */}
                      <section className="flex-1">
                        <h4 className="text-sm font-bold mb-2 text-gray-700">
                          FTP
                        </h4>
                        <div className="border text-sm border-gray-300 rounded-md p-3 bg-white space-y-1 w-fit">
                          <div className="flex gap-2">
                            <span className="font-medium">Host:</span>
                            <p>{item.ftpAcesso.hostFtp}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-medium">User:</span>
                            <p>{item.ftpAcesso.usuarioFtp}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-medium">Password:</span>
                            <p>{item.ftpAcesso.senhaFtp}</p>
                          </div>
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
