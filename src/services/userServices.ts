import { api } from "../api/axios";

// Interface que reflete os dados REAIS que vêm do Backend
// Isso é mais detalhado que o token JWT
export interface UserProfile {
  id: string;
  nome: string; //mudei pro ContaResponse igual do back por desencargo de consciência
  email: string;
  telefone: string;
  endereco: string;
  tipoConta: string;
  // Adicione outros campos necessários para a Home/Perfil
}

export const userService = {
  async getProfileAdmin(id: string): Promise<UserProfile> {
    try {
      // O endpoint real pode ser /users/{id} ou similar
      const response = await api.get<UserProfile>(`/administrador/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário", error);
      throw error;
    }
  },
  async getProfileUser(id: string): Promise<UserProfile> {
    try {
      // O endpoint real pode ser /users/{id} ou similar
      const response = await api.get<UserProfile>(`/api/user/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário", error);
      throw error;
    }
  },
  async getProfileSecretaria(id: string): Promise<UserProfile> {
    try {
      // O endpoint real pode ser /users/{id} ou similar
      const response = await api.get<UserProfile>(`/secretaria/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário", error);
      throw error;
    }
  },
  async getProfileEmpresa(id: string): Promise<UserProfile> {
    try {
      // O endpoint real pode ser /users/{id} ou similar
      const response = await api.get<UserProfile>(`/empresa/${id}`);
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
