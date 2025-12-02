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

export interface VagaCard {
  titulo: string;
  empresaNome: string;
  area: string; // tags[0] sempre é a area
  tipo: string; // tags[1] sempre é o tipo
  modalidade: string; // tags[2] sempre é a modalidade
  localizacao: string; // tags[3] sempre é a localizacao
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
      const response = await api.get(`/vagas/por-empresa?empresaId=${empresaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getJobsByTags(tags: string[]): Promise<VagaResponse[]> {
    try {
      const response = await api.get(`/vagas/buscar/multiplas-tags?tags=${tags}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getJobsBySearch(searchTerm: string): Promise<VagaResponse[]> {
    try {
      const response = await api.get(`/vagas/search?termo=${searchTerm}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Descomentado e tipado para retornar a lista de Vagas
  async getAllJobs(): Promise<VagaResponse[]> {
    try {
      const response = await api.get('/vagas');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}