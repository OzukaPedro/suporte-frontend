"use client";

import { useEffect, useState } from "react";
import Menu from "../_components/menu";
import type { ComponentType } from "react";

interface StoreProps {
  id: string;
  name: string;
}

type MenuOption = {
  label: string;
  href: string;
};

type MenuProps = {
  options: MenuOption[];
};

const TypedMenu = Menu as ComponentType<MenuProps>;

export default function AccessPage() {
  const [lojas, setLojas] = useState<StoreProps[]>([]);

  // Simula busca no banco (substitua pelo seu fetch real)
  useEffect(() => {
    fetch("http://localhost:3000/api/marketplaces")
      .then((response) => response.json())
      .then((data) => setLojas(data));
  }, []);
  return (
    <>
      <TypedMenu
        options={lojas.map((loja) => ({
          label: loja.name,
          href: `/${loja.id}`, // <- alterado: agora aponta para /access/[id]
        }))}
      />
    </>
  );
}
