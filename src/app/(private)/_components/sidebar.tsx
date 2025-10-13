"use client";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import clsx from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  KeyRoundIcon,
  List
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// -----------------------------------------------------
// Configurações das seções e links
// -----------------------------------------------------
const sidebarSections = [
  {
    title: "Painel",
    links: [
      {
        href: "/dashboard",
        label: "Home",
        icon: <Home className="w-6 h-6" />,
      },
      {
        href: "/access",
        label: "Acessos",
        icon: <KeyRoundIcon className="w-6 h-6" />,
      },
    ],
  },
];

export function SidebarDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* SIDEBAR */}
      <aside
        className={clsx(
          "flex flex-col border-r bg-background transition-all duration-300 p-4 h-full",
          {
            "w-20": isCollapsed,
            "w-64": !isCollapsed,
            "hidden md:flex md:fixed": true,
          }
        )}
      >
        <div className="mb-6 mt-4">
          {!isCollapsed && <span>Logo</span>}
        </div>

        {/* Botão de colapsar */}
        <Button
          className="bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end mb-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed ? (
            <ChevronLeft className="w-12 h-12" />
          ) : (
            <ChevronRight className="w-12 h-12" />
          )}
        </Button>

        {/* Sidebar colapsada (ícones apenas) */}
        {isCollapsed && (
          <nav className="flex flex-col gap-1 overflow-hidden mt-2">
            {sidebarSections.flatMap((section) =>
              section.links.map((link) => (
                <SidebarLink
                  key={link.href}
                  pathname={pathname}
                  href={link.href}
                  label={link.label}
                  isCollapsed={isCollapsed}
                  icon={link.icon}
                />
              ))
            )}
          </nav>
        )}

        {/* Sidebar expandida (com seções) */}
        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
            <nav className="flex flex-col gap-1 overflow-hidden">
              {sidebarSections.map((section) => (
                <div key={section.title}>
                  <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                    {section.title}
                  </span>
                  {section.links.map((link) => (
                    <SidebarLink
                      key={link.href}
                      pathname={pathname}
                      href={link.href}
                      label={link.label}
                      isCollapsed={isCollapsed}
                      icon={link.icon}
                    />
                  ))}
                </div>
              ))}
            </nav>
          </CollapsibleContent>
        </Collapsible>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div
        className={clsx("flex flex-1 flex-col transition-all duration-300", {
          "md:ml-20": isCollapsed,
          "md:ml-64": !isCollapsed,
        })}
      >
        {/* HEADER MOBILE */}
        <header
          className="md:hidden flex items-center justify-between border-b px-2 md:px-6 
        h-14 z-10 sticky top-0 bg-white"
        >
          <Sheet>
            <div className="flex items-center gap-4">
              <SheetTrigger asChild className="md:hidden">
                <Button
                  onClick={() => setIsCollapsed(false)}
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                >
                  <List className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <h1 className="text-base md:text-lg font-semibold">
                Menu OdontoPRO
              </h1>
            </div>

            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>OdontoPRO</SheetTitle>
                <SheetDescription>Menu Administrativo</SheetDescription>
              </SheetHeader>

              <nav className="grid gap-2 text-base px-5">
                {sidebarSections.map((section) => (
                  <div key={section.title}>
                    {section.links.map((link) => (
                      <SidebarLink
                        key={link.href}
                        pathname={pathname}
                        href={link.href}
                        label={link.label}
                        isCollapsed={isCollapsed}
                        icon={link.icon}
                      />
                    ))}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 py-4 px-2 md:p-6">{children}</main>
      </div>
    </div>
  );
}

// -----------------------------------------------------
// Componente SidebarLink
// -----------------------------------------------------
interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
  isCollapsed: boolean;
}

function SidebarLink({
  href,
  icon,
  isCollapsed,
  label,
  pathname,
}: SidebarLinkProps) {
  const isActive = pathname.startsWith(href);

  return (
    <Link href={href}>
      <div
        className={clsx(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
          {
            "text-white bg-blue-500": isActive,
            "text-gray-700 hover:bg-gray-100": !isActive,
          }
        )}
      >
        <span className="w-6 h-6">{icon}</span>
        {!isCollapsed && <label>{label}</label>}
      </div>
    </Link>
  );
}

export default SidebarDashboard;