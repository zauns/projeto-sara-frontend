import { api } from "../api/axios";

export interface CurriculumResponse {
  pathR2: string;
  documentName: string;
  documentType: string;
}

export const curriculumService = {
  /**
   * Envia o PDF e os metadados (MultipartFile)
   */
  async uploadCurriculum(file: Blob, candidateName: string): Promise<CurriculumResponse> {
    const formData = new FormData();
    formData.append("file", file, "curriculo.pdf");
    formData.append("name", candidateName);

    const response = await api.post<CurriculumResponse>("/api/curriculum", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * Baixa o arquivo PDF do usuário logado (Contexto do Candidato)
   */
  async downloadCurriculum(): Promise<Blob> {
    const response = await api.get("/api/curriculum", {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Baixa o currículo de uma candidata específica através do e-mail.
   * (Contexto da Empresa - requer role 'EMPRESA')
   */
  async downloadCurriculumByEmail(email: string): Promise<Blob> {
    // Usamos encodeURIComponent para garantir que o email seja passado corretamente na URL
    const response = await api.get(`/api/curriculum/candidatas/${encodeURIComponent(email)}/curriculos`, {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Verifica se o usuário já tem currículo.
   * Retorna true se conseguir conectar ao arquivo, false se der 404.
   */
  async checkCurriculumExists(): Promise<boolean> {
    try {
      await api.get("/api/curriculum", { 
        responseType: 'blob' 
      });
      return true;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return false;
      }
      return false;
    }
  }
};