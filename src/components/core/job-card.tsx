import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

// Definição da interface baseada no seu novo modelo
interface VagaCardProps {
  titulo: string;
  empresaNome: string;
  area: string;       // Antigo tags[0]
  tipo: string;       // Antigo tags[1]
  modalidade: string; // Antigo tags[2]
  localizacao: string; // Antigo tags[3]
  companyLogoUrl?: string; // Mantido como opcional para a UI
}

export function JobCard(props: VagaCardProps) {
  return (
    <div className="p-3">
      <Card className="w-full bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex flex-col gap-1 mb-4">
            {/* A Área funciona bem como o descritor principal no topo */}
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              {props.area}
            </CardDescription>
            
            <CardTitle className="text-lg text-black leading-tight">
              {props.titulo}
            </CardTitle>
            
            {/* Agrupamento de Localização, Modalidade e Tipo */}
            <CardDescription className="text-sm text-gray-600 flex flex-wrap items-center gap-2 mt-1">
              <span>{props.localizacao}</span>
              <span className="text-gray-300">•</span>
              <span>{props.modalidade}</span>
              <span className="text-gray-300">•</span>
              <span>{props.tipo}</span>
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
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
              {/* O campo de tempo foi removido pois não existe na nova interface */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}