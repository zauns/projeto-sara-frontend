"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useAuth } from "../../../contexts/AuthContext";

// Carregamento dinâmico dos componentes
// após o hook saber o tamanho da tela.
const MobileView = dynamic(() => import("./login.mobile"), {
  ssr: false,
});

const DesktopView = dynamic(() => import("./login.desktop"), {
  ssr: false,
});

// Um componente de "esqueleto" ou loader para mostrar durante o SSR
// e antes da hidratação.
const PageLoader = () => {
  return <div className="min-h-screen" />; // Ou um spinner, skeleton, etc.
};

export default function Login() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redireciona usuários autenticados para a página home
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, isLoading, router]);

  // Durante o SSR (isMobile === null), renderizamos o Loader.
  // O cliente renderiza o Loader na primeira passagem.
  // SEM INCOMPATIBILIDADE!
  // Também mostra o loader enquanto verifica a autenticação
  if (isMobile === null || isLoading) {
    return <PageLoader />;
  }

  // Se o usuário está autenticado, mostra o loader enquanto redireciona
  if (isAuthenticated) {
    return <PageLoader />;
  }

  // Agora, no cliente, sabemos o tamanho e renderizamos a versão correta.
  // O Next.js vai baixar apenas o chunk JS necessário.
  return isMobile ? <MobileView /> : <DesktopView />;
}
