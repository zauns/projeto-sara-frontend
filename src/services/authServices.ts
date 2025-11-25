import { api } from "../api/axios";
import { jwtDecode } from "jwt-decode";
import { AxiosError } from "axios";

export interface UserTokenPayload {
    sub: string;    // e-mail ou username
    scope: string;  // roles da conta
    userId: string; // id
    exp: number;
    iss: string;
}

export interface LoginResponse {
    token: string;
    user: UserTokenPayload;
}

export interface LoginCredentials {
    email: string; // O front recebe email
    password: string;
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            // Adaptação dos dados: Front (email) -> Back (espera 'username')
            const payload = {
                username: credentials.email,
                password: credentials.password 
            };

            const response = await api.post<string>("/token", payload); // Axios parseia JSON auto, mas endpoint retorna token comos string
            
            // Se o backend retorna o token como string pura (text/plain)
            const token = response.data;
            
            // Se o backend retornasse JSON { token: "..." }, seria response.data.token
            
            const decodeUser = jwtDecode<UserTokenPayload>(token);

            return {
                token,
                user: decodeUser
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                // Tratamento específico de erro do Axios
                const message = error.response?.data || error.message;
                if (error.response?.status === 401 || error.response?.status === 403) {
                     throw new Error("Credenciais inválidas ou conta pendente.");
                }
                throw new Error(typeof message === 'string' ? message : "Falha na autenticação");
            }
            console.error("Erro inesperado no login", error);
            throw error;
        }
    },
};