import { api } from "../api/axios";
import { UserProfileGeneric } from "./userServices";

export interface VagaRequest {
  titulo: string;
  descricao: string;
  empresaId: string;
  tags: string[];
  isAtiva: boolean;
}

export interface VagaResponse {
  id: string;
  titulo: string;
  descricao: string;
  empresa: UserProfileGeneric;
  tags: string[];
  isAtiva: boolean;
}

export const jobService = {
  async createJob(data: VagaRequest) {
    try {
      const response = await api.post('/vagas', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateJob(id: string, data: VagaRequest) {
    try {
      const response = await api.put(`/vagas/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteJob(id: string) {
    try {
      await api.delete(`/vagas/${id}`);
    } catch (error) {
      throw error;
    }
  },

  async getJobById(id: string): Promise<VagaResponse> {
    try {
      const response = await api.get(`/vagas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getJobsByEmpresaId(empresaId: string): Promise<VagaResponse[]> {
    try {
      const response = await api.get(`/por-empresa?empresaId=${empresaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getJobsByTags(tags: string[]): Promise<VagaResponse[]> {
    try {
      const response = await api.get(`/buscar/multiplas-tags?tags=${tags}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getJobsBySearch(searchTerm: string): Promise<VagaResponse[]> {
    try {
      const response = await api.get(`/search?termo=${searchTerm}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /* 
  async getAllJobs(): Promise<VagaResponse[]> {
    try {
      const response = await api.get('/vagas');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  */
}
