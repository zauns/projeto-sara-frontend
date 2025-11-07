import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// props/dados do curriculo
type CurriculumDataProps = {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  objective?: string;
  experience?: string;
  education?: string;
  city?: string;
  skills?: string;
};

// placeholder de dados do formulário (lore ipsum)
const placeholderData: Required<CurriculumDataProps> = {
  fullName: "Nome Completo da Silva",
  phoneNumber: "(81) 99999-8888",
  email: "email.exemplo@provedor.com",
  city: "Recife",
  objective: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  experience: "Empresa X (2023 - Presente)\n- Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n- Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nEmpresa Y (2021 - 2023)\n- Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  education: "Graduação em Análise e Desenvolvimento de Sistemas - Faculdade Exemplo (2020 - 2023)",
  skills: "React, Next.js, TypeScript, TailwindCSS, Node.js, Git, SQL."
};


// Visualização do curriculo
export function CurriculumDisplay(props: CurriculumDataProps) {
  const data = { ...placeholderData, ...props };

  return (
    // Wrapper principal
    <div className="p-4">
      {/* Card principal */}
      <Card className="bg-white shadow-md border-gray-200">
        
        {/* Div interna para espaçamento */}
        <div className="w-full md:p-6 space-y-6 p-4">
          
          {/* Seção de Contato */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Currículo</h2>
            <div className="pl-2 border-l-2 border-gray-100 space-y-1">
              <div className="flex flex-col md:flex-row md:items-center">
                <span className="font-medium text-gray-600 w-full md:w-40">Nome completo:</span>
                <span className="text-gray-800 break-words">{data.fullName}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <span className="font-medium text-gray-600 w-full md:w-40">Número:</span>
                <span className="text-gray-800 break-words">{data.phoneNumber}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <span className="font-medium text-gray-600 w-full md:w-40">Email:</span>
                <span className="text-gray-800 break-words">{data.email}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <span className="font-medium text-gray-600 w-full md:w-40">Cidade:</span>
                <span className="text-gray-800 break-words">{data.city}</span>
              </div>
            </div>
          </div>

          {/* Seção de Objetivo */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Objetivo Profissional</h2>
            <div className="pl-2 border-l-2 border-gray-100">
              <p className="text-gray-700 whitespace-pre-line">{data.objective}</p>
            </div>
          </div>

          {/* Seção de Experiência */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Experiência Profissional</h2>
            <div className="pl-2 border-l-2 border-gray-100">
              <p className="text-gray-700 whitespace-pre-line">{data.experience}</p>
            </div>
          </div>

          {/* Seção de Formação */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Formação Acadêmica</h2>
            <div className="pl-2 border-l-2 border-gray-100">
              <p className="text-gray-700 whitespace-pre-line">{data.education}</p>
            </div>
          </div>

          {/* Seção de Habilidades */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Habilidades e Competências</h2>
            <div className="pl-2 border-l-2 border-gray-100">
              <p className="text-gray-700 whitespace-pre-line">{data.skills}</p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-6 border-t border-gray-200 space-y-3">
            <Button 
              variant="destructive" 
              className="w-full bg-red-400 hover:bg-red-500" 
            >
              Editar Currículo
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-red-400 text-red-400 hover:bg-red-50 hover:text-red-500"
            >
              Baixar PDF
            </Button>
          </div>

        </div>
      </Card>
    </div>
  );
}