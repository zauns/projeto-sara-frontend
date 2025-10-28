"use client";

// Utilitários de Cookie para gerenciamento seguro de token com suporte a Lembrar de mim
export const cookieUtils = {
  // Define um cookie com expiração opcional e configurações de segurança
  setCookie: (
    name: string,
    value: string,
    options: {
      days?: number;
      isSession?: boolean;
      secure?: boolean;
    } = {},
  ) => {
    if (typeof document === "undefined") return; // Verificação de segurança SSR

    const { days = 7, isSession = false, secure = true } = options;
    let cookieString = `${name}=${value}; path=/; SameSite=Strict`;

    if (!isSession) {
      // Cookie persistente com expiração
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${expires.toUTCString()}`;
    }
    // Cookies de sessão não têm atributo de expiração - eles expiram quando o navegador fecha

    if (secure && window.location.protocol === "https:") {
      cookieString += "; Secure";
    }

    document.cookie = cookieString;
  },

  // Obtém um cookie por nome
  getCookie: (name: string): string | null => {
    if (typeof document === "undefined") return null; // Verificação de segurança SSR

    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // Deleta um cookie
  deleteCookie: (name: string) => {
    if (typeof document === "undefined") return; // Verificação de segurança SSR

    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict${secure}`;
  },

  // Verifica se cookies estão disponíveis
  areCookiesAvailable: (): boolean => {
    if (typeof document === "undefined") return false; // Verificação de segurança SSR

    try {
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `cookietest=1; SameSite=Strict${secure}`;
      const result = document.cookie.indexOf("cookietest=") !== -1;
      document.cookie =
        `cookietest=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict${secure}`;
      return result;
    } catch {
      return false;
    }
};

// Utilitários específicos de Token com suporte a Lembrar de mim
export const tokenUtils = {
  // Define token de autenticação com opção Lembrar de mim
  setAuthToken: (token: string, rememberMe: boolean = false) => {
    if (rememberMe) {
      // Lembrar de mim: cookie persistente de 30 dias
      cookieUtils.setCookie("auth_token", token, {
        days: 30,
        isSession: false,
      });
      cookieUtils.setCookie("remember_me", "true", {
        days: 30,
        isSession: false,
      });
    } else {
      // Login regular: Cookie de sessão (expira quando o navegador fecha)
      cookieUtils.setCookie("auth_token", token, { isSession: true });
      cookieUtils.setCookie("remember_me", "false", { isSession: true });
    }
  },

  // Obtém token de autenticação
  getAuthToken: (): string | null => {
    return cookieUtils.getCookie("auth_token");
  },

  // Remove token de autenticação e preferência de lembrar de mim
  removeAuthToken: () => {
    cookieUtils.deleteCookie("auth_token");
    cookieUtils.deleteCookie("remember_me");
  },

  // Verifica se o usuário previamente selecionou "Lembrar de mim"
  getRememberMePreference: (): boolean => {
    const rememberMe = cookieUtils.getCookie("remember_me");
    return rememberMe === "true";
  },

  // Verifica se o usuário está autenticado (possui token válido)
  isAuthenticated: (): boolean => {
    const token = tokenUtils.getAuthToken();
    return !!token && token.length > 0;
  },
};

// Utilitários de dados do usuário com suporte a Lembrar de mim (para dados não sensíveis)
export const userDataUtils = {
  // Define dados do usuário com consideração de Lembrar de mim
  setUserData: (userData: object, rememberMe: boolean = false) => {
    if (typeof window === "undefined") return; // Verificação de segurança SSR

    try {
      if (rememberMe) {
        // Armazena no localStorage para armazenamento persistente
        localStorage.setItem("user_data", JSON.stringify(userData));
        localStorage.setItem("user_storage_type", "persistent");
      } else {
        // Armazena no sessionStorage para armazenamento apenas da sessão
        sessionStorage.setItem("user_data", JSON.stringify(userData));
        sessionStorage.setItem("user_storage_type", "session");
        // Limpa quaisquer dados anteriores do localStorage
        localStorage.removeItem("user_data");
        localStorage.removeItem("user_storage_type");
      }
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  },

  // Obtém dados do usuário do armazenamento apropriado (localStorage ou sessionStorage)
  getUserData: (): object | null => {
    if (typeof window === "undefined") return null; // Verificação de segurança SSR

    try {
      // Verifica localStorage primeiro (para usuários com Lembrar de mim)
      let data = localStorage.getItem("user_data");
      if (data) {
        return JSON.parse(data);
      }

      // Verifica sessionStorage (para usuários com login regular)
      data = sessionStorage.getItem("user_data");
      if (data) {
        return JSON.parse(data);
      }

      return null;
    } catch (error) {
      console.error("Failed to retrieve user data:", error);
      return null;
    }
  },

  // Obtém preferência do tipo de armazenamento
  getStorageType: (): "persistent" | "session" | null => {
    if (typeof window === "undefined") return null; // Verificação de segurança SSR

    try {
      return (
        (localStorage.getItem("user_storage_type") as
          | "persistent"
          | "session") ||
        (sessionStorage.getItem("user_storage_type") as
          | "persistent"
          | "session") ||
        null
      );
    } catch (error) {
      console.error("Failed to get storage type:", error);
      return null;
    }
  },

  // Remove dados do usuário de ambos localStorage e sessionStorage
  removeUserData: () => {
    if (typeof window === "undefined") return; // Verificação de segurança SSR

    try {
      // Limpa de ambos os tipos de armazenamento
      localStorage.removeItem("user_data");
      localStorage.removeItem("user_storage_type");
      sessionStorage.removeItem("user_data");
      sessionStorage.removeItem("user_storage_type");
    } catch (error) {
      console.error("Failed to remove user data:", error);
    }
  },
};
