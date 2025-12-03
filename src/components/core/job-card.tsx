// job-card.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Certifique-se de importar o Badge
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export interface VagaCardProps {
  titulo: string;
  empresaNome: string;
  area: string;
  tipo: string;
  modalidade: string;
  localizacao: string;
  companyLogoUrl?: string;
  ativa: boolean; // ADICIONADO
}

export function JobCard(props: VagaCardProps) {
  return (
    <div className="p-3">
      <Card className={`w-full bg-white hover:shadow-md transition-shadow ${!props.ativa ? 'opacity-75 bg-gray-50' : ''}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col gap-1">
               {/* Área da Vaga */}
               <CardDescription className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  {props.area}
                </CardDescription>
            </div>
            
            {/* ADICIONADO: Badge de Status */}
            {!props.ativa && (
              <Badge variant="secondary" className="bg-gray-200 text-gray-600 hover:bg-gray-300 text-[10px] h-5">
                Fechada
              </Badge>
            )}
            {props.ativa && (
               <Badge variant="outline" className="text-green-600 border-green-200 text-[10px] h-5 bg-green-50">
                 Nova
               </Badge>
            )}
          </div>

          <div className="flex flex-col gap-1 mb-4">
            <CardTitle className="text-lg text-black leading-tight">
              {props.titulo}
            </CardTitle>
            
            <CardDescription className="text-sm text-gray-600 flex flex-wrap items-center gap-2 mt-1">
              <span>{props.localizacao}</span>
              <span className="text-gray-300">•</span>
              <span>{props.modalidade}</span>
              <span className="text-gray-300">•</span>
              <span>{props.tipo}</span>
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
             {/* ... Conteúdo do Avatar mantido igual ... */}
             <Avatar className="h-8 w-8">
              <AvatarImage src={props.companyLogoUrl} alt={props.empresaNome} />
              <AvatarFallback className="bg-gray-100">
                <User className="h-4 w-4 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {props.empresaNome}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}