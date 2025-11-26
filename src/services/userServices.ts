import { api } from "../api/axios";

// Interface que reflete os dados REAIS que vêm do Backend
// Isso é mais detalhado que o token JWT
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  telephone: string;
  address: string;
  accountType: string;
  // Adicione outros campos necessários para a Home/Perfil
}

export const userService = {
  async getProfile(id: string): Promise<UserProfile> {
    try {
      // O endpoint real pode ser /users/{id} ou similar
      const response = await api.get<UserProfile>(`/administrador/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário", error);
      throw error;
    }
  },

  // Exemplo de método para atualizar perfil
  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.put<UserProfile>("/users/me", data);
    return response.data;
  },
};
