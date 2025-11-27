"use client";
import Image from "next/image";
import LoginForm from "../../../components/core/login-form";
// 1. Importe o hook customizado
import { useProtectedRoute } from "../../../hooks/useProtectedRoute";

export default function Login() {
  // 2. Configure o hook para "Guest Only" (requireAuth: false)
  // Definimos redirectTo como "/" para passar na verificação do hook 
  // e permitir que o switch(role) faça o redirecionamento correto.
  const { isAuthenticated, isLoading } = useProtectedRoute({
    requireAuth: false,
    redirectTo: "/", 
  });

  // 3. Mantém a tela branca enquanto carrega ou enquanto prepara o redirecionamento
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

      {/* LADO DIREITO (Formulário) */}
      <div className="w-full md:w-[40%] bg-[#FFF1EA] flex flex-col md:justify-center">
        <LoginForm />
      </div>
    </div>
  );
}