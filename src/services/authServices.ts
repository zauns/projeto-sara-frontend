const API_URL = "http://localhost:8080";

import { jwtDecode } from "jwt-decode";

export interface UserTokenPayload {
    sub: string;    //e-mail ou username
    scope: string;  //roles da conta
    userId: string; //id
    exp: number;
    iss: string;
}

export interface LoginResponse {
    token: string;
    user: UserTokenPayload; //ainda avaliar esta linha
}

export const authSevice = {
    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            const payload = {
                username: email,
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
                if (response.status == 401 || response.status == 403 ) {
                    throw new Error(errorText || "Credenciais inválidas ou conta pendente.");
                }
                throw new Error(errorText || "Falha na autenticação");
            }

            const token = await response.text();

            const decodeUser = jwtDecode<UserTokenPayload>(token);

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
