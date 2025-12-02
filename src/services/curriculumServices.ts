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
   * Baixa o arquivo PDF
   */
  async downloadCurriculum(): Promise<Blob> {
    const response = await api.get("/api/curriculum", {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Verifica se o usuário já tem currículo.
   * Tenta fazer uma requisição HEAD ou GET leve. 
   * Retorna true se conseguir conectar ao arquivo, false se der 404.
   */
  async checkCurriculumExists(): Promise<boolean> {
    try {
      // Tenta buscar apenas os cabeçalhos para não baixar o arquivo inteiro (se o back suportar)
      // Se não suportar HEAD, o axios vai dar erro ou fallback, então garantimos com um GET
      // Nota: Como o endpoint retorna byte[], o GET vai baixar o arquivo. 
      // É o "preço" de não ter endpoint de metadados.
      await api.get("/api/curriculum", { 
        responseType: 'blob' 
      });
      return true;
    } catch (error: any) {
      // Se for 404, significa que não tem currículo
      if (error.response && error.response.status === 404) {
        return false;
      }
      // Outros erros assumimos false por segurança ou tratamos diferente
      return false;
    }
  }
};