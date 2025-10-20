"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MenuOption {
  label: string;
  href: string;
}

type MenuProps = {
  options?: MenuOption[]; // opcional: se passado, usa estas opções em vez de fetchar
};

export default function Menu({ options: propsOptions }: MenuProps) {
  const pathname = usePathname();
  const [options, setOptions] = useState<MenuOption[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    // se opções foram passadas via props, usa elas
    if (propsOptions) {
      setOptions(propsOptions);
      setLoading(false);
      return () => {
        mounted = false;
        controller.abort();
      };
    }

    async function load() {
      try {
        const base =
          process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";
        const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? "secretkey";

        const res = await fetch(`${base}/marketplaces`, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
        });

        if (!mounted) return;

        if (!res.ok) {
          // tenta novamente com os mesmos headers (evita erro por falta de header)
          const fallbackRes = await fetch(`${base}/marketplaces`, {
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
              "api-key": apiKey,
            },
          });
          if (!fallbackRes.ok) {
            setOptions([]);
            return;
          }
          const fallbackData = await fallbackRes.json();
          const fallbackItems = Array.isArray(fallbackData)
            ? fallbackData.map((loja: { id: string; name: string }) => ({
                label: loja.name,
                href: loja.id,
              }))
            : [];
          setOptions(fallbackItems);
          return;
        }

        const data = await res.json();
        if (!mounted) return;

        const items = Array.isArray(data)
          ? data.map((loja: { id: string; name: string }) => ({
              label: loja.name,
              href: loja.id,
            }))
          : [];
        setOptions(items);
      } catch (err) {
        if (!mounted) return;
        setOptions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [propsOptions]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="w-full p-2 text-center text-sm text-gray-500">
          Carregando...
        </div>
      );
    }
    if (!options || options.length === 0) {
      return (
        <div className="w-full p-2 text-center text-sm text-gray-500">
          Nenhuma marketplace
        </div>
      );
    }
    return options.map((option) => {
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
    });
  };

  return (
    <div className="flex border w-[20rem] rounded-lg overflow-hidden">
      {renderContent()}
    </div>
  );
}
