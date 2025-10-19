"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MenuOption {
  label: string;
  href: string;
}

export default function Menu() {
  const pathname = usePathname();
  const [options, setOptions] = useState<MenuOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("http://localhost:3000/api/marketplaces");
        const data = await res.json();
        if (!mounted) return;
        const items = Array.isArray(data)
          ? data.map((loja: { id: string; name: string }) => ({
              label: loja.name,
              href: loja.id,
            }))
          : [];
        setOptions(items);
      } catch {
        if (!mounted) return;
        setOptions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex border w-[20rem] rounded-lg overflow-hidden">
      {loading ? (
        <div className="w-full p-2 text-center text-sm text-gray-500">
          Carregando...
        </div>
      ) : options.length === 0 ? (
        <div className="w-full p-2 text-center text-sm text-gray-500">
          Nenhuma marketplace
        </div>
      ) : (
        options.map((option) => {
          const target = `/access/${option.href}`;
          const isActive = pathname?.startsWith(target);
          return (
            <Link
              key={option.href}
              href={target}
              className={`border-r last:border-r-0 p-2 flex-1 text-center transition-colors ${
                isActive
                  ? "bg-blue-500 text-white font-medium"
                  : "hover:bg-gray-100"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {option.label}
            </Link>
          );
        })
      )}
    </div>
  );
}
