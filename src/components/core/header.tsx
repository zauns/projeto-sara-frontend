import React from "react";
import Image from "next/image";
import { SideBar } from "@/components/core/drawer";

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
      {/* REMOVIDO: "max-w-7xl mx-auto" 
        Isso faz o container ocupar a largura total, 
        e o padding (px-4...) define a distância dos cantos.
      */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ADICIONADO: "md:gap-3" para espaçar um pouco mais em telas maiores */}
          <div className="flex items-center gap-2 md:gap-3">
            <SideBar onLogout={onLogout} />
            <Image
              src="/icons/logoSara.png"
              alt="Logo da SARA"
              width={50}
              height={50}
            />
            {/* ALTERADO: de "text-2xl ... md:text-3xl" 
              para "text-xl ... md:text-2xl" para um título mais conservador.
            */}
            <h1 className="text-xl font-bold text-gray-900 truncate md:text-2xl">
              SARA Emprega
            </h1>
          </div>

          {/* Você pode adicionar outros itens aqui (ex: botões, avatar do usuário) 
              que o "justify-between" empurrará para a direita. */}
        </div>
      </div>
    </header>
  );
};