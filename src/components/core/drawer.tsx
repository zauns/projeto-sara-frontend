// src/components/MobileSidebar.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Home,
  Briefcase,
  Bell,
  User,
  Settings,
  LogOut,
  LayoutDashboard, // Importação adicionada
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

type SideBarProps = {
  onLogout?: () => void;
};

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function SideBar({ onLogout }: SideBarProps) {
  const { role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
  };

  const getMenuItems = (): MenuItem[] => {
    switch (role) {
      case "ROLE_USER":
        return [
          { label: "Home", href: "/home/user", icon: <Home className="h-5 w-5" /> },
          { label: "Vagas", href: "/vagas", icon: <Briefcase className="h-5 w-5" /> },
          { label: "Notificações", href: "#", icon: <Bell className="h-5 w-5" /> },
          { label: "Perfil", href: "/perfil", icon: <User className="h-5 w-5" /> },
          { label: "Configurações", href: "#", icon: <Settings className="h-5 w-5" /> },
        ];

      case "ROLE_EMPRESA":
        return [
          { label: "Home", href: "/home/empresa", icon: <Home className="h-5 w-5" /> },
          { label: "Minhas Vagas", href: "/empresa/vagas", icon: <Briefcase className="h-5 w-5" /> },
        ];

      case "ROLE_SECRETARIA":
        return [
          { label: "Home", href: "/home/secretaria", icon: <Home className="h-5 w-5" /> },
        ];

      case "ROLE_ADMIN":
      case "ROLE_SUPER_ADMIN":
        return [
          { label: "Home", href: "/home/adm", icon: <Home className="h-5 w-5" /> },
          { label: "Dashboard", href: "/dashboard/adm", icon: <LayoutDashboard className="h-5 w-5" /> }, // Item adicionado
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="text-black p-2 rounded-md hover:bg-gray-100"
          aria-label="Abrir menu"
          type="button"
          variant="ghost"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[300px] bg-white flex flex-col" side="left">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Image
              src="/icons/logoSara.png"
              alt="Logo da SARA"
              width={40}
              height={40}
            />
            <SheetTitle className="text-left text-2xl font-bold text-black">
              Sara Emprega
            </SheetTitle>
          </div>
          <SheetDescription className="text-left text-gray-800">
            Menu de navegação principal
          </SheetDescription>
        </SheetHeader>

        <nav className="mt-8 flex flex-col gap-2 flex-grow">
          {menuItems.map((item, index) => (
            <SidebarLink key={index} href={item.href} icon={item.icon}>
              {item.label}
            </SidebarLink>
          ))}

          <hr className="my-4 border-t border-gray-200" />

          <SidebarLink
            href="#"
            icon={<LogOut className="h-5 w-5" />}
            onClick={handleLogout}
          >
            Sair
          </SidebarLink>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

type SidebarLinkProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
};

function SidebarLink({ href, icon, children, onClick }: SidebarLinkProps) {
  return (
    <SheetClose asChild>
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
      >
        {icon}
        {children}
      </Link>
    </SheetClose>
  );
}