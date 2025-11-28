import { api } from "../api/axios";
import { CompanyRegistrationData, DepartmentRegistrationData } from "./registrationServices";

// Interface que reflete os dados REAIS que vêm do Backend
// Isso é mais detalhado que o token JWT
export interface UserProfileGeneric {
  id: string;
  nome: string; //mudei pro ContaResponse igual do back por desencargo de consciência
  email: string;
  telefone: string;
  endereco: string;
  tipoConta: string;
}

export interface AdminProfile {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  isSuperAdmin: boolean;
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  tipoConta: string;
}

export interface EmpresaProfile {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cnpj: string;
  biografia: string;
  links: string;
}

export interface SecretariaProfile {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  municipio: string;
}


export const userService = {
  async getProfileGeneric(id: string, role: string): Promise<UserProfileGeneric> {
    try {
      let response;
      switch (role) {
        case "ROLE_SUPER_ADMIN":
        case "ROLE_ADMIN":
          response = await api.get<UserProfileGeneric>(`/administrador/${id}`);
          return response.data;
        case "ROLE_USER":
          response = await api.get<UserProfileGeneric>(`/api/user/${id}`);
          return response.data;
        case "ROLE_EMPRESA":
          response = await api.get<UserProfileGeneric>(`/empresa/${id}`);
          return response.data;
        case "ROLE_SECRETARIA":
          response = await api.get<UserProfileGeneric>(`/secretaria/${id}`);
          return response.data;
        default:
          throw new Error("Role não suportada");
      }
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário", error);
      throw error;
    }
  },
  
  async getProfileAdmin(id: string): Promise<AdminProfile> {
    try {
      // O endpoint real pode ser /users/{id} ou similar
      const response = await api.get<AdminProfile>(`/administrador/dados/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário", error);
      throw error;
    }
  },
  async getProfileUser(id: string): Promise<UserProfile> {
    try {
      // O endpoint real pode ser /users/{id} ou similar
      const response = await api.get<UserProfile>(`/api/user/dados/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário", error);
      throw error;
    }
  },
  async getProfileSecretaria(id: string): Promise<SecretariaProfile> {
    try {
      // O endpoint real pode ser /users/{id} ou similar
      const response = await api.get<SecretariaProfile>(`/secretaria/dados/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário", error);
      throw error;
    }
  },
  async getProfileEmpresa(id: string): Promise<EmpresaProfile> {
    try {
      // O endpoint real pode ser /users/{id} ou similar
      const response = await api.get<EmpresaProfile>(`/empresa/dados/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário", error);
      throw error;
    }
  },

  async updateProfileSecretaria(id: string, data: Partial<DepartmentRegistrationData>): Promise<UserProfileGeneric> {
    try {
      const response = await api.put<UserProfileGeneric>(`/secretaria/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil da secretaria", error);
      throw error;
    }
  },
  
  async updateProfileEmpresa(id: string, data: Partial<CompanyRegistrationData>): Promise<UserProfileGeneric> {
    try {
      const response = await api.put<UserProfileGeneric>(`/empresa/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil da empresa", error);
      throw error;
    }
  },
}
