const API_URL = "http://localhost:8080";

import { jwtDecode } from "jwt-decode";

export interface LoginResponse {
    token: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any; //ainda avaliar esta linha
}

export const authSevice = {
    async login(cpf: string, password: string): Promise<LoginResponse> {
        try {
            const payload = {
                username: cpf,
                password: password //no back end vamos alterar os dados enviados
                // o back envia e-mail e senha mas o front espera cpf e senha
            };
            const response = await fetch(`${API_URL}/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Falha na autenticação");
            }

            const token = await response.text();

            const decodeUser = jwtDecode(token);

            return {
                token,
                user: decodeUser
            };
        } catch (error) {
            console.error("Erro na requisição do login", error);
            throw error;
        }
    },
};
