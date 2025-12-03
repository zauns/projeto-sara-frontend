'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { curriculumService } from "@/services/curriculumServices";
import { useState } from "react";
import { 
  Loader2, 
  Download, 
  FileCheck, 
  FileX, 
  PlusCircle, 
  RefreshCcw 
} from "lucide-react";

interface CurriculumDisplayProps {
  hasCurriculum: boolean; // Só precisamos saber se existe ou não
  candidateName?: string; // Para nomear o arquivo no download
  onOpenForm: () => void; // Abre o formulário
}

export function CurriculumDisplay({ hasCurriculum, candidateName, onOpenForm }: CurriculumDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const blob = await curriculumService.downloadCurriculum();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Nome do arquivo seguro
      const safeName = candidateName ? candidateName.replace(/\s+/g, '_') : 'meu_curriculo';
      link.download = `curriculo_${safeName}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro no download:", error);
      alert("Erro ao baixar o currículo.");
    } finally {
      setIsDownloading(false);
    }
  };

  // ESTADO 1: Existe Currículo (Card Verde/Azul)
  if (hasCurriculum) {
    return (
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <FileCheck className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Currículo Disponível</h3>
              <p className="text-sm text-gray-500">
                Você já possui um arquivo PDF salvo em nossa base.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={handleDownload} 
              disabled={isDownloading}
              className="w-full sm:w-auto"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Baixar Atual
            </Button>
            
            <Button 
              onClick={onOpenForm} 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Atualizar / Criar Novo
            </Button>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-100 flex items-start">
          <span className="font-bold mr-1">Nota:</span> 
          Ao criar um novo currículo, o arquivo anterior será substituído permanentemente.
        </div>
      </Card>
    );
  }

  // ESTADO 2: Não Existe Currículo (Card Cinza/Vazio)
  return (
    <Card className="p-8 border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-4 bg-white rounded-full shadow-sm">
        <FileX className="w-10 h-10 text-gray-400" />
      </div>
      
      <div className="max-w-md space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">Nenhum currículo encontrado</h3>
        <p className="text-gray-500 text-sm">
          Ainda não temos um currículo cadastrado para o seu perfil.
          Preencha o formulário para gerar e enviar seu PDF.
        </p>
      </div>

      <Button onClick={onOpenForm} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm mt-2">
        <PlusCircle className="w-4 h-4 mr-2" />
        Criar meu Currículo
      </Button>
    </Card>
  );
}