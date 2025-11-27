"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { tokenUtils, userDataUtils } from "../utils/cookies";
import { UserProfile, userService } from "../services/userServices";
import { UserTokenPayload } from "../services/authServices";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  role: string | null; // Adicionado para expor a role no contexto
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    tokenPayload: UserTokenPayload,
    token: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<UserProfile>) => Promise<void>; // Agora retorna uma Promise
}

// Criar Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook customizado para permitir o uso do AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Componente AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // Estado para armazenar a role
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verifica se há sessão existente ao montar
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Verifica token e dados do usuário
        const storedToken = tokenUtils.getAuthToken();
        const storedUser = userDataUtils.getUserData() as UserProfile | null;
        // Recupera a role salva (necessário persistir para sobreviver ao refresh)
        const storedRole = localStorage.getItem("user_role"); 

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          if (storedRole) {
            setRole(storedRole);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        tokenUtils.removeAuthToken();
        userDataUtils.removeUserData();
        localStorage.removeItem("user_role");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Função de login com suporte a Lembrar de mim
  const login = async (
    tokenPayload: UserTokenPayload,
    authToken: string,
    rememberMe: boolean = false,
  ) => {
    try {
      // 1. Armazena o token
      tokenUtils.setAuthToken(authToken, rememberMe);
      setToken(authToken);
      
      // 2. Define a role baseada no payload
      setRole(tokenPayload.scope);
      localStorage.setItem("user_role", tokenPayload.scope); // Persiste a role

      // 3. Busca o perfil baseado na role
      let userProfile: UserProfile;

      switch (tokenPayload.scope) {
        case "ROLE_ADMIN":
        case "ROLE_SUPER_ADMIN":
          userProfile = await userService.getProfileAdmin(tokenPayload.userId);
          break;
        case "ROLE_USER":
          userProfile = await userService.getProfileUser(tokenPayload.userId);
          break;
        case "ROLE_SECRETARIA":
          userProfile = await userService.getProfileSecretaria(tokenPayload.userId);
          break;
        case "ROLE_EMPRESA":
          userProfile = await userService.getProfileEmpresa(tokenPayload.userId);
          break;
        default:
          throw new Error("Invalid role");
      }

      setUser(userProfile);

      // 4. Armazena os dados do usuário
      userDataUtils.setUserData(userProfile, rememberMe);

      if (rememberMe) {
        localStorage.setItem("login_time", new Date().getTime().toString());
      }

      // 5. Redirecionamento
      switch (tokenPayload.scope) {
        case "ROLE_SUPER_ADMIN":
        case "ROLE_ADMIN":
          router.push("/home/adm");
          break;
        case "ROLE_USER":
          router.push("/home/");
          break;
        case "ROLE_EMPRESA":
          router.push("/home/empresa");
          break;
        case "ROLE_SECRETARIA":
          router.push("/home/secretaria");
          break;
        default:
          router.push("/login");
      }
    } catch (error) {
      console.error("Error during login:", error);
      logout();
    }
  };

  // Função de logout
  const logout = () => {
    try {
      setUser(null);
      setToken(null);
      setRole(null);

      tokenUtils.removeAuthToken();
      userDataUtils.removeUserData();
      localStorage.removeItem("login_time");
      localStorage.removeItem("user_role"); // Remove a role persistida

      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Atualiza dados do usuário (Backend + Frontend)
  const updateUser = async (userData: Partial<UserProfile>) => {
    if (!user || !user.id) return;

    try {
      // 1. Identifica a role e chama o serviço específico de atualização
      switch (role) {
        case "ROLE_EMPRESA":
          // Supõe-se que userService tenha esses métodos implementados
          await userService.updateProfileEmpresa(user.id, userData as UserProfile);
          break;
        case "ROLE_SECRETARIA":
          await userService.updateProfileSecretaria(user.id, userData as UserProfile);
          break;
        case "ROLE_ADMIN":
        case "ROLE_SUPER_ADMIN":
          // Exemplo caso existam métodos para admin
          // await userService.updateProfileAdmin(user.id, userData as UserProfile);
          break;
        case "ROLE_USER":
          // await userService.updateProfileUser(user.id, userData as UserProfile);
          break;
        default:
          console.warn("Role não identificada para atualização específica, atualizando apenas localmente.");
      }

      // 2. Se a API respondeu ok, atualiza o estado local
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);

      // 3. Atualiza persistência local
      const currentStorageType = userDataUtils.getStorageType();
      const rememberMe = currentStorageType === "persistent";
      userDataUtils.setUserData(updatedUser, rememberMe);

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error; // Re-lança o erro para que o componente de UI possa tratar (ex: mostrar toast de erro)
    }
  };

  const isAuthenticated = !!(user && token);

  const value: AuthContextType = {
    user,
    token,
    role,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};