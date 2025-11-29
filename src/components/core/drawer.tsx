// src/components/MobileSidebar.tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose, // Importe o SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Home, // menu principal
  Briefcase, // Ícone para "Vagas"
  Bell, // notificações
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";

type SideBarProps = {
  onLogout?: () => void;
};

export function SideBar({ onLogout }: SideBarProps) {
  return (
    <Sheet>
      {/* O Botão que Abre a Sidebar */}
      <SheetTrigger asChild>
        <Button
          className="text-black p-2 rounded-md hover:bg-gray-100"
          aria-label="Abrir menu"
          type="button"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>

      {/* O Conteúdo da Sidebar que desliza */}
      <SheetContent className="w-[300px] bg-white" side="left">
        <SheetHeader>
          <div className="flex items-center">
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

        {/* Links de Navegação */}
        <nav className="mt-8 flex flex-col gap-2">
          <SidebarLink href="/home/user" icon={<Home className="h-5 w-5" />}>
            Home
          </SidebarLink>
          <SidebarLink href="/vagas" icon={<Briefcase className="h-5 w-5" />}>
            Vagas
          </SidebarLink>
          <SidebarLink href="#" icon={<Bell className="h-5 w-5" />}>
            Notificações
          </SidebarLink>
          <SidebarLink href="/perfil" icon={<User className="h-5 w-5" />}>
            Perfil
          </SidebarLink>
          <SidebarLink href="#" icon={<Settings className="h-5 w-5" />}>
            Configurações{" "}
            {/*fiz esse aqui tambem mas se couber no escopo necessário podemos só remover*/}
          </SidebarLink>

          {/* Divisor */}
          <hr className="my-4 border-t border-gray-200" />

          <SidebarLink
            href="#"
            icon={<LogOut className="h-5 w-5" />}
            onClick={onLogout}
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
  onClick?: () => void; // Add optional onClick prop
};

function SidebarLink({ href, icon, children, onClick }: SidebarLinkProps) {
  return (
    <SheetClose asChild>
      <a
        href={href}
        onClick={onClick} // Use onClick prop
        className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
      >
        {icon}
        {children}
      </a>
    </SheetClose>
  );
}
