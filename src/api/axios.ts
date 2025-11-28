import axios from "axios";
import { tokenUtils } from "../utils/cookies";

const api = axios.create({
  baseURL: "http://localhost:8080",
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
  '/api/user/dados',
  'secretaria/dados',
  'empresa/dados',
  'administrador/dados',
  
  // REGEX PARA ROTAS DINÂMICAS (COM ID)
  /^\/empresa\/[^/]+$/,        // Cobre: /empresa/${id}
  /^\/secretaria\/[^/]+$/,     // Cobre: /secretaria/${id}
  /^\/administrador\/[^/]+$/,  // Cobre /administrador/${id}
  /^\/api\/user\/[^/]+$/       // Cobre /api/user/${id}
];

const matchesPrivateEndpoint = (url: string): boolean => {
  return privateEndpoints.some(endpoint => {
    if (endpoint instanceof RegExp) {
      return endpoint.test(url);
    }
    return url === endpoint || url.startsWith(endpoint + '/');
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
