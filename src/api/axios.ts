import axios from "axios";
import { tokenUtils } from "../utils/cookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Endpoints puramente públicos. /empresa e /secretaria foram removidos
// para terem tratamento especial abaixo.
const publicEndpoints = ["/token"];

// Endpoints puramente privados
const privateEndpoints: (string | RegExp)[] = [
  "/empresa/pendentes",
  /^\/empresa\/aprovar\/[^/]+$/,
  "/secretaria/pendentes",
  /^\/secretaria\/aprovar\/[^/]+$/,
  "/api/user/create",

  // --- Regex para Rotas de Currículo ---
  /^\/api\/curriculum\/candidatas\/[^/]+\/curriculos$/,

  // --- Regex para Rotas Dinâmicas (Nível 1) ---
  // GET /empresa/{id} e GET /secretaria/{id} continuam privados
  /^\/empresa\/[^/]+$/,
  /^\/secretaria\/[^/]+$/,
  /^\/administrador\/[^/]+$/,
  /^\/api\/user\/[^/]+$/,

  // --- Regex para Rotas Dinâmicas de DADOS (Nível 2) ---
  /^\/administrador\/dados\/[^/]+$/,
  /^\/api\/user\/dados\/[^/]+$/,
  /^\/secretaria\/dados\/[^/]+$/,
  /^\/empresa\/dados\/[^/]+$/,
];

const matchesPrivateEndpoint = (url: string): boolean => {
  return privateEndpoints.some((endpoint) => {
    if (endpoint instanceof RegExp) {
      return endpoint.test(url);
    }
    return url === endpoint;
  });
};

const isPublicEndpoint = (
  url: string | undefined,
  method: string | undefined,
): boolean => {
  if (!url) return false;

  // 1. Limpa a URL removendo query strings (?param=valor) para não quebrar o Regex
  const cleanUrl = url.split("?")[0];
  const currentMethod = method ? method.toUpperCase() : "GET";

  // --- LÓGICA ESPECÍFICA PARA EMPRESA E SECRETARIA ---
  const isEmpresaRoot = /^\/empresa\/?$/.test(cleanUrl);
  const isSecretariaRoot = /^\/secretaria\/?$/.test(cleanUrl);

  if (isEmpresaRoot || isSecretariaRoot) {
    // GET /empresa e GET /secretaria são PRIVADOS (precisam de token).
    // Outros métodos como POST (para cadastro) são PÚBLICOS.
    // Retornamos 'true' (público) apenas se o método NÃO for GET.
    return currentMethod !== "GET";
  }

  // --- LÓGICA ESPECÍFICA PARA VAGAS ---
  // Verifica se a URL limpa é exatamente /vagas ou /vagas/{id}
  const isVagasRoot = /^\/vagas\/?$/.test(cleanUrl); // /vagas ou /vagas/
  const isVagasDetail = /^\/vagas\/[^/]+$/.test(cleanUrl); // /vagas/123

  if (isVagasRoot || isVagasDetail) {
    // Se for rota de vagas, retornamos TRUE (público) apenas se for GET.
    // Qualquer outro método (POST, DELETE) retornará false (privado/token necessário).
    return currentMethod === "GET";
  }

  // 2. Se está na lista negra explícita, requer auth
  // Usamos cleanUrl aqui também para garantir que query params não burlem a segurança
  if (matchesPrivateEndpoint(cleanUrl)) {
    console.log(cleanUrl);
    console.log("private");
    return false;
  }

  // 3. Se está na lista branca explícita, é público
  return publicEndpoints.some(
    (endpoint) => cleanUrl === endpoint || cleanUrl.startsWith(endpoint + "/"),
  );
};

api.interceptors.request.use(
  (config) => {
    if (!isPublicEndpoint(config.url, config.method)) {
      const token = tokenUtils.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      console.log(config.url);
      console.log("public");
    }

    return config;
  },
  (error) => {
    console.error("Erro no interceptor de request:", error);
    return Promise.reject(error);
  },
);

export { api };
