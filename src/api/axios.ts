import axios from "axios";
import { tokenUtils } from "../utils/cookies";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Endpoints puramente públicos
const publicEndpoints = [
  '/token',
  '/empresa',
  '/secretaria',
];

// Endpoints puramente privados
const privateEndpoints: (string | RegExp)[] = [
  '/empresa/pendentes',
  '/empresa/aprovar',
  '/secretaria/pendentes',
  '/secretaria/aprovar',
  '/api/user/create',

  // --- Regex para Rotas Dinâmicas (Nível 1) ---
  /^\/empresa\/[^/]+$/,        
  /^\/secretaria\/[^/]+$/,     
  /^\/administrador\/[^/]+$/,  
  /^\/api\/user\/[^/]+$/,       

  // --- Regex para Rotas Dinâmicas de DADOS (Nível 2) ---
  /^\/administrador\/dados\/[^/]+$/, 
  /^\/api\/user\/dados\/[^/]+$/,     
  /^\/secretaria\/dados\/[^/]+$/,    
  /^\/empresa\/dados\/[^/]+$/         
];

const matchesPrivateEndpoint = (url: string): boolean => {
  return privateEndpoints.some(endpoint => {
    if (endpoint instanceof RegExp) {
      return endpoint.test(url);
    }
    return url === endpoint;
  });
};


const isPublicEndpoint = (url: string | undefined, method: string | undefined): boolean => {
  if (!url) return false;
  
  const currentMethod = method ? method.toUpperCase() : 'GET';

  // --- LÓGICA ESPECÍFICA PARA VAGAS ---
  // Verifica se a URL é exatamente /vagas ou /vagas/{id}
  const isVagasRoot = /^\/vagas\/?$/.test(url);        // /vagas
  const isVagasDetail = /^\/vagas\/[^/]+$/.test(url);  // /vagas/{id}

  if (isVagasRoot || isVagasDetail) {
    // Se for rota de vagas, só é público se for GET.
    // POST, PUT, DELETE retornarão false (exigindo token).
    return currentMethod === 'GET';
  }
  
  // 1. Se está na lista negra explícita, requer auth
  if (matchesPrivateEndpoint(url)) {
    return false;
  }
  
  // 2. Se está na lista branca explícita, é público
  return publicEndpoints.some(endpoint => 
    url === endpoint || url.startsWith(endpoint + '/')
  );
};

api.interceptors.request.use(
  (config) => {
    if (!isPublicEndpoint(config.url, config.method)) {
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