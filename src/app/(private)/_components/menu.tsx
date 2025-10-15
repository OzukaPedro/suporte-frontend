"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuOption {
  label: string;
  href: string;
}

interface MenuProps {
  options: MenuOption[];
}

export default function Menu({ options }: MenuProps) {
  const pathname = usePathname();

  return (
    <div className="flex border w-[20rem] rounded-lg overflow-hidden">
      {options.map((option) => (
        <Link
          key={option.href}
          href={`/access/${option.href}`}
          className={`border-r last:border-r-0 p-2 flex-1 text-center transition-colors ${
            pathname === option.href
              ? "bg-blue-500 text-white font-medium"
              : "hover:bg-gray-100"
          }`}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
