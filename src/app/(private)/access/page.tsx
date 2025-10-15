"use client";

import { useEffect, useState } from "react";
import Menu from "../_components/menu";

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

  // Simula busca no banco (substitua pelo seu fetch real)
  useEffect(() => {
  fetch("http://localhost:3000/api/stores")
    .then((response) => response.json())
    .then((data) => setLojas(data));
}, []);
  return (
    <>
      <Menu options={
        lojas.map((loja) => ({
          label: loja.name,
          href: `/${loja.id}`,
        }))
      } />
    </>
  );
}
