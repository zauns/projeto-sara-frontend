"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

interface UseProtectedRouteOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * Hook para proteger rotas baseado no status de autenticação
 * @param options Opções de configuração para proteção de rota
 * @returns Objeto contendo status de autenticação e dados do usuário
 */
export const useProtectedRoute = (options: UseProtectedRouteOptions = {}) => {
  const { redirectTo = "/login", requireAuth = true } = options;

  const { user, token, isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Não redireciona enquanto ainda está carregando
    if (isLoading) return;

    // Se a rota requer autenticação mas o usuário não está autenticado
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Se a rota requer NÃO estar autenticado mas o usuário ESTÁ autenticado
    // (útil para páginas de login/registro)
    if (!requireAuth && isAuthenticated && redirectTo !== "/login") {
      switch (role) {
        case "ROLE_SUPER_ADMIN":
        case "ROLE_ADMIN":
          router.replace("home/adm")
          break;
        case "ROLE_USER":
          router.replace("home/user")
          break;
        case "ROLE_EMPRESA":
          router.replace("home/empresa")
          break;
        case "ROLE_SECRETARIA":
          router.replace("home/secretaria")
          break;
        default:
          router.replace("/")
          break;
      }
      return;
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, role]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    canAccess: requireAuth ? isAuthenticated : true,
  };
};

/**
 * Hook especificamente para páginas que requerem autenticação
 */
export const useRequireAuth = () => {
  return useProtectedRoute({ requireAuth: true, redirectTo: "/login" });
};


