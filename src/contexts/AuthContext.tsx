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
import { EmpresaProfile,SecretariaProfile, UserProfile, UserProfileGeneric, userService } from "../services/userServices";
import { UserTokenPayload } from "../services/authServices";

interface AuthContextType {
  user: UserProfileGeneric | null;
  userDetails: unknown | null;
  token: string | null;
  role: string | null; 
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    tokenPayload: UserTokenPayload,
    token: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<unknown>) => Promise<void>; 
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
  const [user, setUser] = useState<UserProfileGeneric | null>(null);
  const [userDetails, setUserDetails] = useState<unknown | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // Estado para armazenar a role
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verifica se há sessão existente ao montar
  useEffect(() => {
    const initializeAuth = async () => { // Note que agora é async
      try {
        const storedToken = tokenUtils.getAuthToken();
        // Ajuste de tipagem aqui para garantir acesso ao ID se necessário
        const storedUser = userDataUtils.getUserData() as UserProfileGeneric | null; 
        const storedRole = localStorage.getItem("user_role");
  
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          
          if (storedRole) {
            setRole(storedRole);
            let details = null;
            
            const userId = storedUser.id; 
  
            if (userId) {
              switch (storedRole) {
                case "ROLE_SECRETARIA":
                  details = await userService.getProfileSecretaria(userId);
                  break;
                case "ROLE_EMPRESA":
                  details = await userService.getProfileEmpresa(userId);
                  break;
                case "ROLE_ADMIN":
                case "ROLE_SUPER_ADMIN":
                  details = await userService.getProfileAdmin(userId);
                  break;
                case "ROLE_USER":
                  details = await userService.getProfileUser(userId);
                  break;
              }
              setUserDetails(details);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Se der erro ao buscar os detalhes (ex: token expirado na API), faz logout
        tokenUtils.removeAuthToken();
        userDataUtils.removeUserData();
        localStorage.removeItem("user_role");
        setUser(null);
        setUserDetails(null);
        setToken(null);
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
      let userProfile: UserProfileGeneric;
      let userProfileDetails: unknown

      switch (tokenPayload.scope) {
        case "ROLE_ADMIN":
        case "ROLE_SUPER_ADMIN":
          userProfile = await userService.getProfileGeneric(tokenPayload.userId, tokenPayload.scope);
          userProfileDetails = await userService.getProfileAdmin(tokenPayload.userId);
          break;
        case "ROLE_USER":
          userProfile = await userService.getProfileGeneric(tokenPayload.userId, tokenPayload.scope);
          userProfileDetails = await userService.getProfileUser(tokenPayload.userId);
          break;
        case "ROLE_SECRETARIA":
          userProfile = await userService.getProfileGeneric(tokenPayload.userId, tokenPayload.scope);
          userProfileDetails = await userService.getProfileSecretaria(tokenPayload.userId);
          break;
        case "ROLE_EMPRESA":
          userProfile = await userService.getProfileGeneric(tokenPayload.userId, tokenPayload.scope);
          userProfileDetails = await userService.getProfileEmpresa(tokenPayload.userId);
          break;
        default:
          throw new Error("Invalid role");
      }
      setUserDetails(userProfileDetails)
      setUser(userProfile);

      // 4. Armazena os dados do usuário
      userDataUtils.setUserData(userProfile, rememberMe);

      if (rememberMe) {
        localStorage.setItem("login_time", new Date().getTime().toString());
      }
      console.log(tokenPayload.scope)
      // 5. Redirecionamento
      switch (tokenPayload.scope) {
        case "ROLE_SUPER_ADMIN":
        case "ROLE_ADMIN":
          console.log("login admin")
          router.replace("/home/adm");
          break;
        case "ROLE_USER":
          console.log("login user")
          router.replace("/home/user");
          break;
        case "ROLE_EMPRESA":
          console.log("login empresa")
          router.replace("/home/empresa");
          break;
        case "ROLE_SECRETARIA":
          console.log("login secretaria")
          router.replace("/home/secretaria");
          break;
        default:
          router.replace("/login");
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
  const updateUser = async (userData: unknown) => {
    if (!user || !user?.id) return;

    try {
      let updatedUserDetails;

      switch (role) {
        case "ROLE_EMPRESA":
          // Supõe-se que userService tenha esses métodos implementados
          updatedUserDetails = await userService.updateProfileEmpresa(user.id, userData as EmpresaProfile);
          break;
        case "ROLE_SECRETARIA":
          updatedUserDetails = await userService.updateProfileSecretaria(user.id, userData as SecretariaProfile);
          break;
        case "ROLE_ADMIN":
        case "ROLE_SUPER_ADMIN":
          // Exemplo caso existam métodos para admin
          // await userService.updateProfileAdmin(user.id, userData as UserProfile);
          break;
        case "ROLE_USER":
          userService.updateProfileUser(user.id, userData as UserProfile);
          break;
        default:
          console.warn("Role não identificada para atualização específica.");
      }

      // 2. Se a API respondeu ok, atualiza o estado local
      setUserDetails(updatedUserDetails);

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error; // Re-lança o erro para que o componente de UI possa tratar (ex: mostrar toast de erro)
    }
  };

  const isAuthenticated = !!(user && token);

  const value: AuthContextType = {
    user,
    userDetails,
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