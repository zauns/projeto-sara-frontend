import axios from "axios";
import { tokenUtils } from "../utils/cookies";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    //NUNCA enviar token para /token (causa 401)
    const isPublicEndpoint = config.url?.includes('/token') ||
                           config.url?.includes('/empresa') ||
                           config.url?.includes('/secretaria');

    if (!isPublicEndpoint) {
      const token = tokenUtils.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => {
    console.error("Erro no interceptor de request:", error);
    return Promise.reject(error);
  }
);

export { api };
