"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AcessPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/access/mforce"); // redireciona sem voltar no histórico
  }, [router]);

  return null; // não renderiza nada (ou poderia mostrar um spinner)
}
