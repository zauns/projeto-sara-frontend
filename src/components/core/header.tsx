import React from "react";
import Image from "next/image";
import { SideBar } from "@/components/core/drawer";

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <SideBar onLogout={onLogout} />
            <Image
              src="/icons/logoSara.png"
              alt="Logo da SARA"
              width={50}
              height={50}
            />
            <h1 className="text-2xl font-bold text-gray-900 truncate md:text-3xl">
              SARA Emprega
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
