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
import { EmpresaProfile, SecretariaProfile, UserProfile, UserProfileGeneric, userService } from "../services/userServices";
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
  // NOVA FUNÇÃO
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfileGeneric | null>(null);
  const [userDetails, setUserDetails] = useState<unknown | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => { 
      try {
        const storedToken = tokenUtils.getAuthToken();
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

  const login = async (
    tokenPayload: UserTokenPayload,
    authToken: string,
    rememberMe: boolean = false,
  ) => {
    try {
      tokenUtils.setAuthToken(authToken, rememberMe);
      setToken(authToken);
      
      setRole(tokenPayload.scope);
      localStorage.setItem("user_role", tokenPayload.scope); 

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

      userDataUtils.setUserData(userProfile, rememberMe);

      if (rememberMe) {
        localStorage.setItem("login_time", new Date().getTime().toString());
      }
      
      switch (tokenPayload.scope) {
        case "ROLE_SUPER_ADMIN":
        case "ROLE_ADMIN":
          router.replace("/home/adm");
          break;
        case "ROLE_USER":
          router.replace("/home/user");
          break;
        case "ROLE_EMPRESA":
          router.replace("/home/empresa");
          break;
        case "ROLE_SECRETARIA":
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

  const logout = () => {
    try {
      setUser(null);
      setToken(null);
      setRole(null);

      tokenUtils.removeAuthToken();
      userDataUtils.removeUserData();
      localStorage.removeItem("login_time");
      localStorage.removeItem("user_role");

      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const updateUser = async (userData: unknown) => {
    if (!user || !user?.id) return;

    try {
      let updatedUserDetails;

      switch (role) {
        case "ROLE_EMPRESA":
          updatedUserDetails = await userService.updateProfileEmpresa(user.id, userData as EmpresaProfile);
          break;
        case "ROLE_SECRETARIA":
          updatedUserDetails = await userService.updateProfileSecretaria(user.id, userData as SecretariaProfile);
          break;
        case "ROLE_ADMIN":
        case "ROLE_SUPER_ADMIN":
          break;
        case "ROLE_USER":
          updatedUserDetails = await userService.updateProfileUser(user.id, userData as UserProfile);
          break;
        default:
          console.warn("Role não identificada para atualização específica.");
      }
      setUserDetails(updatedUserDetails);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  };

  // --- IMPLEMENTAÇÃO DA DELEÇÃO ---
  const deleteAccount = async () => {
    if (!user || !user.id || !role) {
      console.error("Não foi possível excluir: ID ou Role ausente");
      return;
    }

    try {
      await userService.deleteProfile(user.id, role);
      // Se tiver sucesso, faz logout para limpar cookies e redirecionar
      logout();
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      throw error; // Re-lança para o componente mostrar feedback se necessário
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
    deleteAccount, // Expondo a função
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};