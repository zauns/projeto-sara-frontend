import { api } from "../api/axios";
import { VagaResponse } from "./jobServices";
import { UserProfileGeneric } from "./userServices";

// Interfaces de Request/Response
export interface CandidaturaRequest {
  userId: string; 
  vagaId: string;
}

export interface CandidaturaResponse {
  id: string;
  vaga: VagaResponse;
  user: UserProfileGeneric;
  status: StatusCandidatura;
}

export enum StatusCandidatura {
  PENDENTE = "PENDENTE",
  EM_ANALISE = "EM_ANALISE",
  APROVADA = "APROVADA",
  REJEITADA = "REJEITADA"
}

export const applicationService = {
  // 1. CRIAÇÃO (POST /candidaturas)
  async createCandidatura(data: CandidaturaRequest): Promise<CandidaturaResponse> {
    try {
      const response = await api.post<CandidaturaResponse>('/candidaturas', data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar candidatura", error);
      throw error;
    }
  },

  // 2. DESISTÊNCIA (DELETE /candidaturas/{id})
  async desistirCandidatura(candidaturaId: string): Promise<void> {
    try {
      await api.delete(`/candidaturas/${candidaturaId}`);
    } catch (error) {
      console.error("Erro ao desistir da candidatura", error);
      throw error;
    }
  },

  // 3. BUSCAS - Minhas Candidaturas (GET /candidaturas/minhas)
  async getMinhasCandidaturas(): Promise<CandidaturaResponse[]> {
    try {
      const response = await api.get<CandidaturaResponse[]>('/candidaturas/minhas');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar minhas candidaturas", error);
      throw error;
    }
  },

  // Busca por ID (GET /candidaturas/{id})
  async getCandidaturaById(id: string): Promise<CandidaturaResponse> {
    try {
      const response = await api.get<CandidaturaResponse>(`/candidaturas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar candidatura por ID", error);
      throw error;
    }
  },

  // Busca por Vaga - Para Empresas (GET /candidaturas/vaga/{vagaId})
  async getCandidaturasByVaga(vagaId: string): Promise<CandidaturaResponse[]> {
    try {
      const response = await api.get<CandidaturaResponse[]>(`/candidaturas/vaga/${vagaId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar candidaturas da vaga", error);
      throw error;
    }
  },

  // Busca por Status - Admin (GET /candidaturas/status/{status})
  async getCandidaturasByStatus(status: StatusCandidatura): Promise<CandidaturaResponse[]> {
    try {
      const response = await api.get<CandidaturaResponse[]>(`/candidaturas/status/${status}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar candidaturas por status", error);
      throw error;
    }
  },

  // 4. AÇÃO DA EMPRESA - Atualizar Status (PUT /candidaturas/{id}/status?status=X)
  async updateStatusCandidatura(id: string, status: StatusCandidatura): Promise<CandidaturaResponse> {
    try {
      // O controller usa @RequestParam, então passamos como query params
      const response = await api.put<CandidaturaResponse>(`/candidaturas/${id}/status`, null, {
        params: {
          status: status
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar status da candidatura", error);
      throw error;
    }
  }
};