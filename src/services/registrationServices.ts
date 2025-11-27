import { api } from "@/api/axios";

// Interface para os dados de cadastro da empresa
export interface CompanyRegistrationData {
  nome: string;
  email: string;
  senha: string; // Senha pode ser opcional dependendo da lógica de confirmação
  telefone: string;
  endereco: string;
  cnpj: string;
  biografia: string;
  links: string; // Pode ser um JSON stringificado ou um campo de texto simples
}

// Interface para os dados de cadastro da secretaria
export interface DepartmentRegistrationData {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
  municipio: string;
}

/**
 * Registra uma nova empresa no sistema.
 * @param companyData - Os dados da empresa a serem registrados.
 * @returns A resposta da API.
 */
const registerCompany = async (companyData: CompanyRegistrationData) => {
  try {
    const response = await api.post("/empresa", companyData);
    return response.data;
  } catch (error) {
    // É uma boa prática relançar o erro para que a UI possa tratá-lo
    console.error("Erro ao registrar empresa:", error);
    throw error;
  }
};

/**
 * Registra uma nova secretaria no sistema.
 * @param departmentData - Os dados da secretaria a serem registrados.
 * @returns A resposta da API.
 */
const registerDepartment = async (
  departmentData: DepartmentRegistrationData,
) => {
  try {
    const response = await api.post("/secretaria", departmentData);
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar secretaria:", error);
    throw error;
  }
};

export const registrationService = {
  registerCompany,
  registerDepartment,
};
