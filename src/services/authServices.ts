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
            const payload = {
                username: credentials.email,
                password: credentials.password
            };

            //Configurar headers explicitamente
            const response = await api.post("/token", payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const token = response.data;

            if (!token || typeof token !== 'string') {
                throw new Error('Resposta inválida do servidor');
            }

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
                throw new Error(error.response?.data?.message || "Falha na autenticação");
            }
            console.error("Erro inesperado no login", error);
            throw error;
        }
    },
};
