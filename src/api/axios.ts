import axios from "axios";
import { tokenUtils } from "../utils/cookies";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Endpoints públicos (não requerem autenticação)
const publicEndpoints = [
  '/token',
  '/empresa',
  '/secretaria',
];


const privateEndpoints: (string | RegExp)[] = [
  '/empresa/pendentes',
  '/empresa/aprovar',
  '/secretaria/pendentes',
  '/secretaria/aprovar',
  '/api/user/create',

  // --- Regex para Rotas Dinâmicas (Nível 1 - ex: /empresa/{id}) ---
  /^\/empresa\/[^/]+$/,
  /^\/secretaria\/[^/]+$/,
  /^\/administrador\/[^/]+$/,
  /^\/api\/user\/[^/]+$/,

  // --- Regex para Rotas Dinâmicas de DADOS (Nível 2 - ex: /empresa/dados/{id}) ---
  /^\/administrador\/dados\/[^/]+$/,  // Cobre: /administrador/dados/${id}
  /^\/api\/user\/dados\/[^/]+$/,      // Cobre: /api/user/dados/${id}
  /^\/secretaria\/dados\/[^/]+$/,     // Cobre: /secretaria/dados/${id}
  /^\/empresa\/dados\/[^/]+$/         // Cobre: /empresa/dados/${id}
];

const matchesPrivateEndpoint = (url: string): boolean => {
  return privateEndpoints.some(endpoint => {
    if (endpoint instanceof RegExp) {
      return endpoint.test(url);
    }
    return url === endpoint;
  });
};

const isPublicEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;

  // Primeiro verifica se é um endpoint explicitamente privado
  if (matchesPrivateEndpoint(url)) {
    return false;
  }
  // Depois verifica se é público (match exato ou começa com endpoint + /)
  return publicEndpoints.some(endpoint =>
    url === endpoint || url.startsWith(endpoint + '/')
  );
};

api.interceptors.request.use(
  (config) => {
    if (!isPublicEndpoint(config.url)) {
      const token = tokenUtils.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    console.error("Erro no interceptor de request:", error);
    return Promise.reject(error);
  }
);

export { api };
