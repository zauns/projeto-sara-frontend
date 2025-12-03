import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, CalendarClock } from "lucide-react";
import { StatusCandidatura } from "@/services/applicationServices"; // Ajuste o import conforme seu caminho

interface ApplicationCardProps {
  titulo: string;
  empresaNome: string;
  localizacao: string;
  modalidade: string; // Ex: Híbrido, Remoto
  status: StatusCandidatura;
  companyLogoUrl?: string;
}

// Helper para formatar o visual do status
const getStatusConfig = (status: StatusCandidatura) => {
  switch (status) {
    case StatusCandidatura.APROVADA:
      return { label: "Aprovada", className: "bg-green-100 text-green-700 border-green-200" };
    case StatusCandidatura.REJEITADA:
      return { label: "Não Selecionado", className: "bg-red-100 text-red-700 border-red-200" };
    case StatusCandidatura.EM_ANALISE:
      return { label: "Em Análise", className: "bg-yellow-100 text-yellow-700 border-yellow-200" };
    case StatusCandidatura.PENDENTE:
    default:
      return { label: "Enviada", className: "bg-blue-50 text-blue-700 border-blue-200" };
  }
};

export function ApplicationCard({
  titulo,
  empresaNome,
  localizacao,
  modalidade,
  status,
  companyLogoUrl,
}: ApplicationCardProps) {
  const statusConfig = getStatusConfig(status);

  return (
    <div className="p-3">
      <Card className="w-full bg-white hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-[#F55F58]">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col gap-1">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {empresaNome}
              </CardDescription>
            </div>
            
            {/* Badge de Status da Candidatura */}
            <Badge variant="outline" className={`${statusConfig.className} px-2 py-0.5 text-[10px] uppercase font-bold`}>
              {statusConfig.label}
            </Badge>
          </div>

          <div className="flex flex-col gap-1 mb-4">
            <CardTitle className="text-lg text-black leading-tight">
              {titulo}
            </CardTitle>
            
            <CardDescription className="text-sm text-gray-600 flex flex-wrap items-center gap-2 mt-1">
              <span>{localizacao}</span>
              <span className="text-gray-300">•</span>
              <span>{modalidade}</span>
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
             <Avatar className="h-8 w-8">
              <AvatarImage src={companyLogoUrl} alt={empresaNome} />
              <AvatarFallback className="bg-gray-100">
                <CalendarClock className="h-4 w-4 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Clique para ver detalhes da vaga</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}