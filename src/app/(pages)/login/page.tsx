"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import LoginForm from "../../../components/core/login-form";

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* LADO ESQUERDO (Apenas Desktop) */}
      <div className="hidden md:flex md:w-[60%] relative bg-white items-center justify-center">
        <Image
          src="/images/imagemLogin.png"
          alt="Imagem de Login Desktop"
          fill
          className="object-contain p-8"
          priority
        />
      </div>

      {/* LADO DIREITO (Formulário) 
          - bg-[#FFF1EA]: Garante que o fundo laranja preencha toda a coluna.
          - md:justify-center: Centraliza verticalmente o conteúdo (LoginForm) apenas no desktop.
          - flex flex-col: Necessário para o alinhamento funcionar.
      */}
      <div className="w-full md:w-[40%] bg-[#FFF1EA] flex flex-col md:justify-center">
        <LoginForm />
      </div>
    </div>
  );
}