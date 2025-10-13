"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Menu() {
  const router = useRouter();
  const pathname = usePathname();

  function handleLinkClick(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) {
    event.preventDefault(); // impede o reload
    router.push(href); // navega sem recarregar
  }

  return (
    <div className="flex border w-[20rem]">
      <a
        href="/access/mforce"
        onClick={(e) => handleLinkClick(e, "/access/mforce")}
        className={`border p-2 flex-1 text-center transition-colors ${
          pathname === "/access/mforce"
            ? "bg-blue-500 text-white" // ativo
            : "hover:bg-gray-100" // inativo
        }`}
      >
        MForce
      </a>

      <a
        href="/access/mkommerce"
        onClick={(e) => handleLinkClick(e, "/access/mkommerce")}
        className={`border p-2 flex-1 text-center transition-colors ${
          pathname === "/access/mkommerce"
            ? "bg-blue-500 text-white"
            : "hover:bg-gray-100"
        }`}
      >
        MKommerce
      </a>
    </div>
  );
}
