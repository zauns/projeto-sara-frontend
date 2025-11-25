"use client";
// Esqueleto genérico para AuthContext sem integração
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
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    tokenPayload: UserTokenPayload,
    token: string,
    rememberMe?: boolean,
  ) => void;
  logout: () => void;
  updateUser: (userData: Partial<UserProfile>) => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verifica se há sessão existente ao montar
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Verifica token e dados do usuário (tanto localStorage quanto sessionStorage)
        const storedToken = tokenUtils.getAuthToken();
        const storedUser = userDataUtils.getUserData() as UserProfile | null;

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Limpa dados potencialmente corrompidos
        tokenUtils.removeAuthToken();
        userDataUtils.removeUserData();
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
      // 1. Armazena o token primeiro para chamadas de API autenticadas
      tokenUtils.setAuthToken(authToken, rememberMe);
      setToken(authToken);

      // 2. Busca os dados completos do perfil do usuário
      const userProfile = await userService.getProfile(tokenPayload.userId);

      // 3. Define o estado e armazena os dados do usuário
      setUser(userProfile);
      userDataUtils.setUserData(userProfile, rememberMe);

      // Armazena o horário de login para cálculo de tempo restante
      if (rememberMe) {
        localStorage.setItem("login_time", new Date().getTime().toString());
      }

      // Navega para a página home
      router.push("/home");
    } catch (error) {
      console.error("Error during login:", error);
      // Em caso de erro ao buscar perfil, desloga para evitar estado inconsistente
      logout();
    }
  };

  // Função de logout
  const logout = () => {
    try {
      // Limpa o estado
      setUser(null);
      setToken(null);

      // Limpa todos os dados armazenados (tokens e dados do usuário)
      tokenUtils.removeAuthToken();
      userDataUtils.removeUserData();

      // Remove o horário de login
      localStorage.removeItem("login_time");

      // Navega para a página de login
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Atualiza dados do usuário
  const updateUser = (userData: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      // Atualiza dados do usuário preservando a preferência do tipo de armazenamento
      const currentStorageType = userDataUtils.getStorageType();
      const rememberMe = currentStorageType === "persistent";
      userDataUtils.setUserData(updatedUser, rememberMe);
    }
  };

  // Verifica se o usuário está autenticado
  const isAuthenticated = !!(user && token);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
