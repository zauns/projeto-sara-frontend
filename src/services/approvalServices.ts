import { api } from "../api/axios";
import { UserProfile } from "./userServices";

export const approvalService = {
  async getPendingCompanies(): Promise<UserProfile[]> {
    try {
      const response = await api.get<UserProfile[]>("/empresas/pendentes");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar empresas pendentes", error);
      throw error;
    }
  },

  async approveCompany(id: string): Promise<void> {
    try {
      await api.put(`/empresas/aprovar/${id}`);
    } catch (error) {
      console.error("Erro ao aprovar empresa", error);
      throw error;
    }
  },

  async getPendingSecretaries(): Promise<UserProfile[]> {
    try {
      const response = await api.get<UserProfile[]>("/secretarias/pendentes");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar secretarias pendentes", error);
      throw error;
    }
  },

  async approveSecretary(id: string): Promise<void> {
    try {
      await api.put(`/secretarias/aprovar/${id}`);
    } catch (error) {
      console.error("Erro ao aprovar secretaria", error);
      throw error;
    }
  },
};
