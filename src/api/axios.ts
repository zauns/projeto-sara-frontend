import axios from "axios";
import { tokenUtils } from "../utils/cookies"; // Assumindo que seu utils existe

// Define a URL base para não repetir em todo lugar
export const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor opcional: Anexa o token automaticamente se ele já existir nos cookies
// Isso ajuda na persistência entre refreshes antes mesmo do Context carregar
api.interceptors.request.use((config) => {
  const token = tokenUtils.getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});