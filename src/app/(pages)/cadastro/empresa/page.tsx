"use client";

import { CompanyRegistrationForm } from "@/components/core/company-registration-form";
import Image from "next/image";

export default function CompanyRegistrationPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FFF1EA]">
      {/* SEÇÃO DA IMAGEM */}
      <div className="relative w-full h-[221px] md:h-screen md:w-[60%] bg-white flex items-center justify-center">
        <Image
          src="/images/imagemLogin.png"
          alt="Imagem de Cadastro de Empresa"
          fill
          priority
          className="object-contain md:p-8"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>

      {/* SEÇÃO DO FORMULÁRIO */}
      <div className="w-full flex flex-col justify-start md:justify-center md:h-screen md:w-[40%] md:overflow-y-auto">
        <CompanyRegistrationForm />
      </div>
    </div>
  );
}
