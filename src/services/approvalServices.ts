import { api } from "../api/axios";
import { UserProfileGeneric } from "./userServices";

export const approvalService = {
  async getPendingCompanies(): Promise<UserProfileGeneric[]> {
    try {
      const response = await api.get<UserProfileGeneric[]>("/empresa/pendentes");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar empresas pendentes", error);
      throw error;
    }
  },

  async approveCompany(id: string): Promise<void> {
    try {
      await api.put(`/empresa/aprovar/${id}`);
    } catch (error) {
      console.error("Erro ao aprovar empresa", error);
      throw error;
    }
  },

  async getPendingSecretaries(): Promise<UserProfileGeneric[]> {
    try {
      const response = await api.get<UserProfileGeneric[]>("/secretaria/pendentes");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar secretarias pendentes", error);
      throw error;
    }
  },

  async approveSecretary(id: string): Promise<void> {
    try {
      await api.put(`/secretaria/aprovar/${id}`);
    } catch (error) {
      console.error("Erro ao aprovar secretaria", error);
      throw error;
    }
  },
};
